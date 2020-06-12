import React from 'react';
import BeregningForm2 from './beregningForm/BeregningForm';

const BeregningsgrunnlagFieldArrayComponent = ({
  fields,
  harFlereBeregningsgrunnlag,
  initialValues,
  aktivtBeregningsgrunnlagIndeks,
  aktivtBeregningsgrunnlag,
  gjeldendeAksjonspunkter,
  relevanteStatuser,
  submitCallback,
  readOnlySubmitButton,
  alleKodeverk,
  behandling: { id, versjon },
  readOnly,
  vilkaarBG,
}) => {
  if (fields.length === 0) {
    if (harFlereBeregningsgrunnlag) {
      // eslint-disable-next-line
      initialValues.forEach(initialValueObject => {
        fields.push(initialValueObject);
      });
    } else {
      fields.push(initialValues[0]);
    }
  }
  return fields.map((fieldId, index) =>
    index === aktivtBeregningsgrunnlagIndeks ? (
      <BeregningForm2
        readOnly={readOnly}
        fieldArrayID={fieldId}
        beregningsgrunnlag={aktivtBeregningsgrunnlag}
        gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
        relevanteStatuser={relevanteStatuser}
        submitCallback={submitCallback}
        readOnlySubmitButton={readOnlySubmitButton}
        alleKodeverk={alleKodeverk}
        behandlingId={id}
        behandlingVersjon={versjon}
        vilkaarBG={vilkaarBG}
        initialValues={initialValues[index]}
      />
    ) : null,
  );
};

export default BeregningsgrunnlagFieldArrayComponent;