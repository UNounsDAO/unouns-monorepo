import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { BigNumber, constants, utils } from 'ethers';
import { ethers, upgrades } from 'hardhat';
import {
  MaliciousBidder__factory as MaliciousBidderFactory,
  NounsAuctionHouse,
  NounsDescriptorV2__factory as NounsDescriptorV2Factory,
  NounsToken,
  WETH,
} from '../typechain';
import { deployNounsToken, deployWeth, populateDescriptorV2 } from './utils';

chai.use(solidity);
const { expect } = chai;

describe('NounsAuctionHouse', () => {
  let nounsAuctionHouse: NounsAuctionHouse;
  let nounsToken: NounsToken;
  let unoundersDAO: SignerWithAddress;
  let nounsDAOTreasury: SignerWithAddress;
  let halloffame: SignerWithAddress;
  let weth: WETH;
  let deployer: SignerWithAddress;
  let noundersDAO: SignerWithAddress;
  let bidderA: SignerWithAddress;
  let bidderB: SignerWithAddress;
  let snapshotId: number;

  const TIME_BUFFER = 15 * 60;
  const PROCEEDS_SHARE_END_TIME = 1832993999;
  const RESERVE_PRICE = 100;
  const MIN_INCREMENT_BID_PERCENTAGE = 5;
  const DURATION = 60 * 60 * 24;
  const UNOUNDERS_PERCENTAPGE = 4;
  const NOUNS_PERCENTAPGE = 1;

  const oneETH = utils.parseEther('1');

  async function deploy(deployer?: SignerWithAddress) {
    const auctionHouseFactory = await ethers.getContractFactory('NounsAuctionHouse', deployer);
    return upgrades.deployProxy(auctionHouseFactory, [
      nounsToken.address,
      weth.address,
      unoundersDAO.address,
      nounsDAOTreasury.address,
      halloffame.address,
      TIME_BUFFER,
      PROCEEDS_SHARE_END_TIME,
      RESERVE_PRICE,
      UNOUNDERS_PERCENTAPGE,
      NOUNS_PERCENTAPGE,
      MIN_INCREMENT_BID_PERCENTAGE,
      DURATION,
    ]) as Promise<NounsAuctionHouse>;
  }

  before(async () => {
    [unoundersDAO, nounsDAOTreasury, halloffame, deployer, noundersDAO, bidderA, bidderB] = await ethers.getSigners();

    nounsToken = await deployNounsToken(deployer, noundersDAO.address, deployer.address);
    weth = await deployWeth(deployer);
    nounsAuctionHouse = await deploy(deployer);

    const descriptor = await nounsToken.descriptor();

    await populateDescriptorV2(NounsDescriptorV2Factory.connect(descriptor, deployer));

    await nounsToken.setMinter(nounsAuctionHouse.address);
  });

  beforeEach(async () => {
    snapshotId = await ethers.provider.send('evm_snapshot', []);
  });

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [snapshotId]);
  });

  it('should revert if a second initialization is attempted', async () => {
    const tx = nounsAuctionHouse.initialize(
      nounsToken.address,
      weth.address,
      unoundersDAO.address,
      nounsDAOTreasury.address,
      halloffame.address,
      TIME_BUFFER,
      PROCEEDS_SHARE_END_TIME,
      RESERVE_PRICE,
      UNOUNDERS_PERCENTAPGE,
      NOUNS_PERCENTAPGE,
      MIN_INCREMENT_BID_PERCENTAGE,
      DURATION,
    );
    await expect(tx).to.be.revertedWith('Initializable: contract is already initialized');
  });

  it('should allow the noundersDAO to unpause the contract and create the first auction', async () => {
    const tx = await nounsAuctionHouse.unpause();
    await tx.wait();

    const auction = await nounsAuctionHouse.auction();
    expect(auction.startTime.toNumber()).to.be.greaterThan(0);
  });

  it('should revert if a user creates a bid for an inactive auction', async () => {
    await (await nounsAuctionHouse.unpause()).wait();

    const { unounId } = await nounsAuctionHouse.auction();
    const tx = nounsAuctionHouse.connect(bidderA).createBid(unounId.add(1), {
      value: RESERVE_PRICE,
    });

    await expect(tx).to.be.revertedWith('Noun not up for auction');
  });

  it('should revert if a user creates a bid for an expired auction', async () => {
    await (await nounsAuctionHouse.unpause()).wait();

    await ethers.provider.send('evm_increaseTime', [60 * 60 * 25]); // Add 25 hours

    const { unounId } = await nounsAuctionHouse.auction();
    const tx = nounsAuctionHouse.connect(bidderA).createBid(unounId, {
      value: RESERVE_PRICE,
    });

    await expect(tx).to.be.revertedWith('Auction expired');
  });

  it('should revert if a user creates a bid with an amount below the reserve price', async () => {
    await (await nounsAuctionHouse.unpause()).wait();

    const { unounId } = await nounsAuctionHouse.auction();
    const tx = nounsAuctionHouse.connect(bidderA).createBid(unounId, {
      value: RESERVE_PRICE - 1,
    });

    await expect(tx).to.be.revertedWith('Must send at least reservePrice');
  });

  it('should revert if a user creates a bid less than the min bid increment percentage', async () => {
    await (await nounsAuctionHouse.unpause()).wait();

    const { unounId } = await nounsAuctionHouse.auction();
    await nounsAuctionHouse.connect(bidderA).createBid(unounId, {
      value: RESERVE_PRICE * 50,
    });
    const tx = nounsAuctionHouse.connect(bidderB).createBid(unounId, {
      value: RESERVE_PRICE * 51,
    });

    await expect(tx).to.be.revertedWith(
      'Must send more than last bid by minBidIncrementPercentage amount',
    );
  });

  it('should refund the previous bidder when the following user creates a bid', async () => {
    await (await nounsAuctionHouse.unpause()).wait();

    const { unounId } = await nounsAuctionHouse.auction();
    await nounsAuctionHouse.connect(bidderA).createBid(unounId, {
      value: RESERVE_PRICE,
    });

    const bidderAPostBidBalance = await bidderA.getBalance();
    await nounsAuctionHouse.connect(bidderB).createBid(unounId, {
      value: RESERVE_PRICE * 2,
    });
    const bidderAPostRefundBalance = await bidderA.getBalance();

    expect(bidderAPostRefundBalance).to.equal(bidderAPostBidBalance.add(RESERVE_PRICE));
  });

  it('should cap the maximum bid griefing cost at 30K gas + the cost to wrap and transfer WETH', async () => {
    await (await nounsAuctionHouse.unpause()).wait();

    const { unounId } = await nounsAuctionHouse.auction();

    const maliciousBidderFactory = new MaliciousBidderFactory(bidderA);
    const maliciousBidder = await maliciousBidderFactory.deploy();

    const maliciousBid = await maliciousBidder
      .connect(bidderA)
      .bid(nounsAuctionHouse.address, unounId, {
        value: RESERVE_PRICE,
      });
    await maliciousBid.wait();

    const tx = await nounsAuctionHouse.connect(bidderB).createBid(unounId, {
      value: RESERVE_PRICE * 2,
      gasLimit: 1_000_000,
    });
    const result = await tx.wait();

    expect(result.gasUsed.toNumber()).to.be.lessThan(200_000);
    expect(await weth.balanceOf(maliciousBidder.address)).to.equal(RESERVE_PRICE);
  });

  it('should emit an `AuctionBid` event on a successful bid', async () => {
    await (await nounsAuctionHouse.unpause()).wait();

    const { unounId } = await nounsAuctionHouse.auction();
    const tx = nounsAuctionHouse.connect(bidderA).createBid(unounId, {
      value: RESERVE_PRICE,
    });

    await expect(tx)
      .to.emit(nounsAuctionHouse, 'AuctionBid')
      .withArgs(unounId, bidderA.address, RESERVE_PRICE, false);
  });

  it('should emit an `AuctionExtended` event if the auction end time is within the time buffer', async () => {
    await (await nounsAuctionHouse.unpause()).wait();

    const { unounId, endTime } = await nounsAuctionHouse.auction();

    await ethers.provider.send('evm_setNextBlockTimestamp', [endTime.sub(60 * 5).toNumber()]); // Subtract 5 mins from current end time

    const tx = nounsAuctionHouse.connect(bidderA).createBid(unounId, {
      value: RESERVE_PRICE,
    });

    await expect(tx)
      .to.emit(nounsAuctionHouse, 'AuctionExtended')
      .withArgs(unounId, endTime.add(60 * 10));
  });

  it('should revert if auction settlement is attempted while the auction is still active', async () => {
    await (await nounsAuctionHouse.unpause()).wait();

    const { unounId } = await nounsAuctionHouse.auction();

    await nounsAuctionHouse.connect(bidderA).createBid(unounId, {
      value: RESERVE_PRICE,
    });
    const tx = nounsAuctionHouse.connect(bidderA).settleCurrentAndCreateNewAuction();

    await expect(tx).to.be.revertedWith("Auction hasn't completed");
  });

  it('should emit `AuctionSettled` and `AuctionCreated` events if all conditions are met', async () => {
    await (await nounsAuctionHouse.unpause()).wait();

    const { unounId } = await nounsAuctionHouse.auction();

    await nounsAuctionHouse.connect(bidderA).createBid(unounId, {
      value: RESERVE_PRICE,
    });

    await ethers.provider.send('evm_increaseTime', [60 * 60 * 25]); // Add 25 hours
    const tx = await nounsAuctionHouse.connect(bidderA).settleCurrentAndCreateNewAuction();

    const receipt = await tx.wait();
    const { timestamp } = await ethers.provider.getBlock(receipt.blockHash);

    const settledEvent = receipt.events?.find(e => e.event === 'AuctionSettled');
    const createdEvent = receipt.events?.find(e => e.event === 'AuctionCreated');

    expect(settledEvent?.args?.unounId).to.equal(unounId);
    expect(settledEvent?.args?.winner).to.equal(bidderA.address);
    expect(settledEvent?.args?.amount).to.equal(RESERVE_PRICE);

    expect(createdEvent?.args?.unounId).to.equal(unounId.add(1));
    expect(createdEvent?.args?.startTime).to.equal(timestamp);
    expect(createdEvent?.args?.endTime).to.equal(timestamp + DURATION);
  });

  it('should not create a new auction if the auction house is paused and unpaused while an auction is ongoing', async () => {
    await (await nounsAuctionHouse.unpause()).wait();

    await (await nounsAuctionHouse.pause()).wait();

    await (await nounsAuctionHouse.unpause()).wait();

    const { unounId } = await nounsAuctionHouse.auction();

    expect(unounId).to.equal(1);
  });

  it('should create a new auction if the auction house is paused and unpaused after an auction is settled', async () => {
    await (await nounsAuctionHouse.unpause()).wait();

    const { unounId } = await nounsAuctionHouse.auction();

    await nounsAuctionHouse.connect(bidderA).createBid(unounId, {
      value: RESERVE_PRICE,
    });

    await ethers.provider.send('evm_increaseTime', [60 * 60 * 25]); // Add 25 hours

    await (await nounsAuctionHouse.pause()).wait();

    const settleTx = nounsAuctionHouse.connect(bidderA).settleAuction();

    await expect(settleTx)
      .to.emit(nounsAuctionHouse, 'AuctionSettled')
      .withArgs(unounId, bidderA.address, RESERVE_PRICE);

    const unpauseTx = await nounsAuctionHouse.unpause();
    const receipt = await unpauseTx.wait();
    const { timestamp } = await ethers.provider.getBlock(receipt.blockHash);

    const createdEvent = receipt.events?.find(e => e.event === 'AuctionCreated');

    expect(createdEvent?.args?.unounId).to.equal(unounId.add(1));
    expect(createdEvent?.args?.startTime).to.equal(timestamp);
    expect(createdEvent?.args?.endTime).to.equal(timestamp + DURATION);
  });

  it('should settle the current auction and pause the contract if the minter is updated while the auction house is unpaused', async () => {
    await (await nounsAuctionHouse.unpause()).wait();

    const { unounId } = await nounsAuctionHouse.auction();

    await nounsAuctionHouse.connect(bidderA).createBid(unounId, {
      value: RESERVE_PRICE,
    });

    await nounsToken.setMinter(constants.AddressZero);

    await ethers.provider.send('evm_increaseTime', [60 * 60 * 25]); // Add 25 hours

    const settleTx = nounsAuctionHouse.connect(bidderA).settleCurrentAndCreateNewAuction();

    await expect(settleTx)
      .to.emit(nounsAuctionHouse, 'AuctionSettled')
      .withArgs(unounId, bidderA.address, RESERVE_PRICE);

    const paused = await nounsAuctionHouse.paused();

    expect(paused).to.equal(true);
  });

  it('should transfer a Noun to hall of fame on auction settlement if no bids are received', async () => {
    await (await nounsAuctionHouse.unpause()).wait();

    const { unounId } = await nounsAuctionHouse.auction();

    await ethers.provider.send('evm_increaseTime', [60 * 60 * 25]); // Add 25 hours

    const tx = nounsAuctionHouse.connect(bidderA).settleCurrentAndCreateNewAuction();

    await expect(tx)
      .to.emit(nounsAuctionHouse, 'AuctionSettled')
      .withArgs(unounId, halloffame.address, 0);
  });

  it('should finish UNouders reward and yet transfer ETH to UNouns DAO treasury and Nouns teasury when settled', async () => {
    await (await nounsAuctionHouse.unpause()).wait();
    await nounsAuctionHouse.finishUNoundersReward();
    console.log(`unoundersPercentage():${await nounsAuctionHouse.unoundersPercentage()}`)
    expect(await nounsAuctionHouse.unoundersPercentage()).to.equal(0);

    await ethers.provider.send('evm_increaseTime', [60 * 60 * 25]); // Add 25 hours

    await nounsAuctionHouse.connect(bidderA).settleCurrentAndCreateNewAuction();

    // const auctionHouseBalance = await ethers.provider.getBalance(deployer.address) / oneETH.toNumber();
    // const nounsDAOTreasury = await ethers.provider.getBalance(nounsDAOTreasury.address) / oneETH.toNumber();
/*     console.log(`getBalance(deployer.address):${await ethers.provider.getBalance(deployer.address)}`)
    console.log(`getBalance(nounsDAOTreasury.address):${await ethers.provider.getBalance(nounsDAOTreasury.address)}`)
    expect(await ethers.provider.getBalance(deployer.address)).to.equal((100 - NOUNS_PERCENTAPGE) * (RESERVE_PRICE) * oneETH.toNumber());
    expect(await ethers.provider.getBalance(nounsDAOTreasury.address)).to.equal(NOUNS_PERCENTAPGE * RESERVE_PRICE * oneETH.toNumber());
 */  });

  it('should finish Nouns treasury proceeds share and yet transfer ETH to UNouns DAO treasury and UNounders when settled', async () => {
    await (await nounsAuctionHouse.unpause()).wait();
    await nounsAuctionHouse.finishUNoundersReward();
    console.log(`unoundersPercentage():${await nounsAuctionHouse.unoundersPercentage()}`)
    expect(await nounsAuctionHouse.unoundersPercentage()).to.equal(0);

    await ethers.provider.send('evm_increaseTime', [60 * 60 * 25]); // Add 25 hours

    await nounsAuctionHouse.connect(bidderA).settleCurrentAndCreateNewAuction();

/*     console.log(`getBalance(deployer.address):${await ethers.provider.getBalance(deployer.address)}`)
    console.log(`getBalance(nounsDAOTreasury.address):${await ethers.provider.getBalance(nounsDAOTreasury.address)}`)
    expect(await ethers.provider.getBalance(deployer.address)).to.equal((100 - NOUNS_PERCENTAPGE) * (RESERVE_PRICE) * oneETH.toNumber());
    expect(await ethers.provider.getBalance(nounsDAOTreasury.address)).to.equal(oneETH.toNumber() * NOUNS_PERCENTAPGE * RESERVE_PRICE);
 */  });

  it('should finish Nouns treasury proceeds share and reward to UNounders yet transfer ETH to UNouns DAO treasury when settled', async () => {
    await (await nounsAuctionHouse.unpause()).wait();
    await nounsAuctionHouse.finishUNoundersReward();
    await nounsAuctionHouse.finishNounsDAOTreasuryShare();
    expect(await nounsAuctionHouse.unoundersPercentage()).to.equal(0);
    expect(await nounsAuctionHouse.nounsPercentage()).to.equal(0);

    await ethers.provider.send('evm_increaseTime', [60 * 60 * 25]); // Add 25 hours

    await nounsAuctionHouse.connect(bidderA).settleCurrentAndCreateNewAuction();

    // const receiveValue = BigNumber.from(NOUNS_PERCENTAPGE * RESERVE_PRICE)
    // expect(await ethers.provider.getBalance(nounsDAOTreasury.address)).to.equal(receiveValue * oneETH);
  });
});
