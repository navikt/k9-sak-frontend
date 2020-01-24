import { ReduxEvents, ReduxRestApiBuilder, RestApiConfigBuilder } from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { reducerRegistry, setRequestPollingMessage } from '@fpsak-frontend/fp-felles';

export const BehandlingFpsakApiKeys = {
  BEHANDLING: 'BEHANDLING',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  SAVE_OVERSTYRT_AKSJONSPUNKT: 'SAVE_OVERSTYRT_AKSJONSPUNKT',
  PREVIEW_MESSAGE: 'PREVIEW_MESSAGE',
  PREVIEW_TILBAKEKREVING_MESSAGE: 'PREVIEW_TILBAKEKREVING_MESSAGE',
  STONADSKONTOER_GITT_UTTAKSPERIODER: 'STONADSKONTOER_GITT_UTTAKSPERIODER',
  AKSJONSPUNKTER: 'AKSJONSPUNKTER',
  VILKAR: 'VILKAR',
  PERSONOPPLYSNINGER: 'PERSONOPPLYSNINGER',
  SIMULERING_RESULTAT: 'SIMULERING_RESULTAT',
  TILBAKEKREVINGVALG: 'TILBAKEKREVINGVALG',
  BEREGNINGRESULTAT_ENGANGSSTONAD: 'BEREGNINGRESULTAT_ENGANGSSTONAD',
  BEREGNINGRESULTAT_FORELDREPENGER: 'BEREGNINGRESULTAT_FORELDREPENGER',
  BEREGNINGSGRUNNLAG: 'BEREGNINGSGRUNNLAG',
  BEREGNINGRESULTAT: 'BEREGNINGRESULTAT',
  FAMILIEHENDELSE: 'FAMILIEHENDELSE',
  SOKNAD: 'SOKNAD',
  ORIGINAL_BEHANDLING: 'ORIGINAL_BEHANDLING',
  MEDLEMSKAP: 'MEDLEMSKAP',
  MEDLEMSKAP_V2: 'MEDLEMSKAP_V2',
  UTTAK_PERIODE_GRENSE: 'UTTAK_PERIODE_GRENSE',
  INNTEKT_ARBEID_YTELSE: 'INNTEKT_ARBEID_YTELSE',
  VERGE: 'VERGE',
  YTELSEFORDELING: 'YTELSEFORDELING',
  OPPTJENING: 'OPPTJENING',
  SEND_VARSEL_OM_REVURDERING: 'SEND_VARSEL_OM_REVURDERING',
  SVANGERSKAPSPENGER_TILRETTELEGGING: 'SVANGERSKAPSPENGER_TILRETTELEGGING',
  FAKTA_ARBEIDSFORHOLD: 'FAKTA_ARBEIDSFORHOLD',
  UTTAKSRESULTAT_PERIODER: 'UTTAKSRESULTAT_PERIODER',
  UTTAK_STONADSKONTOER: 'UTTAK_STONADSKONTOER',
  UTTAK_KONTROLLER_FAKTA_PERIODER: 'UTTAK_KONTROLLER_FAKTA_PERIODER',
};

