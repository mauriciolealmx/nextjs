import { useCallback, useState } from 'react';
import Head from 'next/head';
import Markdown from 'react-markdown';
import { DataStore } from '@aws-amplify/datastore';
import { useRouter } from 'next/router';
import { withSSRContext } from 'aws-amplify';

import Date from '../../components/date';
import Layout from '../../components/layout';
import Reason from '../../components/reason/reason';
import { Post } from '../../models';

import utilStyles from '../../styles/utils.module.css';

const blueHostId = '0008c2c3-67c3-4df3-8ead-535d6f577650';
const linkUrl = 'https://www.bluehost.com/track/mauricioleal/googleAds';
const imgSrc =
  'https://bluehost-cdn.com/media/partner/images/mauricioleal/760x80/760x80BW.png';

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

export default function PostComp({ post }) {
  const [postState, setPost] = useState(post);
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const isBluehost = postState.id === blueHostId;

  // TODO: reasonTitle should be id
  const handleVote = useCallback(async (voteValue, title) => {
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
  }, []);

  let reasonsCopy;
  let sortedReasons;
  if (postState.reasons) {
    reasonsCopy = [...postState.reasons];
    sortedReasons = reasonsCopy.sort((a, b) => b.votes - a.votes);
  }

  return (
    <Layout>
      <Head>
        <title>{post.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{post.title}</h1>
        <div className={utilStyles.lightText}>
          <Date lastChangedAtInMS={post._lastChangedAt} />
        </div>

        {sortedReasons?.length > 0 ? (
          <Reason onVote={handleVote} sortedReasons={sortedReasons} />
        ) : (
          <Markdown children={post.content} />
        )}
      </article>
      {isBluehost && (
        <a href={linkUrl} target="_blank">
          <img border="0" src={imgSrc} />
        </a>
      )}
    </Layout>
  );
}

export async function getStaticPaths(req) {
  const { DataStore } = withSSRContext(req);
  const posts = await DataStore.query(Post);
  const paths = posts.map((post) => ({ params: { id: post.id } }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps(req) {
  const { DataStore } = withSSRContext(req);
  const {
    params: { id },
  } = req;

  const post = await DataStore.query(Post, id);

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
    },
    revalidate: 100,
  };
}
