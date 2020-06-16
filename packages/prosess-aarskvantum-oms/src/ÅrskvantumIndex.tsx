import React, { FunctionComponent } from 'react';
import { createIntlCache, createIntl, RawIntlProvider } from 'react-intl';
import { VerticalSpacer } from '@fpsak-frontend/shared-components/index';
import { Behandling, KodeverkMedNavn } from '@k9-sak-web/types';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import Aksjonspunkt from '@k9-sak-web/types/src/aksjonspunktTsType';
import messages from '../i18n/nb_NO.json';
import ÅrskvantumForbrukteDager from './dto/ÅrskvantumForbrukteDager';
import Årskvantum from './components/Årskvantum';
import Uttaksplan from './components/Uttaksplan';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface ÅrsakvantumIndexProps {
  årskvantum: ÅrskvantumForbrukteDager;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  isAksjonspunktOpen: boolean;
  behandling: Behandling;
  submitCallback: (values: any[]) => void;
  aksjonspunkterForSteg?: Aksjonspunkt[];
}

const ÅrskvantumIndex: FunctionComponent<ÅrsakvantumIndexProps> = ({
  årskvantum,
  alleKodeverk,
  isAksjonspunktOpen,
  behandling,
  submitCallback,
  aksjonspunkterForSteg,
}) => {
  const {
    totaltAntallDager,
    antallKoronadager,
    restdager,
    restTid,
    forbrukteDager,
    forbruktTid,
    antallDagerArbeidsgiverDekker,
    antallDagerInfotrygd = 0,
    sisteUttaksplan,
  } = årskvantum;
  const aktivitetsstatuser = alleKodeverk[kodeverkTyper.AKTIVITET_STATUS];

  return (
    <RawIntlProvider value={intl}>
      <Årskvantum
        totaltAntallDager={totaltAntallDager}
        antallKoronadager={antallKoronadager}
        restdager={restdager}
        restTid={restTid}
        forbrukteDager={forbrukteDager}
        forbruktTid={forbruktTid}
        antallDagerArbeidsgiverDekker={antallDagerArbeidsgiverDekker}
        antallDagerInfotrygd={antallDagerInfotrygd}
        benyttetRammemelding={sisteUttaksplan.benyttetRammemelding}
        uttaksperioder={sisteUttaksplan.aktiviteter.flatMap(({ uttaksperioder }) => uttaksperioder)}
      />
      <VerticalSpacer sixteenPx />
      <Uttaksplan
        aktiviteter={sisteUttaksplan.aktiviteter}
        aktivitetsstatuser={aktivitetsstatuser}
        aktiv={sisteUttaksplan.aktiv}
        isAksjonspunktOpen={isAksjonspunktOpen}
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        submitCallback={submitCallback}
        aksjonspunkterForSteg={aksjonspunkterForSteg}
      />
    </RawIntlProvider>
  );
};

export default ÅrskvantumIndex;
