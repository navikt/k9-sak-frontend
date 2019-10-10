import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import OmsorgInfoPanel from './components/OmsorgInfoPanel';
import omsorgAksjonspunkterPropType from './propTypes/omsorgAksjonspunkterPropType';
import omsorgPersonopplysningerPropType from './propTypes/omsorgPersonopplysningerPropType';
import omsorgYtelsefordelingPropType from './propTypes/omsorgYtelsefordelingPropType';
import omsorgBehandlingPropType from './propTypes/omsorgBehandlingPropType';
import omsorgSoknadPropType from './propTypes/omsorgSoknadPropType';
import messages from '../i18n/nb_NO';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const OmsorgFaktaIndex = ({
  behandling,
  ytelsefordeling,
  soknad,
  personopplysninger,
  aksjonspunkter,
  alleKodeverk,
  alleMerknaderFraBeslutter,
  submitCallback,
  openInfoPanels,
  toggleInfoPanelCallback,
  shouldOpenDefaultInfoPanels,
  readOnly,
}) => (
  <RawIntlProvider value={intl}>
    <OmsorgInfoPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      aksjonspunkter={aksjonspunkter}
      ytelsefordeling={ytelsefordeling}
      personopplysninger={personopplysninger}
      soknad={soknad}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      submitCallback={submitCallback}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggleInfoPanelCallback}
      shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
      readOnly={readOnly}
    />
  </RawIntlProvider>
);

OmsorgFaktaIndex.propTypes = {
  behandling: omsorgBehandlingPropType.isRequired,
  ytelsefordeling: omsorgYtelsefordelingPropType.isRequired,
  soknad: omsorgSoknadPropType.isRequired,
  personopplysninger: omsorgPersonopplysningerPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(omsorgAksjonspunkterPropType).isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  submitCallback: PropTypes.func.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  shouldOpenDefaultInfoPanels: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default OmsorgFaktaIndex;
