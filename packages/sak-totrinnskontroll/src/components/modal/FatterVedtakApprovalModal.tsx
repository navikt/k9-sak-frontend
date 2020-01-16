import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { Image } from '@fpsak-frontend/shared-components';
import { Behandlingsresultat, Kodeverk } from '@fpsak-frontend/types';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import styles from './fatterVedtakApprovalModal.less';

/**
 * FatterVedtakApprovalModal
 *
 * Presentasjonskomponent. Denne modalen vises en lightbox etter at en beslutter har godkjent alle aksjonspunkter
 * med totrinnskontroll. Ved å trykke på knapp blir beslutter tatt tilbake til sokesiden.
 */
const FatterVedtakApprovalModal = ({
  showModal,
  closeEvent,
  infoTextCode,
  altImgTextCode,
  resolveProsessAksjonspunkterSuccess,
  intl,
  modalDescriptionTextCode,
}: FatterVedtakApprovalModalProps & WrappedComponentProps) => {
  let localShowModal = false;

  if (showModal !== undefined) {
    localShowModal = showModal;
  } else if (!localShowModal) {
    localShowModal = !!resolveProsessAksjonspunkterSuccess;
  }

  return (
    <Modal
      className={styles.modal}
      isOpen={localShowModal}
      closeButton={false}
      contentLabel={intl.formatMessage({ id: modalDescriptionTextCode })}
      onRequestClose={closeEvent}
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
      style={{ overlay: { zIndex: 3000 } }}
    >
      <Row>
        <Column xs="1">
          <Image className={styles.image} alt={intl.formatMessage({ id: altImgTextCode })} src={innvilgetImageUrl} />
          <div className={styles.divider} />
        </Column>
        <Column xs="9">
          <Normaltekst>
            <FormattedMessage id={infoTextCode} />
          </Normaltekst>
          <Normaltekst>
            <FormattedMessage id="FatterVedtakApprovalModal.GoToSearchPage" />
          </Normaltekst>
        </Column>
        <Column xs="2">
          <Hovedknapp mini className={styles.button} onClick={closeEvent} autoFocus>
            {intl.formatMessage({ id: 'FatterVedtakApprovalModal.Ok' })}
          </Hovedknapp>
        </Column>
      </Row>
    </Modal>
  );
};

interface FatterVedtakApprovalModalProps {
  altImgTextCode: string;
  behandlingsresultat: Behandlingsresultat;
  behandlingStatusKode: string;
  behandlingTypeKode: string;
  closeEvent: () => void;
  erKlageWithKA: boolean;
  fagsakYtelseType: Kodeverk;
  harSammeResultatSomOriginalBehandling?: boolean;
  infoTextCode: string;
  modalDescriptionTextCode: string;
  resolveProsessAksjonspunkterSuccess?: boolean;
  showModal?: boolean;
}

const isBehandlingsresultatOpphor = createSelector(
  [(ownProps: FatterVedtakApprovalModalProps) => ownProps.behandlingsresultat],
  behandlingsresultat => behandlingsresultat && behandlingsresultat.type.kode === behandlingResultatType.OPPHOR,
);

const getModalDescriptionTextCode = createSelector(
  [
    isBehandlingsresultatOpphor,
    ownProps => ownProps.fagsakYtelseType,
    ownProps => ownProps.erKlageWithKA,
    ownProps => ownProps.behandlingTypeKode,
  ],
  (isOpphor, ytelseType, erKlageWithKA, behandlingTypeKode) => {
    if (behandlingTypeKode === BehandlingType.KLAGE) {
      if (erKlageWithKA) {
        return 'FatterVedtakApprovalModal.ModalDescriptionKlageKA';
      }
      return 'FatterVedtakApprovalModal.ModalDescriptionKlage';
    }
    if (isOpphor) {
      return 'FatterVedtakApprovalModal.ModalDescriptionOpphort';
    }
    if (ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD) {
      return 'FatterVedtakApprovalModal.ModalDescriptionESApproval';
    }
    if (ytelseType.kode === fagsakYtelseType.SVANGERSKAPSPENGER) {
      return 'FatterVedtakApprovalModal.ModalDescriptionSVPApproval';
    }
    return 'FatterVedtakApprovalModal.ModalDescriptionFPApproval';
  },
);

