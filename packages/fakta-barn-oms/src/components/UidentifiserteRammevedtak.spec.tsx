import React from 'react';
import { Rammevedtak, RammevedtakEnum } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
import { shallowWithIntl } from '../../i18n';
import UidentifiserteRammevedtak from './UidentifiserteRammevedtak';

describe('<UidentifiserteRammevedtak>', () => {
  const utvidetRettManglendeFnr: Rammevedtak = {
    type: RammevedtakEnum.UTVIDET_RETT,
    gyldigFraOgMed: '2020-01-01',
    gyldigTilOgMed: '2028-12-31',
    fritekst: '@9-6 2 L UTV.OMSD*20/',
  };

  const aleneOmOmsorgenManglendeFnr: Rammevedtak = {
    type: RammevedtakEnum.ALENEOMSORG,
    gyldigFraOgMed: '2020-01-01',
    gyldigTilOgMed: '2020-12-31',
    fritekst: '@9-6 2 L AL.OMSD*10/',
  };

  const fosterbarnManglendeFnr: Rammevedtak = {
    type: RammevedtakEnum.FOSTERBARN,
    gyldigFraOgMed: '2020-01-01',
    gyldigTilOgMed: '2020-12-31',
    fritekst: '@9-6 2 L FOST/',
  };

  it('rendrer uidentifiserte vedtak for gitte kriterier', () => {
    const rammevedtak: Rammevedtak[] = [
      utvidetRettManglendeFnr,
      utvidetRettManglendeFnr,
      utvidetRettManglendeFnr,
      aleneOmOmsorgenManglendeFnr,
      aleneOmOmsorgenManglendeFnr,
      fosterbarnManglendeFnr,
    ];

    const utvidetRett = shallowWithIntl(
      <UidentifiserteRammevedtak rammevedtak={rammevedtak} type={RammevedtakEnum.UTVIDET_RETT} />,
    );
    expect(utvidetRett.find('li')).toHaveLength(3);

    const aleneomsorg = shallowWithIntl(
      <UidentifiserteRammevedtak rammevedtak={rammevedtak} type={RammevedtakEnum.ALENEOMSORG} />,
    );
    expect(aleneomsorg.find('li')).toHaveLength(2);

    const fosterbarn = shallowWithIntl(
      <UidentifiserteRammevedtak rammevedtak={rammevedtak} type={RammevedtakEnum.FOSTERBARN} />,
    );
    expect(fosterbarn.find('li')).toHaveLength(1);
  });
});
