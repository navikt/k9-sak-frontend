import React, { FunctionComponent, useState } from 'react';
import { connect } from 'react-redux';
import { InjectedFormProps, change as reduxFormChange, reset } from 'redux-form';
import { bindActionCreators } from 'redux';
import { FormAction } from 'redux-form/lib/actions';
import Hovedknapp from 'nav-frontend-knapper/lib/hovedknapp';
import { minLength, maxLength, required, hasValidText } from '@fpsak-frontend/utils';
import {
  behandlingForm,
  getBehandlingFormPrefix,
  behandlingFormValueSelector,
} from '@fpsak-frontend/fp-felles/src/behandlingForm';
import { createSelector } from 'reselect';
import { FormattedMessage, injectIntl, IntlFormatters } from 'react-intl';
import VerticalSpacer from '@fpsak-frontend/shared-components/src/VerticalSpacer';
import FlexRow from '@fpsak-frontend/shared-components/src/flexGrid/FlexRow';
import { TextAreaField } from '@fpsak-frontend/form';
import { Knapp } from 'nav-frontend-knapper';
import ArbeidsgiverType from './types/Arbeidsgiver';
import Arbeidsgiver from './Arbeidsgiver';
import { beregnNyePerioder, UttakFaktaFormContext } from './uttakUtils';
import styles from './uttakFaktaForm.less';
import ValgtPeriode from './ValgtPeriode';
import UttakFormKolonne from './UttakFormKolonne';
import Perioder from './Perioder';
import UttakContextProps from './types/UttakContextProps';
import ArbeidsforholdPeriode from './types/Arbeidfsforhold';
import { uttakFaktaFormName, nyArbeidsperiodeFormName } from './constants';
import Arbeid from './types/Arbeid';

interface UttakFaktaFormProps {
  arbeid: Arbeid[];
  behandlingId: number;
  behandlingVersjon: number;
  submitCallback: (values: ArbeidsgiverType[]) => void;
  behandlingFormPrefix?: string;
  reduxFormChange?: (
    form: string,
    field: string,
    value: any,
    touch?: boolean,
    persistentSubmitErrors?: boolean,
  ) => FormAction;
  resetForm: (formName: string) => void;
  intl: IntlFormatters;
}

// TODO: slå sammen perioder hvis de er tilstøtende og timer-inputs er like
export const oppdaterPerioderFor = (
  arbeidsgivere: ArbeidsgiverType[],
  valgtArbeidsgiversOrgNr: string,
  valgtArbeidsforholdId: string,
  setValgtPeriodeIndex: (index: number) => void,
  oppdaterForm: (oppdatert: ArbeidsgiverType[]) => void,
) => (nyPeriode: ArbeidsforholdPeriode) => {
  let nyePerioder;
  const oppdatert = arbeidsgivere.map(arbeidsgiver => {
    if (arbeidsgiver.organisasjonsnummer === valgtArbeidsgiversOrgNr) {
      return {
        ...arbeidsgiver,
        arbeidsforhold: arbeidsgiver.arbeidsforhold.map(arbeidsforhold => {
          if (arbeidsforhold.arbeidsgiversArbeidsforholdId === valgtArbeidsforholdId) {
            nyePerioder = beregnNyePerioder(arbeidsforhold.perioder, nyPeriode);
            const nyPeriodeIndex = nyePerioder.reduce(
              (tmpIndex: number, periode: ArbeidsforholdPeriode, index: number) => {
                const periodeErLik =
                  periode.fom === nyPeriode.fom &&
                  periode.tom === nyPeriode.tom &&
                  periode.timerIJobbTilVanlig === nyPeriode.timerIJobbTilVanlig &&
                  periode.timerFårJobbet === nyPeriode.timerFårJobbet;
                if (periodeErLik) {
                  return index;
                }
                return tmpIndex;
              },
              null,
            );

            setValgtPeriodeIndex(nyPeriodeIndex);

            return {
              ...arbeidsforhold,
              perioder: nyePerioder,
            };
          }
          return arbeidsforhold;
        }),
      };
    }
    return arbeidsgiver;
  });
  oppdaterForm(oppdatert);
};

