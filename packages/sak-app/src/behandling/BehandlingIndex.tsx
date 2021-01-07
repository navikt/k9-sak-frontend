import React, { Component, Suspense } from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { RouteProps } from 'react-router';

import { Link } from '@fpsak-frontend/rest-api/src/requestApi/LinkTsType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { replaceNorwegianCharacters } from '@fpsak-frontend/utils';
import { LoadingPanel, requireProps } from '@fpsak-frontend/shared-components';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { FagsakPerson, KodeverkMedNavn, Kodeverk, NavAnsatt, FeatureToggles } from '@k9-sak-web/types';

import { getProsessStegLocation, getFaktaLocation, getLocationWithDefaultProsessStegAndFakta } from '../app/paths';
import { getAlleKodeverkForBehandlingstype } from '../kodeverk/duck';
import {
  getSelectedFagsakStatus,
  getFagsakPerson,
  getSaksnummer,
  getFagsakYtelseType,
  isForeldrepengerFagsak,
  getKanRevurderingOpprettes,
  getSkalBehandlesAvInfotrygd,
} from '../fagsak/fagsakSelectors';
import { getNavAnsatt, getFeatureToggles } from '../app/duck';
import trackRouteParam from '../app/trackRouteParam';
import { reduxRestApi } from '../data/fpsakApi';
import {
  setUrlBehandlingId,
  setSelectedBehandlingIdOgVersjon,
  getTempBehandlingVersjon,
  getUrlBehandlingId,
  oppdaterBehandlingVersjon as oppdaterVersjon,
  resetBehandlingContext as resetBehandlingContextActionCreator,
} from './duck';
import {
  getBehandlingerTypesMappedById,
  getBehandlingerInfo,
  getBehandlingerLinksMappedById,
  getBehandlingerStatusMappedById,
  BehandlingerInfo,
} from './selectors/behandlingerSelectors';
import behandlingEventHandler from './BehandlingEventHandler';
import ErrorBoundary from './ErrorBoundary';
import getAccessRights from '../app/util/access';

const BehandlingPleiepengerIndex = React.lazy(() => import('@fpsak-frontend/behandling-pleiepenger'));
const BehandlingOmsorgspengerIndex = React.lazy(() => import('@fpsak-frontend/behandling-omsorgspenger'));
const BehandlingInnsynIndex = React.lazy(() => import('@fpsak-frontend/behandling-innsyn'));
const BehandlingKlageIndex = React.lazy(() => import('@fpsak-frontend/behandling-klage'));
const BehandlingTilbakekrevingIndex = React.lazy(() => import('@fpsak-frontend/behandling-tilbakekreving'));
const BehandlingAnkeIndex = React.lazy(() => import('@fpsak-frontend/behandling-anke'));
const BehandlingFrisinnIndex = React.lazy(() => import('@fpsak-frontend/behandling-frisinn'));
const BehandlingUnntakIndex = React.lazy(() => import('@k9-sak-web/behandling-unntak'));

const erTilbakekreving = behandlingTypeKode =>
  behandlingTypeKode === BehandlingType.TILBAKEKREVING ||
  behandlingTypeKode === BehandlingType.TILBAKEKREVING_REVURDERING;
const formatName = (bpName = '') => replaceNorwegianCharacters(bpName.toLowerCase());

interface FagsakInfo {
  saksnummer: string;
  fagsakYtelseType: Kodeverk;
  fagsakPerson: FagsakPerson;
  fagsakStatus: Kodeverk;
}

interface OwnProps {
  behandlingId: number;
  behandlingTypeKode: string;
  behandlingVersjon: number;
  location: RouteProps['location'] & { query: { punkt?: string; fakta?: string } };
  oppdaterBehandlingVersjon: (behandlingVersjon: number) => void;
  resetBehandlingContext: () => void;
  setBehandlingIdOgVersjon: (behandlingVersjon: number) => void;
  kodeverk: { [key: string]: KodeverkMedNavn[] };
  featureToggles: FeatureToggles;
  fagsak: FagsakInfo;
  fagsakBehandlingerInfo: BehandlingerInfo[];
  behandlingLinks: Link[];
  push: (location: RouteProps['location'] | string) => void;
  visFeilmelding: (data: any) => void;
  rettigheter: {
    writeAccess: {
      employeeHasAccess: boolean;
      isEnabled: boolean;
    };
    kanOverstyreAccess: {
      employeeHasAccess: boolean;
      isEnabled: boolean;
    };
  };
}

