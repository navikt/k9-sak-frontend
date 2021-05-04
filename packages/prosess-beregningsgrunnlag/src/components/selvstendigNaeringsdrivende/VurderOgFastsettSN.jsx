import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { behandlingFormValueSelector } from '@fpsak-frontend/form';
import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';

import VurderVarigEndretEllerNyoppstartetSN from './VurderVarigEndretEllerNyoppstartetSN';
import FastsettSN from './FastsettSN';
import beregningsgrunnlagAksjonspunkterPropType from '../../propTypes/beregningsgrunnlagAksjonspunkterPropType';

const FORM_NAME = 'BeregningForm';
const {
  FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
  VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
} = aksjonspunktCodes;

const finnSnAksjonspunkt = aksjonspunkter =>
  aksjonspunkter &&
  aksjonspunkter.find(
    ap =>
      ap.definisjon.kode === VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE ||
      ap.definisjon.kode === FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
  );

/**
 * VurderOgFastsettSNImpl
 *
 * Containerkomponent. Setter opp riktige forms basert på hvilket aksjonspunkt vi har og hva som er valgt i radioknapper
 */
export const VurderOgFastsettSNImpl = ({
  readOnly,
  erVarigEndretNaering,
  isAksjonspunktClosed,
  erNyArbLivet,
  erNyoppstartet,
  erVarigEndring,
  gjeldendeAksjonspunkter,
  endretTekst,
  fieldArrayID,
}) => {
  if (erNyArbLivet) {
    return (
      <FastsettSN
        readOnly={readOnly}
        isAksjonspunktClosed={isAksjonspunktClosed}
        gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
        erNyArbLivet={erNyArbLivet}
        fieldArrayID={fieldArrayID}
      />
    );
  }
  return (
    <>
      <VurderVarigEndretEllerNyoppstartetSN
        readOnly={readOnly}
        isAksjonspunktClosed={isAksjonspunktClosed}
        erVarigEndring={erVarigEndring}
        erNyoppstartet={erNyoppstartet}
        erVarigEndretNaering={erVarigEndretNaering}
        gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
        endretTekst={endretTekst}
        fieldArrayID={fieldArrayID}
      />
      {erVarigEndretNaering && (
        <FastsettSN
          readOnly={readOnly}
          isAksjonspunktClosed={isAksjonspunktClosed}
          gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
          erNyArbLivet={erNyArbLivet}
          endretTekst={endretTekst}
          fieldArrayID={fieldArrayID}
        />
      )}
    </>
  );
};

VurderOgFastsettSNImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  erVarigEndretNaering: PropTypes.bool,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  erNyArbLivet: PropTypes.bool.isRequired,
  erVarigEndring: PropTypes.bool.isRequired,
  erNyoppstartet: PropTypes.bool.isRequired,
  endretTekst: PropTypes.node,
  gjeldendeAksjonspunkter: PropTypes.arrayOf(beregningsgrunnlagAksjonspunkterPropType).isRequired,
  fieldArrayID: PropTypes.string.isRequired,
};

VurderOgFastsettSNImpl.defaultProps = {
  erVarigEndretNaering: undefined,
};

const mapStateToPropsFactory = (initialState, ownPropsStatic) => {
  const aksjonspunkt = finnSnAksjonspunkt(ownPropsStatic.gjeldendeAksjonspunkter);
  return (state, ownProps) => ({
    erVarigEndretNaering: behandlingFormValueSelector(
      FORM_NAME,
      ownProps.behandlingId,
      ownProps.behandlingVersjon,
    )(state, `${ownProps.fieldArrayID}.erVarigEndretNaering`),
    isAksjonspunktClosed: !isAksjonspunktOpen(aksjonspunkt.status.kode),
    fieldArrayID: ownProps.fieldArrayID,
  });
};

const VurderOgFastsettSN = connect(mapStateToPropsFactory)(VurderOgFastsettSNImpl);

VurderOgFastsettSN.buildInitialValues = (relevanteAndeler, gjeldendeAksjonspunkter) => ({
  ...VurderVarigEndretEllerNyoppstartetSN.buildInitialValues(relevanteAndeler, gjeldendeAksjonspunkter),
  ...FastsettSN.buildInitialValues(relevanteAndeler, gjeldendeAksjonspunkter),
});

VurderOgFastsettSN.transformValues = (values, gjeldendeAksjonspunkter) => {
  if (hasAksjonspunkt(FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET, gjeldendeAksjonspunkter)) {
    return FastsettSN.transformValuesNyIArbeidslivet(values);
  }
  return VurderVarigEndretEllerNyoppstartetSN.transformValues(values);
};

export default VurderOgFastsettSN;
