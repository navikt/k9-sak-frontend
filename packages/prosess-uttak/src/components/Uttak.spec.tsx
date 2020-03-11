import { expect } from 'chai';
import { mapRader } from './Uttak';
import BehandlingPersonMap from './types/BehandlingPersonMap';
import Uttaksplaner from './types/Uttaksplaner';

describe('<UttakPP>', () => {
  const uttaksplaner: Uttaksplaner = {
    '123': {
      perioder: {
        '2020-01-01/2020-01-08': {
          utfall: 'Innvilget',
          grad: 100,
          utbetalingsgrader: [
            {
              arbeidsforhold: {
                type: 'Arbeidstaker',
                organisasjonsnummer: '999999999',
                aktørId: null,
                arbeidsforholdId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              },
              utbetalingsgrad: 75.0,
            },
          ],
        },
        '2020-02-16/2020-02-25': {
          utfall: 'Avslått',
          årsaker: [
            {
              årsak: 'IkkeMedlemIFolketrygden',
              hjemler: [
                {
                  henvisning: 'Folketrygdloven LOV-1997-02-28-19 Kapittel 2',
                  anvendelse: 'Fastsatt at personen ikke er medlem av folketrygden i perioden.',
                },
              ],
            },
          ],
        },
      },
    },
    '456': {
      perioder: {
        '2020-01-29/2020-02-15': {
          utfall: 'Innvilget',
          årsak: 'AvkortetMotInntekt',
          hjemler: [],
          grad: 80,
          utbetalingsgrader: [
            {
              arbeidsforhold: {
                type: 'Arbeidstaker',
                organisasjonsnummer: '999999999',
                aktørId: null,
                arbeidsforholdId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              },
              utbetalingsgrad: 80.0,
            },
          ],
        },
      },
    },
  };

  const behandlingPersonMap: BehandlingPersonMap = {
    123: {
      kjønnkode: 'K',
      fnr: '12312312312',
    },
    456: {
      kjønnkode: 'M',
      fnr: '45645645645',
    },
  };

  it('mapper periodeformat', () => {
    const mappet = mapRader(uttaksplaner, behandlingPersonMap, { formatMessage: () => 'gradering' });

    const expected = [
      {
        ikon: {
          imageText: 'gradering',
          title: 'gradering',
          src: {},
        },
        id: '123',
        perioder: [
          {
            fom: '2020-01-01',
            tom: '2020-01-08',
            id: '123-0',
            hoverText: '100% gradering',
            className: 'godkjentPeriode',
            periodeinfo: {
              utfall: 'Innvilget',
              grad: 100,
              utbetalingsgrader: [
                {
                  arbeidsforhold: {
                    type: 'Arbeidstaker',
                    organisasjonsnummer: '999999999',
                    aktørId: null,
                    arbeidsforholdId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                  },
                  utbetalingsgrad: 75,
                },
              ],
              behandlingsId: '123',
            },
          },
          {
            fom: '2020-02-16',
            tom: '2020-02-25',
            id: '123-1',
            hoverText: 'undefined% gradering',
            className: 'avvistPeriode',
            periodeinfo: {
              utfall: 'Avslått',
              årsaker: [
                {
                  årsak: 'IkkeMedlemIFolketrygden',
                  hjemler: [
                    {
                      henvisning: 'Folketrygdloven LOV-1997-02-28-19 Kapittel 2',
                      anvendelse: 'Fastsatt at personen ikke er medlem av folketrygden i perioden.',
                    },
                  ],
                },
              ],
              behandlingsId: '123',
            },
          },
        ],
      },
      {
        ikon: {
          imageText: 'gradering',
          title: 'gradering',
          src: {},
        },
        id: '456',
        perioder: [
          {
            fom: '2020-01-29',
            tom: '2020-02-15',
            id: '456-0',
            hoverText: '80% gradering',
            className: 'gradert godkjentPeriode',
            periodeinfo: {
              utfall: 'Innvilget',
              årsak: 'AvkortetMotInntekt',
              hjemler: [],
              grad: 80,
              utbetalingsgrader: [
                {
                  arbeidsforhold: {
                    type: 'Arbeidstaker',
                    organisasjonsnummer: '999999999',
                    aktørId: null,
                    arbeidsforholdId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                  },
                  utbetalingsgrad: 80,
                },
              ],
              behandlingsId: '456',
            },
          },
        ],
      },
    ];
    expect(mappet).to.eql(expected);
  });
});
