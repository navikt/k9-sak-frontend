import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import vedtakResultType from '../../kodeverk/vedtakResultType';
import VedtakAvslagArsakOgBegrunnelsePanel from '../VedtakAvslagArsakOgBegrunnelsePanel';
import { findTilbakekrevingText, findAvslagResultatText } from '../VedtakHelper';
import vedtakVarselPropType from '../../propTypes/vedtakVarselPropType';

export const isNewBehandlingResult = (beregningResultat, originaltBeregningResultat) => {
  const vedtakResult = beregningResultat ? vedtakResultType.INNVILGET : vedtakResultType.AVSLAG;
  const vedtakResultOriginal = originaltBeregningResultat ? vedtakResultType.INNVILGET : vedtakResultType.AVSLAG;
  return vedtakResultOriginal !== vedtakResult;
};

export const isNewAmount = (beregningResultat, originaltBeregningResultat) => {
  if (beregningResultat === null) {
    return false;
  }
  return beregningResultat.antallBarn !== originaltBeregningResultat.antallBarn;
};

const resultText = (beregningResultat, originaltBeregningResultat) => {
  if (isNewBehandlingResult(beregningResultat, originaltBeregningResultat)) {
    return beregningResultat ? 'VedtakForm.Resultat.EndretTilInnvilget' : 'VedtakForm.Resultat.EndretTilAvslag';
  }
  return isNewAmount(beregningResultat, originaltBeregningResultat)
    ? 'VedtakForm.Resultat.EndretAntallBarn'
    : 'VedtakForm.Resultat.IngenEndring';
};

export const VedtakAvslagRevurderingPanelImpl = ({
  intl,
  beregningResultat,
  behandlingStatusKode,
  vilkar,
  aksjonspunkter,
  sprakkode,
  readOnly,
  originaltBeregningResultat,
  tilbakekrevingText,
  alleKodeverk,
  vedtakVarsel,
  ytelseTypeKode,
}) => (
  <div>
    <Undertekst>{intl.formatMessage({ id: 'VedtakForm.Resultat' })}</Undertekst>
    {(ytelseTypeKode === fagsakYtelseType.FRISINN || ytelseTypeKode === fagsakYtelseType.OMSORGSPENGER) && (
      <Normaltekst>
        {intl.formatMessage({ id: findAvslagResultatText(undefined, ytelseTypeKode) })}
        {tilbakekrevingText && `. ${intl.formatMessage({ id: tilbakekrevingText })}`}
      </Normaltekst>
    )}
    {ytelseTypeKode !== fagsakYtelseType.FRISINN && (
      <Normaltekst>
        {intl.formatMessage({ id: resultText(beregningResultat, originaltBeregningResultat) })}
        {tilbakekrevingText && `. ${intl.formatMessage({ id: tilbakekrevingText })}`}
      </Normaltekst>
    )}
    <VerticalSpacer sixteenPx />
    <VedtakAvslagArsakOgBegrunnelsePanel
      intl={intl}
      behandlingStatusKode={behandlingStatusKode}
      vilkar={vilkar}
      aksjonspunkter={aksjonspunkter}
      vedtakVarsel={vedtakVarsel}
      sprakkode={sprakkode}
      readOnly={readOnly}
      alleKodeverk={alleKodeverk}
    />
  </div>
);

VedtakAvslagRevurderingPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  beregningResultat: PropTypes.shape(),
  behandlingStatusKode: PropTypes.string.isRequired,
  vilkar: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  sprakkode: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  originaltBeregningResultat: PropTypes.shape(),
  tilbakekrevingText: PropTypes.string,
  alleKodeverk: PropTypes.shape().isRequired,
  vedtakVarsel: vedtakVarselPropType,
  ytelseTypeKode: PropTypes.string.isRequired,
};

VedtakAvslagRevurderingPanelImpl.defaultProps = {
  originaltBeregningResultat: undefined,
  beregningResultat: undefined,
  tilbakekrevingText: null,
};

const mapStateToProps = (state, ownProps) => ({
  tilbakekrevingText: findTilbakekrevingText(ownProps),
});

export default connect(mapStateToProps)(injectIntl(VedtakAvslagRevurderingPanelImpl));
