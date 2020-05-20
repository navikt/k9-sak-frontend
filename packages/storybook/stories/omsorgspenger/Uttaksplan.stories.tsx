import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import ÅrskvantumIndex from '@k9-sak-web/prosess-aarskvantum-oms';
import { UtfallEnum } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/Utfall';
import { VilkårEnum } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/Vilkår';
import { VurderteVilkår } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/Uttaksperiode';
import { Behandling } from '@k9-sak-web/types';
import ÅrskvantumForbrukteDager from '../../../prosess-aarskvantum-oms/src/dto/ÅrskvantumForbrukteDager';
import alleKodeverk from '../mocks/alleKodeverk.json';
import withReduxProvider from '../../decorators/withRedux';

export default {
  title: 'omsorgspenger/prosess/Årskvantum',
  component: ÅrskvantumIndex,
  decorators: [withKnobs, withReduxProvider],
};

const vilkårInnvilget: VurderteVilkår = {
  [VilkårEnum.NOK_DAGER]: UtfallEnum.INNVILGET,
  [VilkårEnum.ALDERSVILKÅR_BARN]: UtfallEnum.INNVILGET,
};

const årskvantumDto: ÅrskvantumForbrukteDager = {
  totaltAntallDager: 17,
  antallKoronadager: 0,
  antallDagerArbeidsgiverDekker: 3,
  forbrukteDager: 10.4,
  restdager: 9.6,
  antallDagerInfotrygd: 2.4,
  sisteUttaksplan: {
    aktiviteter: [
      {
        arbeidsforhold: {
          arbeidsforholdId: '123',
          organisasjonsnummer: '456',
          type: 'AT',
        },
        uttaksperioder: [
          {
            utfall: UtfallEnum.UAVKLART,
            vurderteVilkår: {
              vilkår: {
                ...vilkårInnvilget,
                [VilkårEnum.UIDENTIFISERT_RAMMEVEDTAK]: UtfallEnum.UAVKLART,
              },
            },
            periode: '2020-03-01/2020-03-10',
            utbetalingsgrad: 50,
            hjemler: ['FTRL_9_5__1', 'FTRL_9_5__3', 'FTRL_9_3__1', 'FTRL_9_6__1'],
          },
          {
            utfall: UtfallEnum.INNVILGET,
            vurderteVilkår: {
              vilkår: vilkårInnvilget,
            },
            delvisFravær: 'P2DT4H30M',
            periode: '2020-04-01/2020-04-30',
            utbetalingsgrad: 100,
            hjemler: ['FTRL_9_5__1', 'FTRL_9_5__3', 'FTRL_9_3__1', 'FTRL_9_6__1'],
          },
        ],
      },
      {
        arbeidsforhold: {
          arbeidsforholdId: '888',
          organisasjonsnummer: '999',
          type: 'SN',
        },
        uttaksperioder: [
          {
            utfall: UtfallEnum.AVSLÅTT,
            vurderteVilkår: {
              vilkår: {
                ...vilkårInnvilget,
                [VilkårEnum.NOK_DAGER]: UtfallEnum.AVSLÅTT,
              },
            },
            periode: '2020-03-01/2020-03-31',
            utbetalingsgrad: 0,
            hjemler: ['FTRL_9_5__1', 'FTRL_9_5__3', 'FTRL_9_3__1', 'FTRL_9_6__1', 'COVID19_4_3', 'COVID19_4_1__2'],
          },
        ],
      },
    ],
    behandlingUUID: '1',
    saksnummer: '2',
    innsendingstidspunkt: '123',
    benyttetRammemelding: true,
  },
};

// @ts-ignore
const behandling: Behandling = {
  id: 1,
  versjon: 1,
};

export const standard = () => (
  // @ts-ignore
  <ÅrskvantumIndex årskvantum={årskvantumDto} alleKodeverk={alleKodeverk} behandling={behandling} />
);

export const smittevernsdager = () => (
  <ÅrskvantumIndex
    årskvantum={{
      ...årskvantumDto,
      antallKoronadager: 10,
      restdager: -3.4,
    }}
    // @ts-ignore
    alleKodeverk={alleKodeverk}
    behandling={behandling}
    isAksjonspunktOpen
    submitCallback={action('bekreft')}
  />
);
