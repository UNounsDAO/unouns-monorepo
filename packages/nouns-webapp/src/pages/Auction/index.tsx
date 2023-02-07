import Auction from '../../components/Auction';
import Documentation from '../../components/Documentation';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setOnDisplayAuctionUNounId } from '../../state/slices/onDisplayAuction';
import { push } from 'connected-react-router';
import { nounPath } from '../../utils/history';
import useOnDisplayAuction from '../../wrappers/onDisplayAuction';
import { useEffect } from 'react';
import ProfileActivityFeed from '../../components/ProfileActivityFeed';
import NounsIntroSection from '../../components/NounsIntroSection';

interface AuctionPageProps {
  initialAuctionId?: number;
}

const AuctionPage: React.FC<AuctionPageProps> = props => {
  const { initialAuctionId } = props;
  const onDisplayAuction = useOnDisplayAuction();
  const lastAuctionUNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionUNounId);
  const onDisplayAuctionUNounId = onDisplayAuction?.unounId.toNumber();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!lastAuctionUNounId) return;

    if (initialAuctionId !== undefined) {
      // handle out of bounds noun path ids
      if (initialAuctionId > lastAuctionUNounId || initialAuctionId < 0) {
        dispatch(setOnDisplayAuctionUNounId(lastAuctionUNounId));
        dispatch(push(nounPath(lastAuctionUNounId)));
      } else {
        if (onDisplayAuction === undefined) {
          // handle regular noun path ids on first load
          dispatch(setOnDisplayAuctionUNounId(initialAuctionId));
        }
      }
    } else {
      // no noun path id set
      if (lastAuctionUNounId) {
        dispatch(setOnDisplayAuctionUNounId(lastAuctionUNounId));
      }
    }
  }, [lastAuctionUNounId, dispatch, initialAuctionId, onDisplayAuction]);

  const isCoolBackground = useAppSelector(state => state.application.isCoolBackground);
  const backgroundColor = isCoolBackground ? 'var(--brand-cool-background)' : 'var(--brand-peace-background)';

  return (
    <>
      <Auction auction={onDisplayAuction} />
      {onDisplayAuctionUNounId !== undefined && onDisplayAuctionUNounId !== lastAuctionUNounId ? (
        <ProfileActivityFeed unounId={onDisplayAuctionUNounId} />
      ) : (<NounsIntroSection />)}
      <Documentation
        backgroundColor={
          onDisplayAuctionUNounId === undefined || onDisplayAuctionUNounId === lastAuctionUNounId ? backgroundColor : undefined
        }
      />
    </>
  );
};
export default AuctionPage;
