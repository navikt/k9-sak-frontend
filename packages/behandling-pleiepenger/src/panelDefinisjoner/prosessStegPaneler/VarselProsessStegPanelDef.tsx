import React from 'react';

import VarselOmRevurderingProsessIndex from '@fpsak-frontend/prosess-varsel-om-revurdering';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@fpsak-frontend/behandling-felles';

import pleiepengerBehandlingApi from '../../data/pleiepengerBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <VarselOmRevurderingProsessIndex {...props} />;

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.VARSEL_REVURDERING_MANUELL,
    aksjonspunktCodes.VARSEL_REVURDERING_ETTERKONTROLL,
  ];

  getEndepunkter = () => [
    pleiepengerBehandlingApi.FAMILIEHENDELSE,
    pleiepengerBehandlingApi.FAMILIEHENDELSE_ORIGINAL_BEHANDLING,
    pleiepengerBehandlingApi.SOKNAD_ORIGINAL_BEHANDLING,
  ];

  getData = ({ previewCallback, dispatchSubmitFailed, soknad }) => ({
    previewCallback,
    dispatchSubmitFailed,
    soknad,
  });
}

class VarselProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.VARSEL;

  getTekstKode = () => 'Behandlingspunkt.CheckVarselRevurdering';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default VarselProsessStegPanelDef;