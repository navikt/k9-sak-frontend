import React from 'react';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { UtfallEnum, Uttaksperiode, VilkårEnum } from '@k9-sak-web/types';
import { CheckboxField, RadioOption } from '@fpsak-frontend/form/index';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FraværÅrsakEnum } from '@k9-sak-web/types/src/omsorgspenger/Uttaksperiode';
import { shallowWithIntl } from '../../i18n';
import { begrunnelseUavklartePerioder, FormContent, FormValues, transformValues } from './AksjonspunktForm';

import Aktivitet from '../dto/Aktivitet';

describe('<AksjonspunktForm>', () => {
  const uavklartPeriode: Uttaksperiode = {
    utfall: UtfallEnum.UAVKLART,
    fraværÅrsak: FraværÅrsakEnum.ORDINÆRT_FRAVÆR,
    periode: '2020-03-01/2020-03-31',
    utbetalingsgrad: 0,
    hjemler: [],
    vurderteVilkår: {
      vilkår: {
        [VilkårEnum.NOK_DAGER]: UtfallEnum.UAVKLART,
      },
    },
  };

  const innvilgetPeriode: Uttaksperiode = {
    utfall: UtfallEnum.INNVILGET,
    fraværÅrsak: FraværÅrsakEnum.ORDINÆRT_FRAVÆR,
    periode: '2020-03-01/2020-03-31',
    utbetalingsgrad: 100,
    hjemler: [],
    vurderteVilkår: {
      vilkår: {
        [VilkårEnum.ALDERSVILKÅR_BARN]: UtfallEnum.INNVILGET,
      },
    },
  };

  describe('<FormContent>', () => {
    it('viser kun en checkbox hvis man har minst én uavklart periode', () => {
      const aktiviteter: Aktivitet[] = [
        {
          uttaksperioder: [uavklartPeriode],
          arbeidsforhold: { type: 'AT' },
        },
        {
          uttaksperioder: [innvilgetPeriode],
          arbeidsforhold: { type: 'AT' },
        },
      ];
      const wrapper = shallowWithIntl(
        <FormContent {...reduxFormPropsMock} aktiviteter={aktiviteter} isAksjonspunktOpen />,
      );

      const checkbox = wrapper.find(CheckboxField);
      const radios = wrapper.find(RadioOption);

      expect(checkbox).toHaveLength(1);
      expect(radios).toHaveLength(0);
    });

    it('viser radios hvis man ikke har uavklarte perioder', () => {
      const aktiviteter: Aktivitet[] = [
        {
          uttaksperioder: [innvilgetPeriode],
          arbeidsforhold: { type: 'AT' },
        },
        {
          uttaksperioder: [innvilgetPeriode],
          arbeidsforhold: { type: 'AT' },
        },
      ];
      const wrapper = shallowWithIntl(
        <FormContent {...reduxFormPropsMock} aktiviteter={aktiviteter} isAksjonspunktOpen />,
      );

      const checkbox = wrapper.find(CheckboxField);
      const radios = wrapper.find(RadioOption);

      expect(checkbox).toHaveLength(0);
      expect(radios).toHaveLength(2);
    });
  });

  describe('transformValues', () => {
    it('mapper valg', () => {
      const valgtReBehandling: FormValues = {
        valg: 'reBehandling',
        begrunnelse: 'Nei.',
      };

      const rebehandlingDto = transformValues(valgtReBehandling);

      expect(rebehandlingDto).toEqual([
        {
          fortsettBehandling: false,
          begrunnelse: valgtReBehandling.begrunnelse,
          kode: aksjonspunktCodes.VURDER_ÅRSKVANTUM_KVOTE,
        },
      ]);

      const valgtFortsett: FormValues = {
        valg: 'fortsett',
        begrunnelse: 'Ja.',
      };

      const fortsettDto = transformValues(valgtFortsett);

      expect(fortsettDto).toEqual([
        {
          fortsettBehandling: true,
          begrunnelse: valgtFortsett.begrunnelse,
          kode: aksjonspunktCodes.VURDER_ÅRSKVANTUM_KVOTE,
        },
      ]);
    });

    it('mapper bekreftelse til reBehandling', () => {
      const bekreftelse: FormValues = {
        bekreftInfotrygd: true,
      };

      const mappet = transformValues(bekreftelse);

      expect(mappet).toEqual([
        {
          fortsettBehandling: false,
          kode: aksjonspunktCodes.VURDER_ÅRSKVANTUM_KVOTE,
          begrunnelse: begrunnelseUavklartePerioder,
        },
      ]);
    });
  });
});
