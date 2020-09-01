import React from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Hovedknapp } from 'nav-frontend-knapper';

import { ariaCheck, isRequiredMessage } from '@fpsak-frontend/utils';
import { behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import {AlertStripeInfo} from "nav-frontend-alertstriper";
import ApprovalField from './ApprovalField';

import styles from './ToTrinnsForm.less';

const allApproved = (formState) => formState
  .reduce((a, b) => a.concat(b.aksjonspunkter), [])
  .every((ap) => ap.totrinnskontrollGodkjent && ap.totrinnskontrollGodkjent === true);

const allSelected = (formState) => formState
  .reduce((a, b) => a.concat(b.aksjonspunkter), [])
  .every((ap) => ap.totrinnskontrollGodkjent !== null);


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
                                   erTilbakekreving,
                                   tilgjengeligeVedtaksbrev,
                                   ...formProps
                                 }) => {
  if (formState.length !== totrinnskontrollContext.length) {
    return null;
  }

  const erKlage = !!behandlingKlageVurdering.klageVurderingResultatNFP || !!behandlingKlageVurdering.klageVurderingResultatNK;
  const isTilgjengeligeVedtaksbrevArray = Array.isArray(tilgjengeligeVedtaksbrev);
  const harTilgjengeligeVedtaksbrev = !isTilgjengeligeVedtaksbrevArray || !!tilgjengeligeVedtaksbrev.length;

  return (
    <form name="toTrinn" onSubmit={handleSubmit}>
      {totrinnskontrollContext.map(({
                                      contextCode, skjermlenke, aksjonspunkter, skjermlenkeNavn,
                                    }, contextIndex) => {
        if (aksjonspunkter.length > 0) {
          return (
            <div key={contextCode}>
              <NavLink to={skjermlenke} onClick={() => window.scroll(0, 0)} className={styles.lenke}>
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
                    klageKA={!!behandlingKlageVurdering.klageVurderingResultatNK}
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
        {harTilgjengeligeVedtaksbrev && !erKlage && !erBehandlingEtterKlage && !erTilbakekreving && (
          <>
            <VerticalSpacer eightPx />
            <button
              type="button"
              className={styles.buttonLink}
              onClick={forhandsvisVedtaksbrev}
            >
              <FormattedMessage id="ToTrinnsForm.ForhandvisBrev" />
            </button>
          </>
        )}
        {!harTilgjengeligeVedtaksbrev && (
          <AlertStripeInfo className={styles.infoIkkeVedtaksbrev}>
            <FormattedMessage id="ToTrinnsForm.IkkeVedtaksbrev"/>
          </AlertStripeInfo>
          )}
      </div>
    </form>
  );
};

ToTrinnsFormImpl.propTypes = {
  ...formPropTypes,
  totrinnskontrollContext: PropTypes.arrayOf(PropTypes.shape({})),
  formState: PropTypes.arrayOf(PropTypes.shape({})),
  forhandsvisVedtaksbrev: PropTypes.func.isRequired,
  klageVurderingResultatNFP: PropTypes.shape(),
  klageVurderingResultatNK: PropTypes.shape(),
  behandlingKlageVurdering: PropTypes.shape(),
  erBehandlingEtterKlage: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  disableGodkjennKnapp: PropTypes.bool.isRequired,
  erTilbakekreving: PropTypes.bool,
  tilgjengeligeVedtaksbrev: PropTypes.arrayOf(PropTypes.string),
};

ToTrinnsFormImpl.defaultProps = {
  klageVurderingResultatNFP: undefined,
  klageVurderingResultatNK: undefined,
  totrinnskontrollContext: [],
  formState: [{ aksjonspunkter: [] }],
  behandlingKlageVurdering: {},
  erTilbakekreving: false,
  tilgjengeligeVedtaksbrev: undefined,
};

const validate = (values) => {
  const errors = {};
  if (!values.approvals) {
    return errors;
  }

  errors.approvals = values.approvals.map((kontekst) => ({
    aksjonspunkter: kontekst.aksjonspunkter.map((ap) => {
      if (!ap.feilFakta && !ap.feilLov && !ap.feilRegel && !ap.annet) {
        return { missingArsakError: isRequiredMessage() };
      }

      return undefined;
    }),
  }));

  return errors;
};

const formName = 'toTrinnForm';

const mapStateToProps = (state, ownProps) => ({
  formState: behandlingFormValueSelector(formName, ownProps.behandlingId, ownProps.behandlingVersjon)(state, 'approvals'),
});
const ToTrinnsForm = behandlingForm({ form: formName, validate })(connect(mapStateToProps)(ToTrinnsFormImpl));

ToTrinnsForm.formName = formName;

export default ToTrinnsForm;
