import BlueHost from 'components/blueHost/blueHost';
import CardDisclaimer from 'components/cardDisclaimer/cardDisclaimer';
import Fiverr from 'components/fiverr/fiverr';

const affiliateMap = {
  '0008c2c3-67c3-4df3-8ead-535d6f577650': {
    id: 'bluehost',
    renderer: <BlueHost />,
  },
  '2741a20e-3687-4113-a6a1-7004bc8fc5fa': {
    id: 'fiverr',
    renderer: <Fiverr />,
    disclaimer: <CardDisclaimer title="Disclaimer" />
  },
};

export default affiliateMap;
