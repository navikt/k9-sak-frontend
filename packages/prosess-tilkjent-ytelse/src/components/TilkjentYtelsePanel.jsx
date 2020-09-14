import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import moment from 'moment';
import { DDMMYYYY_DATE_FORMAT, getKodeverknavnFn } from '@fpsak-frontend/utils';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import Tilbaketrekkpanel from './tilbaketrekk/Tilbaketrekkpanel';
import tilkjentYtelseBeregningresultatPropType from '../propTypes/tilkjentYtelseBeregningresultatPropType';
import TilkjentYtelse from './TilkjentYtelse';

const perioderMedClassName = [];

const formatPerioder = perioder => {
  perioderMedClassName.length = 0;
  perioder.forEach(item => {
    if (item.andeler[0] && item.dagsats >= 0) {
      perioderMedClassName.push({ ...item, id: perioderMedClassName.length });
    }
  });
  return perioderMedClassName;
};

const groups = [
  { id: 1, content: '' },
  { id: 2, content: '' },
];

export const TilkjentYtelsePanelImpl = ({
  beregningsresultatMedUttaksplan,
  vurderTilbaketrekkAP,
  submitCallback,
  readOnlySubmitButton,
  getKodeverknavn,
  behandlingId,
  behandlingVersjon,
}) => {
  const opphoersdato = beregningsresultatMedUttaksplan?.opphoersdato;
  return (
    <>
      <Undertittel>
        <FormattedMessage id="TilkjentYtelse.Title" />
      </Undertittel>
      {opphoersdato && (
        <FormattedMessage
          id="TilkjentYtelse.Opphoersdato"
          values={{
            opphoersdato: moment(opphoersdato).format(DDMMYYYY_DATE_FORMAT).toString(),
          }}
        />
      )}
      {beregningsresultatMedUttaksplan && (
        <TilkjentYtelse
          items={formatPerioder(beregningsresultatMedUttaksplan.perioder)}
          groups={groups}
          getKodeverknavn={getKodeverknavn}
        />
      )}
      {vurderTilbaketrekkAP && (
        <Tilbaketrekkpanel
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          readOnly
          vurderTilbaketrekkAP={vurderTilbaketrekkAP}
          submitCallback={submitCallback}
          readOnlySubmitButton={readOnlySubmitButton}
          beregningsresultat={beregningsresultatMedUttaksplan}
        />
      )}
    </>
  );
};
TilkjentYtelsePanelImpl.propTypes = {
  beregningsresultatMedUttaksplan: tilkjentYtelseBeregningresultatPropType,
  vurderTilbaketrekkAP: PropTypes.shape(),
  submitCallback: PropTypes.func.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
};

TilkjentYtelsePanelImpl.defaultProps = {
  beregningsresultatMedUttaksplan: undefined,
  vurderTilbaketrekkAP: undefined,
};

const finnTilbaketrekkAksjonspunkt = createSelector(
  [(state, ownProps) => ownProps.aksjonspunkter],
  alleAksjonspunkter => {
    if (alleAksjonspunkter) {
      return alleAksjonspunkter.find(
        ap => ap.definisjon && ap.definisjon.kode === aksjonspunktCodes.VURDER_TILBAKETREKK,
      );
    }
    return undefined;
  },
);

const mapStateToProps = (state, ownProps) => {
  return {
    beregningsresultatMedUttaksplan: ownProps.beregningsresultat,
    vurderTilbaketrekkAP: finnTilbaketrekkAksjonspunkt(state, ownProps),
    getKodeverknavn: getKodeverknavnFn(ownProps.alleKodeverk, kodeverkTyper),
  };
};

export default connect(mapStateToProps)(injectIntl(TilkjentYtelsePanelImpl));
