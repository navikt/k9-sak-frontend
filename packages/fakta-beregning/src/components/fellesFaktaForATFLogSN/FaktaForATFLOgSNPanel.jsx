import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import { createSelector, createStructuredSelector } from 'reselect';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import TidsbegrensetArbeidsforholdForm from './tidsbegrensetArbeidsforhold/TidsbegrensetArbeidsforholdForm';
import VurderMilitaer from './vurderMilitaer/VurderMilitaer';
import NyoppstartetFLForm from './vurderOgFastsettATFL/forms/NyoppstartetFLForm';
import {
  setFaktaPanelForKunYtelse,
  transformValuesForKunYtelse,
  getKunYtelseValidation,
  buildInitialValuesKunYtelse,
} from './kunYtelse/FastsettBgKunYtelse';
import LonnsendringForm from './vurderOgFastsettATFL/forms/LonnsendringForm';
import NyIArbeidslivetSNForm from './nyIArbeidslivet/NyIArbeidslivetSNForm';
import VurderOgFastsettATFL from './vurderOgFastsettATFL/VurderOgFastsettATFL';
import VurderEtterlonnSluttpakkeForm from './vurderOgFastsettATFL/forms/VurderEtterlonnSluttpakkeForm';
import VurderMottarYtelseForm from './vurderOgFastsettATFL/forms/VurderMottarYtelseForm';
import VurderRefusjonForm from './vurderrefusjon/VurderRefusjonForm';
import beregningAksjonspunkterPropType from '../../propTypes/beregningAksjonspunkterPropType';

const { VURDER_FAKTA_FOR_ATFL_SN } = aksjonspunktCodes;

export const getFaktaOmBeregning = createSelector(
  [ownProps => ownProps.beregningsgrunnlag],
  (beregningsgrunnlag = {}) => (beregningsgrunnlag ? beregningsgrunnlag.faktaOmBeregning : undefined),
);
export const getVurderMottarYtelse = createSelector([getFaktaOmBeregning], (faktaOmBeregning = {}) =>
  faktaOmBeregning ? faktaOmBeregning.vurderMottarYtelse : undefined,
);

export const getArbeidsgiverInfoForRefusjonskravSomKommerForSent = createSelector(
  [getFaktaOmBeregning],
  (faktaOmBeregning = {}) => {
    if (faktaOmBeregning && faktaOmBeregning.refusjonskravSomKommerForSentListe) {
      return faktaOmBeregning.refusjonskravSomKommerForSentListe;
    }
    return [];
  },
);

export const validationForVurderFakta = values => {
  if (!values) {
    return {};
  }
  const { faktaOmBeregning, beregningsgrunnlag, tilfeller, kunYtelse, vurderMottarYtelse } = values;
  if (!faktaOmBeregning || !beregningsgrunnlag || !tilfeller) {
    return {};
  }
  return {
    ...getKunYtelseValidation(values, kunYtelse, tilfeller),
    ...VurderMottarYtelseForm.validate(values, vurderMottarYtelse),
    ...VurderOgFastsettATFL.validate(values, tilfeller, faktaOmBeregning, beregningsgrunnlag),
  };
};

const spacer = hasShownPanel => {
  if (hasShownPanel) {
    return <VerticalSpacer twentyPx />;
  }
  return {};
};

