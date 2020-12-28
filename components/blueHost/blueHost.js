import * as gtag from '../../lib/gtag';

const TRACKING_URL = process.env.NEXT_PUBLIC_BH_TRACKING_URL;
const IMAGE_URL = process.env.NEXT_PUBLIC_BH_IMG_URL;

const BlueHost = () => {
  const handleClick = () => {
    gtag.event({
      action: 'click',
      category: 'affiliate',
      label: 'click_affiliate',
      value: 'bluehost',
    });
  };

  return (
    <a href={TRACKING_URL} target="_blank" onClick={handleClick}>
      <img border="0" src={IMAGE_URL} />
    </a>
  );
};

export default BlueHost;
