import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';
import PropTypes from 'prop-types';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { behandlingForm } from '@fpsak-frontend/form';
import { safeJSONParse } from '@fpsak-frontend/utils';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import FormkravKlageForm, { getPaklagdVedtak, IKKE_PAKLAGD_VEDTAK } from './FormkravKlageForm';

/**
 * FormkravklageformNfp
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for formkrav klage (NFP).
 */
export const FormkravKlageFormNfpImpl = ({
  behandlingId,
  behandlingVersjon,
  handleSubmit,
  readOnly,
  readOnlySubmitButton,
  alleKodeverk,
  avsluttedeBehandlinger,
  klageparter,
  ...formProps
}) => (
  <form onSubmit={handleSubmit}>
    <FormkravKlageForm
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly}
      readOnlySubmitButton={readOnlySubmitButton}
      aksjonspunktCode={aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP}
      formProps={formProps}
      alleKodeverk={alleKodeverk}
      avsluttedeBehandlinger={avsluttedeBehandlinger}
      klageparter={klageparter}
    />
  </form>
);

FormkravKlageFormNfpImpl.propTypes = {
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  readOnly: PropTypes.bool,
  readOnlySubmitButton: PropTypes.bool,
  ...formPropTypes,
};

FormkravKlageFormNfpImpl.defaultProps = {
  readOnly: true,
  readOnlySubmitButton: true,
};

const getPåklagdBehandling = (avsluttedeBehandlinger, påklagdVedtak) =>
  avsluttedeBehandlinger.find(behandling => behandling.id.toString() === påklagdVedtak);

export const erTilbakekreving = (avsluttedeBehandlinger, påklagdVedtak) => {
  const behandling = getPåklagdBehandling(avsluttedeBehandlinger, påklagdVedtak);
  return (
    behandling?.type.kode === BehandlingType.TILBAKEKREVING ||
    behandling?.type.kode === BehandlingType.TILBAKEKREVING_REVURDERING
  );
};

export const påklagdTilbakekrevingInfo = (avsluttedeBehandlinger, påklagdVedtak) => {
  const behandling = getPåklagdBehandling(avsluttedeBehandlinger, påklagdVedtak);
  return behandling
    ? {
        tilbakekrevingUuid: behandling.uuid,
        tilbakekrevingVedtakDato: behandling.avsluttet,
        tilbakekrevingBehandlingType: behandling.type.kode,
      }
    : null;
};

const transformValues = (values, avsluttedeBehandlinger) => ({
  erKlagerPart: values.erKlagerPart,
  erFristOverholdt: values.erFristOverholdt,
  erKonkret: values.erKonkret,
  erSignert: values.erSignert,
  begrunnelse: values.begrunnelse,
  kode: aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP,
  vedtak: values.vedtak === IKKE_PAKLAGD_VEDTAK ? null : values.vedtak,
  erTilbakekreving: erTilbakekreving(avsluttedeBehandlinger, values.vedtak),
  tilbakekrevingInfo: påklagdTilbakekrevingInfo(avsluttedeBehandlinger, values.vedtak),
  valgtKlagepart: safeJSONParse(values.valgtKlagepart),
});

const formName = 'FormkravKlageFormNfp';

const buildInitialValues = createSelector(
  [
    ownProps => ownProps.klageVurdering,
    ownProps => ownProps.avsluttedeBehandlinger,
    ownProps => ownProps.valgtKlagepart,
  ],
  (klageVurdering, valgtKlagepart, avsluttedeBehandlinger) => {
    const klageFormkavResultatNfp = klageVurdering ? klageVurdering.klageFormkravResultatNFP : null;
    return {
      vedtak: klageFormkavResultatNfp ? getPaklagdVedtak(klageFormkavResultatNfp, avsluttedeBehandlinger) : null,
      begrunnelse: klageFormkavResultatNfp ? klageFormkavResultatNfp.begrunnelse : null,
      erKlagerPart: klageFormkavResultatNfp ? klageFormkavResultatNfp.erKlagerPart : null,
      erKonkret: klageFormkavResultatNfp ? klageFormkavResultatNfp.erKlageKonkret : null,
      erFristOverholdt: klageFormkavResultatNfp ? klageFormkavResultatNfp.erKlagefirstOverholdt : null,
      erSignert: klageFormkavResultatNfp ? klageFormkavResultatNfp.erSignert : null,
      valgtKlagepart: JSON.stringify(valgtKlagepart),
    };
  },
);

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = values =>
    initialOwnProps.submitCallback([transformValues(values, initialOwnProps.avsluttedeBehandlinger)]);
  return (state, ownProps) => ({
    klageparter: ownProps.klageparter,
    initialValues: buildInitialValues(ownProps),
    readOnly: ownProps.readOnly,
    onSubmit,
  });
};

const FormkravKlageFormNfp = connect(mapStateToPropsFactory)(
  behandlingForm({
    form: formName,
  })(FormkravKlageFormNfpImpl),
);

export default FormkravKlageFormNfp;
