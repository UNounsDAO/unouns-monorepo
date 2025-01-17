import { Auction } from '../wrappers/nounsAuction';
import { AuctionState } from '../state/slices/auction';
import { BigNumber } from '@ethersproject/bignumber';

export const isNounderNoun = (unounId: BigNumber) => {
  return unounId.mod(10).eq(0) || unounId.eq(0);
};

export const isUNouncilUNoun = (unounId: BigNumber) => {
  return unounId.toNumber() < 222 && unounId.mod(10).eq(2);
};

const emptyNounderAuction = (onDisplayAuctionId: number): Auction => {
  return {
    amount: BigNumber.from(0).toJSON(),
    bidder: '',
    startTime: BigNumber.from(0).toJSON(),
    endTime: BigNumber.from(0).toJSON(),
    unounId: BigNumber.from(onDisplayAuctionId).toJSON(),
    settled: false,
  };
};

const findAuction = (id: BigNumber, auctions: AuctionState[]): Auction | undefined => {
  return auctions.find(auction => {
    return BigNumber.from(auction.activeAuction?.unounId).eq(id);
  })?.activeAuction;
};

/**
 *
 * @param unounId
 * @param pastAuctions
 * @returns empty `Auction` object with `startTime` set to auction after param `unounId`
 */
export const generateEmptyNounderAuction = (
  unounId: BigNumber,
  pastAuctions: AuctionState[],
): Auction => {
  const nounderAuction = emptyNounderAuction(unounId.toNumber());
  // use nounderAuction.unounId + 1 to get mint time
  const auctionAbove = findAuction(unounId.add(1), pastAuctions);
  const auctionAboveStartTime = auctionAbove && BigNumber.from(auctionAbove.startTime);
  if (auctionAboveStartTime) nounderAuction.startTime = auctionAboveStartTime.toJSON();

  return nounderAuction;
};

/**
 *
 * @param unounId
 * @param pastAuctions
 * @returns empty `Auction` object with `startTime` set to auction after param `unounId`
 */
export const generateEmptyUNouncilAuction = (
  unounId: BigNumber,
  pastAuctions: AuctionState[],
): Auction => {
  const unouncilAuction = emptyNounderAuction(unounId.toNumber());
  // use nounderAuction.unounId + 1 to get mint time
  const auctionAbove = findAuction(unounId.add(1), pastAuctions);
  const auctionAboveStartTime = auctionAbove && BigNumber.from(auctionAbove.startTime);
  if (auctionAboveStartTime) unouncilAuction.startTime = auctionAboveStartTime.toJSON();

  return unouncilAuction;
};
