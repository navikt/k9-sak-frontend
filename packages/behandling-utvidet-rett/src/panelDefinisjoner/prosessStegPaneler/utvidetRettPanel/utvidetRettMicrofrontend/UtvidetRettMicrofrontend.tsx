import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';
import kartleggePropertyTilMikrofrontendKomponent from './UtvidetRettMikrofrontendHjelpFunksjoner';

const initializeUtvidetRettVilkar = (
  elementId,
  { isReadOnly, behandling, aksjonspunkter, vilkar, submitCallback, isAksjonspunktOpen, soknad, fagsaksType },
) => {
  (window as any).renderMicrofrontendOmsorgsdagerApp(
    elementId,
    kartleggePropertyTilMikrofrontendKomponent(
      behandling,
      isReadOnly,
      aksjonspunkter,
      vilkar,
      submitCallback,
      isAksjonspunktOpen,
      soknad,
      fagsaksType,
    ),
  );
};

export default props => {
  const utvidetRettVilkårAppID = 'utvidetRettApp';
  return (
    <MicroFrontend
      id={utvidetRettVilkårAppID}
      jsSrc="/k9/microfrontend/omsorgsdager/build/1.5.17/app.js"
      jsIntegrity="sha256-WcRHIyakKzq9WUg9ecXSd95zmQ6s0Nq8abH23dy6MBM="
      stylesheetSrc="/k9/microfrontend/omsorgsdager/build/1.5.17/styles.css"
      stylesheetIntegrity="sha256-OwN7oHh3pVJdFYDdrsgwa0kLqYwGWSIBTSUOZSJgL68="
      onReady={() => initializeUtvidetRettVilkar(utvidetRettVilkårAppID, props)}
      onError={() => {}}
    />
  );
};
