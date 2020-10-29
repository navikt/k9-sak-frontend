import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

// import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import messages from '../i18n/nb_NO.json';
import BehandleUnntak from './components/BehandleUnntakForm';
import unntakBehandlingPropType from './propTypes/unntakBehandlingPropType';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const UnntakProsessIndex = ({
  behandling,
  alleKodeverk,
  submitCallback,
  isReadOnly,
  previewCallback,
  readOnlySubmitButton,
  aksjonspunkter,
}) => (
  <RawIntlProvider value={intl}>
    <BehandleUnntak
      behandlingsresultat={behandling.behandlingsresultat}
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      sprakkode={behandling.sprakkode}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      readOnly={isReadOnly}
      previewCallback={previewCallback}
      readOnlySubmitButton={readOnlySubmitButton}
      alleKodeverk={alleKodeverk}
    />
  </RawIntlProvider>
);

UnntakProsessIndex.propTypes = {
  behandling: unntakBehandlingPropType.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  submitCallback: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  previewCallback: PropTypes.func.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default UnntakProsessIndex;
