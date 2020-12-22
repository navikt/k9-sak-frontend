import React, { FunctionComponent } from 'react';
import { createIntlCache, createIntl, RawIntlProvider } from 'react-intl';
import { Behandling, KodeverkMedNavn , Aksjonspunkt, FeatureToggles, InntektArbeidYtelse } from '@k9-sak-web/types';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

import messages from '../i18n/nb_NO.json';
import ÅrskvantumForbrukteDager from './dto/ÅrskvantumForbrukteDager';
import Uttaksplan from './components/Uttaksplan';
import AksjonspunktForm from './components/AksjonspunktForm';
import Aktivitet from './dto/Aktivitet';

const cache = createIntlCache();

export const årskvantumIntl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface ÅrsakvantumIndexProps {
  fullUttaksplan: {
    aktiviteter?: Aktivitet[];
  };
  årskvantum: ÅrskvantumForbrukteDager;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  isAksjonspunktOpen: boolean;
  behandling: Behandling;
  submitCallback: (values: any[]) => void;
  aksjonspunkterForSteg?: Aksjonspunkt[];
  inntektArbeidYtelse: InntektArbeidYtelse;
  featureToggles: FeatureToggles;
}

const ÅrskvantumIndex: FunctionComponent<ÅrsakvantumIndexProps> = ({
  fullUttaksplan,
  årskvantum,
  alleKodeverk,
  isAksjonspunktOpen,
  behandling,
  submitCallback,
  aksjonspunkterForSteg = [],
  inntektArbeidYtelse,
  featureToggles,
}) => {
  const { sisteUttaksplan } = årskvantum;
  const aktivitetsstatuser = alleKodeverk[kodeverkTyper.AKTIVITET_STATUS];

  return (
    <RawIntlProvider value={årskvantumIntl}>
      {aksjonspunkterForSteg.length > 0 && (
        <AksjonspunktForm
          aktiviteter={sisteUttaksplan?.aktiviteter}
          behandlingId={behandling.id}
          behandlingVersjon={behandling.versjon}
          submitCallback={submitCallback}
          aksjonspunkterForSteg={aksjonspunkterForSteg}
          isAksjonspunktOpen={isAksjonspunktOpen}
        />
      )}
      <Uttaksplan
        aktiviteterBehandling={sisteUttaksplan?.aktiviteter}
        aktiviteterHittilIÅr={fullUttaksplan?.aktiviteter}
        aktivitetsstatuser={aktivitetsstatuser}
        aktiv={sisteUttaksplan?.aktiv}
        // @ts-ignore
        arbeidsforhold={inntektArbeidYtelse.arbeidsforhold}
        featureToggles={featureToggles}
      />
    </RawIntlProvider>
  );
};

export default ÅrskvantumIndex;
