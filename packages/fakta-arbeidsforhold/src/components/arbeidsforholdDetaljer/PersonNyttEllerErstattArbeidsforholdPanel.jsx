import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { required } from '@fpsak-frontend/utils';
import { ArrowBox } from '@fpsak-frontend/shared-components';
import { RadioGroupField, RadioOption, SelectField } from '@fpsak-frontend/form';

import { arbeidsforholdPropType } from '@fpsak-frontend/prop-types';
import BehandlingFormFieldCleaner from '../../util/BehandlingFormFieldCleaner';

const getEndCharFromId = id => id.substring(id.length - 4, id.length);

const PersonNyttEllerErstattArbeidsforholdPanel = ({
  intl,
  readOnly,
  isErstattArbeidsforhold,
  arbeidsforholdList,
  formName,
  behandlingId,
  behandlingVersjon,
}) => (
  <BehandlingFormFieldCleaner
    formName={formName}
    fieldNames={['erNyttArbeidsforhold', 'erstatterArbeidsforholdId']}
    behandlingId={behandlingId}
    behandlingVersjon={behandlingVersjon}
  >
    <ArrowBox alignLeft>
      <RadioGroupField name="erNyttArbeidsforhold" validate={[required]} direction="vertical" readOnly={readOnly}>
        <RadioOption
          label={intl.formatMessage({ id: 'PersonNyttEllerErstattArbeidsforholdPanel.NyttArbeidsforhold' })}
          value
        />
        <RadioOption
          label={intl.formatMessage({ id: 'PersonNyttEllerErstattArbeidsforholdPanel.ErstattArbeidsforhold' })}
          value={false}
        />
      </RadioGroupField>
      {isErstattArbeidsforhold && (
        <SelectField
          name="erstatterArbeidsforholdId"
          label={intl.formatMessage({ id: 'PersonNyttEllerErstattArbeidsforholdPanel.SelectArbeidsforhold' })}
          placeholder={intl.formatMessage({ id: 'PersonNyttEllerErstattArbeidsforholdPanel.ChooseArbeidsforhold' })}
          validate={[required]}
          selectValues={arbeidsforholdList.map(a => (
            <option key={a.arbeidsgiverIdentifikator + a.arbeidsforholdId} value={a.id}>
              {`${a.navn}(${a.arbeidsgiverIdentifiktorGUI})...${getEndCharFromId(a.arbeidsforholdId)}`}
            </option>
          ))}
          bredde="xl"
          readOnly={readOnly}
        />
      )}
    </ArrowBox>
  </BehandlingFormFieldCleaner>
);

PersonNyttEllerErstattArbeidsforholdPanel.propTypes = {
  intl: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  isErstattArbeidsforhold: PropTypes.bool.isRequired,
  arbeidsforholdList: PropTypes.arrayOf(arbeidsforholdPropType).isRequired,
  formName: PropTypes.string.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
};

export default injectIntl(PersonNyttEllerErstattArbeidsforholdPanel);
