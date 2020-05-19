import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import VedtakFritekstPanel from '../VedtakFritekstPanel';
import vedtakVarselPropType from '../../propTypes/vedtakVarselPropType';

const ytelseNavnMap = kode => {
  switch (kode) {
    case fagsakYtelseType.FRISINN:
      return 'Frilans og selvstendig næringsdrivende inntektskompensasjon';
    case fagsakYtelseType.OMSORGSPENGER:
      return 'Omsorgspenger';
    case fagsakYtelseType.PLEIEPENGER:
      return 'Pleiepenger';
    default:
      return 'Ytelsen';
  }
};

export const VedtakOpphorRevurderingPanelImpl = ({
  intl,
  opphoersdato,
  revurderingsAarsakString,
  sprakKode,
  readOnly,
  vedtakVarsel,
  ytelseTypeKode,
  beregningErManueltFastsatt,
}) => (
  <div>
    <Undertekst>{intl.formatMessage({ id: 'VedtakForm.Resultat' })}</Undertekst>
    <Normaltekst>
      {intl.formatMessage(
        {
          id: 'VedtakForm.Revurdering.Opphoerer',
        },
        { ytelse: ytelseNavnMap(ytelseTypeKode), dato: moment(opphoersdato).format(DDMMYYYY_DATE_FORMAT) },
      )}
    </Normaltekst>
    <VerticalSpacer sixteenPx />
    <Undertekst>{intl.formatMessage({ id: 'VedtakForm.RevurderingFP.Aarsak' })}</Undertekst>
    {revurderingsAarsakString !== undefined && <Normaltekst>{revurderingsAarsakString}</Normaltekst>}
    {beregningErManueltFastsatt && (
      <VedtakFritekstPanel
        readOnly={readOnly}
        sprakkode={sprakKode}
        labelTextCode="VedtakForm.Fritekst.Beregningsgrunnlag"
        vedtakVarsel={vedtakVarsel}
      />
    )}
  </div>
);

VedtakOpphorRevurderingPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  opphoersdato: PropTypes.string,
  revurderingsAarsakString: PropTypes.string,
  sprakKode: PropTypes.shape(),
  readOnly: PropTypes.bool.isRequired,
  vedtakVarsel: vedtakVarselPropType,
  ytelseTypeKode: PropTypes.string.isRequired,
  beregningErManueltFastsatt: PropTypes.bool.isRequired,
};

VedtakOpphorRevurderingPanelImpl.defaultProps = {
  opphoersdato: '',
  revurderingsAarsakString: undefined,
  sprakKode: undefined,
};

const getOpphorsdato = createSelector(
  [
    ownProps => ownProps.resultatstruktur,
    ownProps => ownProps.medlemskapFom,
    ownProps => ownProps.vedtakVarsel,
    ownProps => ownProps.behandlingsresultat,
  ],
  (resultatstruktur, medlemskapFom, vedtakVarsel, behandlingsresultat) => {
    if (resultatstruktur && resultatstruktur.opphoersdato) {
      return resultatstruktur.opphoersdato;
    }
    if (medlemskapFom) {
      return medlemskapFom;
    }
    if (behandlingsresultat && behandlingsresultat.skjæringstidspunkt) {
      return behandlingsresultat.skjæringstidspunkt.dato;
    }
    return vedtakVarsel.skjæringstidspunkt ? vedtakVarsel.skjæringstidspunkt.dato : '';
  },
);

const mapStateToProps = (state, ownProps) => ({
  opphoersdato: getOpphorsdato(ownProps),
});

export default connect(mapStateToProps)(injectIntl(VedtakOpphorRevurderingPanelImpl));
