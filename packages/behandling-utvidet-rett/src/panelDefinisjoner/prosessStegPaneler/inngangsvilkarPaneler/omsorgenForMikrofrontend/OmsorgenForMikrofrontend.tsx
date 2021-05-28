import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';
import sjekkHvisErIProduksjon from '@fpsak-frontend/utils/src/micro-frontends/sjekkHvisErIProduksjon';
import { FormState } from '@fpsak-frontend/form';
import KartleggePropertyTilOmsorgenForMikrofrontendKomponent from './KartleggePropertyTilOmsorgenForMikrofrontendKomponent';

const initializeOmsorgenForVilkar = (
  elementId,
  {
    isReadOnly,
    aksjonspunkter,
    isAksjonspunktOpen,
    submitCallback,
    behandling,
    status,
    vilkar,
    angitteBarn,
    fagsaksType,
  },
) => {
  (window as any).renderMicrofrontendOmsorgsdagerApp(
    elementId,
    KartleggePropertyTilOmsorgenForMikrofrontendKomponent({
      isReadOnly,
      submitCallback,
      behandling,
      angitteBarn,
      aksjonspunktInformasjon: { aksjonspunkter, isAksjonspunktOpen },
      vilkarInformasjon: { vilkar, status },
      fagsaksType,
      FormState,
    }),
  );
};

const hentVersjonInformasjon = () => {
  const produksjonsVersjon = {
    versjon: '2.0.0',
    jsIntegrity: 'sha384-ReIyiqOV9PXxKcq4qrZfXUR6Vo+91Sq91HVN4vgennfoUX9YmP+5fzMl04ARgLZt',
    stylesheetIntegrity: 'sha384-uHiStnPr4IBhdFpEf302JpS6rkdApNMTNFEeSrdvH6pO6SECF9ftxSm37xftCF7O',
  };
  const preprodVersjon = {
    versjon: '2.0.0',
    jsIntegrity: 'sha384-ReIyiqOV9PXxKcq4qrZfXUR6Vo+91Sq91HVN4vgennfoUX9YmP+5fzMl04ARgLZt',
    stylesheetIntegrity: 'sha384-uHiStnPr4IBhdFpEf302JpS6rkdApNMTNFEeSrdvH6pO6SECF9ftxSm37xftCF7O',
  };
  return sjekkHvisErIProduksjon() ? produksjonsVersjon : preprodVersjon;
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
      onReady={() => initializeOmsorgenForVilkar(omsorgenForVilkårAppID, { ...props, FormState })}
    />
  );
};
