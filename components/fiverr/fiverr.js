const TRACKING_URL = process.env.NEXT_PUBLIC_FIVERR_TRACKING_URL;
const IMAGE_URL = process.env.NEXT_PUBLIC_FIVERR_IMG_URL;

const Fiverr = () => {
  return (
    <a href={TRACKING_URL} target="_Top">
      <img
        style={{ margin: '10px 0 0 0' }}
        border="0"
        src={IMAGE_URL}
        width="340"
        height="70"
      />
    </a>
  );
};

export default Fiverr;
