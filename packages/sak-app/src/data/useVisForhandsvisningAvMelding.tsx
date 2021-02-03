import { Behandling, Fagsak } from '@k9-sak-web/types';

import { erTilbakekrevingType } from '@fpsak-frontend/kodeverk/src/behandlingType';
import lagForhåndsvisRequest from '@fpsak-frontend/utils/src/formidlingUtils';
import { K9sakApiKeys, restApiHooks } from './k9sakApi';

type ForhandsvisFunksjon = (erHenleggelse: boolean, data: any) => void;

const forhandsvis = (data: any) => {
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(data);
  } else if (URL.createObjectURL) {
    window.open(URL.createObjectURL(data));
  }
};

export const useVisForhandsvisningAvMelding = (behandling: Behandling, fagsak?: Fagsak): ForhandsvisFunksjon => {
  const erTilbakekreving = erTilbakekrevingType(behandling?.type);

  if (!erTilbakekreving && !fagsak) {
    throw new Error('Fagsak er påkrevd ved forhåndvisning mot formidling');
  }

  const { startRequest: forhandsvisTilbakekrevingHenleggelse } = restApiHooks.useRestApiRunner(
    K9sakApiKeys.PREVIEW_MESSAGE_TILBAKEKREVING_HENLEGGELSE,
  );
  const { startRequest: forhandsvisTilbakekreving } = restApiHooks.useRestApiRunner(
    K9sakApiKeys.PREVIEW_MESSAGE_TILBAKEKREVING,
  );

  const { startRequest: forhandsvisMelding } = restApiHooks.useRestApiRunner(K9sakApiKeys.PREVIEW_MESSAGE_FORMIDLING);

  return (erHenleggelse: boolean, data: any): void => {
    if (erTilbakekreving && erHenleggelse) {
      forhandsvisTilbakekrevingHenleggelse({ behandlingUuid: behandling.uuid, ...data }).then(response =>
        forhandsvis(response),
      );
    } else if (erTilbakekreving) {
      forhandsvisTilbakekreving({ behandlingUuid: behandling.uuid, ...data }).then(response => forhandsvis(response));
    } else {
      const req = { ...lagForhåndsvisRequest(behandling, fagsak, fagsak.person, data) };
      forhandsvisMelding(req).then(response => forhandsvis(response));
    }
  };
};

export default useVisForhandsvisningAvMelding;
