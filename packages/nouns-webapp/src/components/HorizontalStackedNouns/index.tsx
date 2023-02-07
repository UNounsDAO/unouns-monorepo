import { BigNumber } from 'ethers';
import React from 'react';
import { StandaloneNounCircular } from '../StandaloneNoun';
import classes from './HorizontalStackedNouns.module.css';

interface HorizontalStackedNounsProps {
  nounIds: string[];
}

const HorizontalStackedNouns: React.FC<HorizontalStackedNounsProps> = props => {
  const { nounIds } = props;
  return (
    <div className={classes.wrapper}>
      {nounIds
        .slice(0, 6)
        .map((unounId: string, i: number) => {
          return (
            <div
              key={unounId.toString()}
              style={{
                top: '0px',
                left: `${25 * i}px`,
              }}
              className={classes.nounWrapper}
            >
              <StandaloneNounCircular unounId={BigNumber.from(unounId)} border={true} />
            </div>
          );
        })
        .reverse()}
    </div>
  );
};

export default HorizontalStackedNouns;
