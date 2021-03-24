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
  ArbeidsforholdV2,
  ArbeidsgiverOpplysningerPerId,
  KodeverkMedNavn,
  Vilkar,
} from '@k9-sak-web/types';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { getBehandlingFormPrefix, behandlingForm } from '@fpsak-frontend/form';
import { AksjonspunktHelpTextTemp, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { guid } from '@fpsak-frontend/utils';
import { FormattedMessage } from 'react-intl';
import PeriodeTabell from './PeriodeTabell';

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
  arbeidsforhold: ArbeidsforholdV2[];
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
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
  arbeidsgiverOpplysningerPerId,
  vilkar,
  ...formProps
}) => (
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
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        vilkar={vilkar}
      />
      {formProps.error && <span>{formProps.error}</span>}
    </form>
  </>
);

TilkjentYtelseForm.propTypes = {
  readOnly: PropTypes.bool,
};

TilkjentYtelseForm.defaultProps = {
  readOnly: true,
};

export const sjekkOverlappendePerioder = (index: number, nestePeriode: any, forrigePeriode: any) =>
  index !== 0 && moment(nestePeriode.fom) <= moment(forrigePeriode.tom);

const validateForm = (values: any) => {
  // NOSONAR må ha disse sjekkene
  const errors = {};
  if (!values.perioder) {
    return errors;
  }

  if (values.perioder.length === 0) {
    return {
      perioder: {
        _error: <FormattedMessage id="TilkjentYtelse.IngenPerioder" />,
      },
    };
  }

  values.perioder.forEach((periode: any, index: number) => {
    const forrigePeriode = values.perioder[index - 1];
    const nestePeriode = periode;

    if (sjekkOverlappendePerioder(index, nestePeriode, forrigePeriode)) {
      return {
        perioder: {
          _error: <FormattedMessage id="TilkjentYtelse.OverlappendePerioder" />,
        },
      };
    }
    return {};
  });

  return errors;
};

interface PureOwnProps {
  beregningsresultat: BeregningsresultatUtbetalt[];
  aksjonspunkter: Aksjonspunkt[];
  behandlingId: number;
  behandlingVersjon: number;
  arbeidsforhold: ArbeidsforholdV2[];
  submitCallback: (...args: any[]) => any;
}
// @ts-ignore
const buildInitialValues = createSelector(
  [
    // @ts-ignore
    (props: PureOwnProps) => props.beregningsresultat?.perioder,
    (props: PureOwnProps) => props.arbeidsforhold,
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

export const transformValues = (values: any) => [
  {
    kode: aksjonspunktCodes.MANUELL_TILKJENT_YTELSE,
    tilkjentYtelse: {
      perioder: values.perioder,
    },
    // begrunnelse: '',
  },
];

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
