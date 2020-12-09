import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';

const initializeMedisinskVilkår = elementId => {
  (window as any).renderMedisinskVilkarApp(elementId, {
    onVurderingValgt: vurdering => {
      if (vurdering !== null) {
        window.history.pushState('', '', `#vurdering=${vurdering}`);
      } else {
        window.location.hash = '';
      }
    },
    vurdering: new URLSearchParams(`?${window.location.hash.substr(1)}`).get('vurdering'),
  });
};

const medisinskVilkårAppID = 'medisinskVilkårApp';
export default () => {
  return (
    <MicroFrontend
      id={medisinskVilkårAppID}
      jsSrc="http://localhost:8081/1.4.0/app.js"
      jsIntegrity="sha384-llEKrmj1uHpOpQYRZemaJ0NtcHivRMU7vo1KGyDXEcXqS/TKyrlpaFM8QUvkdg+p"
      stylesheetSrc="http://localhost:8081/1.4.0/styles.css"
      stylesheetIntegrity="sha384-x57YUQFT8ZhpI0Sma8G4bAQZuqT8ltiIJ4PN39WIa8nPVfhzGnWYzn9+PLZCBi7c"
      onReady={() => initializeMedisinskVilkår(medisinskVilkårAppID)}
      onError={() => {}}
    />
  );
};
