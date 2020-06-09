import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import { formatCurrencyNoKr, removeSpacesFromNumber } from '@fpsak-frontend/utils';
import BrukersAndelFieldArray from './BrukersAndelFieldArray';
import KunYtelseBesteberegningPanel from './KunYtelseBesteberegningPanel';
import KunYtelseUtenBesteberegningPanel from './KunYtelseUtenBesteberegningPanel';
import { setGenerellAndelsinfo } from '../BgFordelingUtils';

export const brukersAndelFieldArrayName = 'brukersAndelBG';

/**
 * KunYtelsePanel
 *
 * Presentasjonskomponent. Behandling av aksjonspunktet for fastsetting av bg for kun ytelse.
 */

const KunYtelsePanel = ({
  readOnly,
  skalSjekkeBesteberegning,
  isAksjonspunktClosed,
  skalViseInntektstabell,
  behandlingVersjon,
  behandlingId,
  alleKodeverk,
  fieldArrayID,
}) => (
  <div>
    {skalSjekkeBesteberegning && (
      <KunYtelseBesteberegningPanel
        readOnly={readOnly}
        isAksjonspunktClosed={isAksjonspunktClosed}
        brukersAndelFieldArrayName={brukersAndelFieldArrayName}
        skalViseInntektstabell={skalViseInntektstabell}
        alleKodeverk={alleKodeverk}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        fieldArrayID={fieldArrayID}
      />
    )}
    {!skalSjekkeBesteberegning && skalViseInntektstabell && (
      <KunYtelseUtenBesteberegningPanel
        readOnly={readOnly}
        brukersAndelFieldArrayName={brukersAndelFieldArrayName}
        isAksjonspunktClosed={isAksjonspunktClosed}
        alleKodeverk={alleKodeverk}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        fieldArrayID={fieldArrayID}
      />
    )}
  </div>
);

KunYtelsePanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  skalSjekkeBesteberegning: PropTypes.bool.isRequired,
  skalViseInntektstabell: PropTypes.bool,
  alleKodeverk: PropTypes.shape().isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  fieldArrayID: PropTypes.string.isRequired,
};

KunYtelsePanel.defaultProps = {
  skalViseInntektstabell: true,
};

KunYtelsePanel.buildInitialValues = (kunYtelse, faktaOmBeregningAndeler) => {
  if (!kunYtelse || !kunYtelse.andeler || kunYtelse.andeler.length === 0) {
    return {};
  }
  const initialValues = {
    [brukersAndelFieldArrayName]: kunYtelse.andeler.map(andel => {
      const andelMedInfo = faktaOmBeregningAndeler.find(faktaAndel => faktaAndel.andelsnr === andel.andelsnr);
      return {
        ...setGenerellAndelsinfo(andelMedInfo),
        fastsattBelop:
          andel.fastsattBelopPrMnd || andel.fastsattBelopPrMnd === 0
            ? formatCurrencyNoKr(andel.fastsattBelopPrMnd)
            : '',
      };
    }),
  };
  if (kunYtelse.fodendeKvinneMedDP) {
    return {
      ...KunYtelseBesteberegningPanel.buildInitialValues(kunYtelse),
      ...initialValues,
    };
  }
  return initialValues;
};

KunYtelsePanel.summerFordeling = values =>
  values[brukersAndelFieldArrayName]
    .map(({ fastsattBelop }) => (fastsattBelop ? removeSpacesFromNumber(fastsattBelop) : 0))
    .reduce((sum, fastsattBelop) => sum + fastsattBelop, 0);

KunYtelsePanel.transformValues = (values, kunYtelse) => ({
  kunYtelseFordeling: {
    andeler: values[brukersAndelFieldArrayName].map(fieldValue => ({
      andelsnr: fieldValue.andelsnr,
      fastsattBeløp: removeSpacesFromNumber(fieldValue.fastsattBelop),
      inntektskategori: fieldValue.inntektskategori,
      nyAndel: fieldValue.nyAndel,
      lagtTilAvSaksbehandler: fieldValue.lagtTilAvSaksbehandler,
    })),
    skalBrukeBesteberegning: kunYtelse.fodendeKvinneMedDP ? KunYtelseBesteberegningPanel.transformValues(values) : null,
  },
});

KunYtelsePanel.validate = (values, aktivertePaneler, kunYtelse) => {
  if (!values || !aktivertePaneler.includes(faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE)) {
    return {};
  }
  const errors = {};
  errors[brukersAndelFieldArrayName] = BrukersAndelFieldArray.validate(values[brukersAndelFieldArrayName]);
  if (kunYtelse.fodendeKvinneMedDP) {
    return {
      ...errors,
      ...KunYtelseBesteberegningPanel.validate(values),
    };
  }
  return errors;
};

const mapStateToProps = (state, ownProps) => {
  const { kunYtelse } = ownProps.faktaOmBeregning;
  return {
    skalSjekkeBesteberegning: kunYtelse.fodendeKvinneMedDP,
  };
};

export default connect(mapStateToProps)(KunYtelsePanel);
