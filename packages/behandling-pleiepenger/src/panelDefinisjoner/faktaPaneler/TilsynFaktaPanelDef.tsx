import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { Fagsak } from '@k9-sak-web/types';
import React from 'react';
import Tilsyn from '../../components/Tilsyn';

class TilsynFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.ETABLERT_TILSYN;

  getTekstKode = () => 'EtablertTilsynInfoPanel.Title';

  getAksjonspunktKoder = () => [aksjonspunktCodes.NATTEVÅK, aksjonspunktCodes.BEREDSKAP];

  getKomponent = props => <Tilsyn {...props} />;

  getOverstyrVisningAvKomponent = ({ fagsak }: { fagsak: Fagsak }) =>
    fagsak.sakstype.kode === fagsakYtelseType.PLEIEPENGER;
}

export default TilsynFaktaPanelDef;