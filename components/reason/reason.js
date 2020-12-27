import { useState } from 'react';

import UpTriange from '../../svgs/upTriange.svg';
import { debounce } from './reason.helpers';

import styles from './reason.module.css';

export default function Reason({ onVote, sortedReasons }) {
  const [castedVotes, setCastedVotes] = useState({});

  const handleVote = (title, initialVotes, voteValue) => {
    const reasonVotes = castedVotes[title];
    if (reasonVotes) {
      const canVoteUp = reasonVotes.vote !== voteValue;
      if (canVoteUp) {
        reasonVotes.vote += voteValue;
        onVote(voteValue, title);
      }
    }

    if (!reasonVotes) {
      castedVotes[title] = { vote: voteValue, initialVotes };
      onVote(voteValue, title);
    }
  };

  return (
    <ol>
      {sortedReasons.map((reason, idx) => {
        return (
          <li key={reason.title} className={styles.reasonRoot}>
            <div className={styles.votingRoot}>
              <button
                className={`${styles.textButton}`}
                onClick={debounce(
                  () => handleVote(reason.title, reason.votes, 1),
                  300
                )}
              >
                <UpTriange
                  className={`${styles.btVote} ${
                    castedVotes[reason.title]?.vote === 1 ? styles.voted : ''
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
                  () => handleVote(reason.title, reason.votes, -1),
                  300
                )}
              >
                <UpTriange
                  className={`${styles.btVote} ${
                    castedVotes[reason.title]?.vote === -1 ? styles.voted : ''
                  }`}
                />
              </button>
            </div>
            <span className={styles.marker}>{idx + 1}.</span>
            {reason?.title}
          </li>
        );
      })}
    </ol>
  );
}
