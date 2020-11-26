import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';
import { useHistory } from 'react-router-dom';

const initializeMedisinskVilkår = (elementId, history) => {
  const urlParams = new URLSearchParams(`?${window.location.hash.substr(1)}`);
  const vurdering = urlParams.get('vurdering');

  (window as any).renderMedisinskVilkarApp(elementId, {
    onSelectVurdering: (vurderingId) => {
      history.push(`${window.location.search}#vurdering=${vurderingId}`);
    },
    vurdering
  });
};

const medisinskVilkårAppID = 'medisinskVilkårApp';
export default () => {
  const history = useHistory();
  return (
    <MicroFrontend
      id={medisinskVilkårAppID}
      jsSrc="http://localhost:8081/1.3.1/app.js"
      jsIntegrity="sha384-zTZOHy+icP1959vJmLfNltEiJ71a8PYaJFmG+uiUfCv3SET82YxEaeE2dHzAYiX3"
      stylesheetSrc="http://localhost:8081/1.3.1/styles.css"
      stylesheetIntegrity="sha384-gG2QA/rYN+9l6GpiVzIZVspHGHD4c2vTW5ITdIUVBznVIGJqliuZfizW+Vk6Ltgq"
      onReady={() => initializeMedisinskVilkår(medisinskVilkårAppID, history)}
      onError={() => {}}
    />
  );
};
