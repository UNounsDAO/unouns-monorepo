import config from '../config';

export const resolveNounContractAddress = (address: string) => {
  switch (address.toLowerCase()) {
    case config.addresses.nounsDAOProxy.toLowerCase():
      return 'UNouns DAO Proxy';
    case config.addresses.nounsAuctionHouseProxy.toLowerCase():
      return 'UNouns Auction House Proxy';
    case config.addresses.nounsDaoExecutor.toLowerCase():
      return 'UNouns DAO Treasury';
    default:
      return undefined;
  }
};
