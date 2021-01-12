import { useState } from 'react';

import VoteButton from 'components/VoteButton';
import { debounce } from 'components/reason/reason.helpers';

import styles from './reason.module.css';

export default function Reason({ onVote, sortedReasonsV2 }) {
  const [castedVotes, setCastedVotes] = useState({});

  const handleVote = (initialVotes, voteValue, reasonId) => {
    const reasonVotes = castedVotes[reasonId];
    if (reasonVotes) {
      const canVoteUp = reasonVotes.vote !== voteValue;
      if (canVoteUp) {
        reasonVotes.vote += voteValue;
        onVote(voteValue, reasonId);
      }
    }

    if (!reasonVotes) {
      castedVotes[reasonId] = { vote: voteValue, initialVotes };
      onVote(voteValue, reasonId);
    }
  };

  const hasReasons = sortedReasonsV2.length > 0;

  return (
    <ol>
      {hasReasons &&
        sortedReasonsV2.map((reason, idx) => {
          const { id, votes, description } = reason;
          const reasonCastedVotes = castedVotes[id]?.vote;

          const voteButtonProps = (voteValue) => ({
            voteValue,
            isActive: reasonCastedVotes === voteValue,
            onClick: debounce(() => handleVote(votes, voteValue, id), 300),
          });

          return (
            <li key={id} className={styles.reasonRoot}>
              <div className={styles.votingRoot}>
                <VoteButton {...voteButtonProps(1)} />
                <div className={styles.label}>
                  <span>{votes}</span>
                  <span>votes</span>
                </div>
                <VoteButton {...voteButtonProps(-1)} />
              </div>
              <div>
                <p
                  className={
                    description
                      ? styles.reasonTitleV2
                      : styles.reasonDescription
                  }
                >{`${idx + 1}. ${reason?.title}`}</p>
                <p className={styles.reasonDescription}>{description}</p>
              </div>
            </li>
          );
        })}
    </ol>
  );
}