const getFaktaPanels = (
  readOnly,
  tilfeller,
  isAksjonspunktClosed,
  faktaOmBeregning,
  beregningsgrunnlag,
  behandlingId,
  behandlingVersjon,
  alleKodeverk,
  arbeidsgiverOpplysningerPerId,
  aksjonspunkter,
  erOverstyrer,
  fieldArrayID,
) => {
  const faktaPanels = [];
  let hasShownPanel = false;
  tilfeller.forEach(tilfelle => {
    if (tilfelle === faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD) {
      hasShownPanel = true;
      faktaPanels.push(
        <React.Fragment key={tilfelle}>
          <TidsbegrensetArbeidsforholdForm
            readOnly={readOnly}
            isAksjonspunktClosed={isAksjonspunktClosed}
            faktaOmBeregning={faktaOmBeregning}
            alleKodeverk={alleKodeverk}
            fieldArrayID={fieldArrayID}
          />
        </React.Fragment>,
      );
    }
    if (tilfelle === faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET) {
      hasShownPanel = true;
      faktaPanels.push(
        <React.Fragment key={tilfelle}>
          {spacer(hasShownPanel)}
          <NyIArbeidslivetSNForm
            readOnly={readOnly}
            isAksjonspunktClosed={isAksjonspunktClosed}
            fieldArrayID={fieldArrayID}
          />
        </React.Fragment>,
      );
    }
    if (tilfelle === faktaOmBeregningTilfelle.VURDER_MILITÆR_SIVILTJENESTE) {
      hasShownPanel = true;
      faktaPanels.push(
        <React.Fragment key={tilfelle}>
          <VurderMilitaer readOnly={readOnly} isAksjonspunktClosed={isAksjonspunktClosed} fieldArrayID={fieldArrayID} />
        </React.Fragment>,
      );
    }
    if (tilfelle === faktaOmBeregningTilfelle.VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT) {
      hasShownPanel = true;
      faktaPanels.push(
        <React.Fragment key={tilfelle}>
          <VurderRefusjonForm
            readOnly={readOnly}
            isAksjonspunktClosed={isAksjonspunktClosed}
            faktaOmBeregning={faktaOmBeregning}
            fieldArrayID={fieldArrayID}
          />
        </React.Fragment>,
      );
    }
  });
  setFaktaPanelForKunYtelse(
    faktaPanels,
    tilfeller,
    readOnly,
    isAksjonspunktClosed,
    faktaOmBeregning,
    behandlingId,
    behandlingVersjon,
    alleKodeverk,
    fieldArrayID,
  );
  faktaPanels.push(
    <React.Fragment key="VurderOgFastsettATFL">
      {spacer(true)}
      <VurderOgFastsettATFL
        readOnly={readOnly}
        isAksjonspunktClosed={isAksjonspunktClosed}
        tilfeller={tilfeller}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        faktaOmBeregning={faktaOmBeregning}
        beregningsgrunnlag={beregningsgrunnlag}
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        erOverstyrer={erOverstyrer}
        aksjonspunkter={aksjonspunkter}
        fieldArrayID={fieldArrayID}
      />
    </React.Fragment>,
  );
  return faktaPanels;
};

/**
 * FaktaForArbeidstakerFLOgSNPanel
 *
 * Container komponent.. Inneholder paneler for felles faktaavklaring for aksjonspunktet Vurder fakta for arbeidstaker, frilans og selvstendig næringsdrivende
 */
export const FaktaForATFLOgSNPanelImpl = ({
  readOnly,
  aktivePaneler,
  isAksjonspunktClosed,
  faktaOmBeregning,
  behandlingId,
  behandlingVersjon,
  beregningsgrunnlag,
  alleKodeverk,
  arbeidsgiverOpplysningerPerId,
  aksjonspunkter,
  erOverstyrer,
  fieldArrayID,
}) => (
  <div>
    {getFaktaPanels(
      readOnly,
      aktivePaneler,
      isAksjonspunktClosed,
      faktaOmBeregning,
      beregningsgrunnlag,
      behandlingId,
      behandlingVersjon,
      alleKodeverk,
      arbeidsgiverOpplysningerPerId,
      aksjonspunkter,
      erOverstyrer,
      fieldArrayID,
    ).map(panelOrSpacer => panelOrSpacer)}
  </div>
);

FaktaForATFLOgSNPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  aktivePaneler: PropTypes.arrayOf(PropTypes.string).isRequired,
  faktaOmBeregning: PropTypes.shape().isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  beregningsgrunnlag: PropTypes.shape().isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
  aksjonspunkter: PropTypes.arrayOf(beregningAksjonspunkterPropType).isRequired,
  erOverstyrer: PropTypes.bool.isRequired,
  fieldArrayID: PropTypes.string.isRequired,
};

const kunYtelseTransform = (faktaOmBeregning, aktivePaneler) => values =>
  transformValuesForKunYtelse(values, faktaOmBeregning.kunYtelse, aktivePaneler);

