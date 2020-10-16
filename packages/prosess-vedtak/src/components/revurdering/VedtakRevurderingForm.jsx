import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clearFields, formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { FormattedMessage, injectIntl } from 'react-intl';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { behandlingForm, behandlingFormValueSelector, getBehandlingFormPrefix } from '@fpsak-frontend/form';
import { isAvslag, isInnvilget, isOpphor } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import BehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { decodeHtmlEntity, getKodeverknavnFn } from '@fpsak-frontend/utils';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import { Column, Row } from 'nav-frontend-grid';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import {AlertStripeInfo} from "nav-frontend-alertstriper";
import vedtakBeregningsresultatPropType from '../../propTypes/vedtakBeregningsresultatPropType';
import FritekstBrevPanel from '../FritekstBrevPanel';
import VedtakOverstyrendeKnapp from '../VedtakOverstyrendeKnapp';
import VedtakAksjonspunktPanel from '../VedtakAksjonspunktPanel';
import VedtakRevurderingSubmitPanel from './VedtakRevurderingSubmitPanel';
import VedtakInnvilgetRevurderingPanel from './VedtakInnvilgetRevurderingPanel';
import VedtakAvslagRevurderingPanel from './VedtakAvslagRevurderingPanel';
import VedtakOpphorRevurderingPanel from './VedtakOpphorRevurderingPanel';
import styles from './vedtakRevurderingForm.less';
import VedtakFritekstbrevModal from '../svp/VedtakFritekstbrevModal';
import vedtakVarselPropType from '../../propTypes/vedtakVarselPropType';
import VedtakRedusertUtbetalingArsaker from './VedtakRedusertUtbetalingArsaker';
import redusertUtbetalingArsak from '../../kodeverk/redusertUtbetalingArsak';
import PreviewLink from '../PreviewLink';

export const VEDTAK_REVURDERING_FORM_NAME = 'VEDTAK_REVURDERING_FORM';

const isVedtakSubmission = true;

const getPreviewBrevCallback = (previewCallback, behandlingresultat, redusertUtbetalingÅrsaker) => e => {
  const dokumentMal = () => {
    if (isInnvilget(behandlingresultat.type.kode)) {
      return dokumentMalType.INNVILGELSE;
    }
    if (isAvslag(behandlingresultat.type.kode)) {
      return dokumentMalType.AVSLAG;
    }
    return dokumentMalType.UTLED;
  };

  const data = {
    redusertUtbetalingÅrsaker,
    dokumentMal: dokumentMal(),
  };
  previewCallback(data);
  e.preventDefault();
};

const transformRedusertUtbetalingÅrsaker = formProps =>
  Object.values(redusertUtbetalingArsak).filter(name =>
    Object.keys(formProps).some(key => key === name && formProps[key]),
  );

/**
 * VedtakRevurderingForm
 *
 * Redux-form-komponent for revurdering-vedtak.
 */
export class VedtakRevurderingFormImpl extends Component {
  constructor(props) {
    super(props);
    this.onToggleOverstyring = this.onToggleOverstyring.bind(this);
    this.state = {
      skalBrukeOverstyrendeFritekstBrev: props.skalBrukeOverstyrendeFritekstBrev,
      erSendtInnUtenArsaker: false
    };
  }

  onToggleOverstyring() {
    const { behandlingFormPrefix, clearFields: clearFormFields } = this.props;
    const { skalBrukeOverstyrendeFritekstBrev } = this.state;
    this.setState({
      skalBrukeOverstyrendeFritekstBrev: !skalBrukeOverstyrendeFritekstBrev,
    });
    const fields = ['begrunnelse', 'overskrift', 'brødtekst'];
    clearFormFields(`${behandlingFormPrefix}.VedtakForm`, false, false, ...fields);
  }

