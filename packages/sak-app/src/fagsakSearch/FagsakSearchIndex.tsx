import React, { FunctionComponent, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { errorOfType, ErrorTypes, getErrorResponseData } from '@k9-sak-web/rest-api';
import { Fagsak, KodeverkMedNavn } from '@k9-sak-web/types';
import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import FagsakSokSakIndex from '@fpsak-frontend/sak-sok';

import { pathToFagsak } from '../app/paths';
import { K9sakApiKeys, restApiHooks } from '../data/k9sakApi';

const EMPTY_ARRAY = [];

/**
 * FagsakSearchIndex
 *
 * Container komponent. Har ansvar for å vise søkeskjermbildet og å håndtere fagsaksøket
 * mot server og lagringen av resultatet i klientens state.
 */
const FagsakSearchIndex: FunctionComponent = () => {
  const alleKodeverk = restApiHooks.useGlobalStateRestApiData<{ [key: string]: [KodeverkMedNavn] }>(
    K9sakApiKeys.KODEVERK,
  );

  const history = useHistory();
  const goToFagsak = (saksnummer: string) => {
    history.push(pathToFagsak(saksnummer));
  };

  const {
    startRequest: searchFagsaker,
    data: fagsaker = EMPTY_ARRAY,
    state: sokeStatus,
    error,
  } = restApiHooks.useRestApiRunner<Fagsak[]>(K9sakApiKeys.SEARCH_FAGSAK);

  const searchResultAccessDenied = useMemo(
    () => (errorOfType(error, ErrorTypes.MANGLER_TILGANG_FEIL) ? getErrorResponseData(error) : undefined),
    [error],
  );

  const sokFerdig = sokeStatus === RestApiState.SUCCESS;

  useEffect(() => {
    if (sokFerdig && fagsaker.length === 1) {
      goToFagsak(fagsaker[0].saksnummer);
    }
  }, [sokFerdig, fagsaker]);

  return (
    <FagsakSokSakIndex
      fagsaker={fagsaker}
      searchFagsakCallback={searchFagsaker}
      searchResultReceived={sokFerdig}
      selectFagsakCallback={(e, saksnummer: string) => goToFagsak(saksnummer)}
      searchStarted={sokeStatus === RestApiState.LOADING}
      searchResultAccessDenied={searchResultAccessDenied}
      alleKodeverk={alleKodeverk}
    />
  );
};

export default FagsakSearchIndex;
