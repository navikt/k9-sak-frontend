import React, { FunctionComponent, useState, useCallback } from 'react';
import { Dispatch } from 'redux';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  FagsakInfo,
  Rettigheter,
  prosessStegHooks,
  IverksetterVedtakStatusModal,
  ProsessStegPanel,
  ProsessStegContainer,
} from '@fpsak-frontend/behandling-felles';
import { KodeverkMedNavn, Behandling } from '@k9-sak-web/types';

import lagForhåndsvisRequest from "@fpsak-frontend/utils/src/formidlingUtils";
import innsynBehandlingApi from '../data/innsynBehandlingApi';
import prosessStegPanelDefinisjoner from '../panelDefinisjoner/prosessStegInnsynPanelDefinisjoner';

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
  featureToggles: {};
}

const previewCallback = (dispatch, fagsak, behandling) => parametre => {
  const request = lagForhåndsvisRequest(behandling, fagsak, parametre)
  return dispatch(innsynBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest()(request));
};

const getLagringSideeffekter = (
  toggleIverksetterVedtakModal,
  toggleOppdatereFagsakContext,
  oppdaterProsessStegOgFaktaPanelIUrl,
) => async aksjonspunktModels => {
  const isVedtak = aksjonspunktModels.some(a => a.kode === aksjonspunktCodes.FORESLA_VEDTAK);

  if (isVedtak) {
    toggleOppdatereFagsakContext(false);
  }

  // Returner funksjon som blir kjørt etter lagring av aksjonspunkt(er)
  return () => {
    if (isVedtak) {
      toggleIverksetterVedtakModal(true);
    } else {
      oppdaterProsessStegOgFaktaPanelIUrl('default', 'default');
    }
  };
};

const InnsynProsess: FunctionComponent<OwnProps> = ({
  data,
  fagsak,
  behandling,
  alleKodeverk,
  rettigheter,
  valgtProsessSteg,
  oppdaterProsessStegOgFaktaPanelIUrl,
  oppdaterBehandlingVersjon,
  opneSokeside,
  dispatch,
  featureToggles,
}) => {
  const toggleSkalOppdatereFagsakContext = prosessStegHooks.useOppdateringAvBehandlingsversjon(
    behandling.versjon,
    oppdaterBehandlingVersjon,
  );

  const dataTilUtledingAvFpPaneler = {
    alleDokumenter: data.innsynDokumenter,
    innsyn: data.innsyn,
    previewCallback: useCallback(previewCallback(dispatch, fagsak, behandling), [behandling.versjon]),
    ...data,
  };
  const [prosessStegPaneler, valgtPanel, formaterteProsessStegPaneler] = prosessStegHooks.useProsessStegPaneler(
    prosessStegPanelDefinisjoner,
    dataTilUtledingAvFpPaneler,
    fagsak,
    rettigheter,
    behandling,
    data.aksjonspunkter,
    data.vilkar,
    false,
    valgtProsessSteg,
  );

  const [visIverksetterVedtakModal, toggleIverksetterVedtakModal] = useState(false);
  const lagringSideeffekterCallback = getLagringSideeffekter(
    toggleIverksetterVedtakModal,
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

  return (
    <>
      <IverksetterVedtakStatusModal
        visModal={visIverksetterVedtakModal}
        lukkModal={useCallback(() => {
          toggleIverksetterVedtakModal(false);
          opneSokeside();
        }, [])}
        behandlingsresultat={behandling.behandlingsresultat}
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
          behandlingApi={innsynBehandlingApi}
          dispatch={dispatch}
          featureToggles={featureToggles}
        />
      </ProsessStegContainer>
    </>
  );
};

export default InnsynProsess;
