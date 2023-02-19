import { Col } from 'react-bootstrap';
import { StandaloneNounWithSeed } from '../StandaloneNoun';
import AuctionActivity from '../AuctionActivity';
import { Row, Container } from 'react-bootstrap';
import { setStateBackgroundColor } from '../../state/slices/application';
import { LoadingNoun } from '../Noun';
import { Auction as IAuction } from '../../wrappers/nounsAuction';
import classes from './Auction.module.css';
import { INounSeed } from '../../wrappers/nounToken';
import NounderNounContent from '../NounderNounContent';
import UNouncilUNounContent from '../UNouncilUNounContent';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { isNounderNoun, isUNouncilUNoun } from '../../utils/nounderNoun';
import {
  setNextOnDisplayAuctionUNounId,
  setPrevOnDisplayAuctionUNounId,
} from '../../state/slices/onDisplayAuction';
import { peace, grey } from '../../utils/nounBgColors';

interface AuctionProps {
  auction?: IAuction;
}

const Auction: React.FC<AuctionProps> = props => {
  const { auction: currentAuction } = props;

  const history = useHistory();
  const dispatch = useAppDispatch();
  let stateBgColor = useAppSelector(state => state.application.stateBackgroundColor);
  const lastUNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionUNounId);

  const loadedNounHandler = (seed: INounSeed) => {
    dispatch(setStateBackgroundColor(seed.background === 0 ?  peace : grey));
  };

  const prevAuctionHandler = () => {
    dispatch(setPrevOnDisplayAuctionUNounId());
    currentAuction && history.push(`/unoun/${currentAuction.unounId.toNumber() - 1}`);
  };
  const nextAuctionHandler = () => {
    dispatch(setNextOnDisplayAuctionUNounId());
    currentAuction && history.push(`/unoun/${currentAuction.unounId.toNumber() + 1}`);
  };

  const nounContent = currentAuction && (
    <div className={classes.nounWrapper}>
      <StandaloneNounWithSeed
        unounId={currentAuction.unounId}
        onLoadSeed={loadedNounHandler}
        shouldLinkToProfile={false}
      />
    </div>
  );

  const loadingNoun = (
    <div className={classes.nounWrapper}>
      <LoadingNoun />
    </div>
  );

  const currentAuctionActivityContent = currentAuction && lastUNounId && (
    <AuctionActivity
      auction={currentAuction}
      isFirstAuction={currentAuction.unounId.eq(0)}
      isLastAuction={currentAuction.unounId.eq(lastUNounId)}
      onPrevAuctionClick={prevAuctionHandler}
      onNextAuctionClick={nextAuctionHandler}
      displayGraphDepComps={true}
    />
  );

  const nounderNounContent = currentAuction && lastUNounId && (
    <NounderNounContent
      mintTimestamp={currentAuction.startTime}
      unounId={currentAuction.unounId}
      isFirstAuction={currentAuction.unounId.eq(0)}
      isLastAuction={currentAuction.unounId.eq(lastUNounId)}
      onPrevAuctionClick={prevAuctionHandler}
      onNextAuctionClick={nextAuctionHandler}
    />
  );

    const unouncilUNounContent = currentAuction && lastUNounId && (
    <UNouncilUNounContent
      mintTimestamp={currentAuction.startTime}
      unounId={currentAuction.unounId}
      isFirstAuction={currentAuction.unounId.eq(0)}
      isLastAuction={currentAuction.unounId.eq(lastUNounId)}
      onPrevAuctionClick={prevAuctionHandler}
      onNextAuctionClick={nextAuctionHandler}
    />
  );

  return (
    <div style={{ backgroundColor: stateBgColor }} className={classes.wrapper}>
      <Container fluid="xl">
        <Row>
          <Col lg={{ span: 6 }} className={classes.nounContentCol}>
            {currentAuction ? nounContent : loadingNoun}
          </Col>
          <Col lg={{ span: 6 }} className={classes.auctionActivityCol}>
            {currentAuction &&
              (isNounderNoun(currentAuction.unounId)
                ? nounderNounContent
                : (isUNouncilUNoun(currentAuction.unounId) ? unouncilUNounContent : currentAuctionActivityContent))}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Auction;
