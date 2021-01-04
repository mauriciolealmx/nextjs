import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import Markdown from 'react-markdown';
import { DataStore } from '@aws-amplify/datastore';
import { useRouter } from 'next/router';
import { withSSRContext } from 'aws-amplify';

import BlueHost from '../../components/blueHost/blueHost';
import Fiverr from '../../components/fiverr/fiverr';

import Date from '../../components/date';
import Layout from '../../components/layout';
import Reason from '../../components/reason/reason';
import { Post, ReasonV2 } from '../../models';

import utilStyles from '../../styles/utils.module.css';

const blueHostId = '0008c2c3-67c3-4df3-8ead-535d6f577650';
const fiverrId = '2741a20e-3687-4113-a6a1-7004bc8fc5fa';

const fixReasons = [
  {
    title:
      'Free domain name included with your purchase (1 domain name, 1 year)',
    votes: 0,
    description: '',
  },
  {
    title: 'Unlimited Email Accounts and Email Storage',
    votes: 0,
    description: '',
  },
  {
    title:
      'eCommerce features with multiple shopping carts and Free SSL security',
    votes: 0,
    description: '',
  },
  {
    title: 'Excellent security features',
    votes: 0,
    description: '',
  },
  {
    title: 'WordPress hosting on Bluehost is considered to be top-notch',
    votes: 0,
    description: '',
  },
];

const replaceItemAtIndex = (arr, index, newValue) => {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
};

export default function PostComp({ post, reasonsV2 }) {
  const [postState, setPost] = useState(post);
  const [reasonsV2State, setReasonsV2State] = useState(reasonsV2);
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const isBluehost = postState.id === blueHostId;
  const isFiverr = postState.id === fiverrId;

  // TODO: reasonTitle should be id
  const handleVote = useCallback(async (voteValue, title, reasonId) => {
    if (!reasonId) {
      const original = await DataStore.query(Post, postState.id);
      const updatedPost = await DataStore.save(
        Post.copyOf(original, (item) => {
          const newReasons = item.reasons.map((cloudReason) => {
            if (cloudReason.title === title) {
              cloudReason.votes += voteValue;
            }
            return cloudReason;
          });

          item.reasons = newReasons;
          return item;
        })
      );

      const reasonsCopy = [...updatedPost.reasons];
      const sortedReasons = reasonsCopy.sort((a, b) => b.votes - a.votes);

      setPost({ ...updatedPost, reasons: sortedReasons });
    } else {
      const originalReason = await DataStore.query(ReasonV2, reasonId);
      const updatedReason = await DataStore.save(
        Post.copyOf(originalReason, (item) => ({
          ...item,
          votes: (item.votes += voteValue),
        }))
      );

      setReasonsV2State((prevState) => {
        const reasonIdx = prevState.findIndex((r) => r.id === updatedReason.id);
        const newState = replaceItemAtIndex(
          prevState,
          reasonIdx,
          updatedReason
        );

        return newState;
      });
    }
  }, []);

  let reasonsCopy;
  let sortedReasons;
  if (postState.reasons) {
    reasonsCopy = [...postState.reasons];
    sortedReasons = reasonsCopy.sort((a, b) => b.votes - a.votes);
  }

  let sortedReasonsV2;
  if (reasonsV2State) {
    reasonsCopy = [...(reasonsV2State || [])];
    sortedReasonsV2 = reasonsCopy.sort((a, b) => b.votes - a.votes);
  }

  const hasSortedReasons =
    sortedReasons?.length > 0 || sortedReasonsV2?.length > 0;

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
        {isFiverr && <Fiverr />}
        {hasSortedReasons ? (
          <Reason
            onVote={handleVote}
            sortedReasons={sortedReasons}
            sortedReasonsV2={sortedReasonsV2}
          />
        ) : (
          <Markdown children={post.content} />
        )}
      </article>
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
