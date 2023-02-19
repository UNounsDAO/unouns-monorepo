import classes from './NounsIntroSection.module.css';
import Section from '../../layout/Section';
import eyeCatch from '../../assets/eye-catch.png';
import { Col } from 'react-bootstrap';
import { Trans } from '@lingui/macro';
import Image from 'react-bootstrap/Image';

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
          <Image
            src={eyeCatch}
            alt={`UNoun eye catch`}
          />
        </Col>
      </Section>
    </>
  );
};

export default NounsIntroSection;
