import React from 'react';
import { Field } from 'redux-form';
import CustomNavSelect from './CustomNavSelect';
import LabelType from './LabelType';
import ReadOnlyField from './ReadOnlyField';
import renderNavField from './renderNavField';

interface SelectFieldProps {
  name: string;
  selectValues: object[];
  label: LabelType;
  validate?: ((value: string) => boolean | undefined)[] | ((value: string) => boolean | undefined);
  readOnly?: boolean;
  placeholder?: string;
  hideValueOnDisable?: boolean;
}

/* eslint-disable-next-line react/prop-types */
const renderReadOnly = () => ({ input, selectValues, ...otherProps }) => {
  /* eslint-disable-next-line react/prop-types */
  const option = selectValues.map(sv => sv.props).find(o => o.value === input.value);
  const value = option ? option.children : undefined;
  return <ReadOnlyField input={{ value }} {...otherProps} />;
};

const renderNavSelect = renderNavField(CustomNavSelect);

const SelectField = ({ name, label, selectValues, validate, readOnly, ...otherProps }: SelectFieldProps) => (
  <Field
    name={name}
    validate={validate}
    component={readOnly ? renderReadOnly() : renderNavSelect}
    label={label}
    selectValues={selectValues}
    disabled={!!readOnly}
    {...otherProps}
    readOnly={readOnly}
    readOnlyHideEmpty
  />
);

SelectField.defaultProps = {
  validate: null,
  readOnly: false,
  placeholder: ' ',
  hideValueOnDisable: false,
};

export default SelectField;