const endpoints = new RestApiConfigBuilder()
  /* /api/behandlinger */
  .withAsyncPost('/sak/api/behandlinger', BehandlingFpsakApiKeys.BEHANDLING)
  .withPost('/sak/api/behandlinger/endre-pa-vent', BehandlingFpsakApiKeys.UPDATE_ON_HOLD)

  /* /api/behandling */
  .withAsyncPost('/sak/api/behandling/aksjonspunkt', BehandlingFpsakApiKeys.SAVE_AKSJONSPUNKT)
  .withAsyncPost('/sak/api/behandling/aksjonspunkt/overstyr', BehandlingFpsakApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT)
  .withPost(
    '/sak/api/behandling/uttak/stonadskontoerGittUttaksperioder',
    BehandlingFpsakApiKeys.STONADSKONTOER_GITT_UTTAKSPERIODER,
  )

  /* fptilbake/api/dokument */
  .withPostAndOpenBlob(
    '/fptilbake/api/dokument/forhandsvis-varselbrev',
    BehandlingFpsakApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE,
  )

  /* /api/brev */
  .withPostAndOpenBlob('/fpformidling/api/brev/forhaandsvis', BehandlingFpsakApiKeys.PREVIEW_MESSAGE)

  // TODO (TOR) Desse er ikkje i bruk enno. Må flytta ut prosess- og fakta-komponentar først
  .withInjectedPath('aksjonspunkter', BehandlingFpsakApiKeys.AKSJONSPUNKTER)
  .withInjectedPath('vilkar', BehandlingFpsakApiKeys.VILKAR)
  .withInjectedPath('soeker-personopplysninger', BehandlingFpsakApiKeys.PERSONOPPLYSNINGER)
  .withInjectedPath('simuleringResultat', BehandlingFpsakApiKeys.SIMULERING_RESULTAT)
  .withInjectedPath('tilbakekrevingvalg', BehandlingFpsakApiKeys.TILBAKEKREVINGVALG)
  .withInjectedPath('beregningsresultat-engangsstonad', BehandlingFpsakApiKeys.BEREGNINGRESULTAT_ENGANGSSTONAD)
  .withInjectedPath('beregningsresultat-foreldrepenger', BehandlingFpsakApiKeys.BEREGNINGRESULTAT_FORELDREPENGER)
  .withInjectedPath('beregningsgrunnlag', BehandlingFpsakApiKeys.BEREGNINGSGRUNNLAG)
  .withInjectedPath('beregningsresultat-foreldrepenger', BehandlingFpsakApiKeys.BEREGNINGRESULTAT)
  .withInjectedPath('familiehendelse-v2', BehandlingFpsakApiKeys.FAMILIEHENDELSE)
  .withInjectedPath('soknad', BehandlingFpsakApiKeys.SOKNAD)
  .withInjectedPath('original-behandling', BehandlingFpsakApiKeys.ORIGINAL_BEHANDLING)
  .withInjectedPath('soeker-medlemskap', BehandlingFpsakApiKeys.MEDLEMSKAP)
  .withInjectedPath('soeker-medlemskap-v2', BehandlingFpsakApiKeys.MEDLEMSKAP_V2)
  .withInjectedPath('uttak-periode-grense', BehandlingFpsakApiKeys.UTTAK_PERIODE_GRENSE)
  .withInjectedPath('inntekt-arbeid-ytelse', BehandlingFpsakApiKeys.INNTEKT_ARBEID_YTELSE)
  .withInjectedPath('soeker-verge', BehandlingFpsakApiKeys.VERGE)
  .withInjectedPath('ytelsefordeling', BehandlingFpsakApiKeys.YTELSEFORDELING)
  .withInjectedPath('opptjening', BehandlingFpsakApiKeys.OPPTJENING)
  .withInjectedPath('sendt-varsel-om-revurdering', BehandlingFpsakApiKeys.SEND_VARSEL_OM_REVURDERING)
  .withInjectedPath('svangerskapspenger-tilrettelegging', BehandlingFpsakApiKeys.SVANGERSKAPSPENGER_TILRETTELEGGING)
  .withInjectedPath('fakta-arbeidsforhold', BehandlingFpsakApiKeys.FAKTA_ARBEIDSFORHOLD)
  .withInjectedPath('uttaksresultat-perioder', BehandlingFpsakApiKeys.UTTAKSRESULTAT_PERIODER)
  .withInjectedPath('uttak-stonadskontoer', BehandlingFpsakApiKeys.UTTAK_STONADSKONTOER)
  .withInjectedPath('uttak-kontroller-fakta-perioder', BehandlingFpsakApiKeys.UTTAK_KONTROLLER_FAKTA_PERIODER)

  .build();

const reducerName = 'dataContextForstegangOgRevurderingBehandling';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withReduxEvents(
    new ReduxEvents()
      .withErrorActionCreator(errorHandler.getErrorActionCreator())
      .withPollingMessageActionCreator(setRequestPollingMessage),
  )
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const fpsakBehandlingApi = reduxRestApi.getEndpointApi();
export default fpsakBehandlingApi;
