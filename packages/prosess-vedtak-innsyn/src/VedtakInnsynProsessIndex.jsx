import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import InnsynVedtakForm from './components/InnsynVedtakForm';
import innsynPropType from './propTypes/innsynPropType';
import vedtakInnsynBehandlingPropType from './propTypes/vedtakInnsynBehandlingPropType';
import vedtakInnsynAksjonspunkterPropType from './propTypes/vedtakInnsynAksjonspunkterPropType';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const VedtakInnsynProsessIndex = ({
  behandling,
  innsyn,
  saksnummer,
  aksjonspunkter,
  alleDokumenter,
  submitCallback,
  previewCallback,
  readOnly,
}) => (
  <RawIntlProvider value={intl}>
    <InnsynVedtakForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      sprakkode={behandling.sprakkode}
      innsynDokumenter={innsyn.dokumenter}
      innsynMottattDato={innsyn.innsynMottattDato}
      innsynResultatType={innsyn.innsynResultatType}
      alleDokumenter={alleDokumenter}
      saksNr={saksnummer}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      previewCallback={previewCallback}
      readOnly={readOnly}
    />
  </RawIntlProvider>
);

VedtakInnsynProsessIndex.propTypes = {
  behandling: vedtakInnsynBehandlingPropType.isRequired,
  innsyn: innsynPropType.isRequired,
  saksnummer: PropTypes.string.isRequired,
  aksjonspunkter: PropTypes.arrayOf(vedtakInnsynAksjonspunkterPropType).isRequired,
  alleDokumenter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  submitCallback: PropTypes.func.isRequired,
  previewCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default VedtakInnsynProsessIndex;
