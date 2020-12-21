import Head from 'next/head';
import Markdown from 'react-markdown';
import { useRouter } from 'next/router';
import { withSSRContext } from 'aws-amplify';

import Date from '../../components/date';
import Layout from '../../components/layout';
import Reason from '../../components/reason/reason';
import { Post } from '../../models';

import utilStyles from '../../styles/utils.module.css';

const blueHostId = 'fa4e1c36-bf99-400b-8c82-348589912807';
const linkUrl = 'https://www.bluehost.com/track/mauricioleal/googleAds';
const imgSrc =
  'https://bluehost-cdn.com/media/partner/images/mauricioleal/760x80/760x80BW.png';

export default function PostComp({ post }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const isBluehost = post.id === blueHostId;

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
        {post.reasons ? (
          <ol>
            {post.reasons.map((reason, idx) => (
              <Reason
                key={idx}
                reason={{ ...reason }}
                post={post}
                index={idx + 1}
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
