import chai from 'chai';
import { ethers, upgrades } from 'hardhat';
import { BigNumber as EthersBN } from 'ethers';
import { solidity } from 'ethereum-waffle';

import {
  WETH,
  NounsToken,
  NounsAuctionHouse,
  NounsAuctionHouse__factory as NounsAuctionHouseFactory,
  NounsDescriptorV2,
  NounsDescriptorV2__factory as NounsDescriptorV2Factory,
  NounsDAOProxy__factory as NounsDaoProxyFactory,
  NounsDAOLogicV1,
  NounsDAOLogicV1__factory as NounsDaoLogicV1Factory,
  NounsDAOExecutor,
  NounsDAOExecutor__factory as NounsDaoExecutorFactory,
} from '../typechain';

import {
  deployNounsToken,
  deployWeth,
  populateDescriptorV2,
  address,
  encodeParameters,
  advanceBlocks,
  blockTimestamp,
  setNextBlockTimestamp,
} from './utils';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

chai.use(solidity);
const { expect } = chai;

let nounsToken: NounsToken;
let nounsAuctionHouse: NounsAuctionHouse;
let descriptor: NounsDescriptorV2;
let weth: WETH;
let unoundersDAO: SignerWithAddress;
let nounsDAOTreasury: SignerWithAddress;
let halloffame: SignerWithAddress;
let gov: NounsDAOLogicV1;
let timelock: NounsDAOExecutor;

let deployer: SignerWithAddress;
let wethDeployer: SignerWithAddress;
let bidderA: SignerWithAddress;

// Governance Config
const TIME_LOCK_DELAY = 172_800; // 2 days
const PROPOSAL_THRESHOLD_BPS = 500; // 5%
const QUORUM_VOTES_BPS = 1_000; // 10%
const VOTING_PERIOD = 5_760; // About 24 hours with 15s blocks
const VOTING_DELAY = 1; // 1 block

// Proposal Config
const targets: string[] = [];
const values: string[] = [];
const signatures: string[] = [];
const callDatas: string[] = [];

let proposalId: EthersBN;

// Auction House Config
const TIME_BUFFER = 15 * 60;
const PROCEEDS_SHARE_END_TIME = 1832993999; // Jan 31 23:59:59, 2028 (EST)
const RESERVE_PRICE = 20;
const PROPOSAL_PRICE = 2;
const UNOUNDERS_PERCENTAPGE = 4;
const NOUNS_PERCENTAPGE = 1;
const UNOUNS_DAO_PERCENTAPGE = 100 - (UNOUNDERS_PERCENTAPGE + NOUNS_PERCENTAPGE);
const MIN_INCREMENT_BID_PERCENTAGE = 5;
const DURATION = 60 * 60 * 24;

// test data
const firstTranserPrice = (RESERVE_PRICE * UNOUNS_DAO_PERCENTAPGE) / 100

async function deploy() {
  [unoundersDAO, nounsDAOTreasury, halloffame, deployer, bidderA, wethDeployer] = await ethers.getSigners();

  // Deployed by another account to simulate real network

  weth = await deployWeth(wethDeployer);

  // nonce 2: Deploy AuctionHouse
  // nonce 3: Deploy nftDescriptorLibraryFactory
  // nonce 4: Deploy NounsDescriptor
  // nonce 5: Deploy NounsSeeder
  // nonce 6: Deploy NounsToken
  // nonce 0: Deploy NounsDAOExecutor
  // nonce 1: Deploy NounsDAOLogicV1
  // nonce 7: Deploy NounsDAOProxy
  // nonce ++: populate Descriptor
  // nonce ++: set ownable contracts owner to timelock

  // 1. DEPLOY UNouns token
  nounsToken = await deployNounsToken(
    deployer,
    unoundersDAO.address,
    deployer.address, // do not know minter/auction house yet
  );

  // 2a. DEPLOY AuctionHouse
  const auctionHouseFactory = await ethers.getContractFactory('NounsAuctionHouse', deployer);
  const nounsAuctionHouseProxy = await upgrades.deployProxy(auctionHouseFactory, [
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
  ]);

  // 2b. CAST proxy as AuctionHouse
  nounsAuctionHouse = NounsAuctionHouseFactory.connect(nounsAuctionHouseProxy.address, deployer);

  // 3. SET MINTER
  await nounsToken.setMinter(nounsAuctionHouse.address);

  // 4. POPULATE body parts
  descriptor = NounsDescriptorV2Factory.connect(await nounsToken.descriptor(), deployer);

  await populateDescriptorV2(descriptor);

  // 5a. CALCULATE Gov Delegate, takes place after 2 transactions
  const calculatedGovDelegatorAddress = ethers.utils.getContractAddress({
    from: deployer.address,
    nonce: (await deployer.getTransactionCount()) + 2,
  });

  // 5b. DEPLOY NounsDAOExecutor with pre-computed Delegator address
  timelock = await new NounsDaoExecutorFactory(deployer).deploy(
    calculatedGovDelegatorAddress,
    TIME_LOCK_DELAY,
  );

  // 6. DEPLOY Delegate
  const govDelegate = await new NounsDaoLogicV1Factory(deployer).deploy();

  // 7a. DEPLOY Delegator
  const nounsDAOProxy = await new NounsDaoProxyFactory(deployer).deploy(
    timelock.address,
    nounsToken.address,
    unoundersDAO.address, // UNoundersDAO is vetoer
    timelock.address,
    govDelegate.address,
    VOTING_PERIOD,
    VOTING_DELAY,
    PROPOSAL_THRESHOLD_BPS,
    QUORUM_VOTES_BPS,
  );

  expect(calculatedGovDelegatorAddress).to.equal(nounsDAOProxy.address);

  // 7b. CAST Delegator as Delegate
  gov = NounsDaoLogicV1Factory.connect(nounsDAOProxy.address, deployer);

  // 8. SET UNouns owner to NounsDAOExecutor
  await nounsToken.transferOwnership(timelock.address);
  // 9. SET Descriptor owner to NounsDAOExecutor
  await descriptor.transferOwnership(timelock.address);

  // 10. UNPAUSE auction and kick off first mint
  await nounsAuctionHouse.unpause();

  // 11. SET Auction House owner to NounsDAOExecutor
  await nounsAuctionHouse.transferOwnership(timelock.address);
}