  render() {
    const {
      intl,
      readOnly,
      behandlingStatusKode,
      behandlingresultat,
      aksjonspunkter,
      previewCallback,
      begrunnelse,
      aksjonspunktKoder,
      antallBarn,
      ytelseTypeKode,
      revurderingsAarsakString,
      kanOverstyre,
      sprakkode,
      skalBrukeOverstyrendeFritekstBrev,
      brødtekst,
      overskrift,
      initialValues,
      resultatstruktur,
      alleKodeverk,
      tilbakekrevingvalg,
      simuleringResultat,
      vilkar,
      sendVarselOmRevurdering,
      resultatstrukturOriginalBehandling,
      behandlingArsaker,
      medlemskapFom,
      beregningErManueltFastsatt,
      vedtakVarsel,
      bgPeriodeMedAvslagsårsak,
      tilgjengeligeVedtaksbrev,
      ...formProps
    } = this.props;
    const {erSendtInnUtenArsaker} = this.state;
    const previewAutomatiskBrev = getPreviewBrevCallback(
      previewCallback,
      behandlingresultat,
      readOnly ? vedtakVarsel.redusertUtbetalingÅrsaker : transformRedusertUtbetalingÅrsaker(formProps),
    );
    const visOverstyringKnapp = kanOverstyre || readOnly;
    const isTilgjengeligeVedtaksbrevArray = Array.isArray(tilgjengeligeVedtaksbrev);
    const harTilgjengeligeVedtaksbrev = !isTilgjengeligeVedtaksbrevArray || !!tilgjengeligeVedtaksbrev.length;
    const harRedusertUtbetaling = ytelseTypeKode === fagsakYtelseType.FRISINN && simuleringResultat?.simuleringResultat?.sumFeilutbetaling < 0;
    return (
      <>
        <VedtakFritekstbrevModal
          readOnly={readOnly}
          behandlingsresultat={behandlingresultat}
          erSVP={ytelseTypeKode === fagsakYtelseType.SVANGERSKAPSPENGER}
        />
        <VedtakAksjonspunktPanel
          behandlingStatusKode={behandlingStatusKode}
          aksjonspunktKoder={aksjonspunktKoder}
          readOnly={readOnly}
        >
          <VerticalSpacer eightPx />
          <>
            {ytelseTypeKode === fagsakYtelseType.FRISINN ? (
              <VedtakOverstyrendeKnapp readOnly={readOnly} keyName="skalUndertrykkeBrev" readOnlyHideEmpty={false} />
            ) : (
              visOverstyringKnapp && (
                <VedtakOverstyrendeKnapp
                  toggleCallback={this.onToggleOverstyring}
                  readOnly={readOnly || initialValues.skalBrukeOverstyrendeFritekstBrev === true}
                  keyName="skalBrukeOverstyrendeFritekstBrev"
                  readOnlyHideEmpty={false}
                />
              )
            )}
            <Row>
              <Column xs={ytelseTypeKode === fagsakYtelseType.FRISINN ? '4' : '12'}>
                {isInnvilget(behandlingresultat.type.kode) && (
                  <VedtakInnvilgetRevurderingPanel
                    antallBarn={antallBarn}
                    ytelseTypeKode={ytelseTypeKode}
                    aksjonspunktKoder={aksjonspunktKoder}
                    revurderingsAarsakString={revurderingsAarsakString}
                    behandlingsresultat={behandlingresultat}
                    readOnly={readOnly}
                    beregningResultat={resultatstruktur}
                    sprakKode={sprakkode}
                    tilbakekrevingvalg={tilbakekrevingvalg}
                    simuleringResultat={simuleringResultat}
                    alleKodeverk={alleKodeverk}
                    originaltBeregningResultat={resultatstrukturOriginalBehandling}
                    beregningErManueltFastsatt={beregningErManueltFastsatt}
                    vedtakVarsel={vedtakVarsel}
                    bgPeriodeMedAvslagsårsak={bgPeriodeMedAvslagsårsak}
                  />
                )}
                {isAvslag(behandlingresultat.type.kode) && (
                  <VedtakAvslagRevurderingPanel
                    behandlingStatusKode={behandlingStatusKode}
                    aksjonspunkter={aksjonspunkter}
                    behandlingsresultat={behandlingresultat}
                    readOnly={readOnly}
                    alleKodeverk={alleKodeverk}
                    beregningResultat={resultatstruktur}
                    sprakkode={sprakkode}
                    vilkar={vilkar}
                    tilbakekrevingvalg={tilbakekrevingvalg}
                    simuleringResultat={simuleringResultat}
                    originaltBeregningResultat={resultatstrukturOriginalBehandling}
                    vedtakVarsel={vedtakVarsel}
                    ytelseTypeKode={ytelseTypeKode}
                  />
                )}
                {isOpphor(behandlingresultat.type.kode) && (
                  <VedtakOpphorRevurderingPanel
                    revurderingsAarsakString={revurderingsAarsakString}
                    ytelseTypeKode={ytelseTypeKode}
                    readOnly={readOnly}
                    behandlingsresultat={behandlingresultat}
                    sprakKode={sprakkode}
                    medlemskapFom={medlemskapFom}
                    resultatstruktur={resultatstruktur}
                    beregningErManueltFastsatt={beregningErManueltFastsatt}
                    vedtakVarsel={vedtakVarsel}
                  />
                )}
              </Column>
              {harRedusertUtbetaling && (
                <Column xs="8">
                  <VedtakRedusertUtbetalingArsaker
                    intl={intl}
                    readOnly={readOnly}
                    values={new Map(Object.values(redusertUtbetalingArsak).map(a => [a, !!formProps[a]]))}
                    vedtakVarsel={vedtakVarsel}
                    erSendtInnUtenArsaker={erSendtInnUtenArsaker}
                  />
                </Column>
              )}
            </Row>
            {ytelseTypeKode === fagsakYtelseType.FRISINN && harTilgjengeligeVedtaksbrev && (
              <PreviewLink previewCallback={previewAutomatiskBrev}>
                <FormattedMessage id="VedtakForm.AutomatiskBrev.Lenke" />
              </PreviewLink>
            )}
            {!harTilgjengeligeVedtaksbrev && (
              <AlertStripeInfo className={styles.infoIkkeVedtaksbrev}>
                {intl.formatMessage({id: 'VedtakForm.IkkeVedtaksbrev'})}
              </AlertStripeInfo>
            )}
            {skalBrukeOverstyrendeFritekstBrev &&
              ![fagsakYtelseType.ENGANGSSTONAD, fagsakYtelseType.FRISINN].includes(ytelseTypeKode) && (
                <FritekstBrevPanel
                  intl={intl}
                  readOnly={readOnly}
                  sprakkode={sprakkode}
                  previewBrev={previewAutomatiskBrev}
                />
            )}
            {behandlingStatusKode === behandlingStatusCode.BEHANDLING_UTREDES && (
              <VedtakRevurderingSubmitPanel
                begrunnelse={begrunnelse}
                brodtekst={brødtekst}
                overskrift={overskrift}
                previewCallback={previewCallback}
                formProps={formProps}
                readOnly={readOnly}
                ytelseTypeKode={ytelseTypeKode}
                skalBrukeOverstyrendeFritekstBrev={skalBrukeOverstyrendeFritekstBrev}
                beregningResultat={resultatstruktur}
                haveSentVarsel={sendVarselOmRevurdering}
                aksjonspunkter={aksjonspunkter}
                originaltBeregningResultat={resultatstrukturOriginalBehandling}
                behandlingArsaker={behandlingArsaker}
                behandlingResultat={behandlingresultat}
                harRedusertUtbetaling={harRedusertUtbetaling}
                visFeilmeldingFordiArsakerMangler={() => this.setState({erSendtInnUtenArsaker: true})}
              />
            )}
          </>
        </VedtakAksjonspunktPanel>
      </>
    );
  }
}

VedtakRevurderingFormImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  begrunnelse: PropTypes.string,
  brødtekst: PropTypes.string,
  overskrift: PropTypes.string,
  previewCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  antallBarn: PropTypes.number,
  behandlingStatusKode: PropTypes.string.isRequired,
  behandlingresultat: PropTypes.shape().isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
  resultatstruktur: vedtakBeregningsresultatPropType,
  revurderingsAarsakString: PropTypes.string,
  kanOverstyre: PropTypes.bool,
  skalBrukeOverstyrendeFritekstBrev: PropTypes.bool,
  beregningErManueltFastsatt: PropTypes.bool.isRequired,
  bgPeriodeMedAvslagsårsak: PropTypes.shape(),
  vedtakVarsel: vedtakVarselPropType,
  tilgjengeligeVedtaksbrev: PropTypes.arrayOf(PropTypes.string),
  lagreArsakerTilRedusertUtbetaling: PropTypes.func,
  ...formPropTypes,
};

VedtakRevurderingFormImpl.defaultProps = {
  begrunnelse: undefined,
  brødtekst: undefined,
  overskrift: undefined,
  antallBarn: undefined,
  revurderingsAarsakString: undefined,
  kanOverstyre: undefined,
  resultatstruktur: undefined,
  skalBrukeOverstyrendeFritekstBrev: false,
  bgPeriodeMedAvslagsårsak: undefined,
  tilgjengeligeVedtaksbrev: undefined,
};

