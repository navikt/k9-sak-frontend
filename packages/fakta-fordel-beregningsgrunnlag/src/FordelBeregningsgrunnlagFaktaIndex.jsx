import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import FordelBeregningsgrunnlagPanel from './components/FordelBeregningsgrunnlagPanel';
import fordelBeregningsgrunnlagAksjonspunkterPropType from './propTypes/fordelBeregningsgrunnlagAksjonspunkterPropType';
import beregningsgrunnlagPropType from './propTypes/beregningsgrunnlagPropType';
import fordelBeregningsgrunnlagBehandlingPropType from './propTypes/fordelBeregningsgrunnlagBehandlingPropType';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const FordelBeregningsgrunnlagFaktaIndex = ({
  behandling,
  beregningsgrunnlag,
  alleKodeverk,
  alleMerknaderFraBeslutter,
  aksjonspunkter,
  submitCallback,
  openInfoPanels,
  toggleInfoPanelCallback,
  shouldOpenDefaultInfoPanels,
  readOnly,
}) => (
  <RawIntlProvider value={intl}>
    <FordelBeregningsgrunnlagPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      behandlingType={behandling.type}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggleInfoPanelCallback}
      shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
      readOnly={readOnly}
      beregningsgrunnlag={beregningsgrunnlag}
    />
  </RawIntlProvider>
);

FordelBeregningsgrunnlagFaktaIndex.propTypes = {
  behandling: fordelBeregningsgrunnlagBehandlingPropType.isRequired,
  beregningsgrunnlag: beregningsgrunnlagPropType.isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  aksjonspunkter: PropTypes.arrayOf(fordelBeregningsgrunnlagAksjonspunkterPropType).isRequired,
  submitCallback: PropTypes.func.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  shouldOpenDefaultInfoPanels: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default FordelBeregningsgrunnlagFaktaIndex;
