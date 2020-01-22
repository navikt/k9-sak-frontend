import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import BehandleResultatForm from './components/BehandleResultatForm';
import messages from '../i18n/nb_NO.json';
import ankeResultatBehandlingPropType from './propTypes/ankeResultatBehandlingPropType';
import ankeResultatAksjonspunkterPropType from './propTypes/ankeResultatAksjonspunkterPropType';
import ankeVurderingPropType from './propTypes/ankeVurderingPropType';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const AnkeResultatProsessIndex = ({
  behandling,
  ankeVurdering,
  aksjonspunkter,
  submitCallback,
  readOnly,
  readOnlySubmitButton,
  saveAnke,
  previewCallback,
  previewVedtakCallback,
}) => (
  <RawIntlProvider value={intl}>
    <BehandleResultatForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      ankeVurderingResultat={ankeVurdering.ankeVurderingResultat}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      readOnly={readOnly}
      readOnlySubmitButton={readOnlySubmitButton}
      saveAnke={saveAnke}
      previewCallback={previewCallback}
      previewVedtakCallback={previewVedtakCallback}
    />
  </RawIntlProvider>
);

AnkeResultatProsessIndex.propTypes = {
  behandling: ankeResultatBehandlingPropType.isRequired,
  ankeVurdering: ankeVurderingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(ankeResultatAksjonspunkterPropType).isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  saveAnke: PropTypes.func.isRequired,
  previewCallback: PropTypes.func.isRequired,
  previewVedtakCallback: PropTypes.func.isRequired,
};

export default AnkeResultatProsessIndex;
