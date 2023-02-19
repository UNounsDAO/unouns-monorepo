import { BigNumber } from 'ethers';
import classes from './AuctionActivityNounTitle.module.css';

const AuctionActivityNounTitle: React.FC<{ unounId: BigNumber; isCool?: boolean }> = props => {
  const { unounId, isCool } = props;
  return (
    <div className={classes.wrapper}>
      <h1 style={{ color: isCool ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)' }}>
        UNoun {unounId.toString()}
      </h1>
    </div>
  );
};
export default AuctionActivityNounTitle;
