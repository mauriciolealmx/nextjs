const TRACKING_URL = process.env.NEXT_PUBLIC_BH_TRACKING_URL;
const IMAGE_URL = process.env.NEXT_PUBLIC_BH_IMG_URL;

const BlueHost = () => (
  <a href={TRACKING_URL} target="_blank">
    <img border="0" src={IMAGE_URL} />
  </a>
);

export default BlueHost;
