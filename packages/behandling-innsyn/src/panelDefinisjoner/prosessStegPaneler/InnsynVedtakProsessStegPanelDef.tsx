import React from 'react';

import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import innsynResultatTypeKV from '@fpsak-frontend/kodeverk/src/innsynResultatType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import VedtakInnsynProsessIndex from '@fpsak-frontend/prosess-vedtak-innsyn';
import redusertUtbetalingArsak from '@fpsak-frontend/prosess-vedtak/src/kodeverk/redusertUtbetalingArsak';
import { dokumentdatatype, prosessStegCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@fpsak-frontend/behandling-felles';
import innsynBehandlingApi from '../../data/innsynBehandlingApi';

const getVedtakStatus = (innsynResultatType, aksjonspunkter) => {
  const harApentAksjonpunkt = aksjonspunkter.some(ap => ap.status.kode === aksjonspunktStatus.OPPRETTET);
  if (aksjonspunkter.length === 0 || harApentAksjonpunkt) {
    return vilkarUtfallType.IKKE_VURDERT;
  }
  return innsynResultatType.kode === innsynResultatTypeKV.INNVILGET
    ? vilkarUtfallType.OPPFYLT
    : vilkarUtfallType.IKKE_OPPFYLT;
};

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <VedtakInnsynProsessIndex {...props} />;

  getOverstyrVisningAvKomponent = () => true;

  getOverstyrtStatus = ({ innsyn, aksjonspunkterForSteg }) =>
    innsyn ? getVedtakStatus(innsyn.innsynResultatType, aksjonspunkterForSteg) : vilkarUtfallType.IKKE_VURDERT;

  getAksjonspunktKoder = () => [aksjonspunktCodes.FORESLA_VEDTAK];

  getEndepunkter = () => [innsynBehandlingApi.DOKUMENTDATA_HENTE];

  getData = ({ innsyn, alleDokumenter, fagsak, previewCallback, aksjonspunkter, featureToggles }) => ({
    innsyn,
    alleDokumenter,
    previewCallback,
    aksjonspunkter,
    saksnummer: fagsak.saksnummer,
    lagreArsakerTilRedusertUtbetaling: (values, dispatch) => {
      if (featureToggles?.DOKUMENTDATA) {
        const arsaker = Object.values(redusertUtbetalingArsak).filter(a => values[a]);
        dispatch(
          innsynBehandlingApi.DOKUMENTDATA_LAGRE.makeRestApiRequest()({
            [dokumentdatatype.REDUSERT_UTBETALING_AARSAK]: arsaker,
          }),
        );
      }
    },
  });
}

class InnsynVedtakProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.VEDTAK;

  getTekstKode = () => 'Behandlingspunkt.Vedtak';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default InnsynVedtakProsessStegPanelDef;
