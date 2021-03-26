import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';
import sjekkHvisErIProduksjon from '@fpsak-frontend/utils/src/micro-frontends/sjekkHvisErIProduksjon';
import KartleggePropertyTilSaerligeSmittevernhensynMikrofrontend from './KartleggePropertyTilSaerligeSmittevernhensynMikrofrontend';

const initializeOmsorgenForVilkar = (
  elementId,
  { submitCallback, behandling, aksjonspunkterForSteg, isAksjonspunktOpen, aktiviteter },
) => {
  (window as any).renderMicrofrontendOmsorgsdagerApp(
    elementId,
    KartleggePropertyTilSaerligeSmittevernhensynMikrofrontend(
      submitCallback,
      behandling,
      aksjonspunkterForSteg,
      isAksjonspunktOpen,
      aktiviteter,
    ),
  );
};

const hentVersjonInformasjon = () => {
  const produksjonsVersjon = {
    versjon: '1.5.30',
    jsIntegrity: 'sha384-mWRKTlTCMBqfw28AKXc4HSgGc6O8CVuGXJ1oLO37jaI/QjU1sArXeArfJwGuevgA',
    stylesheetIntegrity: 'sha384-s7zKNrhjA1tpqnkyej5k6S6jybA6XM3bdjEMmWg9iMy7Mnj2pVupmHEmWn9LX1pY',
  };
  const preprodVersjon = {
    versjon: '1.5.30',
    jsIntegrity: 'sha384-mWRKTlTCMBqfw28AKXc4HSgGc6O8CVuGXJ1oLO37jaI/QjU1sArXeArfJwGuevgA',
    stylesheetIntegrity: 'sha384-s7zKNrhjA1tpqnkyej5k6S6jybA6XM3bdjEMmWg9iMy7Mnj2pVupmHEmWn9LX1pY',
  };
  return sjekkHvisErIProduksjon ? produksjonsVersjon : preprodVersjon;
};

export default props => {
  const saerligSmittvernhensynVilkårAppID = 'saerligSmittvernhensyn';
  const { versjon, jsIntegrity, stylesheetIntegrity } = hentVersjonInformasjon();
  return (
    <MicroFrontend
      id={saerligSmittvernhensynVilkårAppID}
      jsSrc={`/k9/microfrontend/omsorgsdager/${versjon}/app.js`}
      jsIntegrity={jsIntegrity}
      stylesheetSrc={`/k9/microfrontend/omsorgsdager/${versjon}/styles.css`}
      stylesheetIntegrity={stylesheetIntegrity}
      onReady={() => initializeOmsorgenForVilkar(saerligSmittvernhensynVilkårAppID, props)}
    />
  );
};