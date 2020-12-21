import styles from './reason.module.css';

export default function Reason({ index, reason }) {
  return (
    <li className={styles.reasonRoot}>
      <span className={styles.marker}>{index}.</span>
      {reason.title}
    </li>
  );
}
