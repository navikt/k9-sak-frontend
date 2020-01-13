import addCircleIcon from '@fpsak-frontend/assets/images/add-circle.svg';
import NavFieldGroup from '@fpsak-frontend/form/src/NavFieldGroup';
import { Column, Row } from 'nav-frontend-grid';
import { Undertekst } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { FieldArrayFieldsProps, FieldArrayMetaProps, WrappedFieldArrayProps } from 'redux-form';
import Image from './Image';
import styles from './periodFieldArray.less';
import VerticalSpacer from './VerticalSpacer';

const onClick = (fields: FieldArrayFieldsProps<any>, emptyPeriodTemplate: EmptyPeriodTemplate) => () => {
  fields.push(emptyPeriodTemplate);
};

const onKeyDown = (fields: FieldArrayFieldsProps<any>, emptyPeriodTemplate: EmptyPeriodTemplate) => ({ keyCode }) => {
  if (keyCode === 13) {
    fields.push(emptyPeriodTemplate);
  }
};

const getRemoveButton = (index: number, fields: FieldArrayFieldsProps<any>) => className => {
  if (index > 0) {
    return (
      <button
        className={className || styles.buttonRemove}
        type="button"
        onClick={() => {
          fields.remove(index);
        }}
      />
    );
  }
  return undefined;
};

const showErrorMessage = (meta: FieldArrayMetaProps) => meta && meta.error && (meta.dirty || meta.submitFailed);

/**
 * PeriodFieldArray
 *
 * Overbygg over FieldArray (Redux-form) som håndterer å legge til og fjerne perioder
 */
const PeriodFieldArray = ({
  intl,
  fields,
  readOnly,
  meta,
  titleTextCode,
  textCode,
  emptyPeriodTemplate,
  shouldShowAddButton,
  createAddButtonInsteadOfImageLink,
  children,
}: PeriodFieldArrayProps) => (
  <NavFieldGroup
    title={titleTextCode ? intl.formatMessage({ id: titleTextCode }) : undefined}
    errorMessage={showErrorMessage(meta) ? intl.formatMessage({ ...meta.error }) : null}
  >
    {fields.map((periodeElementFieldId, index) =>
      children(periodeElementFieldId, index, getRemoveButton(index, fields)),
    )}
    {shouldShowAddButton && (
      <Row className="">
        <Column xs="12">
          {!createAddButtonInsteadOfImageLink && !readOnly && (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <div
              onClick={onClick(fields, emptyPeriodTemplate)}
              onKeyDown={onKeyDown(fields, emptyPeriodTemplate)}
              className={styles.addPeriode}
              role="button"
              tabIndex={0}
            >
              <Image className={styles.addCircleIcon} src={addCircleIcon} alt={intl.formatMessage({ id: textCode })} />
              <Undertekst className={styles.imageText}>
                <FormattedMessage id={textCode} />
              </Undertekst>
            </div>
          )}
          {createAddButtonInsteadOfImageLink && !readOnly && (
            <button type="button" onClick={onClick(fields, emptyPeriodTemplate)} className={styles.buttonAdd}>
              <FormattedMessage id={textCode} />
            </button>
          )}
          <VerticalSpacer sixteenPx />
        </Column>
      </Row>
    )}
  </NavFieldGroup>
);

interface EmptyPeriodTemplate {
  periodeFom: string;
  periodeTom: string;
}

interface PeriodFieldArrayProps extends WrappedFieldArrayProps {
  intl: IntlShape;
  children: (
    periodeElementFieldId: string,
    index: number,
    getRemoveButton: (index: number, fields: FieldArrayFieldsProps<any>) => JSX.Element,
  ) => void;
  readOnly?: boolean;
  titleTextCode?: string;
  textCode?: string;
  emptyPeriodTemplate?: EmptyPeriodTemplate;
  shouldShowAddButton?: boolean;
  createAddButtonInsteadOfImageLink?: boolean;
}

PeriodFieldArray.defaultProps = {
  readOnly: true,
  titleTextCode: undefined,
  textCode: 'PeriodFieldArray.LeggTilPeriode',
  emptyPeriodTemplate: {
    periodeFom: '',
    periodeTom: '',
  },
  shouldShowAddButton: true,
  createAddButtonInsteadOfImageLink: false,
};

export default injectIntl(PeriodFieldArray);