describe('End to End test with deployment, auction, proposing, voting, executing', async () => {
  before(deploy);

  it('sets all starting params correctly', async () => {
    expect(await nounsToken.owner()).to.equal(timelock.address);
    expect(await descriptor.owner()).to.equal(timelock.address);
    expect(await nounsAuctionHouse.owner()).to.equal(timelock.address);

    expect(await nounsToken.minter()).to.equal(nounsAuctionHouse.address);
    expect(await nounsToken.unoundersDAO()).to.equal(unoundersDAO.address);

    expect(await gov.admin()).to.equal(timelock.address);
    expect(await timelock.admin()).to.equal(gov.address);
    expect(await gov.timelock()).to.equal(timelock.address);

    expect(await gov.vetoer()).to.equal(unoundersDAO.address);

    expect(await nounsToken.totalSupply()).to.equal(EthersBN.from('2'));

    expect(await nounsToken.ownerOf(0)).to.equal(unoundersDAO.address);
    expect(await nounsToken.ownerOf(1)).to.equal(nounsAuctionHouse.address);

    expect((await nounsAuctionHouse.auction()).unounId).to.equal(EthersBN.from('1'));
  });

  it('allows bidding, settling, and transferring ETH correctly', async () => {
    await nounsAuctionHouse.connect(bidderA).createBid(1, { value: RESERVE_PRICE });
    await setNextBlockTimestamp(Number(await blockTimestamp('latest')) + DURATION);
    await nounsAuctionHouse.settleCurrentAndCreateNewAuction();

    expect(await nounsToken.ownerOf(1)).to.equal(bidderA.address);
    expect(await ethers.provider.getBalance(timelock.address)).to.equal(firstTranserPrice);
  });

  it('after 6 years, allows bidding, settling, and transferring ETH correctly', async () => {
    await ethers.provider.send('evm_increaseTime', [60 * 60 * 24 * 365 * 6]); // Add 6 years
    await nounsAuctionHouse.settleCurrentAndCreateNewAuction(); // start auction of unounId = 3
    await nounsAuctionHouse.connect(bidderA).createBid(3, { value: RESERVE_PRICE });
    await setNextBlockTimestamp(Number(await blockTimestamp('latest')) + DURATION);
    await nounsAuctionHouse.settleCurrentAndCreateNewAuction();

    expect(await nounsToken.ownerOf(1)).to.equal(bidderA.address);
    expect(await ethers.provider.getBalance(timelock.address)).to.equal((firstTranserPrice + RESERVE_PRICE));
  });

/*
  it('should finish UNouders reward and yet transfer ETH to UNouns DAO treasury and Nouns teasury when settled', async () => {
    await nounsAuctionHouse.finishUNoundersReward();
    console.log(`unoundersPercentage():${await nounsAuctionHouse.unoundersPercentage()}`)
    expect(await nounsAuctionHouse.unoundersPercentage()).to.equal(0);

    await ethers.provider.send('evm_increaseTime', [60 * 60 * 25]); // Add 25 hours

    await nounsAuctionHouse.connect(bidderA).settleCurrentAndCreateNewAuction();

    console.log(`getBalance(deployer.address):${await ethers.provider.getBalance(deployer.address)}`)
    console.log(`getBalance(nounsDAOTreasury.address):${await ethers.provider.getBalance(nounsDAOTreasury.address)}`)
    expect(await ethers.provider.getBalance(timelock.address)).to.equal((100 - NOUNS_PERCENTAPGE) * (RESERVE_PRICE));
    expect(await ethers.provider.getBalance(nounsDAOTreasury.address)).to.equal(NOUNS_PERCENTAPGE * RESERVE_PRICE);
  });

  it('should finish Nouns treasury proceeds share and yet transfer ETH to UNouns DAO treasury and UNounders when settled', async () => {
    await nounsAuctionHouse.finishUNoundersReward();
    console.log(`unoundersPercentage():${await nounsAuctionHouse.unoundersPercentage()}`)
    expect(await nounsAuctionHouse.unoundersPercentage()).to.equal(0);

    await ethers.provider.send('evm_increaseTime', [60 * 60 * 25]); // Add 25 hours

    await nounsAuctionHouse.connect(bidderA).settleCurrentAndCreateNewAuction();

    console.log(`getBalance(timelock.address):${await ethers.provider.getBalance(timelock.address)}`)
    console.log(`getBalance(nounsDAOTreasury.address):${await ethers.provider.getBalance(nounsDAOTreasury.address)}`)
    expect(await ethers.provider.getBalance(timelock.address)).to.equal((100 - NOUNS_PERCENTAPGE) * (RESERVE_PRICE));
    expect(await ethers.provider.getBalance(nounsDAOTreasury.address)).to.equal(NOUNS_PERCENTAPGE * RESERVE_PRICE);
  });

  it('should finish Nouns treasury proceeds share and reward to UNounders yet transfer ETH to UNouns DAO treasury when settled', async () => {
    await nounsAuctionHouse.finishUNoundersReward();
    await nounsAuctionHouse.finishNounsDAOTreasuryShare();
    expect(await nounsAuctionHouse.unoundersPercentage()).to.equal(0);
    expect(await nounsAuctionHouse.nounsPercentage()).to.equal(0);

    await ethers.provider.send('evm_increaseTime', [60 * 60 * 25]); // Add 25 hours

    await nounsAuctionHouse.connect(bidderA).settleCurrentAndCreateNewAuction();

    expect(await ethers.provider.getBalance(nounsDAOTreasury.address)).to.equal(NOUNS_PERCENTAPGE * RESERVE_PRICE);
  });
 */

  it('allows proposing, voting, queuing', async () => {
    const description = 'Set nounsToken minter to address(1) and transfer treasury to address(2)';

    // Action 1. Execute nounsToken.setMinter(address(1))
    targets.push(nounsToken.address);
    values.push('0');
    signatures.push('setMinter(address)');
    callDatas.push(encodeParameters(['address'], [address(1)]));

    // Action 2. Execute transfer PROPOSAL_PRICE to address(2)
    targets.push(address(2));
    values.push(String(PROPOSAL_PRICE));
    signatures.push('');
    callDatas.push('0x');

    await gov.connect(bidderA).propose(targets, values, signatures, callDatas, description);

    proposalId = await gov.latestProposalIds(bidderA.address);

    // Wait for VOTING_DELAY
    await advanceBlocks(VOTING_DELAY + 1);

    // cast vote for proposal
    await gov.connect(bidderA).castVote(proposalId, 1);

    await advanceBlocks(VOTING_PERIOD);

    await gov.connect(bidderA).queue(proposalId);

    // Queued state
    expect(await gov.state(proposalId)).to.equal(5);
  });

  it('executes proposal transactions correctly', async () => {
    const { eta } = await gov.proposals(proposalId);
    await setNextBlockTimestamp(eta.toNumber(), false);
    await gov.execute(proposalId);

    // Successfully executed Action 1
    expect(await nounsToken.minter()).to.equal(address(1));

    // Successfully executed Action 2
    expect(await ethers.provider.getBalance(address(2))).to.equal(PROPOSAL_PRICE);
  });

  it('does not allow NounsDAO to accept funds', async () => {
    let error1;

    // NounsDAO does not accept value without calldata
    try {
      await bidderA.sendTransaction({
        to: gov.address,
        value: 10,
      });
    } catch (e) {
      error1 = e;
    }

    expect(error1);

    let error2;

    // NounsDAO does not accept value with calldata
    try {
      await bidderA.sendTransaction({
        data: '0xb6b55f250000000000000000000000000000000000000000000000000000000000000001',
        to: gov.address,
        value: 10,
      });
    } catch (e) {
      error2 = e;
    }

    expect(error2);
  });

  it('allows NounsDAOExecutor to receive funds', async () => {
    // test receive()
    const transferAmount = 10;
    await bidderA.sendTransaction({
      to: timelock.address,
      value: transferAmount,
    });

    const treasuryAmount = firstTranserPrice + RESERVE_PRICE;
    expect(await ethers.provider.getBalance(timelock.address)).to.equal((treasuryAmount - PROPOSAL_PRICE) + transferAmount);

    // test fallback() calls deposit(uint) which is not implemented
    await bidderA.sendTransaction({
      data: '0xb6b55f250000000000000000000000000000000000000000000000000000000000000001',
      to: timelock.address,
      value: transferAmount,
    });

    expect(await ethers.provider.getBalance(timelock.address)).to.equal((treasuryAmount - PROPOSAL_PRICE) + transferAmount + transferAmount);
  });
});
