import React from 'react';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import VedtakProsessIndex from '@fpsak-frontend/prosess-vedtak';
import { featureToggle, prosessStegCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@fpsak-frontend/behandling-felles';

import findStatusForVedtak from '../vedtakStatusUtlederOmsorgspenger';
import omsorgspengerBehandlingApi from '../../data/omsorgspengerBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <VedtakProsessIndex {...props} />;

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.FORESLA_VEDTAK,
    aksjonspunktCodes.FATTER_VEDTAK,
    aksjonspunktCodes.FORESLA_VEDTAK_MANUELT,
    aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL,
    aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
    aksjonspunktCodes.VURDERE_DOKUMENT,
    aksjonspunktCodes.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST,
    aksjonspunktCodes.KONTROLL_AV_MAUNELT_OPPRETTET_REVURDERINGSBEHANDLING,
  ];

  getEndepunkter = featureToggles => {
    const endepunkterUtenDd = [
      omsorgspengerBehandlingApi.TILBAKEKREVINGVALG,
      omsorgspengerBehandlingApi.SEND_VARSEL_OM_REVURDERING,
      omsorgspengerBehandlingApi.MEDLEMSKAP,
      omsorgspengerBehandlingApi.VEDTAK_VARSEL,
      omsorgspengerBehandlingApi.TILGJENGELIGE_VEDTAKSBREV,
    ];
    const endepunkterMedDd = endepunkterUtenDd.concat([omsorgspengerBehandlingApi.DOKUMENTDATA_HENTE]);
    return featureToggles?.[featureToggle.AKTIVER_DOKUMENTDATA] ? endepunkterMedDd : endepunkterUtenDd;
  };

  getOverstyrVisningAvKomponent = () => true;

  getOverstyrtStatus = ({ vilkar, aksjonspunkter, behandling, aksjonspunkterForSteg }) =>
    findStatusForVedtak(vilkar, aksjonspunkter, aksjonspunkterForSteg, behandling.behandlingsresultat);

  getData = ({
    previewCallback,
    rettigheter,
    aksjonspunkter,
    vilkar,
    simuleringResultat,
    beregningsgrunnlag,
    forbrukteDager,
  }) => ({
    previewCallback,
    aksjonspunkter,
    vilkar,
    simuleringResultat,
    beregningsgrunnlag,
    ytelseTypeKode: fagsakYtelseType.OMSORGSPENGER,
    employeeHasAccess: rettigheter.kanOverstyreAccess.isEnabled,
    uttaksperioder: forbrukteDager?.sisteUttaksplan?.aktiviteter?.flatMap(aktivitet => aktivitet.uttaksperioder),
  });
}

class VedtakProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.VEDTAK;

  getTekstKode = () => 'Behandlingspunkt.Vedtak';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default VedtakProsessStegPanelDef;
