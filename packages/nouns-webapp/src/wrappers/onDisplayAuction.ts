import { BigNumber } from '@ethersproject/bignumber';
import { useAppSelector } from '../hooks';
import { generateEmptyNounderAuction, isNounderNoun } from '../utils/nounderNoun';
import { Bid, BidEvent } from '../utils/types';
import { Auction } from './nounsAuction';

const deserializeAuction = (reduxSafeAuction: Auction): Auction => {
  return {
    amount: BigNumber.from(reduxSafeAuction.amount),
    bidder: reduxSafeAuction.bidder,
    startTime: BigNumber.from(reduxSafeAuction.startTime),
    endTime: BigNumber.from(reduxSafeAuction.endTime),
    unounId: BigNumber.from(reduxSafeAuction.unounId),
    settled: false,
  };
};

const deserializeBid = (reduxSafeBid: BidEvent): Bid => {
  return {
    unounId: BigNumber.from(reduxSafeBid.unounId),
    sender: reduxSafeBid.sender,
    value: BigNumber.from(reduxSafeBid.value),
    extended: reduxSafeBid.extended,
    transactionHash: reduxSafeBid.transactionHash,
    timestamp: BigNumber.from(reduxSafeBid.timestamp),
  };
};
const deserializeBids = (reduxSafeBids: BidEvent[]): Bid[] => {
  return reduxSafeBids
    .map(bid => deserializeBid(bid))
    .sort((a: Bid, b: Bid) => {
      return b.timestamp.toNumber() - a.timestamp.toNumber();
    });
};

const useOnDisplayAuction = (): Auction | undefined => {
  const lastAuctionUNounId = useAppSelector(state => state.auction.activeAuction?.unounId);
  const onDisplayAuctionUNounId = useAppSelector(
    state => state.onDisplayAuction.onDisplayAuctionUNounId,
  );
  const currentAuction = useAppSelector(state => state.auction.activeAuction);
  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);
  console.log(`pastAuctions:${pastAuctions}`)
  console.log(`is pastAuctions:${!pastAuctions}`)
  if (
    onDisplayAuctionUNounId === undefined ||
    lastAuctionUNounId === undefined ||
    currentAuction === undefined ||
    !pastAuctions
  )
    return undefined;

  // current auction
  if (BigNumber.from(onDisplayAuctionUNounId).eq(lastAuctionUNounId)) {
    console.log(`handling currentAuction:${currentAuction}`)
    return deserializeAuction(currentAuction);
  }

  // unounder auction
  if (isNounderNoun(BigNumber.from(onDisplayAuctionUNounId))) {
    const emptyNounderAuction = generateEmptyNounderAuction(
      BigNumber.from(onDisplayAuctionUNounId),
      pastAuctions,
    );

    return deserializeAuction(emptyNounderAuction);
  }

  console.log(`starting to handle past auction.`);
  // past auction
  const reduxSafeAuction: Auction | undefined = pastAuctions.find(auction => {
    const unounId = auction.activeAuction && BigNumber.from(auction.activeAuction.unounId);
    console.log(`handling past auction. unounId:${unounId}. onDisplayAuctionUNounId:${onDisplayAuctionUNounId}`);

    return unounId && unounId.toNumber() === onDisplayAuctionUNounId;
  })?.activeAuction;

  console.log(`reduxSafeAuction:${reduxSafeAuction}`);
  return reduxSafeAuction ? deserializeAuction(reduxSafeAuction) : undefined;
};

export const useAuctionBids = (auctionUNounId: BigNumber): Bid[] | undefined => {
  const lastAuctionUNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionUNounId);
  const lastAuctionBids = useAppSelector(state => state.auction.bids);
  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);

  // auction requested is active auction
  if (lastAuctionUNounId === auctionUNounId.toNumber()) {
    return deserializeBids(lastAuctionBids);
  } else {
    // find bids for past auction requested
    console.log(`pastAuctionBids, pastAuctions:${pastAuctions}`)
    const bidEvents: BidEvent[] | undefined = pastAuctions.find(auction => {
      const unounId = auction.activeAuction && BigNumber.from(auction.activeAuction.unounId);
      console.log(`auction.activeAuction:${auction.activeAuction}`)
      return unounId && unounId.eq(auctionUNounId);
    })?.bids;

    return bidEvents && deserializeBids(bidEvents);
  }
};

export default useOnDisplayAuction;
