import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import BeregningFaktaIndex from '@fpsak-frontend/fakta-beregning';
import { FaktaPanelDef } from '@fpsak-frontend/behandling-felles';

class BeregningFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.BEREGNING;

  getTekstKode = () => 'BeregningInfoPanel.Title';

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
    aksjonspunktCodes.AVKLAR_AKTIVITETER,
    aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
    aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
  ];

  getKomponent = props => <BeregningFaktaIndex {...props} />;

  getOverstyrVisningAvKomponent = ({ beregningsgrunnlag }) => beregningsgrunnlag;

  getData = ({ rettigheter, beregningsgrunnlag, arbeidsgivere }) => ({
    erOverstyrer: rettigheter.kanOverstyreAccess.isEnabled,
    beregningsgrunnlag,
    arbeidsgivere,
  });
}

export default BeregningFaktaPanelDef;
