import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import React from 'react';
import Uttak from '../../components/Uttak';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = ({ behandling, uttaksperioder }) => <Uttak uuid={behandling.uuid} uttaksperioder={uttaksperioder} />;

  getAksjonspunktKoder = () => [];

  getOverstyrVisningAvKomponent = () => true;

  getOverstyrtStatus = props => {
    const { uttak } = props;
    if (!uttak) {
      return vilkarUtfallType.IKKE_VURDERT;
    }

    return vilkarUtfallType.OPPFYLT;
  };

  getData = ({ uttak }) => ({
    uttaksperioder: uttak,
  });
}

class UttakProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.UTTAK;

  getTekstKode = () => 'Behandlingspunkt.Uttak';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default UttakProsessStegPanelDef;
