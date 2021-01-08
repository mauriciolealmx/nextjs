import { useState } from 'react';

import UpTriange from '../../svgs/upTriange.svg';
import { debounce } from './reason.helpers';

import styles from './reason.module.css';

export default function Reason({ onVote, sortedReasonsV2 }) {
  const [castedVotes, setCastedVotes] = useState({});

  const handleVote = (initialVotes, voteValue, reasonId) => {
    const reasonVotes = castedVotes[reasonId];
    if (reasonVotes) {
      const canVoteUp = reasonVotes.vote !== voteValue;
      if (canVoteUp) {
        reasonVotes.vote += voteValue;
        onVote(voteValue, reasonId, reasonId);
      }
    }

    if (!reasonVotes) {
      castedVotes[reasonId] = { vote: voteValue, initialVotes };
      onVote(voteValue, reasonId, reasonId);
    }
  };

  const hasReasons = sortedReasonsV2.length > 0;

  return (
    <ol>
      {hasReasons &&
        sortedReasonsV2.map((reason, idx) => {
          return (
            <li key={reason.id} className={styles.reasonRoot}>
              <div className={styles.votingRoot}>
                <button
                  className={styles.textButton}
                  onClick={debounce(
                    () => handleVote(reason.votes, 1, reason.id),
                    300
                  )}
                >
                  <UpTriange
                    className={`${styles.btVote} ${
                      castedVotes[reason.id]?.vote === 1 ? styles.voted : ''
                    }`}
                  />
                </button>
                <div className={styles.label}>
                  <span>{reason?.votes}</span>
                  <span>votes</span>
                </div>
                <button
                  className={`${styles.textButton} ${styles.rotated}`}
                  onClick={debounce(
                    () => handleVote(reason.votes, -1, reason.id),
                    300
                  )}
                >
                  <UpTriange
                    className={`${styles.btVote} ${
                      castedVotes[reason.id]?.vote === -1 ? styles.voted : ''
                    }`}
                  />
                </button>
              </div>
              <div>
                <p
                  className={
                    reason?.description
                      ? styles.reasonTitleV2
                      : styles.reasonDescription
                  }
                >{`${idx + 1}. ${reason?.title}`}</p>
                <p className={styles.reasonDescription}>
                  {reason?.description}
                </p>
              </div>
            </li>
          );
        })}
    </ol>
  );
}
