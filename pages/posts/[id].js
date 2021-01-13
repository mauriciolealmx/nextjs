import { useCallback, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import * as gtag from 'lib/gtag';
import * as postsClient from 'apis/posts.api';
import Date from 'components/date';
import Layout from 'components/layout';
import Reasons from 'components/reason/reason';
import affiliateMap from './affiliateMap';

import utilStyles from 'styles/utils.module.css';
import styles from './post.module.css';

const replaceItemAtIndex = (arr, index, newValue) => {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
};

export default function PostComp({ post, reasons }) {
  const [reasonsState, setReasonsState] = useState(reasons);
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const handleVote = useCallback(async (voteValue, reasonId) => {
    const updatedReason = await postsClient.updateReasonById(
      reasonId,
      (prevState) => ({
        ...prevState,
        votes: (prevState.votes += voteValue),
      })
    );

    setReasonsState((prevState) => {
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

  const hasReasons = reasonsState?.length > 0;
  const sortedReasons = reasonsState?.sort((a, b) => b.votes - a.votes);

  const { renderer, disclaimer } = affiliateMap[post.id];

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
        {renderer}
        {disclaimer}
        {hasReasons && (
          <Reasons onVote={handleVote} sortedReasonsV2={sortedReasons} />
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
      {renderer}
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const { id } = params;
  const postReasons = await postsClient.getReasonsByPostId(id);
  const post = await postsClient.getPostById(id);

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
      reasons: JSON.parse(JSON.stringify(postReasons)),
    },
  };
}
