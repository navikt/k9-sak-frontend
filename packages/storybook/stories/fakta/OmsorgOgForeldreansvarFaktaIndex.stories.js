import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import relatertYtelseTilstand from '@fpsak-frontend/kodeverk/src/relatertYtelseTilstand';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import relatertYtelseType from '@fpsak-frontend/kodeverk/src/relatertYtelseType';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import soknadType from '@fpsak-frontend/kodeverk/src/soknadType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import OmsorgOgForeldreansvarFaktaIndex from '@fpsak-frontend/fakta-omsorg-og-foreldreansvar';

import withReduxProvider from '../../decorators/withRedux';

const alleKodeverk = require('../mocks/alleKodeverk.json'); // eslint-disable-line

const behandling = {
  id: 1,
  versjon: 1,
};

const familieHendelse = {
  gjeldende: {
    termindato: '2019-01-01',
    utstedtdato: '2019-01-01',
    antallBarnTermin: 1,
    dokumentasjonForeligger: true,
  },
};

const soknad = {
  fodselsdatoer: { 1: '2019-01-10' },
  utstedtdato: '2019-01-02',
  antallBarn: 1,
  soknadType: {
    kode: soknadType.FODSEL,
  },
  farSokerType: {
    kode: 'ADOPTERER_ALENE',
    kodeverk: 'FAR_SOEKER_TYPE',
  },
};

const personopplysninger = {
  aktoerId: '1',
  navn: 'Espen Utvikler',
  navBrukerKjonn: {
    kode: navBrukerKjonn.KVINNE,
  },
  personstatus: {
    kode: personstatusType.BOSATT,
  },
  barnSoktFor: [],
};
const inntektArbeidYtelse = {
  innvilgetRelatertTilgrensendeYtelserForAnnenForelder: [{
    tilgrensendeYtelserListe: [{
      status: {
        kode: relatertYtelseTilstand.LOPENDE,
      },
      periodeFraDato: '2019-01-01',
    }],
    relatertYtelseType: relatertYtelseType.FORELDREPENGER,
  }],
};
const merknaderFraBeslutter = {
  notAccepted: false,
};

const toggle = (openInfoPanels, togglePanel) => (value) => {
  const exists = openInfoPanels.some((op) => op === value);
  return togglePanel(exists ? [] : [value]);
};

export default {
  title: 'fakta/fakta-omsorg-og-foreldreansvar',
  component: OmsorgOgForeldreansvarFaktaIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visÅpentAksjonspunktForOmsorgovertakelse = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.OMSORGSVILKARET]);
  return (
    <OmsorgOgForeldreansvarFaktaIndex
      behandling={behandling}
      soknad={object('soknad', soknad)}
      familiehendelse={object('familiehendelse', familieHendelse)}
      personopplysninger={object('personopplysninger', personopplysninger)}
      inntektArbeidYtelse={object('inntektArbeidYtelse', inntektArbeidYtelse)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.OMSORGSOVERTAKELSE,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.OMSORGSOVERTAKELSE]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
      alleKodeverk={alleKodeverk}
    />
  );
};

export const visÅpentAksjonspunktForAvklareVilkårForForeldreansvar = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.OMSORGSVILKARET]);
  return (
    <OmsorgOgForeldreansvarFaktaIndex
      behandling={behandling}
      soknad={object('soknad', soknad)}
      familiehendelse={object('familiehendelse', familieHendelse)}
      personopplysninger={object('personopplysninger', personopplysninger)}
      inntektArbeidYtelse={object('inntektArbeidYtelse', inntektArbeidYtelse)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_VILKAR_FOR_FORELDREANSVAR,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.AVKLAR_VILKAR_FOR_FORELDREANSVAR]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
      alleKodeverk={alleKodeverk}
    />
  );
};
