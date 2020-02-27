import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { destroy } from 'redux-form';

import { getBehandlingFormPrefix } from '@fpsak-frontend/fp-felles';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  Kodeverk,
  NavAnsatt,
  Behandling,
  FagsakInfo,
  SettPaVentParams,
  ReduxFormStateCleaner,
  DataFetcherBehandlingDataV2,
} from '@fpsak-frontend/behandling-felles';

import pleiepengerBehandlingApi, { reduxRestApi, PleiepengerBehandlingApiKeys } from './data/pleiepengerBehandlingApi';
import PleiepengerPaneler from './components/PleiepengerPaneler';
import FetchedData from './types/fetchedDataTsType';

const foreldrepengerData = [
  pleiepengerBehandlingApi.AKSJONSPUNKTER,
  pleiepengerBehandlingApi.VILKAR,
  pleiepengerBehandlingApi.PERSONOPPLYSNINGER,
  // TODO (Hallvard): FIXME
  pleiepengerBehandlingApi.SOKNAD,
  pleiepengerBehandlingApi.INNTEKT_ARBEID_YTELSE,
  pleiepengerBehandlingApi.BEREGNINGRESULTAT_FORELDREPENGER,
  pleiepengerBehandlingApi.BEREGNINGSGRUNNLAG,
  pleiepengerBehandlingApi.SIMULERING_RESULTAT,
  pleiepengerBehandlingApi.SYKDOM,
];

interface OwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  fagsak: FagsakInfo;
  navAnsatt: NavAnsatt;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  valgtProsessSteg?: string;
  valgtFaktaSteg?: string;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  behandlingEventHandler: {
    setHandler: (events: { [key: string]: (params: {}) => Promise<any> }) => void;
    clear: () => void;
  };
  opneSokeside: () => void;
  featureToggles: {};
}

interface StateProps {
  behandling?: Behandling;
  forrigeBehandling?: Behandling;
  kodeverk?: { [key: string]: [Kodeverk] };
  hasFetchError: boolean;
}

interface DispatchProps {
  nyBehandlendeEnhet: (params: {}) => Promise<void>;
  settBehandlingPaVent: (params: {}) => Promise<void>;
  taBehandlingAvVent: (params: {}, { keepData: boolean }) => Promise<void>;
  henleggBehandling: (params: {}) => Promise<void>;
  opneBehandlingForEndringer: (params: {}) => Promise<any>;
  opprettVerge: (params: {}) => Promise<any>;
  fjernVerge: (params: {}) => Promise<any>;
  lagreRisikoklassifiseringAksjonspunkt: (params: {}) => Promise<any>;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }, { keepData: boolean }) => Promise<any>;
  resetRestApiContext: () => (dspatch: any) => void;
  destroyReduxForm: (form: string) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

class BehandlingPleiepengerIndex extends PureComponent<Props> {
  componentDidMount = () => {
    const {
      behandlingEventHandler,
      nyBehandlendeEnhet,
      settBehandlingPaVent,
      taBehandlingAvVent,
      henleggBehandling,
      hentBehandling,
      behandlingId,
      opneBehandlingForEndringer,
      opprettVerge,
      fjernVerge,
      lagreRisikoklassifiseringAksjonspunkt,
    } = this.props;
    behandlingEventHandler.setHandler({
      endreBehandlendeEnhet: params =>
        nyBehandlendeEnhet(params).then(() => hentBehandling({ behandlingId }, { keepData: true })),
      settBehandlingPaVent: params =>
        settBehandlingPaVent(params).then(() => hentBehandling({ behandlingId }, { keepData: true })),
      taBehandlingAvVent: params => taBehandlingAvVent(params, { keepData: true }),
      henleggBehandling: params => henleggBehandling(params),
      opneBehandlingForEndringer: params => opneBehandlingForEndringer(params),
      opprettVerge: params => opprettVerge(params),
      fjernVerge: params => fjernVerge(params),
      lagreRisikoklassifiseringAksjonspunkt: params => lagreRisikoklassifiseringAksjonspunkt(params),
    });

    hentBehandling({ behandlingId }, { keepData: false });
  };

