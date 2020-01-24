import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Element, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { getKodeverknavnFn } from '@fpsak-frontend/fp-felles';

import { EtikettInfo } from 'nav-frontend-etiketter';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import styles from './fagsakProfile.less';

const hasLink = link => link && link.saksnr && link.saksnr.verdi && link.behandlingId;

const visSakDekningsgrad = (saksKode, dekningsgrad) => {
  const erForeldrepenger = saksKode === fagsakYtelseType.FORELDREPENGER;
  const gyldigDekningsGrad = dekningsgrad === 100 || dekningsgrad === 80;

  return erForeldrepenger && gyldigDekningsGrad;
};

/**
 * FagsakProfile
 *
 * Presentasjonskomponent. Viser fagsakinformasjon og knapper for å endre status eller lukke sak.
 */
export const FagsakProfile = ({
  saksnummer,
  sakstype,
  fagsakStatus,
  toggleShowAll,
  annenPartLink,
  alleKodeverk,
  createLink,
  renderBehandlingMeny,
  renderBehandlingVelger,
  dekningsgrad,
  intl,
}) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  return (
    <div>
      <Row>
        <Column xs="6">
          <div className={styles.bottomMargin}>
            <Systemtittel>{getKodeverknavn(sakstype)}</Systemtittel>
            {visSakDekningsgrad(sakstype.kode, dekningsgrad) && (
              <EtikettInfo title={intl.formatMessage({ id: 'FagsakProfile.Dekningsgrad' }, { dekningsgrad })}>
                {`${dekningsgrad}%`}
              </EtikettInfo>
            )}
          </div>
          <Normaltekst>{`${saksnummer} - ${getKodeverknavn(fagsakStatus)}`}</Normaltekst>
        </Column>
        <Column xs="6">
          <div className={styles.floatRight}>
            {renderBehandlingMeny()}
            {hasLink(annenPartLink) && (
              <div className={styles.topMargin}>
                <Element>
                  <NavLink to={createLink(annenPartLink)} target="_blank" onClick={toggleShowAll}>
                    <FormattedMessage id="FagsakProfile.AnnenPartSak" />
                  </NavLink>
                </Element>
              </div>
            )}
          </div>
        </Column>
      </Row>
      {renderBehandlingVelger()}
    </div>
  );
};

FagsakProfile.propTypes = {
  saksnummer: PropTypes.string.isRequired,
  fagsakStatus: PropTypes.shape().isRequired,
  sakstype: PropTypes.shape().isRequired,
  toggleShowAll: PropTypes.func.isRequired,
  annenPartLink: PropTypes.shape(),
  alleKodeverk: PropTypes.shape().isRequired,
  createLink: PropTypes.func.isRequired,
  renderBehandlingMeny: PropTypes.func.isRequired,
  renderBehandlingVelger: PropTypes.func.isRequired,
  dekningsgrad: PropTypes.number.isRequired,
  intl: PropTypes.shape().isRequired,
};

FagsakProfile.defaultProps = {
  annenPartLink: null,
};

export default injectIntl(FagsakProfile);
