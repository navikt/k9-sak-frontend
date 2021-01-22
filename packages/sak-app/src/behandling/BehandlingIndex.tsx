import React, { Suspense, FunctionComponent, useEffect, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { History } from 'history';

import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { replaceNorwegianCharacters, parseQueryString } from '@fpsak-frontend/utils';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import {
  KodeverkMedNavn,
  NavAnsatt,
  Fagsak,
  BehandlingAppKontekst,
  FeatureToggles,
  FagsakPerson,
  ArbeidsgiverOpplysningerWrapper,
} from '@k9-sak-web/types';

import useTrackRouteParam from '../app/useTrackRouteParam';
import getAccessRights from '../app/util/access';
import { getProsessStegLocation, getFaktaLocation, getLocationWithDefaultProsessStegAndFakta } from '../app/paths';
import { K9sakApiKeys, requestApi, restApiHooks, LinkCategory } from '../data/k9sakApi';
import behandlingEventHandler from './BehandlingEventHandler';
import ErrorBoundary from '../app/ErrorBoundary';

const BehandlingPleiepengerIndex = React.lazy(() => import('@k9-sak-web/behandling-pleiepenger'));
const BehandlingOmsorgspengerIndex = React.lazy(() => import('@k9-sak-web/behandling-omsorgspenger'));
const BehandlingInnsynIndex = React.lazy(() => import('@k9-sak-web/behandling-innsyn'));
const BehandlingKlageIndex = React.lazy(() => import('@k9-sak-web/behandling-klage'));
const BehandlingTilbakekrevingIndex = React.lazy(() => import('@k9-sak-web/behandling-tilbakekreving'));
const BehandlingAnkeIndex = React.lazy(() => import('@k9-sak-web/behandling-anke'));
const BehandlingFrisinnIndex = React.lazy(() => import('@k9-sak-web/behandling-frisinn'));
const BehandlingUnntakIndex = React.lazy(() => import('@k9-sak-web/behandling-unntak'));

const erTilbakekreving = (behandlingTypeKode: string): boolean =>
  behandlingTypeKode === BehandlingType.TILBAKEKREVING ||
  behandlingTypeKode === BehandlingType.TILBAKEKREVING_REVURDERING;

const formatName = (bpName = ''): string => replaceNorwegianCharacters(bpName.toLowerCase());

const getOppdaterProsessStegOgFaktaPanelIUrl = (history: History) => (
  prosessStegId: string,
  faktaPanelId: string,
): void => {
  let newLocation;
  const { location } = history;
  if (prosessStegId === 'default') {
    newLocation = getLocationWithDefaultProsessStegAndFakta(location);
  } else if (prosessStegId) {
    newLocation = getProsessStegLocation(location)(formatName(prosessStegId));
  } else {
    newLocation = getProsessStegLocation(location)(null);
  }

  if (faktaPanelId === 'default') {
    newLocation = getFaktaLocation(newLocation)('default');
  } else if (faktaPanelId) {
    newLocation = getFaktaLocation(newLocation)(formatName(faktaPanelId));
  } else {
    newLocation = getFaktaLocation(newLocation)(null);
  }

  history.push(newLocation);
};

interface OwnProps {
  setBehandlingIdOgVersjon: (behandlingId: number, behandlingVersjon: number) => void;
  fagsak: Fagsak;
  alleBehandlinger: BehandlingAppKontekst[];
  arbeidsgiverOpplysninger?: ArbeidsgiverOpplysningerWrapper;
  setRequestPendingMessage: (message: string) => void;
}

/**
 * BehandlingIndex
 *
 * Er rot for for den delen av hovedvinduet som har innhold for en valgt behandling, og styrer livssyklusen til de mekanismene som er
 * relatert til den valgte behandlingen.
 */
const BehandlingIndex: FunctionComponent<OwnProps> = ({
  setBehandlingIdOgVersjon,
  fagsak,
  alleBehandlinger,
  arbeidsgiverOpplysninger,
  setRequestPendingMessage,
}) => {
  const { selected: behandlingId } = useTrackRouteParam<number>({
    paramName: 'behandlingId',
    parse: behandlingFromUrl => Number.parseInt(behandlingFromUrl, 10),
  });

  const behandlingVersjon = alleBehandlinger.some(b => b.id === behandlingId)
    ? alleBehandlinger.find(b => b.id === behandlingId).versjon
    : undefined;

  const behandling = alleBehandlinger.find(b => b.id === behandlingId);

  useEffect(() => {
    if (behandling) {
      requestApi.setLinks(behandling.links, LinkCategory.BEHANDLING);
      setBehandlingIdOgVersjon(behandlingId, behandlingVersjon);
    }
  }, [behandling]);

  const { addErrorMessage } = useRestApiErrorDispatcher();

  const oppdaterBehandlingVersjon = useCallback(versjon => setBehandlingIdOgVersjon(behandlingId, versjon), [
    behandlingId,
  ]);

  const kodeverk = restApiHooks.useGlobalStateRestApiData<{ [key: string]: [KodeverkMedNavn] }>(K9sakApiKeys.KODEVERK);
  const klageKodeverk = restApiHooks.useGlobalStateRestApiData<{ [key: string]: [KodeverkMedNavn] }>(
    K9sakApiKeys.KODEVERK_KLAGE,
  );

  const fagsakPerson = restApiHooks.useGlobalStateRestApiData<FagsakPerson>(K9sakApiKeys.SAK_BRUKER);
  const featureTogglesData = restApiHooks.useGlobalStateRestApiData<{ key: string; value: string }[]>(
    K9sakApiKeys.FEATURE_TOGGLE,
  );
  const featureToggles = useMemo<FeatureToggles>(
    () =>
      featureTogglesData.reduce((acc, curr) => {
        acc[curr.key] = `${curr.value}`.toLowerCase() === 'true';
        return acc;
      }, {}),
    [featureTogglesData],
  );

  const navAnsatt = restApiHooks.useGlobalStateRestApiData<NavAnsatt>(K9sakApiKeys.NAV_ANSATT);
  const rettigheter = useMemo(() => getAccessRights(navAnsatt, fagsak.status, behandling?.status, behandling?.type), [
    fagsak.status,
    behandlingId,
    behandling?.status,
    behandling?.type,
  ]);

  const history = useHistory();
  const opneSokeside = useCallback(() => {
    history.push('/');
  }, []);
  const oppdaterProsessStegOgFaktaPanelIUrl = useCallback(getOppdaterProsessStegOgFaktaPanelIUrl(history), [history]);

  const { location } = history;
  const query = parseQueryString(location.search);

  const behandlingTypeKode = behandling?.type ? behandling.type.kode : undefined;

  const defaultProps = {
    key: behandlingId,
    behandlingId,
    oppdaterBehandlingVersjon,
    behandlingEventHandler,
    kodeverk: behandlingTypeKode === BehandlingType.KLAGE ? klageKodeverk : kodeverk,
    fagsak,
    fagsakPerson,
    rettigheter,
    arbeidsgiverOpplysninger,
    featureToggles,
    opneSokeside,
    setRequestPendingMessage,
    valgtProsessSteg: query.punkt,
    arbeidsgiverOpplysninger,
  };

  const fagsakBehandlingerInfo = useMemo(
    () =>
      alleBehandlinger
        .filter(b => !b.behandlingHenlagt)
        .map(b => ({
          id: b.id,
          uuid: b.uuid,
          type: b.type,
          status: b.status,
          opprettet: b.opprettet,
          avsluttet: b.avsluttet,
        })),
    [alleBehandlinger],
  );

  if (!behandlingId) {
    return <LoadingPanel />;
  }

  if (behandlingTypeKode === BehandlingType.DOKUMENTINNSYN) {
    return (
      <Suspense fallback={<LoadingPanel />}>
        <ErrorBoundary errorMessageCallback={addErrorMessage}>
          <BehandlingInnsynIndex
            oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            {...defaultProps}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }

  if (behandlingTypeKode === BehandlingType.KLAGE) {
    return (
      <Suspense fallback={<LoadingPanel />}>
        <ErrorBoundary errorMessageCallback={addErrorMessage}>
          <BehandlingKlageIndex
            oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            alleBehandlinger={fagsakBehandlingerInfo}
            {...defaultProps}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }

  if (behandlingTypeKode === BehandlingType.ANKE) {
    return (
      <Suspense fallback={<LoadingPanel />}>
        <ErrorBoundary errorMessageCallback={addErrorMessage}>
          <BehandlingAnkeIndex
            oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            alleBehandlinger={fagsakBehandlingerInfo}
            {...defaultProps}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }

  if (behandlingTypeKode === BehandlingType.UNNTAK) {
    return (
      <Suspense fallback={<LoadingPanel />}>
        <ErrorBoundary errorMessageCallback={addErrorMessage}>
          <BehandlingUnntakIndex
            oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            valgtFaktaSteg={query.fakta}
            {...defaultProps}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }

  if (erTilbakekreving(behandlingTypeKode)) {
    return (
      <Suspense fallback={<LoadingPanel />}>
        <ErrorBoundary errorMessageCallback={addErrorMessage}>
          <BehandlingTilbakekrevingIndex
            oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            harApenRevurdering={fagsakBehandlingerInfo.some(
              b => b.type.kode === BehandlingType.REVURDERING && b.status.kode !== BehandlingStatus.AVSLUTTET,
            )}
            valgtFaktaSteg={query.fakta}
            {...defaultProps}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }

  if (fagsak.sakstype.kode === FagsakYtelseType.OMSORGSPENGER) {
    return (
      <Suspense fallback={<LoadingPanel />}>
        <ErrorBoundary errorMessageCallback={addErrorMessage}>
          <BehandlingOmsorgspengerIndex
            oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            valgtFaktaSteg={query.fakta}
            {...defaultProps}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }

  if (fagsak.sakstype.kode === FagsakYtelseType.FRISINN) {
    return (
      <Suspense fallback={<LoadingPanel />}>
        <ErrorBoundary errorMessageCallback={addErrorMessage}>
          <BehandlingFrisinnIndex
            oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            valgtFaktaSteg={query.fakta}
            {...defaultProps}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<LoadingPanel />}>
      <ErrorBoundary errorMessageCallback={addErrorMessage}>
        <BehandlingPleiepengerIndex
          oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
          valgtFaktaSteg={query.fakta}
          {...defaultProps}
        />
      </ErrorBoundary>
    </Suspense>
  );
};

export default BehandlingIndex;
