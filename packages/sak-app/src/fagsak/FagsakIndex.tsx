import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import VisittkortSakIndex from '@fpsak-frontend/sak-visittkort';
import { DataFetchPendingModal, requireProps, LoadingPanel } from '@fpsak-frontend/shared-components';
import { Kodeverk, KodeverkMedNavn, Personopplysninger, FamilieHendelseSamling, Fagsak } from '@k9-sak-web/types';
import { DataFetcher, DataFetcherTriggers, getRequestPollingMessage } from '@fpsak-frontend/rest-api-redux';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { getSelectedFagsak, getSelectedSaksnummer } from './fagsakSelectors';
import BehandlingerIndex from '../behandling/BehandlingerIndex';
import BehandlingSupportIndex from '../behandlingsupport/BehandlingSupportIndex';
import FagsakProfileIndex from '../fagsakprofile/FagsakProfileIndex';
import { setSelectedSaksnummer } from './duck';

import { behandlingerPath } from '../app/paths';
import FagsakResolver from './FagsakResolver';
import FagsakGrid from './components/FagsakGrid';
import {
  getSelectedBehandlingId,
  getBehandlingVersjon,
  getBehandlingSprak,
  getUrlBehandlingId,
  getBehandlingType,
  finnesVerge,
} from '../behandling/duck';
import fpsakApi from '../data/fpsakApi';
import { getAlleFpSakKodeverk } from '../kodeverk/duck';
import trackRouteParam from '../app/trackRouteParam';

const endepunkter = [fpsakApi.BEHANDLING_PERSONOPPLYSNINGER];
const ingenEndepunkter = [];

const erTilbakekreving = behandlingType =>
  behandlingType &&
  (BehandlingType.TILBAKEKREVING === behandlingType.kode ||
    BehandlingType.TILBAKEKREVING_REVURDERING === behandlingType.kode);

interface OwnProps {
  harValgtBehandling: boolean;
  behandlingId?: number;
  behandlingVersjon?: number;
  behandlingType?: Kodeverk;
  selectedSaksnummer: string;
  requestPendingMessage?: string;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  sprakkode?: Kodeverk;
  fagsak?: Fagsak;
  harVerge: boolean;
}

interface DataProps {
  behandlingPersonopplysninger?: Personopplysninger;
  behandlingFamilieHendelse?: FamilieHendelseSamling;
  annenPartBehandling?: {
    saksnr: {
      verdi: string;
    };
    behandlingId: number;
  };
}

/**
 * FagsakIndex
 *
 * Container komponent. Er rot for for fagsakdelen av hovedvinduet, og har ansvar å legge valgt saksnummer fra URL-en i staten.
 */
export const FagsakIndex: FunctionComponent<OwnProps> = ({
  harValgtBehandling,
  selectedSaksnummer,
  requestPendingMessage,
  behandlingId,
  behandlingVersjon,
  behandlingType,
  alleKodeverk,
  sprakkode,
  fagsak,
  harVerge,
}) => (
  <>
    <FagsakResolver key={selectedSaksnummer}>
      <FagsakGrid
        behandlingContent={<Route strict path={behandlingerPath} component={BehandlingerIndex} />}
        profileAndNavigationContent={<FagsakProfileIndex />}
        supportContent={<BehandlingSupportIndex />}
        visittkortContent={() => {
          if (harValgtBehandling && !behandlingId) {
            return null;
          }

          return (
            <DataFetcher
              fetchingTriggers={new DataFetcherTriggers({ behandlingId, behandlingVersion: behandlingVersjon }, false)}
              endpointParams={{ [fpsakApi.ANNEN_PART_BEHANDLING.name]: { saksnummer: selectedSaksnummer } }}
              key={endepunkter.every(endepunkt => endepunkt.isEndpointEnabled()) ? 0 : 1}
              endpoints={endepunkter.every(endepunkt => endepunkt.isEndpointEnabled()) ? endepunkter : ingenEndepunkter}
              showOldDataWhenRefetching
              loadingPanel={<LoadingPanel />}
              render={(dataProps: DataProps) => (
                <VisittkortSakIndex
                  personopplysninger={dataProps.behandlingPersonopplysninger}
                  alleKodeverk={alleKodeverk}
                  sprakkode={sprakkode}
                  fagsak={fagsak}
                  harTilbakekrevingVerge={erTilbakekreving(behandlingType) && harVerge}
                />
              )}
            />
          );
        }}
      />
    </FagsakResolver>
    {requestPendingMessage && <DataFetchPendingModal pendingMessage={requestPendingMessage} />}
  </>
);

const mapStateToProps = state => ({
  harValgtBehandling: !!getUrlBehandlingId(state),
  behandlingId: getSelectedBehandlingId(state),
  behandlingVersjon: getBehandlingVersjon(state),
  behandlingType: getBehandlingType(state),
  selectedSaksnummer: getSelectedSaksnummer(state),
  requestPendingMessage: getRequestPollingMessage(state),
  alleKodeverk: getAlleFpSakKodeverk(state),
  sprakkode: getBehandlingSprak(state),
  fagsak: getSelectedFagsak(state),
  harVerge: finnesVerge(state),
});

export default trackRouteParam({
  paramName: 'saksnummer',
  parse: saksnummerFromUrl => saksnummerFromUrl,
  storeParam: setSelectedSaksnummer,
  getParamFromStore: getSelectedSaksnummer,
})(connect(mapStateToProps)(requireProps(['selectedSaksnummer'])(FagsakIndex)));