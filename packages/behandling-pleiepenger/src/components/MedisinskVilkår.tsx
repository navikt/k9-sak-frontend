import * as React from 'react';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { MicroFrontend } from '@fpsak-frontend/utils';
import findEndpointsForMicrofrontend from '../microfrontend/utils/findEndpointsForMicrofrontend';
import SimpleEndpoints from '../microfrontend/types/SimpleEndpoints';
import findAksjonspunktkode from '../microfrontend/utils/findAksjonspunktkode';
import httpErrorHandler from '../microfrontend/utils/httpErrorHandler';

const initializeMedisinskVilkår = (
  elementId,
  httpErrorHandlerFn,
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
    httpErrorHandler: httpErrorHandlerFn,
    endpoints,
    behandlingUuid,
    onFinished: løsAksjonspunkt,
    readOnly,
  });
};

const medisinskVilkårAppID = 'medisinskVilkårApp';
export default ({ behandling: { links, uuid }, submitCallback, aksjonspunkter, readOnly }) => {
  const { addErrorMessage } = useRestApiErrorDispatcher();
  const httpErrorHandlerCaller = (status: number, locationHeader?: string) =>
    httpErrorHandler(status, addErrorMessage, locationHeader);

  const medisinskVilkårAksjonspunktkode = findAksjonspunktkode(aksjonspunkter);
  const løsAksjonspunkt = () =>
    submitCallback([{ kode: medisinskVilkårAksjonspunktkode, begrunnelse: 'Sykdom er behandlet' }]);

  return (
    <MicroFrontend
      id={medisinskVilkårAppID}
      jsSrc="/k9/microfrontend/medisinsk-vilkar/1.5.0/app.js"
      jsIntegrity="sha384-iwXwfuyBdktquifSX/TfEUHAQ03Urw5tM/X2ATCyRIBfJdT5jPR16MRT5wJxR60g"
      stylesheetSrc="/k9/microfrontend/medisinsk-vilkar/1.5.0/styles.css"
      stylesheetIntegrity="sha384-ro9ZEBJEWZEhZB9lZ7+e2ceTx0jtVa/HZlE867122hKrvRTQ722hcYtb03rkRF0I"
      onReady={() =>
        initializeMedisinskVilkår(
          medisinskVilkårAppID,
          httpErrorHandlerCaller,
          findEndpointsForMicrofrontend(links, [
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
