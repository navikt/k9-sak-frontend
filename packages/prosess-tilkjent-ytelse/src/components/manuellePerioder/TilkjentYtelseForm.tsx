import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import PropTypes from 'prop-types';
import moment from 'moment';
import { InjectedFormProps } from 'redux-form';
import {
  Aksjonspunkt,
  Kodeverk,
  BeregningsresultatUtbetalt,
  InntektArbeidYtelse,
  Arbeidsforhold,
  KodeverkMedNavn,
  Vilkar,
} from '@k9-sak-web/types';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { getBehandlingFormPrefix, behandlingForm } from '@fpsak-frontend/form';
import { AksjonspunktHelpTextTemp, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { guid } from '@fpsak-frontend/utils';
import { FormattedMessage } from 'react-intl';
import PeriodeTabell from './PeriodeTabell';

// TODO lage type for periode og formvalues

interface OwnProps {
  readOnly: boolean;
  readOnlySubmitButton: boolean;
  behandlingFormPrefix: string;
  submitting: boolean;
  aksjonspunkter: Aksjonspunkt[];
  behandlingId: number;
  behandlingVersjon: number;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  behandlingStatus: Kodeverk;
  arbeidsforhold: Arbeidsforhold[];
  vilkarForSykdomExists: boolean;
  vilkar: Vilkar[];
}

const FORM_NAME = 'TilkjentYtelseForm';

export const TilkjentYtelseForm: React.FC<OwnProps & InjectedFormProps> = ({
  readOnly,
  readOnlySubmitButton,
  aksjonspunkter,
  behandlingId,
  behandlingVersjon,
  alleKodeverk,
  arbeidsforhold,
  vilkar,
  ...formProps
}) => {
  return (
    <>
      {aksjonspunkter.length > 0 && (
        <>
          <VerticalSpacer twentyPx />
          <AksjonspunktHelpTextTemp isAksjonspunktOpen={!readOnlySubmitButton}>
            {[
              <FormattedMessage
                id="TilkjentYtelse.AksjonspunktHelpText"
                key={aksjonspunktCodes.MANUELL_TILKJENT_YTELSE}
              />,
            ]}
          </AksjonspunktHelpTextTemp>
          <VerticalSpacer twentyPx />
        </>
      )}

      <form onSubmit={formProps.handleSubmit}>
        {formProps.warning && <span>{formProps.warning}</span>}
        <PeriodeTabell
          // readOnlySubmitButton={readOnlySubmitButton}
          readOnly={readOnly}
          submitting={formProps.submitting}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          alleKodeverk={alleKodeverk}
          // @ts-ignore
          arbeidsforhold={arbeidsforhold}
          vilkar={vilkar}
        />
        {formProps.error && <span>{formProps.error}</span>}
      </form>
    </>
  );
};

TilkjentYtelseForm.propTypes = {
  readOnly: PropTypes.bool,
};

TilkjentYtelseForm.defaultProps = {
  readOnly: true,
};

export const sjekkOverlappendePerioder = (index: number, nestePeriode: any, forrigePeriode: any) =>
  index !== 0 && moment(nestePeriode.fom) <= moment(forrigePeriode.tom);

const validateForm = (values: any) => {
  const errors = {
    perioder: {},
  };
  if (!values.perioder) {
    return errors;
  }

  if (values.perioder.length === 0) {
    errors.perioder = {
      _error: <FormattedMessage id="TilkjentYtelse.IngenPerioder" />,
    };
  }

  values.perioder.forEach((periode: any, index: number) => {
    const forrigePeriode = values.perioder[index - 1];
    const nestePeriode = periode;
    if (sjekkOverlappendePerioder(index, nestePeriode, forrigePeriode)) {
      errors.perioder = {
        _error: <FormattedMessage id="TilkjentYtelse.OverlappendePerioder" />,
      };
    }

    const totalRefusjon = periode.andeler
      .map(andel => parseFloat(andel.refusjon))
      .filter(v => !Number.isNaN(v))
      .reduce((totalForPeriode: number, refusjon: any) => totalForPeriode + refusjon, 0);

    if (totalRefusjon >= 3999) {
      errors.perioder = {
        _error: <FormattedMessage id="TilkjentYtelse.OverskriderMaksbeløp" />,
      };
    }
  });

  return errors;
};

interface PureOwnProps {
  beregningsresultat: BeregningsresultatUtbetalt[];
  aksjonspunkter: Aksjonspunkt[];
  behandlingId: number;
  behandlingVersjon: number;
  inntektArbeidYtelse: InntektArbeidYtelse;
  submitCallback: (...args: any[]) => any;
}
// @ts-ignore
const buildInitialValues = createSelector(
  [
    // @ts-ignore
    (props: PureOwnProps) => props.beregningsresultat?.perioder,
    (props: PureOwnProps) => props.inntektArbeidYtelse?.arbeidsforhold,
  ],
  (perioder = [], arbeidsforhold = []) => {
    if (perioder) {
      return {
        arbeidsforhold,
        perioder: perioder.map((periode: any) => ({
          ...periode,
          id: guid(),
          openForm: false,
          // updated: false,
        })),
      };
    }

    return {
      arbeidsforhold,
      perioder,
    };
  },
);

export const transformValues = (values: any) => {
  return [
    {
      kode: aksjonspunktCodes.MANUELL_TILKJENT_YTELSE,
      tilkjentYtelse: {
        perioder: values.perioder,
      },
      // begrunnelse: '',
    },
  ];
};

const lagSubmitFn = createSelector(
  [(ownProps: PureOwnProps) => ownProps.submitCallback, buildInitialValues],
  submitCallback => (values: any) => submitCallback(transformValues(values)),
);

const mapStateToPropsFactory = (_initialState: any, props: PureOwnProps) => {
  const initialValues = buildInitialValues(props);
  const { behandlingId, behandlingVersjon } = props;

  const validate = (values: any) => validateForm(values);

  return (_state, ownProps) => {
    const behandlingFormPrefix = getBehandlingFormPrefix(behandlingId, behandlingVersjon);
    return {
      initialValues,
      behandlingFormPrefix,
      validate,
      onSubmit: lagSubmitFn(ownProps),
    };
  };
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: FORM_NAME,
    enableReinitialize: true,
  })(TilkjentYtelseForm),
);
