import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  withKnobs, object, boolean, array,
} from '@storybook/addon-knobs';

import tilbakekrevingVidereBehandling from '@fpsak-frontend/kodeverk/src/tilbakekrevingVidereBehandling';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import AvregningProsessIndex from '@fpsak-frontend/prosess-avregning';

import withReduxProvider from '../../decorators/withRedux';

const fagsak = {
  saksnummer: 123,
  ytelseType: {
    kode: fagsakYtelseType.FORELDREPENGER,
  },
};

const behandling = {
  id: 1,
  versjon: 1,
  sprakkode: {
    kode: 'NO',
  },
};

const simuleringResultat = {
  simuleringResultat: {
    periodeFom: '2019-01-01',
    periodeTom: '2019-03-31',
    sumEtterbetaling: 0,
    sumFeilutbetaling: -49863,
    sumInntrekk: -10899,
    ingenPerioderMedAvvik: false,
    perioderPerMottaker: [{
      mottakerType: {
        kode: 'BRUKER',
        navn: null,
        kodeverk: 'MOTTAKER_TYPE',
      },
      mottakerNummer: null,
      mottakerNavn: null,
      resultatPerFagområde: [{
        fagOmrådeKode: {
          kode: 'FP',
          navn: 'Foreldrepenger',
          kodeverk: 'FAG_OMRAADE_KODE',
        },
        rader: [{
          feltnavn: 'nyttBeløp',
          resultaterPerMåned: [{
            periode: {
              fom: '2019-01-01',
              tom: '2019-01-31',
            },
            beløp: 52619,
          }],
        }, {
          feltnavn: 'tidligereUtbetalt',
          resultaterPerMåned: [{
            periode: {
              fom: '2019-01-01',
              tom: '2019-01-31',
            },
            beløp: 61795,
          }],
        }, {
          feltnavn: 'differanse',
          resultaterPerMåned: [{
            periode: {
              fom: '2019-01-01',
              tom: '2019-01-31',
            },
            beløp: -9176,
          }],
        }],
      }],
      resultatOgMotregningRader: [{
        feltnavn: 'inntrekkNesteMåned',
        resultaterPerMåned: [{
          periode: {
            fom: '2019-01-01',
            tom: '2019-01-31',
          },
          beløp: 0,
        }],
      }, {
        feltnavn: 'resultat',
        resultaterPerMåned: [{
          periode: {
            fom: '2019-01-01',
            tom: '2019-01-31',
          },
          beløp: -26486,
        }],
      }],
      nesteUtbPeriodeFom: '2019-10-01',
      nestUtbPeriodeTom: '2019-10-31',
    }],
  },
  simuleringResultatUtenInntrekk: null,
  slåttAvInntrekk: false,
};

const tilbakekrevingvalg = {
  videreBehandling: {
    kode: tilbakekrevingVidereBehandling.TILBAKEKR_OPPDATER,
  },
  varseltekst: 'varsel-eksempel',
};

const toggles = {
  'fpsak.simuler-oppdrag-varseltekst': true,
};

const stories = storiesOf('prosess/AvregningProsessIndex', module)
  .addDecorator(withKnobs)
  .addDecorator(withReduxProvider);

stories.add('Vis aksjonspunkt VURDER_INNTREKK (5084)', () => (
  <AvregningProsessIndex
    fagsak={object('fagsak', fagsak)}
    behandling={behandling}
    aksjonspunkter={object('aksjonspunkter', [{
      definisjon: {
        kode: aksjonspunktCodes.VURDER_FEILUTBETALING,
      },
      begrunnelse: 'test',
    }])}
    simuleringResultat={object('simuleringResultat', simuleringResultat)}
    tilbakekrevingvalg={object('tilbakekrevingvalg', tilbakekrevingvalg)}
    submitCallback={action('button-click')}
    previewCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    isApOpen={boolean('isApOpen', true)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', false)}
    apCodes={array('apCodes', [aksjonspunktCodes.VURDER_FEILUTBETALING])}
    featureToggles={toggles}
  />
));

stories.add('Vis aksjonspunkt VURDER_INNTREKK (5085)', () => (
  <AvregningProsessIndex
    fagsak={object('fagsak', fagsak)}
    behandling={behandling}
    aksjonspunkter={object('aksjonspunkter', [{
      definisjon: {
        kode: aksjonspunktCodes.VURDER_INNTREKK,
      },
      begrunnelse: 'test',
    }])}
    simuleringResultat={object('simuleringResultat', simuleringResultat)}
    tilbakekrevingvalg={object('tilbakekrevingvalg', tilbakekrevingvalg)}
    submitCallback={action('button-click')}
    previewCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    isApOpen={boolean('isApOpen', true)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', false)}
    apCodes={array('apCodes', [aksjonspunktCodes.VURDER_INNTREKK])}
    featureToggles={toggles}
  />
));
