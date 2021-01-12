import styles from './cardDisclaimer.module.css';

const CardDisclaimer = ({ title }) => (
  <div className={styles.disclaimerRoot}>
    <div>{title}</div>
    <p>
      A <strong>20% </strong> off is applied to your{' '}
      <strong>first time purchase</strong> when using the Fiverr{' '}
      <strong>link below</strong>. Furthermore, this website earns a commission
      when making that first purchase.
    </p>
  </div>
);

export default CardDisclaimer;
