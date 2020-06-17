import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { CheckboxField } from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { InntektstabellPanelImpl } from './InntektstabellPanel';

const { OVERSTYRING_AV_BEREGNINGSGRUNNLAG } = aksjonspunktCodes;

describe('<InntektstabellPanel>', () => {
  it('skal vise checkbox for overstyring', () => {
    const wrapper = shallow(
      <InntektstabellPanelImpl
        fieldArrayID="dummyId"
        key="inntektstabell"
        hjelpeTekstId="hjelpetekst"
        tabell={<span> tabell </span>}
        kanOverstyre
        aksjonspunkter={[]}
        readOnly={false}
        erOverstyrt={false}
      >
        <span>test1</span>
        <span>test2</span>
      </InntektstabellPanelImpl>,
    );
    const checkbox = wrapper.find(CheckboxField);
    expect(checkbox).has.length(1);
  });

  it('skal vise checkbox for overstyring for saksbehandler når overstyrt', () => {
    const wrapper = shallow(
      <InntektstabellPanelImpl
        fieldArrayID="dummyId"
        key="inntektstabell"
        hjelpeTekstId="hjelpetekst"
        tabell={<span> tabell </span>}
        kanOverstyre={false}
        aksjonspunkter={[]}
        readOnly={false}
        erOverstyrt
      >
        <span>test1</span>
        <span>test2</span>
      </InntektstabellPanelImpl>,
    );
    const checkbox = wrapper.find(CheckboxField);
    expect(checkbox).has.length(1);
  });

  it('checkbox skal vere readOnly når man har overstyring aksjonspunkt', () => {
    const wrapper = shallow(
      <InntektstabellPanelImpl
        fieldArrayID="dummyId"
        key="inntektstabell"
        hjelpeTekstId="hjelpetekst"
        tabell={<span> tabell </span>}
        kanOverstyre
        aksjonspunkter={[{ definisjon: { kode: OVERSTYRING_AV_BEREGNINGSGRUNNLAG }, status: { kode: 'OPPR' } }]}
        readOnly={false}
        erOverstyrt={false}
      >
        <span>test1</span>
        <span>test2</span>
      </InntektstabellPanelImpl>,
    );
    const checkbox = wrapper.find(CheckboxField);
    expect(checkbox).has.length(1);
    expect(checkbox.first().prop('readOnly')).to.equal(true);
  });
});
