import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import { VerticalSpacer, FlexContainer, FlexRow, FlexColumn, Image } from '@fpsak-frontend/shared-components';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { DatepickerField, RadioGroupField, RadioOption, SelectField } from '@fpsak-frontend/form';

import { hasValidDate, isRequiredMessage, required } from '@fpsak-frontend/utils';
import avslattImage from '@fpsak-frontend/assets/images/avslaatt.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/check.svg';

import styles from './vilkarResultPicker.less';

const findRadioButtonTextCode = (customVilkarText, isVilkarOk) => {
  if (customVilkarText) {
    return customVilkarText.id;
  }
  return isVilkarOk ? 'VilkarResultPicker.VilkarOppfylt' : 'VilkarResultPicker.VilkarIkkeOppfylt';
};

/**
 * VilkarResultPicker
 *
 * Presentasjonskomponent. Lar NAV-ansatt velge om vilkåret skal oppfylles eller avvises.
 */
const VilkarResultPickerImpl = ({
  intl,
  avslagsarsaker,
  erVilkarOk,
  customVilkarIkkeOppfyltText,
  customVilkarOppfyltText,
  readOnly,
  erMedlemskapsPanel,
  fieldNamePrefix,
}) => (
  <div className={styles.container}>
    <VerticalSpacer sixteenPx />
    {readOnly && erVilkarOk !== undefined && (
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <Image className={styles.image} src={erVilkarOk ? innvilgetImage : avslattImage} />
          </FlexColumn>
          <FlexColumn>
            {erVilkarOk && (
              <Normaltekst>
                <FormattedMessage id={findRadioButtonTextCode(customVilkarOppfyltText, true)} />
              </Normaltekst>
            )}
            {!erVilkarOk && (
              <Normaltekst>
                <FormattedMessage
                  id={findRadioButtonTextCode(customVilkarIkkeOppfyltText, false)}
                  values={{
                    b: chunks => <b>{chunks}</b>,
                  }}
                />
              </Normaltekst>
            )}
          </FlexColumn>
        </FlexRow>
        <VerticalSpacer eightPx />
      </FlexContainer>
    )}
    {(!readOnly || erVilkarOk === undefined) && (
      <RadioGroupField
        name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}erVilkarOk`}
        validate={[required]}
        bredde="XXL"
        direction="vertical"
        readOnly={readOnly}
      >
        <RadioOption
          label={
            <FormattedMessage
              id={findRadioButtonTextCode(customVilkarOppfyltText, true)}
              values={
                customVilkarOppfyltText
                  ? {
                      b: chunks => <b>{chunks}</b>,
                      ...customVilkarIkkeOppfyltText.values,
                    }
                  : { b: chunks => <b>{chunks}</b> }
              }
            />
          }
          value
        />
        <RadioOption
          label={
            <FormattedMessage
              id={findRadioButtonTextCode(customVilkarIkkeOppfyltText, false)}
              values={
                customVilkarIkkeOppfyltText
                  ? {
                      b: chunks => <b>{chunks}</b>,
                      ...customVilkarIkkeOppfyltText.values,
                    }
                  : { b: chunks => <b>{chunks}</b> }
              }
            />
          }
          value={false}
        />
      </RadioGroupField>
    )}
    <>
      {erVilkarOk !== undefined && !erVilkarOk && avslagsarsaker && (
        <>
          <VerticalSpacer eightPx />
          <SelectField
            name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}avslagCode`}
            label={intl.formatMessage({ id: 'VilkarResultPicker.Arsak' })}
            placeholder={intl.formatMessage({ id: 'VilkarResultPicker.SelectArsak' })}
            selectValues={avslagsarsaker.map(årsak => (
              <option key={årsak.kode} value={årsak.kode}>
                {årsak.navn}
              </option>
            ))}
            bredde="xl"
            readOnly={readOnly}
          />
          {erMedlemskapsPanel && (
            <DatepickerField
              name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}avslagDato`}
              label={{ id: 'VilkarResultPicker.VilkarDato' }}
              readOnly={readOnly}
              validate={[required, hasValidDate]}
            />
          )}
        </>
      )}
    </>
    <VerticalSpacer eightPx />
  </div>
);

VilkarResultPickerImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  avslagsarsaker: PropTypes.arrayOf(
    PropTypes.shape({
      kode: PropTypes.string.isRequired,
      navn: PropTypes.string.isRequired,
    }),
  ),
  customVilkarIkkeOppfyltText: PropTypes.shape({
    id: PropTypes.string.isRequired,
    values: PropTypes.shape(),
  }),
  customVilkarOppfyltText: PropTypes.shape({
    id: PropTypes.string.isRequired,
    values: PropTypes.shape(),
  }),
  erVilkarOk: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  erMedlemskapsPanel: PropTypes.bool,
  fieldNamePrefix: PropTypes.string,
};

VilkarResultPickerImpl.defaultProps = {
  erVilkarOk: undefined,
  customVilkarIkkeOppfyltText: undefined,
  customVilkarOppfyltText: undefined,
  erMedlemskapsPanel: false,
  avslagsarsaker: undefined,
  fieldNamePrefix: undefined,
};

const VilkarResultPicker = injectIntl(VilkarResultPickerImpl);

VilkarResultPicker.validate = (erVilkarOk, avslagCode) => {
  const errors = {};
  if (erVilkarOk === false && !avslagCode) {
    errors.avslagCode = isRequiredMessage();
  }
  return errors;
};

VilkarResultPicker.buildInitialValues = (avslagKode, aksjonspunkter, status) => {
  const isOpenAksjonspunkt = aksjonspunkter.some(ap => isAksjonspunktOpen(ap.status.kode));
  const erVilkarOk = isOpenAksjonspunkt ? undefined : vilkarUtfallType.OPPFYLT === status;
  return {
    erVilkarOk,
    avslagCode: erVilkarOk === false && avslagKode ? avslagKode : undefined,
  };
};

VilkarResultPicker.transformValues = values =>
  values.erVilkarOk
    ? { erVilkarOk: values.erVilkarOk }
    : {
        erVilkarOk: values.erVilkarOk,
        avslagskode: values.avslagCode,
        avslagDato: values.avslagDato,
      };

export default VilkarResultPicker;
