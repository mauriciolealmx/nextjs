import { useState } from 'react';

import UpTriange from '../../svgs/upTriange.svg';
import { debounce } from './reason.helpers';

import styles from './reason.module.css';

export default function Reason({ onVote, sortedReasons, sortedReasonsV2 }) {
  const [castedVotes, setCastedVotes] = useState({});

  const handleVote = (title, initialVotes, voteValue, isV2) => {
    const reasonVotes = castedVotes[title];
    if (reasonVotes) {
      const canVoteUp = reasonVotes.vote !== voteValue;
      if (canVoteUp) {
        reasonVotes.vote += voteValue;
        onVote(voteValue, title, isV2);
      }
    }

    if (!reasonVotes) {
      castedVotes[title] = { vote: voteValue, initialVotes };
      onVote(voteValue, title, isV2);
    }
  };

  return (
    <ol>
      {/* Temp -1 to undo changes */}
      {!sortedReasonsV2.length > 0
        ? sortedReasons.map((reason, idx) => {
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
                        castedVotes[reason.title]?.vote === 1
                          ? styles.voted
                          : ''
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
                        castedVotes[reason.title]?.vote === -1
                          ? styles.voted
                          : ''
                      }`}
                    />
                  </button>
                </div>
                <p className={styles.reasonTitle}>{`${idx + 1}. ${
                  reason?.title
                }`}</p>
              </li>
            );
          })
        : sortedReasonsV2.map((reason, idx) => {
            return (
              <li key={reason.title} className={styles.reasonRoot}>
                <div className={styles.votingRoot}>
                  <button
                    className={`${styles.textButton}`}
                    onClick={debounce(
                      () => handleVote(reason.title, reason.votes, 1, reason.id),
                      300
                    )}
                  >
                    <UpTriange
                      className={`${styles.btVote} ${
                        castedVotes[reason.title]?.vote === 1
                          ? styles.voted
                          : ''
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
                      () => handleVote(reason.title, reason.votes, -1, reason.id),
                      300
                    )}
                  >
                    <UpTriange
                      className={`${styles.btVote} ${
                        castedVotes[reason.title]?.vote === -1
                          ? styles.voted
                          : ''
                      }`}
                    />
                  </button>
                </div>
                <div>
                  <p className={styles.reasonTitleV2}>{`${idx + 1}. ${
                    reason?.title
                  }`}</p>
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
