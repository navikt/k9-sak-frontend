import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import sinon from 'sinon';
import { FormattedMessage } from 'react-intl';
import { AksjonspunktHelpText } from '@fpsak-frontend/shared-components';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { UttakPerioder } from './UttakPerioder';
import UttakSlettPeriodeModal from './UttakSlettPeriodeModal';
import UttakNyPeriode from './UttakNyPeriode';

const reduxFormChange = sinon.spy();
const reduxFormReset = sinon.spy();

describe('<UttakPerioder>', () => {
  it('skal vise uttak UttakPerioder', () => {
    const wrapper = shallowWithIntl(
      <UttakPerioder
        readOnly
        hasOpenAksjonspunkter
        inntektsmeldinger={[]}
        nyPeriode={{}}
        behandlingFormPrefix="UttakFaktaForm"
        perioder={[]}
        reduxFormChange={reduxFormChange}
        reduxFormReset={reduxFormReset}
        periodeTyper={[]}
        utsettelseArsaker={[]}
        uttakPeriodeVurderingTyper={[]}
        initialValues={{}}
        slettedePerioder={[]}
        aksjonspunkter={[]}
        førsteUttaksDato="2018-01-12"
        submitting={false}
        openForms={false}
        kanOverstyre={false}
        hasRevurderingOvertyringAp={false}
      />,
    );

    const fieldArray = wrapper.find('FieldArray');
    const verticalSpacer = wrapper.find('VerticalSpacer');
    const flexContainer = wrapper.find('FlexContainer');
    const flexRow = wrapper.find('FlexRow');
    const flexColumn = wrapper.find('FlexColumn');
    const element = wrapper.find('Element');
    const formattedMessage = wrapper.find('FormattedMessage');
    const uttakNyPeriode = wrapper.find('UttakNyPeriode');
    const uttakSlettPeriodeModal = wrapper.find('UttakSlettPeriodeModal');
    expect(fieldArray).to.have.length(1);
    expect(verticalSpacer).to.have.length(3);
    expect(flexContainer).to.have.length(2);
    expect(flexRow).to.have.length(2);
    expect(flexColumn).to.have.length(3);
    expect(element).to.have.length(1);
    expect(formattedMessage).to.have.length(3);
    expect(uttakNyPeriode).to.have.length(0);
    expect(uttakSlettPeriodeModal).to.have.length(0);
  });

  it('skal vise UttakNyPeriode og disable knapper når isNyPeriodeFormOpen er true', () => {
    const wrapper = shallowWithIntl(
      <UttakPerioder
        readOnly
        hasOpenAksjonspunkter
        inntektsmeldinger={[]}
        nyPeriode={{}}
        behandlingFormPrefix="UttakFaktaForm"
        perioder={[]}
        reduxFormChange={reduxFormChange}
        reduxFormReset={reduxFormReset}
        periodeTyper={[]}
        utsettelseArsaker={[]}
        uttakPeriodeVurderingTyper={[]}
        initialValues={{}}
        slettedePerioder={[]}
        aksjonspunkter={[]}
        førsteUttaksDato="2018-01-12"
        submitting={false}
        openForms={false}
        kanOverstyre={false}
        hasRevurderingOvertyringAp={false}
      />,
    );

    wrapper.setState({ isNyPeriodeFormOpen: true });
    const fieldArray = wrapper.find('FieldArray');
    const flexContainer = wrapper.find('FlexContainer');
    const uttakSlettPeriodeModal = wrapper.find('UttakSlettPeriodeModal');
    const uttakNyPeriode = wrapper.find(UttakNyPeriode);
    const hovedknapp = wrapper.find(Hovedknapp);
    const knapp = wrapper.find(Knapp);
    expect(hovedknapp.prop('disabled')).is.equal(true);
    expect(knapp.prop('disabled')).is.equal(true);
    expect(fieldArray).to.have.length(1);
    expect(flexContainer).to.have.length(2);
    expect(uttakSlettPeriodeModal).to.have.length(0);
    expect(uttakNyPeriode).to.have.length(1);
  });

  it('skal vise UttakSlettPeriodeModal når showModalSlettPeriode er true', () => {
    const wrapper = shallowWithIntl(
      <UttakPerioder
        readOnly
        hasOpenAksjonspunkter
        inntektsmeldinger={[]}
        nyPeriode={{}}
        behandlingFormPrefix="UttakFaktaForm"
        perioder={[]}
        reduxFormChange={reduxFormChange}
        reduxFormReset={reduxFormReset}
        periodeTyper={[]}
        utsettelseArsaker={[]}
        uttakPeriodeVurderingTyper={[]}
        initialValues={{}}
        slettedePerioder={[]}
        aksjonspunkter={[]}
        førsteUttaksDato="2018-01-12"
        submitting={false}
        openForms
        kanOverstyre={false}
        hasRevurderingOvertyringAp={false}
      />,
    );

    wrapper.setState({ showModalSlettPeriode: true });
    const fieldArray = wrapper.find('FieldArray');
    const flexContainer = wrapper.find('FlexContainer');
    const uttakNyPeriode = wrapper.find('UttakNyPeriode');
    const uttakSlettPeriodeModal = wrapper.find(UttakSlettPeriodeModal);
    expect(fieldArray).to.have.length(1);
    expect(flexContainer).to.have.length(2);
    expect(uttakNyPeriode).to.have.length(0);
    expect(uttakSlettPeriodeModal).to.have.length(1);
  });

  it('skal disable knapper når disableButtons er true', () => {
    const wrapper = shallowWithIntl(
      <UttakPerioder
        readOnly
        hasOpenAksjonspunkter
        inntektsmeldinger={[]}
        nyPeriode={{}}
        behandlingFormPrefix="UttakFaktaForm"
        perioder={[]}
        reduxFormChange={reduxFormChange}
        reduxFormReset={reduxFormReset}
        periodeTyper={[]}
        utsettelseArsaker={[]}
        uttakPeriodeVurderingTyper={[]}
        initialValues={{}}
        slettedePerioder={[]}
        aksjonspunkter={[]}
        førsteUttaksDato="2018-01-12"
        submitting={false}
        openForms
        kanOverstyre={false}
        hasRevurderingOvertyringAp={false}
      />,
    );

    const hovedknapp = wrapper.find(Hovedknapp);
    const knapp = wrapper.find(Knapp);
    expect(hovedknapp.prop('disabled')).is.equal(true);
    expect(knapp.prop('disabled')).is.equal(true);
  });

  it('skal disable knapper når readOnly er true', () => {
    const wrapper = shallowWithIntl(
      <UttakPerioder
        readOnly
        hasOpenAksjonspunkter
        inntektsmeldinger={[]}
        nyPeriode={{}}
        behandlingFormPrefix="UttakFaktaForm"
        perioder={[]}
        reduxFormChange={reduxFormChange}
        reduxFormReset={reduxFormReset}
        periodeTyper={[]}
        utsettelseArsaker={[]}
        uttakPeriodeVurderingTyper={[]}
        initialValues={{}}
        slettedePerioder={[]}
        aksjonspunkter={[]}
        førsteUttaksDato="2018-01-12"
        submitting={false}
        openForms={false}
        kanOverstyre={false}
        hasRevurderingOvertyringAp={false}
      />,
    );

    const hovedknapp = wrapper.find(Hovedknapp);
    const knapp = wrapper.find(Knapp);
    expect(hovedknapp.prop('disabled')).is.equal(true);
    expect(knapp.prop('disabled')).is.equal(true);
  });

  it('skal ikke disable knapper når openForms og readOnly er false', () => {
    const wrapper = shallowWithIntl(
      <UttakPerioder
        readOnly={false}
        hasOpenAksjonspunkter
        inntektsmeldinger={[]}
        nyPeriode={{}}
        behandlingFormPrefix="UttakFaktaForm"
        perioder={[]}
        reduxFormChange={reduxFormChange}
        reduxFormReset={reduxFormReset}
        periodeTyper={[]}
        utsettelseArsaker={[]}
        uttakPeriodeVurderingTyper={[]}
        initialValues={{}}
        slettedePerioder={[]}
        aksjonspunkter={[]}
        førsteUttaksDato="2018-01-12"
        submitting={false}
        openForms={false}
        kanOverstyre={false}
        isDirty
        behandlingPaaVent={false}
        hasRevurderingOvertyringAp={false}
      />,
    );

    const hovedknapp = wrapper.find(Hovedknapp);
    const knapp = wrapper.find(Knapp);
    expect(hovedknapp.prop('disabled')).is.equal(false);
    expect(knapp.prop('disabled')).is.equal(false);
  });

  it('skal vise AksjonspunktHelpText når readOnly er false', () => {
    const wrapper = shallowWithIntl(
      <UttakPerioder
        readOnly={false}
        hasOpenAksjonspunkter
        inntektsmeldinger={[]}
        nyPeriode={{}}
        behandlingFormPrefix="UttakFaktaForm"
        perioder={[]}
        reduxFormChange={reduxFormChange}
        reduxFormReset={reduxFormReset}
        periodeTyper={[]}
        utsettelseArsaker={[]}
        uttakPeriodeVurderingTyper={[]}
        initialValues={{}}
        slettedePerioder={[]}
        aksjonspunkter={[
          {
            aksjonspunktType: {
              kode: 'MANU',
              navn: 'Manuell',
              kodeverk: 'AKSJONSPUNKT_TYPE',
            },
            begrunnelse: null,
            besluttersBegrunnelse: null,
            definisjon: {
              kode: '5071',
              navn: 'Fastsett uttaksperioder manuelt',
            },
            erAktivt: true,
            kanLoses: true,
            status: {
              kode: 'OPPR',
              navn: 'Opprettet',
              kodeverk: 'AKSJONSPUNKT_STATUS',
            },
            toTrinnsBehandling: true,
            toTrinnsBehandlingGodkjent: null,
            vilkarType: null,
            vurderPaNyttArsaker: [],
          },
        ]}
        førsteUttaksDato="2018-01-12"
        submitting={false}
        openForms={false}
        kanOverstyre={false}
        hasRevurderingOvertyringAp={false}
      />,
    );

    const aksjonspunktHelpText = wrapper.find(AksjonspunktHelpText);
    expect(aksjonspunktHelpText).to.have.length(1);
    const formattedMessage = aksjonspunktHelpText.find(FormattedMessage);
    expect(formattedMessage.prop('id')).to.eql('UttakInfoPanel.Aksjonspunkt.5071');
    expect(formattedMessage.prop('values')).to.eql({ value: '12.01.2018' });
  });

  it('skal vise nyPeriode skjema onClick på knappen', () => {
    const wrapper = shallowWithIntl(
      <UttakPerioder
        readOnly={false}
        hasOpenAksjonspunkter
        inntektsmeldinger={[]}
        nyPeriode={{}}
        behandlingFormPrefix="UttakFaktaForm"
        perioder={[]}
        reduxFormChange={reduxFormChange}
        reduxFormReset={reduxFormReset}
        periodeTyper={[]}
        utsettelseArsaker={[]}
        uttakPeriodeVurderingTyper={[]}
        initialValues={{}}
        slettedePerioder={[]}
        aksjonspunkter={[]}
        førsteUttaksDato="2018-01-12"
        submitting={false}
        openForms={false}
        kanOverstyre={false}
        hasRevurderingOvertyringAp={false}
      />,
    );

    const knapp = wrapper.find(Knapp);
    expect(knapp.length).to.equal(1);
    knapp.simulate('click');
    wrapper.update();
    const uttakNyPeriode = wrapper.find(UttakNyPeriode);
    expect(uttakNyPeriode.length).to.equal(1);
  });
});