const nyIArbeidslivetTransform = (vurderFaktaValues, values) => {
  vurderFaktaValues.faktaOmBeregningTilfeller.push(faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET);
  return {
    ...vurderFaktaValues,
    ...NyIArbeidslivetSNForm.transformValues(values),
  };
};

const kortvarigeArbeidsforholdTransform = kortvarigeArbeidsforhold => (vurderFaktaValues, values) => {
  vurderFaktaValues.faktaOmBeregningTilfeller.push(faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD);
  return {
    ...vurderFaktaValues,
    ...TidsbegrensetArbeidsforholdForm.transformValues(values, kortvarigeArbeidsforhold),
  };
};

const vurderMilitaerSiviltjenesteTransform = (vurderFaktaValues, values) => {
  vurderFaktaValues.faktaOmBeregningTilfeller.push(faktaOmBeregningTilfelle.VURDER_MILITÆR_SIVILTJENESTE);
  return {
    ...vurderFaktaValues,
    ...VurderMilitaer.transformValues(values),
  };
};

const vurderRefusjonskravTransform = faktaOmBeregning => (vurderFaktaValues, values) => {
  vurderFaktaValues.faktaOmBeregningTilfeller.push(
    faktaOmBeregningTilfelle.VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT,
  );
  return {
    ...vurderFaktaValues,
    ...VurderRefusjonForm.transformValues(faktaOmBeregning.refusjonskravSomKommerForSentListe)(values),
  };
};

export const transformValues = (
  tilfeller,
  nyIArbTransform,
  kortvarigTransform,
  militaerTransform,
  vurderRefusjonTransform,
) => (vurderFaktaValues, values) => {
  if (tilfeller.length === 0) {
    return null;
  }
  let transformed = { ...vurderFaktaValues };
  tilfeller.forEach(kode => {
    if (kode === faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET) {
      transformed = nyIArbTransform(transformed, values);
    }
    if (kode === faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD) {
      transformed = kortvarigTransform(transformed, values);
    }
    if (kode === faktaOmBeregningTilfelle.VURDER_MILITÆR_SIVILTJENESTE) {
      transformed = militaerTransform(transformed, values);
    }
    if (kode === faktaOmBeregningTilfelle.VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT) {
      transformed = vurderRefusjonTransform(transformed, values);
    }
  });
  return transformed;
};

export const setInntektValues = (
  aktivePaneler,
  fatsettKunYtelseTransform,
  vurderOgFastsettATFLTransform,
  erOverstyrt,
) => values => {
  if (aktivePaneler.includes(faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE)) {
    return { fakta: fatsettKunYtelseTransform(values), overstyrteAndeler: [] };
  }
  return { ...vurderOgFastsettATFLTransform(values, erOverstyrt) };
};

const setValuesForVurderFakta = (
  tilfeller,
  values,
  kortvarigeArbeidsforhold,
  faktaOmBeregning,
  beregningsgrunnlag,
  erOverstyrt,
) => {
  const vurderFaktaValues = setInntektValues(
    tilfeller,
    kunYtelseTransform(faktaOmBeregning, tilfeller),
    VurderOgFastsettATFL.transformValues(faktaOmBeregning, beregningsgrunnlag),
    erOverstyrt,
  )(values);
  return {
    fakta: transformValues(
      tilfeller,
      nyIArbeidslivetTransform,
      kortvarigeArbeidsforholdTransform(kortvarigeArbeidsforhold),
      vurderMilitaerSiviltjenesteTransform,
      vurderRefusjonskravTransform(faktaOmBeregning),
    )(vurderFaktaValues.fakta, values),
    overstyrteAndeler: vurderFaktaValues.overstyrteAndeler,
  };
};

export const transformValuesFaktaForATFLOgSN = (values, erOverstyrt) => {
  const { tilfeller, kortvarigeArbeidsforhold, faktaOmBeregning, beregningsgrunnlag } = values;
  return setValuesForVurderFakta(
    tilfeller,
    values,
    kortvarigeArbeidsforhold,
    faktaOmBeregning,
    beregningsgrunnlag,
    erOverstyrt,
  );
};

const getVurderFaktaAksjonspunkt = createSelector([ownProps => ownProps.aksjonspunkter], aksjonspunkter =>
  aksjonspunkter ? aksjonspunkter.find(ap => ap.definisjon.kode === VURDER_FAKTA_FOR_ATFL_SN) : undefined,
);

