import React, { FC } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { FieldArray, InjectedFormProps } from 'redux-form';
import { Element } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { calcDaysAndWeeks, guid, hasValidPeriod, required } from '@fpsak-frontend/utils';
import { DatepickerField, behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import { FlexColumn, FlexContainer, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { KodeverkMedNavn, Arbeidsforhold, Vilkar } from '@k9-sak-web/types';
import NyAndel from './NyAndel';
import { MAKS_REFUSJON_FOR_PERIODE } from '../TilkjentYtelseUtils';

import styles from './periode.less';

type NyPeriodeType = {
  fom: string;
  tom: string;
};

interface OwnProps {
  newPeriodeResetCallback: (values: any) => any;
  newArbeidsforholdCallback: (values: any) => void;
  andeler: any[];
  nyPeriode: NyPeriodeType;
  nyPeriodeDisabledDaysFom: string;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  arbeidsforhold: Arbeidsforhold[];
  readOnly: boolean;
  vilkar: Vilkar[];
  behandlingId: number;
  behandlingVersjon: number;
}

export const TilkjentYtelseNyPeriode: FC<OwnProps & InjectedFormProps> = ({
  newPeriodeResetCallback,
  newArbeidsforholdCallback,
  nyPeriode,
  readOnly,
  alleKodeverk,
  vilkar,
  behandlingId,
  behandlingVersjon,
  arbeidsforhold,
  ...formProps
}) => {
  const numberOfDaysAndWeeks = calcDaysAndWeeks(nyPeriode.fom, nyPeriode.tom);
  const vilkårsPeriode = vilkar[0].perioder[0].periode;
  return (
    <div className={styles.periodeContainer}>
      <div className={styles.periodeType}>
        <div className={styles.headerWrapper}>
          <Element>
            <FormattedMessage id="TilkjentYtelse.NyPeriode" />
          </Element>
        </div>
      </div>
      <div className={styles.periodeInnhold}>
        <VerticalSpacer eightPx />
        <FlexContainer wrap>
          <FlexRow wrap>
            <FlexColumn>
              <FlexRow>
                <FlexColumn>
                  <DatepickerField
                    name="fom"
                    label={{ id: 'TilkjentYtelse.NyPeriode.Fom' }}
                    disabledDays={{
                      before: moment(vilkårsPeriode.fom).toDate(),
                      after: moment(vilkårsPeriode.tom).toDate(),
                    }}
                  />
                </FlexColumn>
                <FlexColumn>
                  <DatepickerField
                    name="tom"
                    label={{ id: 'TilkjentYtelse.NyPeriode.Tom' }}
                    disabledDays={{
                      before: moment(vilkårsPeriode.fom).toDate(),
                      after: moment(vilkårsPeriode.tom).toDate(),
                    }}
                  />
                </FlexColumn>
                <FlexColumn className={styles.suffix}>
                  <div id="antallDager">
                    {nyPeriode.fom && (
                      <FormattedMessage
                        id={numberOfDaysAndWeeks.id.toString()}
                        values={{
                          weeks: numberOfDaysAndWeeks.weeks.toString(),
                          days: numberOfDaysAndWeeks.days.toString(),
                        }}
                      />
                    )}
                  </div>
                </FlexColumn>
              </FlexRow>
              <VerticalSpacer twentyPx />
              <FlexRow>
                <FlexColumn>
                  <FieldArray
                    name="andeler"
                    // @ts-ignore
                    component={NyAndel}
                    readOnly={readOnly}
                    alleKodeverk={alleKodeverk}
                    arbeidsforhold={arbeidsforhold}
                    behandlingId={behandlingId}
                    behandlingVersjon={behandlingVersjon}
                    newArbeidsforholdCallback={newArbeidsforholdCallback}
                  />
                </FlexColumn>
              </FlexRow>
            </FlexColumn>
          </FlexRow>
        </FlexContainer>
        <VerticalSpacer twentyPx />

        <Hovedknapp
          className={styles.oppdaterMargin}
          htmlType="button"
          mini
          onClick={formProps.handleSubmit}
          spinner={formProps.submitting}
        >
          <FormattedMessage id="TilkjentYtelse.LeggTilPeriode" />
        </Hovedknapp>
        <Knapp htmlType="button" mini onClick={newPeriodeResetCallback}>
          <FormattedMessage id="TilkjentYtelse.Avbryt" />
        </Knapp>
      </div>
    </div>
  );
};

const transformValues = (values: any) => ({
  id: guid(),
  fom: values.fom,
  tom: values.tom,
  // refusjon: values.refusjon,
  andeler: values.andeler.map(andel => {
    const arbeidsForhold = andel.arbeidsgiver ? andel.arbeidsgiver.split('|') : [];
    const arbeidsgiverValues = {
      identifikator: arbeidsForhold ? arbeidsForhold[0] : undefined,
      identifikatorGUI: arbeidsForhold ? arbeidsForhold[0] : undefined,
      navn: arbeidsForhold ? arbeidsForhold[1] : undefined,
      eksternArbeidsforholdId: arbeidsForhold && arbeidsForhold[2] !== 'null' ? arbeidsForhold[2] : '-',
      arbeidsforholdId: arbeidsForhold && arbeidsForhold[3] !== 'null' ? arbeidsForhold[3] : '-',
    };
    return {
      utbetalingsgrad: andel.utbetalingsgrad,
      // DUMMY
      aktivitetStatus: {
        kode: 'AT',
        kodeverk: 'AKTIVITET_STATUS',
      },
      // INNTEKTSKATEGORI
      inntektskategori: {
        kode: andel.inntektskategori,
        kodeverk: 'INNTEKTSKATEGORI',
      },
      stillingsprosent: 0,
      refusjon: andel.refusjon,
      sisteUtbetalingsdato: null,
      tilSoker: null,
      // OPPTJENING_AKTIVITET_TYPE
      arbeidsforholdType: '-',
      arbeidsgiver: arbeidsgiverValues,
      arbeidsgiverNavn: arbeidsgiverValues?.navn,
      arbeidsgiverOrgnr: arbeidsgiverValues?.identifikator,
      arbeidsforholdId: arbeidsgiverValues.arbeidsforholdId !== '-' ? arbeidsgiverValues.arbeidsforholdId : null,
      eksternArbeidsforholdId:
        arbeidsgiverValues.eksternArbeidsforholdId !== '-' ? arbeidsgiverValues.eksternArbeidsforholdId : null,
      aktørId: null,
      uttak: [
        {
          periode: {
            fom: values.fom,
            tom: values.tom,
          },
          utbetalingsgrad: andel.utbetalingsgrad,
          utfall: 'INNVILGET',
        },
      ],
    };
  }),
  // lagtTilAvSaksbehandler: true,
});

const beregnTotalRefusjonFraAndeler = values => {
  return (values.andeler || [])
    .map(andel => (andel.refusjon ? parseFloat(andel.refusjon) : 0))
    .filter(v => !Number.isNaN(v))
    .reduce((sum, v) => sum + v, 0);
};

const validateNyPeriodeForm = (values: any) => {
  const errors = {};

  if (!values) {
    return errors;
  }

  const invalid = required(values.fom) || hasValidPeriod(values.fom, values.tom);

  if (invalid) {
    return {
      fom: invalid,
    };
  }

  const refusjonsSum = beregnTotalRefusjonFraAndeler(values);

  (values.andeler || []).forEach((andel, index) => {
    if (!errors.andeler) {
      errors.andeler = [];
    }

    if (refusjonsSum >= MAKS_REFUSJON_FOR_PERIODE && andel && andel.refusjon) {
      errors.andeler[index] = {
        refusjon: [{ id: 'ValidationMessage.MaxSum' }, { length: MAKS_REFUSJON_FOR_PERIODE }],
      };
    }
  });

  return errors;
};

interface PureOwnProps {
  newPeriodeCallback: (values: any) => void;
  behandlingId: number;
  behandlingVersjon: number;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
}

const mapStateToPropsFactory = (_initialState: any, ownProps: PureOwnProps) => {
  const { newPeriodeCallback, behandlingId, behandlingVersjon } = ownProps;
  const onSubmit = (values: any) => newPeriodeCallback(transformValues(values));

  return (state: any) => ({
    initialValues: {
      fom: null,
      tom: null,
      andeler: [],
    },
    nyPeriode: behandlingFormValueSelector('nyPeriodeForm', behandlingId, behandlingVersjon)(state, 'fom', 'tom'),
    onSubmit,
  });
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: 'nyPeriodeForm',
    validate: values => validateNyPeriodeForm(values),
    enableReinitialize: true,
  })(TilkjentYtelseNyPeriode),
);
