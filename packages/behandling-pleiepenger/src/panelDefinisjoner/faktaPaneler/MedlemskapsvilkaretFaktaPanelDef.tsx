import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import MedlemskapFaktaIndex from '@fpsak-frontend/fakta-medlemskap';
import { FaktaPanelDef } from '@fpsak-frontend/behandling-felles';

import pleiepengerBehandlingApi from '../../data/pleiepengerBehandlingApi';

class MedlemskapsvilkaretFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.MEDLEMSKAPSVILKARET;

  getTekstKode = () => 'MedlemskapInfoPanel.Medlemskap';

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
    aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
    aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
    aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD,
    aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP,
    aksjonspunktCodes.OVERSTYR_AVKLAR_STARTDATO,
  ];

  getEndepunkter = () => [pleiepengerBehandlingApi.MEDLEMSKAP];

  getKomponent = props => <MedlemskapFaktaIndex {...props} />;

  getOverstyrVisningAvKomponent = ({ personopplysninger, soknad }) => personopplysninger && soknad;

  getData = ({ fagsak, soknad, personopplysninger }) => ({
    fagsakPerson: fagsak.fagsakPerson,
    soknad,
    personopplysninger,
  });
}

export default MedlemskapsvilkaretFaktaPanelDef;