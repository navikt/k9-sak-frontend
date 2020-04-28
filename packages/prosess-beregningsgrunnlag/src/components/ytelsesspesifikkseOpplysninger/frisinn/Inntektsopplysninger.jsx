import React from 'react';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';

import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import beregningStyles from '../../beregningsgrunnlagPanel/beregningsgrunnlag.less';
import beregningsgrunnlagPropType from '../../../propTypes/beregningsgrunnlagPropType';

const finnSamletBruttoForStatus = (andeler, status) => {
  if (!andeler) {
    return 0;
  }
  return andeler
    .filter(a => a.aktivitetStatus.kode === status)
    .map(({ bruttoPrAar }) => bruttoPrAar)
    .reduce((sum, brutto) => sum + brutto, 0);
};

const Inntektsopplysninger = ({ beregningsgrunnlag }) => {
  // Alle perioder skal ha lik brutto for FRISINN, tar første
  const førstePeriode = beregningsgrunnlag.beregningsgrunnlagPeriode[0];
  const bruttoSN = finnSamletBruttoForStatus(
    førstePeriode.beregningsgrunnlagPrStatusOgAndel,
    aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
  );
  const bruttoFL = finnSamletBruttoForStatus(
    førstePeriode.beregningsgrunnlagPrStatusOgAndel,
    aktivitetStatus.FRILANSER,
  );
  const bruttoAT = finnSamletBruttoForStatus(
    førstePeriode.beregningsgrunnlagPrStatusOgAndel,
    aktivitetStatus.ARBEIDSTAKER,
  );
  return (
    <div>
      <Row>
        <Column xs="12">
          <Element className={beregningStyles.avsnittOverskrift}>
            <FormattedMessage id="Beregningsgrunnlag.Søknad.Inntektsopplysninger" />
          </Element>
        </Column>
      </Row>
      <Row>
        <Column xs="9">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.Frisinn.InntektAT" />
          </Normaltekst>
        </Column>
        <Column xs="3">
          <Element>{formatCurrencyNoKr(bruttoAT)}</Element>
        </Column>
      </Row>
      <Row>
        <Column xs="9">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.Frisinn.InntektFL" />
          </Normaltekst>
        </Column>
        <Column xs="3">
          <Element>{formatCurrencyNoKr(bruttoFL)}</Element>
        </Column>
      </Row>
      <Row>
        <Column xs="9">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.Frisinn.InntektSN" />
          </Normaltekst>
        </Column>
        <Column xs="3">
          <Element>{formatCurrencyNoKr(bruttoSN)}</Element>
        </Column>
      </Row>
    </div>
  );
};
Inntektsopplysninger.propTypes = {
  beregningsgrunnlag: beregningsgrunnlagPropType,
};

Inntektsopplysninger.defaultProps = {
  beregningsgrunnlag: undefined,
};

export default Inntektsopplysninger;
