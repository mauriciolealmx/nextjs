import { useState } from 'react';
import { DataStore } from '@aws-amplify/datastore';

import UpTriange from '../../svgs/upTriange.svg';
import { Post } from '../../models';

import styles from './reason.module.css';

export default function Reason({ index, reason, post }) {
  const [votes, setVotes] = useState(reason.votes);

  const handleVote = async (voteValue) => {
    const original = await DataStore.query(Post, post.id);
    await DataStore.save(
      Post.copyOf(original, (item) => {
        const { reasons } = item;
        const newReasons = reasons.map((currentReason) => {
          if (currentReason.title === reason.title) {
            currentReason.votes += voteValue;
            return reason;
          }
          return reason;
        });

        return {
          ...item,
          reasons: newReasons,
        };
      })
    );

    setVotes((prevValue) => (prevValue += voteValue));
  };

  return (
    <li className={styles.reasonRoot}>
      <div className={styles.votingRoot}>
        <button className={styles.textButton} onClick={() => handleVote(1)}>
          <UpTriange className={styles.btVote} />
        </button>
        <span>{votes}</span>
        <button
          className={`${styles.textButton}  ${styles.rotated}`}
          onClick={() => handleVote(-1)}
        >
          <UpTriange className={styles.btVote} />
        </button>
      </div>
      <span className={styles.marker}>{index}.</span>
      {reason.title}
    </li>
  );
}
