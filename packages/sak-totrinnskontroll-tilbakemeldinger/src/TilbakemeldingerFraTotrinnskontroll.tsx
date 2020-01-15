import avslattImg from '@fpsak-frontend/assets/images/avslaatt.svg';
import checkImg from '@fpsak-frontend/assets/images/check.svg'; //
import { ElementWrapper, Image } from '@fpsak-frontend/shared-components';
import { decodeHtmlEntity } from '@fpsak-frontend/utils';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import {FormattedMessage, injectIntl, IntlShape} from 'react-intl';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { BehandlingKlageVurdering, BehandlingStatusType } from '@fpsak-frontend/types';
import { Aksjonspunkt, getAksjonspunktTextSelector } from '@fpsak-frontend/sak-totrinnskontroll/src/components/ApprovalTextUtils';
import styles from '@fpsak-frontend/sak-totrinnskontroll/src/components/ToTrinnsFormReadOnly.less';

/*
 * ToTrinnsFormReadOnly
 *
 * Presentasjonskomponent. Shows the approved and not approved issues from the manager
 *
 * Eksempel:
 * ```html
 * <ToTrinnsForm data={listOfApprovals}/>
 * ```
 */

/* eslint-disable react/no-array-index-key */
const godkjendAksjonspunkt = (aksjonspunkt: Aksjonspunkt) => {
  const { vurderPaNyttArsaker } = aksjonspunkt;
  return (
    <div className={styles.approvalItem}>
      {aksjonspunkt.totrinnskontrollGodkjent ? (
        <div>
          <span>
            <Image src={checkImg} className={styles.image} />
          </span>
          <span>
            <FormattedMessage id="ToTrinnsForm.Godkjent" />
          </span>
        </div>
      ) : (
        <div className={styles.approvalItem}>
          {vurderPaNyttArsaker.map((item, index) => (
            <div key={`${item.kode}${index}`}>
              <span>
                <Image src={avslattImg} className={styles.image} />
              </span>
              <span>{item.navn}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
/* eslint-enable react/no-array-index-key */

const renderAksjonspunkt = (
  aksjonspunkt: Aksjonspunkt,
  getAksjonspunktText: (aksjonspunkt: Aksjonspunkt) => (JSX.Element | null)[] | null,
) => (
  <div key={aksjonspunkt.aksjonspunktKode} className={styles.approvalItemContainer}>
    <span>{aksjonspunkt.navn}</span>
    {getAksjonspunktText(aksjonspunkt)?.map((formattedMessage, index) => (
      <div
        key={aksjonspunkt.aksjonspunktKode.concat('_'.concat(`${index}`))}
        className={styles.aksjonspunktTextContainer}
      >
        <Normaltekst key={aksjonspunkt.aksjonspunktKode.concat('_'.concat(`${index}`))}>{formattedMessage}</Normaltekst>
      </div>
    ))}
    <div>
      {godkjendAksjonspunkt(aksjonspunkt)}
      <pre className={styles.approvalItem}>{decodeHtmlEntity(aksjonspunkt.besluttersBegrunnelse)}</pre>
    </div>
  </div>
);

interface TilbakemeldingerFraTotrinnskontrollProps {
  approvalList: { contextCode: string, skjermlenke: string, skjermlenkeNavn: string, aksjonspunkter: Aksjonspunkt[] }[];
  isForeldrepengerFagsak: boolean;
  behandlingKlageVurdering?: BehandlingKlageVurdering;
  behandlingStatus: BehandlingStatusType;
  alleKodeverk: object;
}

interface StateProps {
  getAksjonspunktText?: (aksjonspunkt: Aksjonspunkt) => (JSX.Element | null)[] | null;
  intl?: IntlShape;
}

type Props = TilbakemeldingerFraTotrinnskontrollProps & StateProps;

export const TilbakemeldingerFraTotrinnskontroll: React.FunctionComponent<Props> = ({
  approvalList,
  getAksjonspunktText,
}) => {
  if (!approvalList || approvalList.length === 0) {
    return null;
  }
  return (
    <div>
      {approvalList.map(({ contextCode, skjermlenke, skjermlenkeNavn, aksjonspunkter }) => {
        if (aksjonspunkter.length > 0) {
          return (
            <ElementWrapper key={contextCode}>
              <NavLink to={skjermlenke}>{skjermlenkeNavn}</NavLink>
              {aksjonspunkter.map(aksjonspunkt => renderAksjonspunkt(aksjonspunkt, getAksjonspunktText))}
            </ElementWrapper>
          );
        }
        return null;
      })}
    </div>
  );
};

const mapStateToProps = (state, ownProps): StateProps => ({
  getAksjonspunktText: getAksjonspunktTextSelector(ownProps),
});

export default connect(mapStateToProps)(injectIntl(TilbakemeldingerFraTotrinnskontroll as any));