/**
 * BehandlingIndex
 *
 * Container-komponent. Er rot for for den delen av hovedvinduet som har innhold for en valgt behandling, og styrer livssyklusen til de mekanismene som er
 * relatert til den valgte behandlingen.
 *
 * Komponenten har ansvar å legge valgt behandlingId fra URL-en i staten.
 */
export class BehandlingIndex extends Component<OwnProps> {
  constructor(props) {
    super(props);
    const { setBehandlingIdOgVersjon, behandlingVersjon } = props;
    reduxRestApi.injectPaths(props.behandlingLinks);
    setBehandlingIdOgVersjon(behandlingVersjon);
  }

  componentDidUpdate(prevProps) {
    const { behandlingId, behandlingLinks, setBehandlingIdOgVersjon, behandlingVersjon } = this.props;
    if (behandlingId !== prevProps.behandlingId) {
      reduxRestApi.injectPaths(behandlingLinks);
      setBehandlingIdOgVersjon(behandlingVersjon);
    }
  }

  componentWillUnmount() {
    const { resetBehandlingContext } = this.props;
    resetBehandlingContext();
  }

  goToValgtProsessStegOgFaktaPanel = (prosessStegId, faktaPanelId) => {
    const { push: pushLocation, location } = this.props;
    let newLocation;
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

    pushLocation(newLocation);
  };

  goToSearchPage = () => {
    const { push: pushLocation } = this.props;
    pushLocation('/');
  };

