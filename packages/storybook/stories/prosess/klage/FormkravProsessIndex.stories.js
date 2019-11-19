import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import klageVurderingCodes from '@fpsak-frontend/kodeverk/src/klageVurdering';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import FormkravProsessIndex from '@fpsak-frontend/prosess-formkrav';

import withReduxProvider from '../../../decorators/withRedux';

const alleKodeverk = require('../../mocks/alleKodeverk.json'); // eslint-disable-line

const behandling = {
  id: 1,
  versjon: 1,
  sprakkode: {
    kode: 'NO',
  },
};

const avsluttedeBehandlinger = [{
  id: 1,
  type: {
    kode: behandlingType.FORSTEGANGSSOKNAD,
  },
  avsluttet: '2017-08-02T00:54:25.455',
}];

export default {
  title: 'prosess/klage/prosess-formkrav',
  component: FormkravProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visFormkravPanelForAksjonspunktNfp = () => (
  <FormkravProsessIndex
    behandling={behandling}
    klageVurdering={object('klageVurdering', {
      klageVurderingResultatNK: {
        klageVurdertAv: 'NK',
        klageVurdering: klageVurderingCodes.AVVIS_KLAGE,
        fritekstTilBrev: 'test',
        klageMedholdArsakNavn: 'TEST',
        godkjentAvMedunderskriver: false,
      },
      klageFormkravResultatKA: {
        avvistArsaker: [{
          navn: 'Denne er avvist fordi...',
        }],
      },
    })}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    readOnlySubmitButton={boolean('readOnly', false)}
    alleKodeverk={alleKodeverk}
    avsluttedeBehandlinger={avsluttedeBehandlinger}
    apCodes={[aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP]}
  />
);

export const visFormkravPanelForAksjonspunktKa = () => (
  <FormkravProsessIndex
    behandling={behandling}
    klageVurdering={object('klageVurdering', {
      klageVurderingResultatNK: {
        klageVurdertAv: 'NK',
        klageVurdering: klageVurderingCodes.AVVIS_KLAGE,
        fritekstTilBrev: 'test',
        klageMedholdArsakNavn: 'TEST',
        godkjentAvMedunderskriver: false,
      },
      klageFormkravResultatKA: {
        avvistArsaker: [{
          navn: 'Denne er avvist fordi...',
        }],
      },
    })}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    readOnlySubmitButton={boolean('readOnly', false)}
    alleKodeverk={alleKodeverk}
    avsluttedeBehandlinger={avsluttedeBehandlinger}
    apCodes={[aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA]}
  />
);
