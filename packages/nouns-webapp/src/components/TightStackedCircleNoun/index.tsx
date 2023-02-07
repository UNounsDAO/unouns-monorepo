import { useNounSeed } from '../../wrappers/nounToken';
import { BigNumber } from 'ethers';
import { getUNoun } from '../StandaloneNoun';
import { LoadingNoun } from '../Noun';

interface TightStackedCircleNounProps {
  unounId: number;
  index: number;
  square: number;
  shift: number;
}

const TightStackedCircleNoun: React.FC<TightStackedCircleNounProps> = props => {
  const { unounId, index, square, shift } = props;
  const seed = useNounSeed(BigNumber.from(unounId));

  if (!seed) {
    return <LoadingNoun />;
  }

  const nounData = getUNoun(BigNumber.from(unounId), seed);
  const image = nounData.image;

  return (
    <g key={index}>
      <clipPath id={`clipCircleNoun${unounId}`}>
        <circle
          id={`${unounId}`}
          r="20"
          cx={28 + index * shift}
          cy={square - 21 - index * shift}
          style={{
            fill: 'none',
            stroke: 'white',
            strokeWidth: '2',
          }}
        />
      </clipPath>

      <use xlinkHref={`#${unounId}`} />
      <image
        clipPath={`url(#clipCircleNoun${unounId})`}
        x={8 + index * shift}
        y={14 - index * shift}
        width="40"
        height="40"
        href={image}
      ></image>
    </g>
  );
};

export default TightStackedCircleNoun;
