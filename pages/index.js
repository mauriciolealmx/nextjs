import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { DataStore } from '@aws-amplify/datastore';

import Date from '../components/date';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { Post } from '../models';

export default function Home({ allPosts }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>You should:</h2>
        <ul className={utilStyles.list}>
          {allPosts.length > 0 &&
            allPosts?.map((post) => (
              <li className={utilStyles.listItem} key={post.id}>
                <Link href={`/posts/${post.id}`}>
                  <a>{post.title}</a>
                </Link>
                <br />
                <small className={utilStyles.lightText}>
                  <Date lastChangedAtInMS={post?._lastChangedAt} />
                </small>
              </li>
            ))}
        </ul>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const postData = await DataStore.query(Post);
  const allPosts = JSON.parse(JSON.stringify(postData));

  return {
    props: { allPosts },
  };
}
