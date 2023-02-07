import classes from './NounsIntroSection.module.css';
import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
import { Trans } from '@lingui/macro';

const NounsIntroSection = () => {
  return (
    <>
      <Section fullWidth={false} className={classes.videoSection}>
        <Col lg={6}>
          <div className={classes.textWrapper}>
            <h1>
              <Trans>One UNoun, Every Day, Forever.</Trans>
            </h1>
            <p>
              <Trans>
                Behold, an infinite work of art! UNouns is a community-owned brand that makes a
                positive impact by funding ideas and fostering collaboration. From collectors
                and technologists, to non-profits and brands, UNouns is for everyone.
              </Trans>
            </p>
          </div>
        </Col>
        <Col lg={6} className={classes.embedContainer}>
          <iframe
            title="This is UNouns"
            src="https://player.vimeo.com/video/781320182?h=db24612c0a&color=eaeae5&title=0&byline=0&portrait=0"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </Col>
      </Section>
    </>
  );
};

export default NounsIntroSection;