  render() {
    const {
      behandlingId,
      behandlingTypeKode,
      location,
      oppdaterBehandlingVersjon,
      kodeverk,
      featureToggles,
      fagsak,
      fagsakBehandlingerInfo,
      rettigheter,
      visFeilmelding,
    } = this.props;

    const defaultProps = {
      behandlingId,
      oppdaterBehandlingVersjon,
      behandlingEventHandler,
      kodeverk,
      featureToggles,
      fagsak,
      rettigheter,
      valgtProsessSteg: location.query.punkt,
      opneSokeside: this.goToSearchPage,
    };

    if (behandlingTypeKode === BehandlingType.DOKUMENTINNSYN) {
      return (
        <Suspense fallback={<LoadingPanel />}>
          <ErrorBoundary errorMessageCallback={visFeilmelding}>
            <BehandlingInnsynIndex
              oppdaterProsessStegOgFaktaPanelIUrl={this.goToValgtProsessStegOgFaktaPanel}
              {...defaultProps}
            />
          </ErrorBoundary>
        </Suspense>
      );
    }

    if (behandlingTypeKode === BehandlingType.KLAGE) {
      return (
        <Suspense fallback={<LoadingPanel />}>
          <ErrorBoundary errorMessageCallback={visFeilmelding}>
            <BehandlingKlageIndex
              oppdaterProsessStegOgFaktaPanelIUrl={this.goToValgtProsessStegOgFaktaPanel}
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
          <ErrorBoundary errorMessageCallback={visFeilmelding}>
            <BehandlingAnkeIndex
              oppdaterProsessStegOgFaktaPanelIUrl={this.goToValgtProsessStegOgFaktaPanel}
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
          <ErrorBoundary errorMessageCallback={visFeilmelding}>
            <BehandlingUnntakIndex
              oppdaterProsessStegOgFaktaPanelIUrl={this.goToValgtProsessStegOgFaktaPanel}
              valgtFaktaSteg={location.query.fakta}
              {...defaultProps}
            />
          </ErrorBoundary>
        </Suspense>
      );
    }

    if (erTilbakekreving(behandlingTypeKode)) {
      return (
        <Suspense fallback={<LoadingPanel />}>
          <ErrorBoundary errorMessageCallback={visFeilmelding}>
            <BehandlingTilbakekrevingIndex
              oppdaterProsessStegOgFaktaPanelIUrl={this.goToValgtProsessStegOgFaktaPanel}
              harApenRevurdering={fagsakBehandlingerInfo.some(
                b => b.type.kode === BehandlingType.REVURDERING && b.status.kode !== behandlingStatus.AVSLUTTET,
              )}
              valgtFaktaSteg={location.query.fakta}
              {...defaultProps}
            />
          </ErrorBoundary>
        </Suspense>
      );
    }

    if (fagsak.fagsakYtelseType.kode === FagsakYtelseType.OMSORGSPENGER) {
      return (
        <Suspense fallback={<LoadingPanel />}>
          <ErrorBoundary errorMessageCallback={visFeilmelding}>
            <BehandlingOmsorgspengerIndex
              oppdaterProsessStegOgFaktaPanelIUrl={this.goToValgtProsessStegOgFaktaPanel}
              valgtFaktaSteg={location.query.fakta}
              {...defaultProps}
            />
          </ErrorBoundary>
        </Suspense>
      );
    }

    if (fagsak.fagsakYtelseType.kode === FagsakYtelseType.FRISINN) {
      return (
        <Suspense fallback={<LoadingPanel />}>
          <ErrorBoundary errorMessageCallback={visFeilmelding}>
            <BehandlingFrisinnIndex
              oppdaterProsessStegOgFaktaPanelIUrl={this.goToValgtProsessStegOgFaktaPanel}
              valgtFaktaSteg={location.query.fakta}
              {...defaultProps}
            />
          </ErrorBoundary>
        </Suspense>
      );
    }

    return (
      <Suspense fallback={<LoadingPanel />}>
        <ErrorBoundary errorMessageCallback={visFeilmelding}>
          <BehandlingPleiepengerIndex
            oppdaterProsessStegOgFaktaPanelIUrl={this.goToValgtProsessStegOgFaktaPanel}
            valgtFaktaSteg={location.query.fakta}
            {...defaultProps}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }
}

export const getFagsakInfo = createSelector(
  [
    getSaksnummer,
    getSelectedFagsakStatus,
    getFagsakPerson,
    getFagsakYtelseType,
    isForeldrepengerFagsak,
    getKanRevurderingOpprettes,
    getSkalBehandlesAvInfotrygd,
  ],
  (
    saksnummer,
    fagsakStatus,
    fagsakPerson,
    fagsakYtelseType,
    isForeldrepenger,
    kanRevurderingOpprettes,
    skalBehandlesAvInfotrygd,
  ) => ({
    saksnummer,
    fagsakStatus,
    fagsakPerson,
    fagsakYtelseType,
    kanRevurderingOpprettes,
    skalBehandlesAvInfotrygd,
    isForeldrepengerFagsak: isForeldrepenger,
  }),
);

const getRettigheter = createSelector(
  [
    getNavAnsatt,
    getSelectedFagsakStatus,
    getUrlBehandlingId,
    getBehandlingerStatusMappedById,
    getBehandlingerTypesMappedById,
  ],
  (
    navAnsatt: NavAnsatt,
    selectedFagsakStatus,
    behandlingId,
    behandlingerStatusMappedById,
    behandlingerTypesMappedById,
  ) => {
    const status = behandlingerStatusMappedById[behandlingId];
    const type = behandlingerTypesMappedById[behandlingId];
    return getAccessRights(navAnsatt, selectedFagsakStatus, status, type);
  },
);

const mapStateToProps = state => {
  const behandlingId = getUrlBehandlingId(state);
  const behandlingType = getBehandlingerTypesMappedById(state)[behandlingId];
  const behandlingTypeKode = behandlingType ? behandlingType.kode : undefined;
  return {
    behandlingId,
    behandlingTypeKode,
    behandlingVersjon: getTempBehandlingVersjon(state),
    location: state.router.location,
    kodeverk: getAlleKodeverkForBehandlingstype(behandlingTypeKode)(state),
    featureToggles: getFeatureToggles(state),
    fagsakBehandlingerInfo: getBehandlingerInfo(state),
    behandlingLinks: getBehandlingerLinksMappedById(state)[behandlingId],
    fagsak: getFagsakInfo(state),
    rettigheter: getRettigheter(state),
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      oppdaterBehandlingVersjon: oppdaterVersjon,
      resetBehandlingContext: resetBehandlingContextActionCreator,
      setBehandlingIdOgVersjon: setSelectedBehandlingIdOgVersjon,
      visFeilmelding: errorHandler.getErrorActionCreator(),
      push,
    },
    dispatch,
  );

export default trackRouteParam({
  paramName: 'behandlingId',
  parse: behandlingFromUrl => Number.parseInt(behandlingFromUrl, 10),
  storeParam: setUrlBehandlingId,
  getParamFromStore: getUrlBehandlingId,
})(connect(mapStateToProps, mapDispatchToProps)(requireProps(['behandlingId', 'behandlingTypeKode'])(BehandlingIndex)));
