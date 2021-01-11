import { useCallback, useState } from 'react';
import Head from 'next/head';
import Markdown from 'react-markdown';
import { DataStore } from '@aws-amplify/datastore';
import { useRouter } from 'next/router';
import { withSSRContext } from 'aws-amplify';

import BlueHost from 'components/blueHost/blueHost';
import Fiverr from 'components/fiverr/fiverr';

import * as gtag from 'lib/gtag';
import Date from 'components/date';
import Layout from 'components/layout';
import Reason from 'components/reason/reason';
import { Post, ReasonV2 } from 'models';

import utilStyles from 'styles/utils.module.css';
import styles from './post.module.css';

const blueHostId = '0008c2c3-67c3-4df3-8ead-535d6f577650';
const fiverrId = '2741a20e-3687-4113-a6a1-7004bc8fc5fa';

const replaceItemAtIndex = (arr, index, newValue) => {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
};

export default function PostComp({ post, reasonsV2 }) {
  const [reasonsV2State, setReasonsV2State] = useState(reasonsV2);
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const isBluehost = post.id === blueHostId;
  const isFiverr = post.id === fiverrId;

  // TODO: reasonTitle should be id
  const handleVote = useCallback(async (voteValue, title, reasonId) => {
    const originalReason = await DataStore.query(ReasonV2, reasonId);
    const updatedReason = await DataStore.save(
      ReasonV2.copyOf(originalReason, (item) => ({
        ...item,
        votes: (item.votes += voteValue),
      }))
    );

    setReasonsV2State((prevState) => {
      const reasonIdx = prevState.findIndex((r) => r.id === updatedReason.id);
      const newState = replaceItemAtIndex(prevState, reasonIdx, updatedReason);

      return newState;
    });
  }, []);

  const handleClick = (label) => {
    gtag.event({
      label,
      action: 'click',
      category: 'ab-testing',
    });
  };

  let reasonsCopy;
  let sortedReasonsV2;
  if (reasonsV2State) {
    reasonsCopy = [...(reasonsV2State || [])];
    sortedReasonsV2 = reasonsCopy.sort((a, b) => b.votes - a.votes);
  }

  const hasSortedReasons = sortedReasonsV2?.length > 0;

  return (
    <Layout>
      <Head>
        <title>{post.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingMd}>{post.title}</h1>
        <div className={utilStyles.lightText}>
          <Date lastChangedAtInMS={post._lastChangedAt} />
        </div>
        {isFiverr && (
          <div className={styles.disclaimerRoot}>
            <div>Disclaimer</div>
            <p>
              A <strong>20% </strong> off is applied to your{' '}
              <strong>first time purchase</strong> when using the Fiverr{' '}
              <strong>link below</strong>. Furthermore, this website earns a
              commission when making that first purchase.
            </p>
          </div>
        )}
        {isBluehost && <BlueHost />}
        {isFiverr && <Fiverr />}
        {hasSortedReasons ? (
          <Reason onVote={handleVote} sortedReasonsV2={sortedReasonsV2} />
        ) : (
          <Markdown>{post.content}</Markdown>
        )}
      </article>
      <div className={styles.actionsRoot}>
        <button
          onClick={() => handleClick('show more')}
          className={styles.textButton}
        >
          Show more
        </button>
        <button
          onClick={() => handleClick('add reason')}
          className={styles.addReason}
        >
          Add Reason
        </button>
      </div>
      {isBluehost && <BlueHost />}
      {isFiverr && <Fiverr />}
    </Layout>
  );
}

export async function getServerSideProps(req) {
  const { DataStore } = withSSRContext(req);
  const {
    params: { id },
  } = req;

  const reasons = await DataStore.query(ReasonV2);
  const postReasons = reasons.filter((reason) => reason.postID === id);

  const post = await DataStore.query(Post, id);

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
      reasonsV2: JSON.parse(JSON.stringify(postReasons)),
    },
  };
}