const buildInitialValuesForTilfeller = (props, beregningsgrunnlag) => ({
  ...TidsbegrensetArbeidsforholdForm.buildInitialValues(props.kortvarigeArbeidsforhold),
  ...VurderMilitaer.buildInitialValues(props.faktaOmBeregning, props.vurderFaktaAP),
  ...NyIArbeidslivetSNForm.buildInitialValues(beregningsgrunnlag),
  ...LonnsendringForm.buildInitialValues(beregningsgrunnlag),
  ...NyoppstartetFLForm.buildInitialValues(beregningsgrunnlag),
  ...buildInitialValuesKunYtelse(props.kunYtelse, props.tilfeller, props.faktaOmBeregning.andelerForFaktaOmBeregning),
  ...VurderEtterlonnSluttpakkeForm.buildInitialValues(beregningsgrunnlag, props.vurderFaktaAP),
  ...VurderMottarYtelseForm.buildInitialValues(props.vurderMottarYtelse),
  ...VurderOgFastsettATFL.buildInitialValues(props.aksjonspunkter, props.faktaOmBeregning),
  ...VurderRefusjonForm.buildInitialValues(props.tilfeller, props.refusjonskravSomKommerForSentListe),
});

const getFaktaOmBeregningTilfellerKoder = faktaOmBeregning => {
  return faktaOmBeregning && faktaOmBeregning.faktaOmBeregningTilfeller
    ? faktaOmBeregning.faktaOmBeregningTilfeller.map(({ kode }) => kode)
    : [];
};

const mapStateToBuildInitialValuesProps = createStructuredSelector({
  beregningsgrunnlag: (ownProps, beregningsgrunnlag) => beregningsgrunnlag,
  kortvarigeArbeidsforhold: (ownProps, beregningsgrunnlag) =>
    beregningsgrunnlag.faktaOmBeregning?.kortvarigeArbeidsforhold,
  vurderFaktaAP: getVurderFaktaAksjonspunkt,
  kunYtelse: (ownProps, beregningsgrunnlag) => beregningsgrunnlag.faktaOmBeregning?.kunYtelse,
  tilfeller: (ownProps, beregningsgrunnlag) => {
    const tilfeller = getFaktaOmBeregningTilfellerKoder(beregningsgrunnlag.faktaOmBeregning);
    return tilfeller;
  },
  vurderMottarYtelse: (ownProps, beregningsgrunnlag) => beregningsgrunnlag.faktaOmBeregning?.vurderMottarYtelse,
  alleKodeverk: ownProps => ownProps.alleKodeverk,
  aksjonspunkter: ownProps => ownProps.aksjonspunkter,
  faktaOmBeregning: (ownProps, beregningsgrunnlag) => beregningsgrunnlag.faktaOmBeregning,
  refusjonskravSomKommerForSentListe: getArbeidsgiverInfoForRefusjonskravSomKommerForSent,
});

export const getBuildInitialValuesFaktaForATFLOgSN = createSelector(
  [mapStateToBuildInitialValuesProps, (ownProps, beregningsgrunnlag) => beregningsgrunnlag],
  (props, beregningsgrunnlag) => () => {
    return {
      tilfeller: props.tilfeller,
      kortvarigeArbeidsforhold: props.kortvarigeArbeidsforhold,
      faktaOmBeregning: props.faktaOmBeregning,
      beregningsgrunnlag,
      vurderMottarYtelse: props.vurderMottarYtelse,
      kunYtelse: props.kunYtelse,
      ...buildInitialValuesForTilfeller(props),
    };
  },
);

const emptyArray = [];

const mapStateToProps = (state, ownProps) => ({
  faktaOmBeregning: getFaktaOmBeregning(ownProps),
  aktivePaneler: getFaktaOmBeregningTilfellerKoder(ownProps)
    ? getFaktaOmBeregningTilfellerKoder(ownProps.beregningsgrunnlag?.faktaOmBeregning)
    : emptyArray,
});

export default connect(mapStateToProps)(FaktaForATFLOgSNPanelImpl);
