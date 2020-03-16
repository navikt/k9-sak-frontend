import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import Behandling from '@k9-sak-web/types/src/behandlingTsType';
import Personopplysninger from '@k9-sak-web/types/src/personopplysningerTsType';
import moment from 'moment';
import messages from '../i18n/nb_NO.json';
import UttakFaktaPanel from './components/UttakFaktaPanel';
import Arbeid from './components/types/Arbeid';
import ArbeidDto from './components/dto/ArbeidDto';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface UttakFaktaIndexProps {
  behandling: Behandling;
  arbeidDto: ArbeidDto[];
  submitCallback: (values: any[]) => void;
  personopplysninger: Personopplysninger;
}

export const mapDtoTilInternobjekt: (arbeid: ArbeidDto[]) => Arbeid[] = arbeid =>
  arbeid.map(({ perioder, arbeidsforhold }) => ({
    arbeidsforhold: { ...arbeidsforhold },
    perioder: Object.entries(perioder).map(([fomTom, { jobberNormaltPerUke, skalJobbeProsent }]) => {
      const [fom, tom] = fomTom.split('/');
      const timerIJobbTilVanlig = moment.duration(jobberNormaltPerUke).asHours();
      return {
        fom,
        tom,
        timerIJobbTilVanlig,
        timerFårJobbet: (Number(skalJobbeProsent) * timerIJobbTilVanlig) / 100,
      };
    }),
  }));

const UttakFaktaIndex: FunctionComponent<UttakFaktaIndexProps> = ({
  behandling,
  arbeidDto,
  submitCallback,
  personopplysninger,
}) => (
  <RawIntlProvider value={intl}>
    <UttakFaktaPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      arbeid={mapDtoTilInternobjekt(arbeidDto)}
      submitCallback={submitCallback}
      personopplysninger={personopplysninger}
    />
  </RawIntlProvider>
);

export default UttakFaktaIndex;