  componentWillUnmount = () => {
    const { behandlingEventHandler, resetRestApiContext, destroyReduxForm, behandling } = this.props;
    behandlingEventHandler.clear();
    resetRestApiContext();
    setTimeout(() => destroyReduxForm(getBehandlingFormPrefix(behandling.id, behandling.versjon)), 1000);
  };

  render() {
    const {
      behandling,
      forrigeBehandling,
      oppdaterBehandlingVersjon,
      kodeverk,
      fagsak,
      navAnsatt,
      oppdaterProsessStegOgFaktaPanelIUrl,
      valgtProsessSteg,
      valgtFaktaSteg,
      settPaVent,
      hentBehandling,
      opneSokeside,
      hasFetchError,
      featureToggles,
    } = this.props;

    if (!behandling) {
      return <LoadingPanel />;
    }

    reduxRestApi.injectPaths(behandling.links);

    return (
      <DataFetcherBehandlingDataV2
        behandlingVersion={behandling.versjon}
        endpoints={foreldrepengerData}
        showOldDataWhenRefetching
        render={(dataProps: FetchedData, isFinished) => (
          <>
            <ReduxFormStateCleaner
              behandlingId={behandling.id}
              behandlingVersjon={isFinished ? behandling.versjon : forrigeBehandling.versjon}
            />
            <PleiepengerPaneler
              behandling={isFinished ? behandling : forrigeBehandling}
              fetchedData={dataProps}
              fagsak={fagsak}
              alleKodeverk={kodeverk}
              navAnsatt={navAnsatt}
              valgtProsessSteg={valgtProsessSteg}
              oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
              valgtFaktaSteg={valgtFaktaSteg}
              oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
              settPaVent={settPaVent}
              hentBehandling={hentBehandling}
              opneSokeside={opneSokeside}
              hasFetchError={hasFetchError}
              featureToggles={featureToggles}
            />
          </>
        )}
      />
    );
  }
}

const mapStateToProps = state => ({
  behandling: pleiepengerBehandlingApi.BEHANDLING_FP.getRestApiData()(state),
  forrigeBehandling: pleiepengerBehandlingApi.BEHANDLING_FP.getRestApiPreviousData()(state),
  hasFetchError: !!pleiepengerBehandlingApi.BEHANDLING_FP.getRestApiError()(state),
});

const getResetRestApiContext = () => dispatch => {
  Object.values(PleiepengerBehandlingApiKeys).forEach(value => {
    dispatch(pleiepengerBehandlingApi[value].resetRestApi()());
  });
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  ...bindActionCreators(
    {
      nyBehandlendeEnhet: pleiepengerBehandlingApi.BEHANDLING_NY_BEHANDLENDE_ENHET.makeRestApiRequest(),
      settBehandlingPaVent: pleiepengerBehandlingApi.BEHANDLING_ON_HOLD.makeRestApiRequest(),
      taBehandlingAvVent: pleiepengerBehandlingApi.RESUME_BEHANDLING.makeRestApiRequest(),
      henleggBehandling: pleiepengerBehandlingApi.HENLEGG_BEHANDLING.makeRestApiRequest(),
      settPaVent: pleiepengerBehandlingApi.UPDATE_ON_HOLD.makeRestApiRequest(),
      opneBehandlingForEndringer: pleiepengerBehandlingApi.OPEN_BEHANDLING_FOR_CHANGES.makeRestApiRequest(),
      opprettVerge: pleiepengerBehandlingApi.VERGE_OPPRETT.makeRestApiRequest(),
      fjernVerge: pleiepengerBehandlingApi.VERGE_FJERN.makeRestApiRequest(),
      hentBehandling: pleiepengerBehandlingApi.BEHANDLING_FP.makeRestApiRequest(),
      lagreRisikoklassifiseringAksjonspunkt: pleiepengerBehandlingApi.SAVE_AKSJONSPUNKT.makeRestApiRequest(),
      resetRestApiContext: getResetRestApiContext,
      destroyReduxForm: destroy,
    },
    dispatch,
  ),
});

export default connect<any, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(BehandlingPleiepengerIndex);
