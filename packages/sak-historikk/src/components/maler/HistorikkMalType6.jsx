import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { findHendelseText } from './felles/historikkUtils';
import historikkinnslagDelPropType from '../../propTypes/historikkinnslagDelPropType';

import styles from './historikkMalType.less';

const HistorikkMalType6 = ({ historikkinnslagDeler, getKodeverknavn }) => {
  const { formatMessage } = useIntl();

  const formaterOpplysning = (opplysning, index) => (
    <div key={`opplysning${index}`}>
      <Normaltekst className={styles.keyValuePair}>
        {formatMessage({ id: getKodeverknavn(opplysning.opplysningType) })}:
      </Normaltekst>
      &ensp;
      <Element className={styles.keyValuePair}>{opplysning.tilVerdi}</Element>
    </div>
  );

  return (
    <div>
      {historikkinnslagDeler.map(del => (
        <div>
          <Element className="snakkeboble-panel__tekst">{findHendelseText(del.hendelse, getKodeverknavn)}</Element>
          {del.opplysninger.map(formaterOpplysning)}
        </div>
      ))}
    </div>
  );
};

HistorikkMalType6.propTypes = {
  historikkinnslagDeler: PropTypes.arrayOf(historikkinnslagDelPropType).isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
};

export default HistorikkMalType6;