export const UttakFaktaFormImpl: FunctionComponent<UttakFaktaFormProps & InjectedFormProps> = ({
  handleSubmit,
  arbeid,
  behandlingFormPrefix,
  // reduxFormChange: formChange,
  behandlingVersjon,
  behandlingId,
  resetForm,
  intl,
  ...formProps
}) => {
  const [valgtArbeidsforholdId, setValgtArbeidsforholdId] = useState<string>(null);
  const [valgtFomTom, setValgtFomTom] = useState<string>(null);
  const [redigererPeriode, setRedigererPeriode] = useState<boolean>();

  const formContext: UttakContextProps = {
    valgtArbeidsforholdId,
    setValgtArbeidsforholdId,
    valgtFomTom,
    setValgtFomTom,
    redigererPeriode,
    setRedigererPeriode,
  };
  const { pristine } = formProps;

  if (!arbeid) {
    return null;
  }

  // const oppdaterForm = oppdatert =>
  //   formChange(`${behandlingFormPrefix}.${uttakFaktaFormName}`, 'arbeidsgivere', oppdatert);
  // const oppdaterPerioder = oppdaterPerioderFor(
  //   arbeidsgivere,
  //   valgtArbeidsgiversOrgNr,
  //   valgtArbeidsforholdId,
  //   setValgtPeriodeIndex,
  //   oppdaterForm,
  // );
  const oppdaterPerioder = () => undefined;

  const avbrytSkjemaInnfylling = () => {
    // TODO: bekrefte avbryt (i f eks en modal), og så resetForm
    resetForm(`${behandlingFormPrefix}.${uttakFaktaFormName}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <UttakFaktaFormContext.Provider value={formContext}>
        <FlexRow>
          <UttakFormKolonne tittel={intl.formatMessage({ id: 'FaktaOmUttakForm.Arbeidsgivere' })} withBorderRight>
            <div className={styles.arbeidsgivere}>
              {arbeid.map(arbeidet => (
                <Arbeidsgiver
                  arbeid={arbeidet}
                  key={`${arbeidet.arbeidsforhold.organisasjonsnummer}-${arbeidet.arbeidsforhold.arbeidsforholdId}`}
                />
              ))}
            </div>
          </UttakFormKolonne>
          <UttakFormKolonne tittel={intl.formatMessage({ id: 'FaktaOmUttakForm.Perioder' })} withBorderRight>
            <Perioder
              valgtArbeidsforholdId={valgtArbeidsforholdId}
              arbeid={arbeid}
              leggTilPeriode={
                redigererPeriode
                  ? () => {
                      setValgtFomTom(null);
                      setRedigererPeriode(true);
                    }
                  : null
              }
            />
          </UttakFormKolonne>
          <UttakFormKolonne tittel={intl.formatMessage({ id: 'FaktaOmUttakForm.Periodedetaljer' })}>
            <ValgtPeriode
              redigererPeriode={redigererPeriode}
              behandlingVersjon={behandlingVersjon}
              behandlingId={behandlingId}
              oppdaterPerioder={oppdaterPerioder}
              endreValgtPeriodeCallback={() => {
                setRedigererPeriode(true);
              }}
              avbryt={() => {
                resetForm(`${getBehandlingFormPrefix(behandlingId, behandlingVersjon)}.${nyArbeidsperiodeFormName}`);
                setRedigererPeriode(false);
              }}
              arbeid={arbeid}
            />
          </UttakFormKolonne>
        </FlexRow>
      </UttakFaktaFormContext.Provider>
      {!pristine && (
        <>
          <VerticalSpacer twentyPx />
          <FlexRow className={styles.bekreftelseContainer}>
            <div className={styles.textAreaStyle}>
              <TextAreaField
                label={intl.formatMessage({ id: 'FaktaOmUttakForm.Begrunnelse' })}
                name="begrunnelse"
                validate={[required, minLength(3), maxLength(400), hasValidText]}
                textareaClass={styles.textAreaStyle}
              />
            </div>
            <VerticalSpacer sixteenPx />
            <FlexRow className={styles.submittKnapper}>
              <Hovedknapp onClick={handleSubmit}>
                {intl.formatMessage({ id: 'SubmitButton.ConfirmInformation' })}
              </Hovedknapp>
              <Knapp htmlType="button" mini onClick={avbrytSkjemaInnfylling}>
                <FormattedMessage id="FaktaOmUttakForm.Avbryt" />
              </Knapp>
            </FlexRow>
          </FlexRow>
        </>
      )}
    </form>
  );
};

interface FormValues {
  arbeid: Arbeid[];
  begrunnelse: string;
}

interface FormProps {
  initialValues: {
    arbeid: Arbeid[];
  };
  behandlingFormPrefix: string;
  onSubmit: (values: FormValues) => any;
}

const arbeidSelector = createSelector(
  [
    (state, ownProps) =>
      behandlingFormValueSelector(
        uttakFaktaFormName,
        ownProps.behandlingId,
        ownProps.behandlingVersjon,
      )(state, 'arbeid'),
  ],
  arbeidsgivere => arbeidsgivere,
);

const transformValues: (formvalues: FormValues) => any[] = ({ arbeid, begrunnelse }) => [
  {
    begrunnelse,
    arbeid,
    kode: 'FAKE_CODE', // TODO
  },
];

const mapStateToPropsFactory = (
  _initialState: null,
  initialOwnProps: UttakFaktaFormProps,
): ((state, ownProps) => FormProps) => {
  const { behandlingId, behandlingVersjon, arbeid, submitCallback } = initialOwnProps;
  const onSubmit = (formvalues: FormValues) => submitCallback(transformValues(formvalues));
  const initialValues = { arbeid };

  return (state, ownProps) => {
    const behandlingFormPrefix = getBehandlingFormPrefix(behandlingId, behandlingVersjon);

    return {
      initialValues,
      behandlingFormPrefix,
      onSubmit,
      arbeid: arbeidSelector(state, ownProps),
    };
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      reduxFormChange,
      resetForm: reset,
    },
    dispatch,
  );

export default connect(
  mapStateToPropsFactory,
  mapDispatchToProps,
)(
  injectIntl(
    behandlingForm({
      form: uttakFaktaFormName,
      enableReinitialize: true,
    })(UttakFaktaFormImpl),
  ),
);