const getAltImgTextCode = createSelector(
  [(ownProps: FatterVedtakApprovalModalProps) => ownProps.fagsakYtelseType],
  ytelseType =>
    ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD
      ? 'FatterVedtakApprovalModal.InnvilgetES'
      : 'FatterVedtakApprovalModal.InnvilgetFP',
);

const getInfoTextCode = createSelector(
  [
    ownProps => ownProps.behandlingTypeKode,
    ownProps => ownProps.behandlingsresultat,
    ownProps => ownProps.harSammeResultatSomOriginalBehandling,
    ownProps => ownProps.fagsakYtelseType,
    ownProps => ownProps.erKlageWithKA,
    isBehandlingsresultatOpphor,
  ],
  (
    behandlingtypeKode,
    behandlingsresultat,
    harSammeResultatSomOriginalBehandling,
    ytelseType,
    erKlageWithKA,
    isOpphor,
  ) => {
    if (behandlingtypeKode === BehandlingType.TILBAKEKREVING) {
      return 'FatterVedtakApprovalModal.Tilbakekreving';
    }
    if (behandlingtypeKode === BehandlingType.KLAGE) {
      if (erKlageWithKA) {
        return 'FatterVedtakApprovalModal.ModalDescriptionKlageKA';
      }
      return 'FatterVedtakApprovalModal.ModalDescriptionKlage';
    }
    if (harSammeResultatSomOriginalBehandling) {
      return 'FatterVedtakApprovalModal.UendretUtfall';
    }
    if (behandlingsresultat.type.kode === behandlingResultatType.AVSLATT) {
      if (ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD) {
        return 'FatterVedtakApprovalModal.IkkeInnvilgetES';
      }
      if (ytelseType.kode === fagsakYtelseType.SVANGERSKAPSPENGER) {
        return 'FatterVedtakApprovalModal.IkkeInnvilgetSVP';
      }
      return 'FatterVedtakApprovalModal.IkkeInnvilgetFP';
    }
    if (isOpphor) {
      return 'FatterVedtakApprovalModal.OpphortForeldrepenger';
    }
    if (ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD) {
      return 'FatterVedtakApprovalModal.InnvilgetEngangsstonad';
    }
    if (ytelseType.kode === fagsakYtelseType.SVANGERSKAPSPENGER) {
      return 'FatterVedtakApprovalModal.InnvilgetSvangerskapspenger';
    }
    return 'FatterVedtakApprovalModal.InnvilgetForeldrepenger';
  },
);

const isStatusFatterVedtak = createSelector(
  [(ownProps: FatterVedtakApprovalModalProps) => ownProps.behandlingStatusKode],
  behandlingStatusKode => behandlingStatusKode === behandlingStatus.FATTER_VEDTAK,
);

// TODO (TOR) Fjern connect (brukar ikkje state)
const mapStateToProps = (state, ownProps) => {
  if (!ownProps.allAksjonspunktApproved) {
    return {
      infoTextCode: 'FatterVedtakApprovalModal.VedtakReturneresTilSaksbehandler',
      altImgTextCode: isStatusFatterVedtak(ownProps) ? getAltImgTextCode(ownProps) : '',
      modalDescriptionTextCode: isStatusFatterVedtak(ownProps)
        ? getModalDescriptionTextCode(ownProps)
        : 'FatterVedtakApprovalModal.ModalDescription',
      isBehandlingStatusFatterVedtak:
        ownProps.behandlingStatusKode === behandlingStatus.FATTER_VEDTAK ? true : undefined,
      resolveProsessAksjonspunkterSuccess: ownProps.erGodkjenningFerdig,
    };
  }
  return {
    infoTextCode: isStatusFatterVedtak(ownProps) ? getInfoTextCode(ownProps) : '',
    altImgTextCode: isStatusFatterVedtak(ownProps) ? getAltImgTextCode(ownProps) : '',
    modalDescriptionTextCode: isStatusFatterVedtak(ownProps)
      ? getModalDescriptionTextCode(ownProps)
      : 'FatterVedtakApprovalModal.ModalDescription',
    isBehandlingStatusFatterVedtak: ownProps.behandlingStatusKode === behandlingStatus.FATTER_VEDTAK ? true : undefined,
    resolveProsessAksjonspunkterSuccess: ownProps.erGodkjenningFerdig,
  };
};

export default connect(mapStateToProps)(injectIntl(FatterVedtakApprovalModal));
