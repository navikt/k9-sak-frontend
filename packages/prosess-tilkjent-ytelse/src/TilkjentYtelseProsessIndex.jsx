import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import tilkjentYtelseBehandlingPropType from './propTypes/tilkjentYtelseBehandlingPropType';
import tilkjentYtelseFagsakPropType from './propTypes/tilkjentYtelseFagsakPropType';
import tilkjentYtelseBeregningresultatPropType from './propTypes/tilkjentYtelseBeregningresultatPropType';
import tilkjentYtelseAksjonspunkterPropType from './propTypes/tilkjentYtelseAksjonspunkterPropType';
import TilkjentYtelsePanel from './components/TilkjentYtelsePanel';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const TilkjentYtelseProsessIndex = ({
  behandling,
  beregningsresultat,
  fagsak,
  aksjonspunkter,
  alleKodeverk,
  isReadOnly,
  submitCallback,
  inntektArbeidYtelse,
  readOnlySubmitButton,
}) => (
  <RawIntlProvider value={intl}>
    <TilkjentYtelsePanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      arbeidsforhold={inntektArbeidYtelse?.arbeidsforhold}
      beregningsresultat={beregningsresultat}
      fagsakYtelseTypeKode={fagsak.fagsakYtelseType.kode}
      aksjonspunkter={aksjonspunkter}
      alleKodeverk={alleKodeverk}
      readOnly={isReadOnly}
      submitCallback={submitCallback}
      readOnlySubmitButton={readOnlySubmitButton}
    />
  </RawIntlProvider>
);

TilkjentYtelseProsessIndex.propTypes = {
  behandling: tilkjentYtelseBehandlingPropType.isRequired,
  beregningsresultat: tilkjentYtelseBeregningresultatPropType.isRequired,
  fagsak: tilkjentYtelseFagsakPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(tilkjentYtelseAksjonspunkterPropType).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  inntektArbeidYtelse: PropTypes.shape(),
};

export default TilkjentYtelseProsessIndex;
