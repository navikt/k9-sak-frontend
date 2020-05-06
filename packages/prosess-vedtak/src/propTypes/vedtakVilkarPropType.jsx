import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const vedtakVilkarPropType = PropTypes.shape({
  lovReferanse: PropTypes.string,
  vilkarType: kodeverkObjektPropType.isRequired,
  perioder: [
    {
      vilkarStatus: kodeverkObjektPropType.isRequired,
    },
  ],
});

export default vedtakVilkarPropType;
