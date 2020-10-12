import React, { FunctionComponent, useCallback } from 'react';

import { RestApiState } from '@fpsak-frontend/rest-api-hooks';
import { Kodeverk } from '@k9-sak-web/types';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { FatterVedtakApprovalModalSakIndex } from '@fpsak-frontend/sak-totrinnskontroll';

import { FpsakApiKeys, restApiHooks, requestApi } from '../../data/fpsakApi';

interface TotrinnsKlageVurdering {
  klageVurdering?: string;
  klageVurderingOmgjoer?: string;
  klageVurderingResultatNFP?: any;
  klageVurderingResultatNK?: any;
}

interface OwnProps {
  erGodkjenningFerdig?: boolean;
  selectedBehandlingVersjon?: number;
  fagsakYtelseType: Kodeverk;
  behandlingsresultat: any;
  behandlingId: number;
  behandlingTypeKode: string;
  pushLocation: (location: string) => void;
  allAksjonspunktApproved: boolean;
  behandlingStatus: Kodeverk;
  totrinnsKlageVurdering: TotrinnsKlageVurdering;
}

const BeslutterModalIndex: FunctionComponent<OwnProps> = ({
  erGodkjenningFerdig = false,
  selectedBehandlingVersjon,
  fagsakYtelseType,
  behandlingsresultat,
  behandlingId,
  behandlingTypeKode,
  pushLocation,
  allAksjonspunktApproved,
  behandlingStatus,
  totrinnsKlageVurdering,
}) => {
  const { data, state } = restApiHooks.useRestApi<{ harRevurderingSammeResultat: boolean }>(
    FpsakApiKeys.HAR_REVURDERING_SAMME_RESULTAT,
    undefined,
    {
      updateTriggers: [behandlingId, selectedBehandlingVersjon],
      suspendRequest: !requestApi.hasPath(FpsakApiKeys.HAR_REVURDERING_SAMME_RESULTAT),
      keepData: true,
    },
  );

  const goToSearchPage = useCallback(() => {
    pushLocation('/');
  }, []);

  if (state === RestApiState.LOADING) {
    return <LoadingPanel />;
  }

  return (
    <FatterVedtakApprovalModalSakIndex
      showModal
      closeEvent={goToSearchPage}
      allAksjonspunktApproved={allAksjonspunktApproved}
      fagsakYtelseType={fagsakYtelseType}
      erGodkjenningFerdig={erGodkjenningFerdig}
      erKlageWithKA={totrinnsKlageVurdering ? !!totrinnsKlageVurdering.klageVurderingResultatNK : undefined}
      behandlingsresultat={behandlingsresultat}
      behandlingId={behandlingId}
      behandlingStatusKode={behandlingStatus.kode}
      behandlingTypeKode={behandlingTypeKode}
      harSammeResultatSomOriginalBehandling={data?.harRevurderingSammeResultat}
    />
  );
};

export default BeslutterModalIndex;