const buildInitialValues = createSelector(
  [
    ownProps => ownProps.resultatstruktur,
    ownProps => ownProps.behandlingStatusKode,
    ownProps => ownProps.aksjonspunkter,
    ownProps => ownProps.ytelseTypeKode,
    ownProps => ownProps.behandlingresultat,
    ownProps => ownProps.sprakkode,
    ownProps => ownProps.vedtakVarsel,
  ],
  (
    beregningResultat,
    behandlingstatusKode,
    aksjonspunkter,
    ytelseTypeKode,
    behandlingresultat,
    sprakkode,
    vedtakVarsel,
  ) => {
    const aksjonspunktKoder = aksjonspunkter
      .filter(ap => ap.erAktivt)
      .filter(ap => ap.kanLoses)
      .map(ap => ap.definisjon.kode);

    if (ytelseTypeKode === fagsakYtelseType.ENGANGSSTONAD) {
      if (beregningResultat) {
        return {
          antallBarn: beregningResultat.antallBarn,
          aksjonspunktKoder,
        };
      }
      if (behandlingstatusKode !== behandlingStatusCode.AVSLUTTET) {
        return {
          antallBarn: null,
          aksjonspunktKoder,
        };
      }
      return { antallBarn: null };
    }
    return {
      sprakkode,
      aksjonspunktKoder,
      skalBrukeOverstyrendeFritekstBrev: vedtakVarsel.vedtaksbrev.kode === 'FRITEKST',
      skalUndertrykkeBrev: vedtakVarsel.vedtaksbrev.kode === 'INGEN',
      overskrift: decodeHtmlEntity(vedtakVarsel.overskrift),
      brødtekst: decodeHtmlEntity(vedtakVarsel.fritekstbrev),
    };
  },
);

const transformValues = values =>
  values.aksjonspunktKoder.map(apCode => {
    const transformedValues = {
      kode: apCode,
      begrunnelse: values.begrunnelse,
      fritekstBrev: values.brødtekst,
      skalBrukeOverstyrendeFritekstBrev: values.skalBrukeOverstyrendeFritekstBrev,
      skalUndertrykkeBrev: values.skalUndertrykkeBrev,
      overskrift: values.overskrift,
      isVedtakSubmission,
    };
    if (apCode === aksjonspunktCodes.FORESLA_VEDTAK_MANUELT) {
      transformedValues.redusertUtbetalingÅrsaker = transformRedusertUtbetalingÅrsaker(values);
    }
    return transformedValues;
  });

const createAarsakString = (revurderingAarsaker, getKodeverknavn) => {
  if (revurderingAarsaker === undefined || revurderingAarsaker.length < 1) {
    return '';
  }
  const aarsakTekstList = [];
  const endringFraBrukerAarsak = revurderingAarsaker.find(
    aarsak => aarsak.kode === BehandlingArsakType.RE_ENDRING_FRA_BRUKER,
  );
  const alleAndreAarsakerNavn = revurderingAarsaker
    .filter(aarsak => aarsak.kode !== BehandlingArsakType.RE_ENDRING_FRA_BRUKER)
    .map(aarsak => getKodeverknavn(aarsak));
  // Dersom en av årsakene er "RE_ENDRING_FRA_BRUKER" skal alltid denne vises først
  if (endringFraBrukerAarsak !== undefined) {
    aarsakTekstList.push(getKodeverknavn(endringFraBrukerAarsak));
  }
  aarsakTekstList.push(...alleAndreAarsakerNavn);
  return aarsakTekstList.join(', ');
};

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = values => initialOwnProps.submitCallback(transformValues(values));
  const aksjonspunktKoder = initialOwnProps.aksjonspunkter.map(ap => ap.definisjon.kode);
  const behandlingArsaker = initialOwnProps.behandlingArsaker.map(({ behandlingArsakType }) => behandlingArsakType);
  const revurderingsAarsakString = createAarsakString(
    behandlingArsaker,
    getKodeverknavnFn(initialOwnProps.alleKodeverk, kodeverkTyper),
  );

  return (state, ownProps) => ({
    onSubmit,
    aksjonspunktKoder,
    revurderingsAarsakString,
    initialValues: buildInitialValues(ownProps),
    ...behandlingFormValueSelector(VEDTAK_REVURDERING_FORM_NAME, ownProps.behandlingId, ownProps.behandlingVersjon)(
      state,
      'antallBarn',
      'begrunnelse',
      'aksjonspunktKoder',
      'skalBrukeOverstyrendeFritekstBrev',
      'skalUndertrykkeBrev',
      'overskrift',
      'brødtekst',
      ...Object.values(redusertUtbetalingArsak),
    ),
    behandlingFormPrefix: getBehandlingFormPrefix(ownProps.behandlingId, ownProps.behandlingVersjon),
  });
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      clearFields,
    },
    dispatch,
  ),
});

const VedtakRevurderingForm = connect(
  mapStateToPropsFactory,
  mapDispatchToProps,
)(
  injectIntl(
    behandlingForm({
      form: VEDTAK_REVURDERING_FORM_NAME,
      onChange: (values, dispatch, props) =>
        props.lagreArsakerTilRedusertUtbetaling ? props.lagreArsakerTilRedusertUtbetaling(values, dispatch) : null,
    })(VedtakRevurderingFormImpl),
  ),
);

export default VedtakRevurderingForm;
