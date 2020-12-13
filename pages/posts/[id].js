import Head from 'next/head';
import Markdown from 'react-markdown';
import { useRouter } from 'next/router';
import { withSSRContext } from 'aws-amplify';

import Date from '../../components/date';
import Layout from '../../components/layout';
import { Post } from '../../models';

import utilStyles from '../../styles/utils.module.css';

export default function PostComp({ post }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
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
        <Markdown children={post.content} />
      </article>
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
