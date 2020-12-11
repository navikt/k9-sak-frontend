import React, { useState, FC } from 'react';
import { WrappedComponentProps } from 'react-intl';
import { FieldArrayFieldsProps, FieldArrayMetaProps } from 'redux-form';
import { FlexColumn, FlexRow, PeriodFieldArray, Image } from '@fpsak-frontend/shared-components';
import { KodeverkMedNavn, Arbeidsforhold } from '@k9-sak-web/types';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { InputField, SelectField } from '@fpsak-frontend/form';
import { hasValidDecimal, maxValue, minValue, required, getKodeverknavnFn } from '@fpsak-frontend/utils';
import addCircleIcon from '@fpsak-frontend/assets/images/add-circle.svg';
import NyttArbeidsforholdModal from './NyttArbeidsforholdModal';
import { createVisningsnavnForAndel, MAKS_REFUSJON_FOR_PERIODE } from '../TilkjentYtelseUtils';

import styles from './periode.less';

const minValue0 = minValue(0);
const maxValue100 = maxValue(100);
const maxValue3999 = maxValue(MAKS_REFUSJON_FOR_PERIODE);

const mapArbeidsforhold = (arbeidsForhold: any, getKodeverknavn) =>
  arbeidsForhold.map((andel: any, index) => {
    const { arbeidsforholdId, arbeidsgiverIdentifikator, navn, eksternArbeidsforholdId } = andel;
    const nyAndel = {
      aktivitetStatus: '',
      arbeidsgiverNavn: navn,
      arbeidsgiverOrgnr: arbeidsgiverIdentifikator,
      arbeidsforholdId,
      eksternArbeidsforholdId,
    };

    const label = createVisningsnavnForAndel(nyAndel, getKodeverknavn);
    const key = `${navn}${index}`;
    return (
      <option value={`${arbeidsgiverIdentifikator}|${navn}|${eksternArbeidsforholdId}|${arbeidsforholdId}`} key={key}>
        {label}
      </option>
    );
  });

const getInntektskategori = alleKodeverk => {
  const aktivitetsstatuser = alleKodeverk[kodeverkTyper.INNTEKTSKATEGORI];
  return aktivitetsstatuser.map(ik => (
    <option value={ik.kode} key={ik.kode}>
      {ik.navn}
    </option>
  ));
};

const defaultAndel = {
  refusjon: '',
  arbeidsgiver: '',
  inntektskategori: '',
  utbetalingsgrad: '',
};

interface OwnProps {
  meta: FieldArrayMetaProps;
  readOnly: boolean;
  fields: FieldArrayFieldsProps<any>;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  arbeidsforhold: Arbeidsforhold[];
  newArbeidsforholdCallback: (values: any) => void;
  behandlingId: number;
  behandlingVersjon: number;
}

export const NyAndel: FC<OwnProps & WrappedComponentProps> = ({
  fields,
  meta,
  newArbeidsforholdCallback,
  alleKodeverk,
  readOnly,
  arbeidsforhold,
  behandlingId,
  behandlingVersjon,
}) => {
  const [isOpen, setOpen] = useState(false);
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);

  return (
    <>
      <PeriodFieldArray
        shouldShowAddButton
        fields={fields}
        meta={meta}
        textCode="TilkjentYtelse.NyAndel"
        emptyPeriodTemplate={defaultAndel}
        readOnly={readOnly}
      >
        {(periodeElementFieldId, index, getRemoveButton) => (
          <FlexRow key={periodeElementFieldId}>
            <FlexColumn>
              <InputField
                label="Refusjon"
                name={`${periodeElementFieldId}.refusjon`}
                validate={[required, minValue0, maxValue3999, hasValidDecimal]}
                format={value => value}
              />
            </FlexColumn>
            <FlexColumn className={styles.relative}>
              <SelectField
                label="Arbeidsforhold"
                bredde="xl"
                name={`${periodeElementFieldId}.arbeidsgiver`}
                validate={[required]}
                selectValues={mapArbeidsforhold(arbeidsforhold, getKodeverknavn)}
              />
              <div
                onClick={() => setOpen(true)}
                onKeyDown={() => setOpen(true)}
                className={styles.addArbeidsforhold}
                role="button"
                tabIndex={0}
              >
                <Image className={styles.addCircleIcon} src={addCircleIcon} alt="Nytt arbeidsforhold" />
              </div>
            </FlexColumn>
            <FlexColumn>
              <SelectField
                label={{ id: 'TilkjentYtelse.NyPeriode.Inntektskategori' }}
                name={`${periodeElementFieldId}.inntektskategori`}
                bredde="l"
                selectValues={getInntektskategori(alleKodeverk)}
              />
            </FlexColumn>
            <FlexColumn>
              <InputField
                label={{ id: 'TilkjentYtelse.NyPeriode.Ubetalingsgrad' }}
                name={`${periodeElementFieldId}.utbetalingsgrad`}
                validate={[required, minValue0, maxValue100, hasValidDecimal]}
                format={value => value}
              />
            </FlexColumn>
            <FlexColumn>{getRemoveButton()}</FlexColumn>
          </FlexRow>
        )}
      </PeriodFieldArray>

      {isOpen && (
        <NyttArbeidsforholdModal
          showModal={isOpen}
          newArbeidsforholdCallback={newArbeidsforholdCallback}
          closeEvent={values => {
            newArbeidsforholdCallback(values);
            setOpen(false);
          }}
          cancelEvent={() => setOpen(false)}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
        />
      )}
    </>
  );
};

export default NyAndel;
