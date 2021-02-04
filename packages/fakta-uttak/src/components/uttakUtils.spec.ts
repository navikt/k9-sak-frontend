import ArbeidsforholdPeriode from './types/ArbeidsforholdPeriode';
import { arbeidsprosentNormal, beregnNyePerioder, visningsdato } from './uttakUtils';

describe('beregner nye perioder fra en periodeendring', () => {
  const periode1 = {
    fom: '2020-01-01',
    tom: '2020-01-31',
    timerIJobbTilVanlig: 30,
    timerFårJobbet: 20,
  };
  const periode2 = {
    fom: '2020-02-01',
    tom: '2020-02-29',
    timerIJobbTilVanlig: 30,
    timerFårJobbet: 20,
  };

  const perioder: ArbeidsforholdPeriode[] = [periode1, periode2];

  it('ny periode innenfor en eksisterende, splitter opp den eksisterende', () => {
    const periodeInniFørstePeriode: ArbeidsforholdPeriode = {
      fom: '2020-01-07',
      tom: '2020-01-14',
      timerIJobbTilVanlig: 20,
      timerFårJobbet: 10,
    };

    const nyePerioder = beregnNyePerioder(perioder, periodeInniFørstePeriode);

    expect(nyePerioder).toHaveLength(4);
    expect(nyePerioder[0]).toEqual({
      ...periode1,
      tom: '2020-01-06',
    });
    expect(nyePerioder[1]).toEqual(periodeInniFørstePeriode);
    expect(nyePerioder[2]).toEqual({
      ...periode1,
      fom: '2020-01-15',
    });
    expect(nyePerioder[3]).toEqual(periode2);
  });

  it('ny periode lik eksisterende, erstatter den eksisterende', () => {
    const nyPeriode: ArbeidsforholdPeriode = {
      ...periode2,
      timerIJobbTilVanlig: 40,
      timerFårJobbet: 50,
    };

    const nyePerioder = beregnNyePerioder(perioder, nyPeriode);

    expect(nyePerioder).toHaveLength(2);
    expect(nyePerioder[0]).toEqual(periode1);
    expect(nyePerioder[1]).toEqual(nyPeriode);
  });

  it('ny periode som overlapper eksisterende periode, overksriver overlappende del', () => {
    const nyPeriode: ArbeidsforholdPeriode = {
      fom: '2020-01-15',
      tom: '2020-02-15',
      timerIJobbTilVanlig: 10,
      timerFårJobbet: 50,
    };

    const nyePerioder = beregnNyePerioder(perioder, nyPeriode);

    expect(nyePerioder).toHaveLength(3);
    expect(nyePerioder[0]).toEqual({
      ...periode1,
      tom: '2020-01-14',
    });
    expect(nyePerioder[1]).toEqual(nyPeriode);
    expect(nyePerioder[2]).toEqual({
      ...periode2,
      fom: '2020-02-16',
    });
  });

  it('ny periode starter før første og slutter etter siste eksisterende perioder, erstatter alt', () => {
    const nyPeriode: ArbeidsforholdPeriode = {
      fom: '2019-01-01',
      tom: '2021-01-01',
      timerIJobbTilVanlig: 50,
      timerFårJobbet: 50,
    };

    const nyePerioder = beregnNyePerioder(perioder, nyPeriode);

    expect(nyePerioder).toEqual([nyPeriode]);
  });

  it('ny periode legges til mellom perioder', () => {
    const eksiterendePerioder: ArbeidsforholdPeriode[] = [
      {
        fom: '2019-02-02',
        tom: '2019-03-02',
        timerIJobbTilVanlig: 20,
        timerFårJobbet: 20,
      },
      {
        fom: '2019-04-01',
        tom: '2019-05-02',
        timerIJobbTilVanlig: 40,
        timerFårJobbet: 40,
      },
    ];

    const nyPeriode: ArbeidsforholdPeriode = {
      fom: '2019-03-13',
      tom: '2019-03-13',
      timerIJobbTilVanlig: 50,
      timerFårJobbet: 50,
    };

    const nyePerioder = beregnNyePerioder(eksiterendePerioder, nyPeriode);

    expect(nyePerioder).toEqual([eksiterendePerioder[0], nyPeriode, eksiterendePerioder[1]]);
  });
});

describe('visningsdato', () => {
  it('formaterer ISO-dato til visningsdato', () => {
    const isodato = '2020-03-14';

    const visning = visningsdato(isodato);

    expect(visning).toBe('14.03.2020');
  });
});

describe('arbeidsprosent', () => {
  it('regner ut prosent i forhold normaluke på 37,5 timer og formaterer med 1 desimal hvis det finnes', () => {
    const test1 = 20;
    const resultat1 = arbeidsprosentNormal(test1);
    expect(resultat1).toBe('53.3');

    const test2 = 37.5;
    const resultat2 = arbeidsprosentNormal(test2);
    expect(resultat2).toBe('100');

    const test3 = 15;
    const resultat3 = arbeidsprosentNormal(test3);
    expect(resultat3).toBe('40');
  });
});
