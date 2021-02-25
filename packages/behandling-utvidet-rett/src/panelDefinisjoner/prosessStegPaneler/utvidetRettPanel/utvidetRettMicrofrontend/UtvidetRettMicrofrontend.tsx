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
      jsSrc="/k9/microfrontend/omsorgsdager/1.5.18/app.js"
      jsIntegrity="sha384-cJdFwt78KR5o77lkU9vj8zk4ltEb8eIE+IBewaCbz+rllMxYxfZfkEaUuBEbydoN"
      stylesheetSrc="/k9/microfrontend/omsorgsdager/1.5.18/styles.css"
      stylesheetIntegrity="sha384-QXxPpC6LOzUrjKWnX6aEaoD0969YYqQjYy5LSoyRA6GSQmlac+d/3qUNrn0U+z5d"
      onReady={() => initializeUtvidetRettVilkar(utvidetRettVilkårAppID, props)}
      onError={() => {}}
    />
  );
};
