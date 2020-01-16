import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Hovedknapp } from 'nav-frontend-knapper';

import { ariaCheck, isRequiredMessage } from '@fpsak-frontend/utils';
import { behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/fp-felles';
import {
  BehandlingKlageVurdering,
  BehandlingStatusType,
  TotrinnskontrollAksjonspunkter,
  KlageVurderingResultat,
  AlleKodeverk,
} from '@fpsak-frontend/types';
import { InjectedFormProps } from 'redux-form';

import ApprovalField from './ApprovalField';

import styles from './ToTrinnsForm.less';
import { Approvals } from './ApprovalPanel';

const allApproved = (formState: FormState[]) =>
  formState
    .reduce((a, b) => a.concat(b.aksjonspunkter), [])
    .every(ap => ap.totrinnskontrollGodkjent && ap.totrinnskontrollGodkjent === true);

const allSelected = (formState: FormState[]) =>
  formState.reduce((a, b) => a.concat(b.aksjonspunkter), []).every(ap => ap.totrinnskontrollGodkjent !== null);

/*
 * ToTrinnsForm
 *
 * Presentasjonskomponent. Holds the form of the totrinnkontroll
 */
export const ToTrinnsFormImpl = ({
  handleSubmit,
  formState,
  forhandsvisVedtaksbrev,
  readOnly,
  totrinnskontrollContext,
  erBehandlingEtterKlage,
  behandlingKlageVurdering,
  behandlingStatus,
  isForeldrepengerFagsak,
  alleKodeverk,
  disableGodkjennKnapp,
  ...formProps
}: ToTrinnsFormImplProps) => {
  if (formState.length !== totrinnskontrollContext.length) {
    return null;
  }

  const erKlage =
    behandlingKlageVurdering &&
    (!!behandlingKlageVurdering.klageVurderingResultatNFP || !!behandlingKlageVurdering.klageVurderingResultatNK);

  return (
    <form name="toTrinn" onSubmit={handleSubmit}>
      {totrinnskontrollContext.map(({ contextCode, skjermlenke, aksjonspunkter, skjermlenkeNavn }, contextIndex) => {
        if (aksjonspunkter.length > 0) {
          return (
            <div key={contextCode}>
              <NavLink to={skjermlenke} className={styles.lenke}>
                {skjermlenkeNavn}
              </NavLink>
              {aksjonspunkter.map((aksjonspunkt, approvalIndex) => (
                <div key={aksjonspunkt.aksjonspunktKode}>
                  <ApprovalField
                    aksjonspunkt={aksjonspunkt}
                    contextIndex={contextIndex}
                    currentValue={formState[contextIndex].aksjonspunkter[approvalIndex]}
                    approvalIndex={approvalIndex}
                    readOnly={readOnly}
                    klageKA={behandlingKlageVurdering && !!behandlingKlageVurdering.klageVurderingResultatNK}
                    isForeldrepengerFagsak={isForeldrepengerFagsak}
                    behandlingKlageVurdering={behandlingKlageVurdering}
                    behandlingStatus={behandlingStatus}
                    alleKodeverk={alleKodeverk}
                  />
                </div>
              ))}
            </div>
          );
        }
        return null;
      })}
      <div className={styles.buttonRow}>
        <Hovedknapp
          mini
          disabled={disableGodkjennKnapp || !allApproved(formState) || !allSelected(formState) || formProps.submitting}
          spinner={formProps.submitting}
        >
          <FormattedMessage id="ToTrinnsForm.Godkjenn" />
        </Hovedknapp>
        <Hovedknapp
          mini
          disabled={allApproved(formState) || !allSelected(formState) || formProps.submitting}
          spinner={formProps.submitting}
          onClick={ariaCheck}
        >
          <FormattedMessage id="ToTrinnsForm.SendTilbake" />
        </Hovedknapp>
        {!erKlage && !erBehandlingEtterKlage && (
          <button type="button" className={styles.buttonLink} onClick={forhandsvisVedtaksbrev}>
            <FormattedMessage id="ToTrinnsForm.ForhandvisBrev" />
          </button>
        )}
      </div>
    </form>
  );
};

interface FormState {
  aksjonspunkter: TotrinnskontrollAksjonspunkter[];
}

interface ToTrinnsFormImplProps extends InjectedFormProps {
  totrinnskontrollContext: Approvals[];
  formState: FormState[];
  forhandsvisVedtaksbrev: () => void;
  klageVurderingResultatNFP?: KlageVurderingResultat;
  klageVurderingResultatNK?: KlageVurderingResultat;
  behandlingKlageVurdering?: BehandlingKlageVurdering;
  erBehandlingEtterKlage?: boolean;
  readOnly: boolean;
  disableGodkjennKnapp: boolean;
  alleKodeverk: AlleKodeverk;
  isForeldrepengerFagsak: boolean;
  behandlingStatus: BehandlingStatusType;
}

interface Aksjonspunkter {
  feilFakta: boolean;
  feilLov: boolean;
  feilRegel: boolean;
  annet: boolean;
}

interface Approval {
  aksjonspunkter: Aksjonspunkter[];
}

const validate = (values: { approvals: Approval[] }) => {
  const errors: { approvals: object } = { approvals: {} };
  if (!values.approvals) {
    return errors;
  }

  errors.approvals = values.approvals.map(kontekst => ({
    aksjonspunkter: kontekst.aksjonspunkter.map(ap => {
      if (!ap.feilFakta && !ap.feilLov && !ap.feilRegel && !ap.annet) {
        return { missingArsakError: isRequiredMessage() };
      }

      return undefined;
    }),
  }));

  return errors;
};

const formName = 'toTrinnForm';

const mapStateToProps = (state: any, ownProps: { behandlingId: string, behandlingVersjon: string }) => ({
  formState: behandlingFormValueSelector(
    formName,
    ownProps.behandlingId,
    ownProps.behandlingVersjon,
  )(state, 'approvals'),
});
const ToTrinnsForm = behandlingForm({ form: formName, validate })(connect(mapStateToProps)(ToTrinnsFormImpl));

(ToTrinnsForm as any).formName = formName;

export default ToTrinnsForm;
