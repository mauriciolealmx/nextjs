import UpTriange from '../../svgs/upTriange.svg';

import styles from './reason.module.css';

export default function Reason({ index, reason, onVote }) {
  const handleVote = async (voteValue) => {
    onVote(voteValue, reason);
  };

  return (
    <li className={styles.reasonRoot}>
      <div className={styles.votingRoot}>
        <button className={styles.textButton} onClick={() => handleVote(1)}>
          <UpTriange className={styles.btVote} />
        </button>
        <span>{reason.votes}</span>
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
