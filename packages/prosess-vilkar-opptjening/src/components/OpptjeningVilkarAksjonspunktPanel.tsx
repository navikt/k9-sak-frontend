import React, { FunctionComponent } from 'react';
import { InjectedFormProps } from 'redux-form';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Element } from 'nav-frontend-typografi';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import { VilkarResultPicker, ProsessStegBegrunnelseTextField, ProsessPanelTemplate } from '@k9-sak-web/prosess-felles';
import { Aksjonspunkt, Behandling, FastsattOpptjening } from '@k9-sak-web/types';

import OpptjeningVilkarView from './OpptjeningVilkarView';

const FORM_NAME = 'OpptjeningVilkarForm';

interface PureOwnProps {
  fastsattOpptjening: FastsattOpptjening;
  behandlingsresultat?: Behandling['behandlingsresultat'];
  aksjonspunkter: Aksjonspunkt[];
  status: string;
  isApOpen: boolean;
  readOnly: boolean;
  readOnlySubmitButton: boolean;
  behandlingId: number;
  behandlingVersjon: number;
  submitCallback: (aksjonspunktData: { kode: string }[]) => Promise<any>;
  lovReferanse?: string;
}

interface MappedOwnProps {
  erVilkarOk?: boolean;
  originalErVilkarOk?: boolean;
}

/**
 * OpptjeningVilkarAksjonspunktPanel
 *
 * Presentasjonskomponent. Viser panel for å løse aksjonspunkt for avslått opptjeningsvilkår
 */
export const OpptjeningVilkarAksjonspunktPanelImpl: FunctionComponent<
  PureOwnProps & MappedOwnProps & InjectedFormProps & WrappedComponentProps
> = ({
  intl,
  isApOpen,
  erVilkarOk,
  originalErVilkarOk,
  readOnlySubmitButton,
  readOnly,
  lovReferanse,
  behandlingId,
  behandlingVersjon,
  fastsattOpptjening,
  ...formProps
}) => (
  <ProsessPanelTemplate
    title={intl.formatMessage({ id: 'OpptjeningVilkarAksjonspunktPanel.Opptjeningsvilkaret' })}
    isAksjonspunktOpen={isApOpen}
    formName={formProps.form}
    handleSubmit={formProps.handleSubmit}
    isDirty={formProps.dirty}
    readOnlySubmitButton={readOnlySubmitButton}
    readOnly={readOnly}
    lovReferanse={lovReferanse}
    behandlingId={behandlingId}
    behandlingVersjon={behandlingVersjon}
    originalErVilkarOk={originalErVilkarOk}
    rendreFakta={() => (
      <>
        <VerticalSpacer sixteenPx />
        <OpptjeningVilkarView
          months={fastsattOpptjening.opptjeningperiode.måneder}
          days={fastsattOpptjening.opptjeningperiode.dager}
          fastsattOpptjeningActivities={fastsattOpptjening.fastsattOpptjeningAktivitetList}
          opptjeningFomDate={fastsattOpptjening.opptjeningFom}
          opptjeningTomDate={fastsattOpptjening.opptjeningTom}
        />
      </>
    )}
  >
    <Element>
      <FormattedMessage id="OpptjeningVilkarAksjonspunktPanel.SokerHarVurdertOpptjentRettTilPleiepenger" />
    </Element>

    <VilkarResultPicker
      erVilkarOk={erVilkarOk}
      readOnly={readOnly}
      customVilkarOppfyltText={<FormattedMessage id="OpptjeningVilkarAksjonspunktPanel.ErOppfylt" />}
      customVilkarIkkeOppfyltText={
        <FormattedMessage
          id="OpptjeningVilkarAksjonspunktPanel.ErIkkeOppfylt"
          values={{ b: chunks => <b>{chunks}</b> }}
        />
      }
    />
    <VerticalSpacer sixteenPx />
    <ProsessStegBegrunnelseTextField readOnly={readOnly} />
  </ProsessPanelTemplate>
);

export const buildInitialValues = createSelector(
  [
    (ownProps: PureOwnProps) => ownProps.behandlingsresultat,
    (ownProps: PureOwnProps) => ownProps.aksjonspunkter,
    (ownProps: PureOwnProps) => ownProps.status,
  ],
  (behandlingsresultat, aksjonspunkter, status) => ({
    // TODO (Hallvard) bytte fra behandlingsresultat til riktig vilkår (vilkårsresultat.avslagsårsak.kode)
    // @ts-ignore Fiks
    ...VilkarResultPicker.buildInitialValues(behandlingsresultat, aksjonspunkter, status),
    ...ProsessStegBegrunnelseTextField.buildInitialValues(aksjonspunkter),
  }),
);

interface FormValues {
  erVilkarOk: boolean;
  avslagCode: string;
  avslagDato: string;
  begrunnelse: string;
}

const transformValues = (values: FormValues, aksjonspunkter: Aksjonspunkt[]) => ({
  ...VilkarResultPicker.transformValues(values),
  ...ProsessStegBegrunnelseTextField.transformValues(values),
  ...{ kode: aksjonspunkter[0].definisjon.kode },
});

const lagSubmitFn = createSelector(
  [(ownProps: PureOwnProps) => ownProps.submitCallback, (ownProps: PureOwnProps) => ownProps.aksjonspunkter],
  (submitCallback, aksjonspunkter) => (values: FormValues) => submitCallback([transformValues(values, aksjonspunkter)]),
);

const mapStateToPropsFactory = (_initialState, initialOwnProps: PureOwnProps) => {
  const isOpenAksjonspunkt = initialOwnProps.aksjonspunkter.some(ap => isAksjonspunktOpen(ap.status.kode));
  const erVilkarOk = isOpenAksjonspunkt ? undefined : vilkarUtfallType.OPPFYLT === initialOwnProps.status;

  return (state, ownProps: PureOwnProps) => ({
    onSubmit: lagSubmitFn(ownProps),
    initialValues: buildInitialValues(ownProps),
    originalErVilkarOk: erVilkarOk,
    erVilkarOk: behandlingFormValueSelector(
      FORM_NAME,
      ownProps.behandlingId,
      ownProps.behandlingVersjon,
    )(state, 'erVilkarOk'),
  });
};

const OpptjeningVilkarAksjonspunktPanel = connect(mapStateToPropsFactory)(
  behandlingForm({
    form: FORM_NAME,
  })(injectIntl(OpptjeningVilkarAksjonspunktPanelImpl)),
);

export default OpptjeningVilkarAksjonspunktPanel;
