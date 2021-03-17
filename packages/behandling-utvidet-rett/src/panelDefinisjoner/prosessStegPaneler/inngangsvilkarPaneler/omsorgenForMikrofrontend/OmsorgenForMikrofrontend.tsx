import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';
import sjekkHvisErIProduksjon from '@fpsak-frontend/utils/src/micro-frontends/sjekkHvisErIProduksjon';
import KartleggePropertyTilOmsorgenForMikrofrontendKomponent from './KartleggePropertyTilOmsorgenForMikrofrontendKomponent';

const initializeOmsorgenForVilkar = (
  elementId,
  { isReadOnly, aksjonspunkter, isAksjonspunktOpen, submitCallback, behandling, status, vilkar, angitteBarn },
) => {
  (window as any).renderMicrofrontendOmsorgsdagerApp(
    elementId,
    KartleggePropertyTilOmsorgenForMikrofrontendKomponent(
      isReadOnly,
      submitCallback,
      behandling,
      angitteBarn,
      { aksjonspunkter, isAksjonspunktOpen },
      { vilkar, status },
    ),
  );
};

const hentVersjonInformasjon = () => {
  const produksjonsVersjon = {
    versjon: '1.5.29',
    jsIntegrity: 'sha384-hHFYOcum1J9U/5dNOouYiTlcPhv4bF/SBVvlyri9YHsSWNFD2HrK9NxUkqUPjorm',
    stylesheetIntegrity: 'sha384-s7zKNrhjA1tpqnkyej5k6S6jybA6XM3bdjEMmWg9iMy7Mnj2pVupmHEmWn9LX1pY',
  };
  const preprodVersjon = {
    versjon: '1.5.29',
    jsIntegrity: 'sha384-hHFYOcum1J9U/5dNOouYiTlcPhv4bF/SBVvlyri9YHsSWNFD2HrK9NxUkqUPjorm',
    stylesheetIntegrity: 'sha384-s7zKNrhjA1tpqnkyej5k6S6jybA6XM3bdjEMmWg9iMy7Mnj2pVupmHEmWn9LX1pY',
  };
  return sjekkHvisErIProduksjon ? produksjonsVersjon : preprodVersjon;
};

export default props => {
  const omsorgenForVilkårAppID = 'omsorgenForRettApp';
  const { versjon, jsIntegrity, stylesheetIntegrity } = hentVersjonInformasjon();

  return (
    <MicroFrontend
      id={omsorgenForVilkårAppID}
      jsSrc={`/k9/microfrontend/omsorgsdager/${versjon}/app.js`}
      jsIntegrity={jsIntegrity}
      stylesheetSrc={`/k9/microfrontend/omsorgsdager/${versjon}/styles.css`}
      stylesheetIntegrity={stylesheetIntegrity}
      onReady={() => initializeOmsorgenForVilkar(omsorgenForVilkårAppID, props)}
    />
  );
};
