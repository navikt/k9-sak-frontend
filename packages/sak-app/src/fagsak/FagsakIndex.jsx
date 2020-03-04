import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import VisittkortSakIndex from '@fpsak-frontend/sak-visittkort';
import {
  behandlingerPath, getRequestPollingMessage, requireProps, trackRouteParam, DataFetcher, pathToAnnenPart,
} from '@fpsak-frontend/fp-felles';
import { DataFetchPendingModal } from '@fpsak-frontend/shared-components';

import { getSelectedFagsak, getSelectedSaksnummer } from './fagsakSelectors';
import BehandlingerIndex from '../behandling/BehandlingerIndex';
import BehandlingSupportIndex from '../behandlingsupport/BehandlingSupportIndex';
import FagsakProfileIndex from '../fagsakprofile/FagsakProfileIndex';
import { setSelectedSaksnummer } from './duck';

import FagsakResolver from './FagsakResolver';
import FagsakGrid from './components/FagsakGrid';
import {
  getSelectedBehandlingId, getBehandlingVersjon, getBehandlingSprak, getUrlBehandlingId,
} from '../behandling/duck';
import fpsakApi from '../data/fpsakApi';
import { getAlleFpSakKodeverk } from '../kodeverk/duck';

const endepunkter = [fpsakApi.BEHANDLING_PERSONOPPLYSNINGER, fpsakApi.ANNEN_PART_BEHANDLING];
const ingenEndepunkter = [];

const finnLenkeTilAnnenPart = (annenPartBehandling) => pathToAnnenPart(annenPartBehandling.saksnr.verdi, annenPartBehandling.behandlingId);

/**
 * FagsakIndex
 *
 * Container komponent. Er rot for for fagsakdelen av hovedvinduet, og har ansvar å legge valgt saksnummer fra URL-en i staten.
 */
export const FagsakIndex = ({
                              harValgtBehandling,
                              selectedSaksnummer,
                              requestPendingMessage,
                              behandlingId,
                              behandlingVersjon,
                              alleKodeverk,
                              sprakkode,
                              fagsak,
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
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
              showLoadingIcon
              behandlingNotRequired
              endpointParams={{ [fpsakApi.ANNEN_PART_BEHANDLING.name]: { saksnummer: selectedSaksnummer } }}
              endpoints={endepunkter.every((endepunkt) => endepunkt.isEndpointEnabled()) ? endepunkter : ingenEndepunkter}
              render={(dataProps) => (
                <VisittkortSakIndex
                  personopplysninger={dataProps.behandlingPersonopplysninger}
                  lenkeTilAnnenPart={dataProps.annenPartBehandling ? finnLenkeTilAnnenPart(dataProps.annenPartBehandling) : undefined}
                  alleKodeverk={alleKodeverk}
                  sprakkode={sprakkode}
                  fagsak={fagsak}
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

FagsakIndex.propTypes = {
  harValgtBehandling: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number,
  behandlingVersjon: PropTypes.number,
  selectedSaksnummer: PropTypes.string.isRequired,
  requestPendingMessage: PropTypes.string,
  alleKodeverk: PropTypes.shape().isRequired,
  sprakkode: PropTypes.shape(),
  fagsak: PropTypes.shape(),
};

FagsakIndex.defaultProps = {
  behandlingId: undefined,
  behandlingVersjon: undefined,
  requestPendingMessage: undefined,
  sprakkode: undefined,
  fagsak: undefined,
};

const mapStateToProps = (state) => ({
  harValgtBehandling: !!getUrlBehandlingId(state),
  behandlingId: getSelectedBehandlingId(state),
  behandlingVersjon: getBehandlingVersjon(state),
  selectedSaksnummer: getSelectedSaksnummer(state),
  requestPendingMessage: getRequestPollingMessage(state),
  alleKodeverk: getAlleFpSakKodeverk(state),
  sprakkode: getBehandlingSprak(state),
  fagsak: getSelectedFagsak(state),
});

export default trackRouteParam({
  paramName: 'saksnummer',
  parse: (saksnummerFromUrl) => saksnummerFromUrl,
  paramPropType: PropTypes.number,
  storeParam: setSelectedSaksnummer,
  getParamFromStore: getSelectedSaksnummer,
})(connect(mapStateToProps)(requireProps(['selectedSaksnummer'])(FagsakIndex)));
