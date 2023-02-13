import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
import classes from './Documentation.module.css';
import Accordion from 'react-bootstrap/Accordion';
import Link from '../Link';
import { Trans } from '@lingui/macro';

interface DocumentationProps {
  backgroundColor?: string;
}

const Documentation = (props: DocumentationProps = { backgroundColor: '#FFF' }) => {
  const NounsLink = (
    <Link
      text={<Trans>Nouns DAO</Trans>}
      url="https://www.nouns.wtf"
      leavesPage={true}
    />
  );
  const playgroundLink = (
    <Link text={<Trans>Playground</Trans>} url="/playground" leavesPage={false} />
  );
  const publicDomainLink = (
    <Link
      text={<Trans>public domain</Trans>}
      url="https://creativecommons.org/publicdomain/zero/1.0/"
      leavesPage={true}
    />
  );
  const compoundGovLink = (
    <Link
      text={<Trans>Compound Governance</Trans>}
      url="https://compound.finance/governance"
      leavesPage={true}
    />
  );
  return (
    <Section fullWidth={false} className={classes.documentationSection} style={{ background: props.backgroundColor }}>
      <Col lg={{ span: 10, offset: 1 }}>
        <div className={classes.headerWrapper}>
          <h1>
            <Trans>WTF?</Trans>
          </h1>
          <p className={classes.aboutText}>
            <Trans>
              UNouns DAO is an expansion DAO based on {NounsLink}, UNouns = Nouns doing United Nations.
              {/* UNouns will aceess solving global issues with Nouns ecosystem and DAO. */}
              UNouns attempts to create community and governance that will access global issues and SDGs
              and create better world by utilizing a treasury, that can be used by the community.
              By expanding the ecosystem, UNouns DAO aims to create better world with DAO and create hornorable presence for Nouns.
            </Trans>
          </p>
          <p className={classes.aboutText} style={{ paddingBottom: '4rem' }}>
            <Trans>
              Learn more below, or start creating UNouns off-chain using the {playgroundLink}.
            </Trans>
          </p>
        </div>
        <Accordion flush>
          <Accordion.Item eventKey="0" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Summary</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <ul>
                <li>
                  <Trans>UNouns artwork is in the {publicDomainLink}.</Trans>
                </li>
                <li>
                  <Trans>One UNoun is trustlessly auctioned every 24 hours, forever.</Trans>
                </li>
                <li>
                  <Trans>100% of UNoun auction proceeds are trustlessly sent to the treasury.</Trans>
                </li>
                <li>
                  <Trans>Settlement of one auction kicks off the next.</Trans>
                </li>
                <li>
                  <Trans>All UNouns are members of UNouns DAO.</Trans>
                </li>
                <li>
                  <Trans>UNouns DAO uses a fork of {compoundGovLink}.</Trans>
                </li>
                <li>
                  <Trans>One UNoun is equal to one vote.</Trans>
                </li>
                <li>
                  <Trans>The treasury is controlled exclusively by UNouns via governance.</Trans>
                </li>
                <li>
                  <Trans>Artwork is generative and stored directly on-chain (not IPFS).</Trans>
                </li>
                <li>
                  <Trans>
                    No explicit rules exist for attribute scarcity; all UNouns are equally rare.
                  </Trans>
                </li>
                <li>
                  <Trans>
                    UNounders receive rewards in the form of UNouns (10% of supply for first 5 years).
                  </Trans>
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Daily Auctions</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p className={classes.aboutText}>
                <Trans>
                  The UNouns Auction Contract will act as a self-sufficient UNoun generation and
                  distribution mechanism, auctioning one UNoun every 24 hours, forever. 100% of
                  auction proceeds (ETH) are automatically deposited in the UNouns DAO treasury,
                  where they are governed by UNoun owners.
                </Trans>
              </p>

              <p className={classes.aboutText}>
                <Trans>
                  Each time an auction is settled, the settlement transaction will also cause a new
                  UNoun to be minted and a new 24 hour auction to begin.{' '}
                </Trans>
              </p>
              <p>
                <Trans>
                  While settlement is most heavily incentivized for the winning bidder, it can be
                  triggered by anyone, allowing the system to trustlessly auction UNouns as long as
                  Ethereum is operational and there are interested bidders.
                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>UNouns DAO</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <Trans>
                UNouns DAO utilizes a fork of {compoundGovLink} and is the main governing body of the
                UNouns ecosystem. The UNouns DAO treasury receives 100% of ETH proceeds from daily
                UNoun auctions. Each UNoun is an irrevocable member of UNouns DAO and entitled to one
                vote in all governance matters. UNoun votes are non-transferable (if you sell your
                UNoun the vote goes with it) but delegatable, which means you can assign your vote to
                someone else as long as you own your UNoun.
              </Trans>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Governance ‘Slow Start’</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  The proposal veto right was initially envisioned as a temporary solution to the
                  problem of ‘51% attacks’ on the UNouns DAO treasury. While UNounders initially
                  believed that a healthy distribution of UNouns would be sufficient protection for
                  the DAO, a more complete understanding of the incentives and risks has led to
                  general consensus within the UNounders, the UNouns Foundation, and the wider
                  community that a more robust game-theoretic solution should be implemented before
                  the right is removed.
                </Trans>
              </p>
              <p>
                <Trans>
                  The UNouns community has undertaken a preliminary exploration of proposal veto
                  alternatives (‘rage quit’ etc.), but it is now clear that this is a difficult
                  problem that will require significantly more research, development and testing
                  before a satisfactory solution can be implemented.
                </Trans>
              </p>
              <p>
                <Trans>
                  Consequently, the UNouns Foundation anticipates being the steward of the veto power
                  until UNouns DAO is ready to implement an alternative, and therefore wishes to
                  clarify the conditions under which it would exercise this power.
                </Trans>
              </p>
              <p>
                <Trans>
                  The UNouns Foundation considers the veto an emergency power that should not be
                  exercised in the normal course of business. The UNouns Foundation will veto
                  proposals that introduce non-trivial legal or existential risks to the UNouns DAO
                  or the UNouns Foundation, including (but not necessarily limited to) proposals
                  that:
                </Trans>
              </p>
              <ul>
                <li>unequally withdraw the treasury for personal gain</li>
                <li>bribe voters to facilitate withdraws of the treasury for personal gain</li>
                <li>
                  attempt to alter UNoun auction cadence for the purpose of maintaining or acquiring
                  a voting majority
                </li>
                <li>make upgrades to critical smart contracts without undergoing an audit</li>
              </ul>
              <p>
                <Trans>
                  There are unfortunately no algorithmic solutions for making these determinations
                  in advance (if there were, the veto would not be required), and proposals must be
                  considered on a case by case basis.
                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>UNoun Traits</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  UNouns are generated randomly based Ethereum block hashes. There are no 'if'
                  statements or other rules governing UNoun trait scarcity, which makes all UNouns
                  equally rare. As of this writing, UNouns are made up of:
                </Trans>
              </p>
              <ul>
                <li>
                  <Trans>backgrounds (2) </Trans>
                </li>
                <li>
                  <Trans>bodies (60)</Trans>
                </li>
                <li>
                  <Trans>accessories (3) </Trans>
                </li>
                <li>
                  <Trans>heads (59) </Trans>
                </li>
                <li>
                  <Trans>glasses (31)</Trans>
                </li>
              </ul>
              <Trans>
                You can experiment with off-chain UNoun generation at the {playgroundLink}.
              </Trans>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="5" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>On-Chain Artwork</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  UNouns are stored directly on Ethereum and do not utilize pointers to other
                  networks such as IPFS. This is possible because UNoun parts are compressed and
                  stored on-chain using a custom run-length encoding (RLE), which is a form of
                  lossless compression.
                </Trans>
              </p>

              <p>
                <Trans>
                  The compressed parts are efficiently converted into a single base64 encoded SVG
                  image on-chain. To accomplish this, each part is decoded into an intermediate
                  format before being converted into a series of SVG rects using batched, on-chain
                  string concatenation. Once the entire SVG has been generated, it is base64
                  encoded.
                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="6" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>UNoun Seeder Contract</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  The UNoun Seeder contract is used to determine UNoun traits during the minting
                  process. The seeder contract can be replaced to allow for future trait generation
                  algorithm upgrades. Additionally, it can be locked by the UNouns DAO to prevent any
                  future updates. Currently, UNoun traits are determined using pseudo-random number
                  generation:
                </Trans>
              </p>
              <code>keccak256(abi.encodePacked(blockhash(block.number - 1), unounId))</code>
              <br />
              <br />
              <p>
                <Trans>
                  Trait generation is not truly random. Traits can be predicted when minting a UNoun
                  on the pending block.
                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="7" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>UNounder's Reward</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  'UNounders' are the group of three builders that initiated UNouns. Here are the
                  UNounders:
                </Trans>
              </p>
              <ul>
                <li>
                  <Link text="@d_sola221" url="https://twitter.com/d_sola221" leavesPage={true} />
                </li>
                <li>
                  <Link text="@amiyoko_eth" url="https://twitter.com/amiyoko_eth" leavesPage={true} />
                </li>
                <li>
                  <Link text="@facuserif" url="https://twitter.com/facuserif" leavesPage={true} />
                </li>
              </ul>
              <p>
                <Trans>
                  Because 100% of UNoun auction proceeds are sent to UNouns DAO, UNounders have chosen
                  to compensate themselves with UNouns. Every 10th UNoun for the first 5 years of the
                  project (UNoun ids #0, #10, #20, #30 and so on) will be automatically sent to the
                  UNounder's multisig to be vested and shared among the founding members of the
                  project.
                </Trans>
              </p>
              <p>
                <Trans>
                  UNounder distributions don't interfere with the cadence of 24 hour auctions. UNouns
                  are sent directly to the UNounder's Multisig, and auctions continue on schedule
                  with the next available UNoun ID.
                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>
    </Section>
  );
};
export default Documentation;
