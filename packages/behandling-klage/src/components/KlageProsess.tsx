import React, { FunctionComponent, useState, useCallback } from 'react';
import { Dispatch } from 'redux';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  FagsakInfo,
  Rettigheter,
  prosessStegHooks,
  FatterVedtakStatusModal,
  ProsessStegPanel,
  ProsessStegContainer,
} from '@fpsak-frontend/behandling-felles';
import { Kodeverk, KodeverkMedNavn, Behandling, FeatureToggles } from '@k9-sak-web/types';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import klageVurderingKodeverk from '@fpsak-frontend/kodeverk/src/klageVurdering';

import lagForhåndsvisRequest from '@fpsak-frontend/utils/src/formidlingUtils';
import KlageBehandlingModal from './KlageBehandlingModal';
import klageBehandlingApi from '../data/klageBehandlingApi';
import prosessStegPanelDefinisjoner from '../panelDefinisjoner/prosessStegKlagePanelDefinisjoner';
import FetchedData from '../types/fetchedDataTsType';

import '@fpsak-frontend/assets/styles/arrowForProcessMenu.less';

interface OwnProps {
  data: FetchedData;
  fagsak: FagsakInfo;
  behandling: Behandling;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  rettigheter: Rettigheter;
  valgtProsessSteg?: string;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  opneSokeside: () => void;
  dispatch: Dispatch;
  alleBehandlinger: {
    id: number;
    type: Kodeverk;
    avsluttet?: string;
  }[];
  featureToggles: FeatureToggles;
}

const saveKlageText = (dispatch, behandling, aksjonspunkter) => aksjonspunktModel => {
  const data = {
    behandlingId: behandling.id,
    ...aksjonspunktModel,
  };

  const getForeslaVedtakAp = aksjonspunkter
    .filter(ap => ap.status.kode === aksjonspunktStatus.OPPRETTET)
    .filter(ap => ap.definisjon.kode === aksjonspunktCodes.FORESLA_VEDTAK);

  if (getForeslaVedtakAp.length === 1) {
    dispatch(klageBehandlingApi.SAVE_REOPEN_KLAGE_VURDERING.makeRestApiRequest()(data));
  } else {
    dispatch(klageBehandlingApi.SAVE_KLAGE_VURDERING.makeRestApiRequest()(data));
  }
};

const previewCallback = (dispatch, fagsak, behandling, valgtPartMedKlagerett) => parametre => {
  const request = lagForhåndsvisRequest(behandling, fagsak, {
    ...parametre,
    overstyrtMottaker: valgtPartMedKlagerett && valgtPartMedKlagerett.identifikasjon,
  });
  return dispatch(klageBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest()(request));
};

const getLagringSideeffekter = (
  toggleFatterVedtakModal,
  toggleKlageModal,
  toggleOppdatereFagsakContext,
  oppdaterProsessStegOgFaktaPanelIUrl,
) => async aksjonspunktModels => {
  const skalByttTilKlageinstans = aksjonspunktModels.some(
    apValue =>
      apValue.kode === aksjonspunktCodes.BEHANDLE_KLAGE_NFP &&
      apValue.klageVurdering === klageVurderingKodeverk.STADFESTE_YTELSESVEDTAK,
  );
  const erVedtakAp =
    aksjonspunktModels[0].kode === aksjonspunktCodes.FORESLA_VEDTAK ||
    aksjonspunktModels[0].kode === aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL;

  if (skalByttTilKlageinstans || erVedtakAp) {
    toggleOppdatereFagsakContext(false);
  }

  // Returner funksjon som blir kjørt etter lagring av aksjonspunkt(er)
  return () => {
    if (skalByttTilKlageinstans) {
      toggleKlageModal(true);
    } else if (erVedtakAp) {
      toggleFatterVedtakModal(true);
    } else {
      oppdaterProsessStegOgFaktaPanelIUrl('default', 'default');
    }
  };
};

const KlageProsess: FunctionComponent<OwnProps> = ({
  data,
  fagsak,
  behandling,
  alleKodeverk,
  rettigheter,
  valgtProsessSteg,
  oppdaterBehandlingVersjon,
  oppdaterProsessStegOgFaktaPanelIUrl,
  opneSokeside,
  alleBehandlinger,
  dispatch,
  featureToggles,
}) => {
  const toggleSkalOppdatereFagsakContext = prosessStegHooks.useOppdateringAvBehandlingsversjon(
    behandling.versjon,
    oppdaterBehandlingVersjon,
  );

  const { valgtPartMedKlagerett, ...rest } = data;

  const dataTilUtledingAvFpPaneler = {
    alleBehandlinger,
    klageVurdering: data.klageVurdering,
    saveKlageText: useCallback(saveKlageText(dispatch, behandling, data.aksjonspunkter), [behandling.versjon]),
    previewCallback: useCallback(previewCallback(dispatch, fagsak, behandling, valgtPartMedKlagerett), [
      behandling.versjon,
    ]),
    valgtPartMedKlagerett,
    ...rest,
  };
  const [prosessStegPaneler, valgtPanel, formaterteProsessStegPaneler] = prosessStegHooks.useProsessStegPaneler(
    prosessStegPanelDefinisjoner,
    dataTilUtledingAvFpPaneler,
    fagsak,
    rettigheter,
    behandling,
    data.aksjonspunkter,
    [],
    false,
    valgtProsessSteg,
  );

  const [visFatterVedtakModal, toggleFatterVedtakModal] = useState(false);
  const [visModalKlageBehandling, toggleKlageModal] = useState(false);
  const lagringSideeffekterCallback = getLagringSideeffekter(
    toggleFatterVedtakModal,
    toggleKlageModal,
    toggleSkalOppdatereFagsakContext,
    oppdaterProsessStegOgFaktaPanelIUrl,
  );

  const velgProsessStegPanelCallback = prosessStegHooks.useProsessStegVelger(
    prosessStegPaneler,
    'undefined',
    behandling,
    oppdaterProsessStegOgFaktaPanelIUrl,
    valgtProsessSteg,
    valgtPanel,
  );

  const skalViseAtKlagenErFerdigbehandlet =
    data.klageVurdering &&
    data.klageVurdering.klageVurderingResultatNK &&
    data.klageVurdering.klageVurderingResultatNK.godkjentAvMedunderskriver;

  return (
    <>
      <KlageBehandlingModal
        visModal={visModalKlageBehandling}
        lukkModal={useCallback(() => {
          toggleKlageModal(false);
          opneSokeside();
        }, [])}
      />
      <FatterVedtakStatusModal
        visModal={visFatterVedtakModal}
        lukkModal={useCallback(() => {
          toggleFatterVedtakModal(false);
          opneSokeside();
        }, [])}
        tekstkode={
          skalViseAtKlagenErFerdigbehandlet
            ? 'FatterVedtakStatusModal.KlagenErFerdigbehandlet'
            : 'FatterVedtakStatusModal.SendtKlageResultatTilMedunderskriver'
        }
      />
      <ProsessStegContainer
        formaterteProsessStegPaneler={formaterteProsessStegPaneler}
        velgProsessStegPanelCallback={velgProsessStegPanelCallback}
      >
        <ProsessStegPanel
          valgtProsessSteg={valgtPanel}
          fagsak={fagsak}
          behandling={behandling}
          alleKodeverk={alleKodeverk}
          lagringSideeffekterCallback={lagringSideeffekterCallback}
          behandlingApi={klageBehandlingApi}
          dispatch={dispatch}
          featureToggles={featureToggles}
        />
      </ProsessStegContainer>
    </>
  );
};

export default KlageProsess;
