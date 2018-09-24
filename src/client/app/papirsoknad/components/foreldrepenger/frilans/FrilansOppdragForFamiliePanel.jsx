import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FieldArray, formValueSelector } from 'redux-form';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import ElementWrapper from '@fpsak-frontend/shared-components/ElementWrapper';
import VerticalSpacer from '@fpsak-frontend/shared-components/VerticalSpacer';
import ArrowBox from '@fpsak-frontend/shared-components/ArrowBox';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import FrilansOppdragForFamilieFieldArray, { defaultFrilansPeriode } from './FrilansOppdragForFamilieFieldArray';

/**
 * FrilansOppdragForFamiliePanel
 *
 * Presentasjonskomponent.
 */
export const FrilansOppdragForFamiliePanelImpl = ({
  intl,
  readOnly,
  harHattOppdragForFamilie,
}) => (
  <ElementWrapper>
    <RadioGroupField
      name="harHattOppdragForFamilie"
      readOnly={readOnly}
      label={<FormattedMessage id="Registrering.FrilansOppdrag.HarHattOppdragForFamilie" />}
    >
      <RadioOption label={intl.formatMessage({ id: 'Registrering.FrilansOppdrag.Yes' })} value />
      <RadioOption label={intl.formatMessage({ id: 'Registrering.FrilansOppdrag.No' })} value={false} />
    </RadioGroupField>
    {harHattOppdragForFamilie
      && (
      <ArrowBox>
        <Normaltekst><FormattedMessage id="Registrering.FrilansOppdrag.OppgiPeriode" /></Normaltekst>
        <VerticalSpacer space={2} />
        <FieldArray name="oppdragPerioder" component={FrilansOppdragForFamilieFieldArray} readOnly={readOnly} />
      </ArrowBox>
      )
    }
  </ElementWrapper>
);

FrilansOppdragForFamiliePanelImpl.propTypes = {
  intl: intlShape.isRequired,
  readOnly: PropTypes.bool.isRequired,
  harHattOppdragForFamilie: PropTypes.bool,
};

FrilansOppdragForFamiliePanelImpl.defaultProps = {
  harHattOppdragForFamilie: undefined,
};

const mapStateToProps = (state, ownProps) => ({
  harHattOppdragForFamilie: formValueSelector(ownProps.formName)(state, ownProps.namePrefix).harHattOppdragForFamilie,
});

const FrilansOppdragForFamiliePanel = connect(mapStateToProps)(injectIntl(FrilansOppdragForFamiliePanelImpl));

FrilansOppdragForFamiliePanel.buildInitialValues = () => ({
  oppdragPerioder: [defaultFrilansPeriode],
});

FrilansOppdragForFamiliePanel.validate = values => ({
  oppdragPerioder: FrilansOppdragForFamilieFieldArray.validate(values),
});

export default FrilansOppdragForFamiliePanel;
