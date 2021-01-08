import UpTriange from 'svgs/upTriange.svg';

import styles from 'components/reason/reason.module.css';

const VoteButton = ({ voteValue, isActive, onClick }) => {
  const highlightVote = isActive ? styles.voted : '';

  const isDownVote = voteValue === -1;
  const voteDownClasses = isDownVote ? styles.rotated : '';
  const buttonClasses = `${styles.textButton} ${voteDownClasses}`;

  return (
    <button className={buttonClasses} onClick={onClick}>
      <UpTriange className={`${styles.btVote} ${highlightVote}`} />
    </button>
  );
};

export default VoteButton;
