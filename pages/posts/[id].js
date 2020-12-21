import { useEffect, useState } from 'react';
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

export default function PostComp({ post }) {
  const [postState, setPost] = useState(post);
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const isBluehost = postState.id === blueHostId;

  useEffect(() => {
    const copy = [...postState.reasons];
    const sorted = copy.sort((a, b) => b.votes - a.votes);
    setPost((prevState) => {
      return {
        ...prevState,
        reasons: sorted,
      };
    });
  }, []);

  // TODO: reasonTitle should be id
  const handleVote = async (voteValue, reason) => {
    const original = await DataStore.query(Post, postState.id);

    const updatedPost = await DataStore.save(
      Post.copyOf(original, (item) => {
        const newReasons = item.reasons.map((cloudReason) => {
          if (cloudReason.title === reason.title) {
            cloudReason.votes += voteValue;
          }
          return cloudReason;
        });

        item.reasons = newReasons;
        return item;
      })
    );

    const copy = [...updatedPost.reasons];
    const sorted = copy.sort((a, b) => b.votes - a.votes);
    setPost({ ...updatedPost, reasons: sorted });
  };

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
        {postState.reasons ? (
          <ol>
            {postState.reasons?.map((reason, idx) => (
              <Reason
                key={idx}
                reason={reason}
                post={post}
                index={idx + 1}
                onVote={handleVote}
              />
            ))}
          </ol>
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
