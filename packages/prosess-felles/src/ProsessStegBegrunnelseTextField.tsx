import React, { FunctionComponent } from 'react';

import { TextAreaField } from '@fpsak-frontend/form';
import {
  decodeHtmlEntity,
  hasValidText,
  maxLength as validateMaxLength,
  minLength as validateMinLength,
  requiredIfNotPristine,
} from '@fpsak-frontend/utils';
import { Aksjonspunkt } from '@k9-sak-web/types';

import getPackageIntl from '../i18n/getPackageIntl';

import styles from './prosessStegBegrunnelseTextField.less';

const validateMinLength3 = validateMinLength(3);
const validateMaxLength1500 = validateMaxLength(1500);

const getBegrunnelseTextCode = (readOnly: boolean): string =>
  readOnly
    ? 'ProsessStegBegrunnelseTextField.ExplanationRequiredReadOnly'
    : 'ProsessStegBegrunnelseTextField.ExplanationRequired';

type FormValues = {
  begrunnelse?: string;
};

interface OwnProps {
  readOnly: boolean;
  text?: string;
  maxLength?: number;
  useAllWidth?: boolean;
  fieldNamePrefix?: string;
}

interface StaticFunctions {
  buildInitialValues?: (aksjonspunkter: Aksjonspunkt[]) => FormValues;
  transformValues?: (
    values: FormValues,
  ) => {
    begrunnelse?: string;
  };
}

/**
 * ProsessStegBegrunnelseTextField
 *
 * Presentasjonskomponent. Lar den NAV-ansatte skrive inn en begrunnelse før lagring av behandlingspunkter.
 */
const ProsessStegBegrunnelseTextField: FunctionComponent<OwnProps> & StaticFunctions = ({
  readOnly,
  text,
  maxLength,
  useAllWidth = false,
  fieldNamePrefix,
}) => {
  const intl = getPackageIntl();
  return (
    <div className={!useAllWidth ? styles.begrunnelseTextField : ''}>
      <TextAreaField
        name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}begrunnelse`}
        label={text || intl.formatMessage({ id: getBegrunnelseTextCode(readOnly) })}
        validate={[
          requiredIfNotPristine,
          validateMinLength3,
          !maxLength ? validateMaxLength1500 : validateMaxLength(maxLength),
          hasValidText,
        ]}
        textareaClass={styles.explanationTextarea}
        maxLength={maxLength || 1500}
        readOnly={readOnly}
        placeholder={intl.formatMessage({ id: 'ProsessStegBegrunnelseTextField.BegrunnVurdering' })}
      />
    </div>
  );
};

const getBegrunnelse = (aksjonspunkter: Aksjonspunkt[]): string =>
  aksjonspunkter.length > 0 && aksjonspunkter[0].begrunnelse ? aksjonspunkter[0].begrunnelse : '';

ProsessStegBegrunnelseTextField.buildInitialValues = (aksjonspunkter: Aksjonspunkt[]): FormValues => ({
  begrunnelse: decodeHtmlEntity(getBegrunnelse(aksjonspunkter)),
});

ProsessStegBegrunnelseTextField.transformValues = (values: FormValues): any => ({
  begrunnelse: values.begrunnelse,
});

export default ProsessStegBegrunnelseTextField;
