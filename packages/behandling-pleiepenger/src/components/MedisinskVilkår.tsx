import * as React from 'react';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { MicroFrontend } from '@fpsak-frontend/utils';
import EventType from '@k9-sak-web/rest-api/src/requestApi/eventType';
import findEndpointsForMedisinskVilkårFrontend from '../microfrontend/utils/findEndpointsForMedisinskVilkårFrontend';
import SimpleEndpoints from '../microfrontend/types/SimpleEndpoints';
import findAksjonspunktkode from '../microfrontend/utils/findAksjonspunktkode';

const initializeMedisinskVilkår = (
  elementId,
  httpErrorHandler,
  endpoints: SimpleEndpoints,
  behandlingUuid: string,
  løsAksjonspunkt,
  readOnly,
) => {
  (window as any).renderMedisinskVilkarApp(elementId, {
    onVurderingValgt: vurdering => {
      if (vurdering !== null) {
        window.history.pushState('', '', `#vurdering=${vurdering}`);
      } else {
        window.location.hash = '';
      }
    },
    onDokumentValgt: dokumentId => {
      if (dokumentId !== null) {
        window.history.pushState('', '', `#dokument=${dokumentId}`);
      } else {
        window.location.hash = '';
      }
    },
    dokument: new URLSearchParams(`?${window.location.hash.substr(1)}`).get('dokument'),
    vurdering: new URLSearchParams(`?${window.location.hash.substr(1)}`).get('vurdering'),
    httpErrorHandler,
    endpoints,
    behandlingUuid,
    onFinished: løsAksjonspunkt,
    readOnly,
  });
};

const medisinskVilkårAppID = 'medisinskVilkårApp';
export default ({ behandling: { links, uuid }, submitCallback, aksjonspunkter, readOnly }) => {
  const { addErrorMessage } = useRestApiErrorDispatcher();
  const httpErrorHandler = (status: number, locationHeader?: string) => {
    if (status === 403) {
      addErrorMessage({ type: EventType.REQUEST_FORBIDDEN });
    } else if (status === 401) {
      if (locationHeader) {
        const currentPath = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `${locationHeader}?redirectTo=${currentPath}`;
      } else {
        addErrorMessage({ type: EventType.REQUEST_UNAUTHORIZED });
      }
    }
  };

  const medisinskVilkårAksjonspunktkode = findAksjonspunktkode(aksjonspunkter);
  const løsAksjonspunkt = () =>
    submitCallback([{ kode: medisinskVilkårAksjonspunktkode, begrunnelse: 'Sykdom er behandlet' }]);

  return (
    <MicroFrontend
      id={medisinskVilkårAppID}
      jsSrc="/k9/microfrontend/medisinsk-vilkar/1.5.2/app.js"
      jsIntegrity="sha384-b9E/j31N8APVhk04vCJbZPQxE3IHbmYDxOMnFKrAewrU1LuAzWuiTgaD3zQ2OBJC"
      stylesheetSrc="/k9/microfrontend/medisinsk-vilkar/1.5.2/styles.css"
      stylesheetIntegrity="sha384-4sFTqyxlXtYVnSL3vvwIXPfy7Idutc1KtoHMjbD711eQje8B4NLcLPBnfP2rKI2r"
      onReady={() =>
        initializeMedisinskVilkår(
          medisinskVilkårAppID,
          httpErrorHandler,
          findEndpointsForMedisinskVilkårFrontend(links, [
            { rel: 'sykdom-vurdering-oversikt-ktp', desiredName: 'vurderingsoversiktKontinuerligTilsynOgPleie' },
            { rel: 'sykdom-vurdering-oversikt-too', desiredName: 'vurderingsoversiktBehovForToOmsorgspersoner' },
            { rel: 'sykdom-vurdering-direkte', desiredName: 'hentVurdering' },
            { rel: 'sykdom-vurdering-opprettelse', desiredName: 'opprettVurdering' },
            { rel: 'sykdom-vurdering-endring', desiredName: 'endreVurdering' },
            { rel: 'sykdom-dokument-oversikt', desiredName: 'dokumentoversikt' },
            { rel: 'sykdom-innleggelse', desiredName: 'innleggelsesperioder' },
            { rel: 'sykdom-diagnosekoder', desiredName: 'diagnosekoder' },
            { rel: 'sykdom-dokument-liste', desiredName: 'dataTilVurdering' },
          ]),
          uuid,
          løsAksjonspunkt,
          readOnly,
        )
      }
    />
  );
};
