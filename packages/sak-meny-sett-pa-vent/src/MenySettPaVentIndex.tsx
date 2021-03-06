import React, { FunctionComponent, useCallback } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { KodeverkMedNavn } from '@k9-sak-web/types';
import SettPaVentModalIndex from '@k9-sak-web/modal-sett-pa-vent';

import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

export const getMenytekst = (): string => intl.formatMessage({ id: 'MenySettPaVentIndex.BehandlingOnHold' });

interface OwnProps {
  behandlingId?: number;
  behandlingVersjon?: number;
  settBehandlingPaVent: (params: {
    behandlingVersjon: number;
    behandlingId: number;
    frist: string;
    ventearsak: string;
  }) => void;
  ventearsaker: KodeverkMedNavn[];
  lukkModal: () => void;
  erTilbakekreving: boolean;
}

const MenySettPaVentIndex: FunctionComponent<OwnProps> = ({
  behandlingId,
  behandlingVersjon,
  settBehandlingPaVent,
  ventearsaker,
  lukkModal,
  erTilbakekreving,
}) => {
  const history = useHistory();

  const submit = useCallback(
    formValues => {
      const values = {
        behandlingVersjon,
        behandlingId,
        frist: formValues.frist,
        ventearsak: formValues.ventearsak,
      };
      settBehandlingPaVent(values);

      // lukkModal();
      history.push('/');
    },
    [behandlingId, behandlingVersjon],
  );

  return (
    <RawIntlProvider value={intl}>
      <SettPaVentModalIndex
        showModal
        submitCallback={submit}
        cancelEvent={lukkModal}
        ventearsaker={ventearsaker}
        erTilbakekreving={erTilbakekreving}
        hasManualPaVent
      />
    </RawIntlProvider>
  );
};

export default MenySettPaVentIndex;
