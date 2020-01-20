import React from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import {
  findEndretFeltNavn,
  findEndretFeltVerdi,
  findHendelseText,
  findIdForOpplysningCode,
  findResultatText,
} from './felles/historikkUtils';
import BubbleText from './felles/bubbleText';
import HistorikkDokumentLenke from './felles/HistorikkDokumentLenke';
import historikkinnslagDelPropType from '../../propTypes/historikkinnslagDelPropType';
import Skjermlenke from './felles/Skjermlenke';

const HistorikkMalType7 = ({
  historikkinnslagDeler,
  behandlingLocation,
  dokumentLinks,
  intl,
  saksNr,
  getKodeverknavn,
}) => {
  const formatChangedField = endretFelt => {
    const fieldName = findEndretFeltNavn(endretFelt, intl);
    const sub1 = fieldName.substring(0, fieldName.lastIndexOf(';'));
    const sub2 = fieldName.substring(fieldName.lastIndexOf(';') + 1);
    const fromValue = findEndretFeltVerdi(endretFelt, endretFelt.fraVerdi, intl);
    const toValue = findEndretFeltVerdi(endretFelt, endretFelt.tilVerdi, intl);

    if (endretFelt.fraVerdi !== null) {
      return (
        <div>
          <FormattedHTMLMessage
            id="Historikk.Template.7.ChangedFromTo"
            values={{
              sub1,
              sub2,
              fromValue,
              toValue,
            }}
          />
        </div>
      );
    }
    return false;
  };

  return historikkinnslagDeler.map((historikkinnslagDel, historikkinnslagDelIndex) => (
    <div
      key={
        `historikkinnslagDel${historikkinnslagDelIndex}` // eslint-disable-line react/no-array-index-key
      }
    >
      <>
        <Skjermlenke
          skjermlenke={historikkinnslagDel.skjermlenke}
          behandlingLocation={behandlingLocation}
          getKodeverknavn={getKodeverknavn}
          scrollUpOnClick={false}
        />

        {historikkinnslagDel.hendelse && (
          <Element>{findHendelseText(historikkinnslagDel.hendelse, getKodeverknavn)}</Element>
        )}

        {historikkinnslagDel.resultat && <Element>{findResultatText(historikkinnslagDel.resultat, intl)}</Element>}

        {historikkinnslagDel.endredeFelter &&
          historikkinnslagDel.endredeFelter.map((endretFelt, i) => (
            <div key={`endredeFelter${i + 1}`}>{formatChangedField(endretFelt)}</div>
          ))}

        {historikkinnslagDel.opplysninger &&
          historikkinnslagDel.opplysninger.map(opplysning => (
            <FormattedHTMLMessage
              id={findIdForOpplysningCode(opplysning)}
              values={{ antallBarn: opplysning.tilVerdi }}
            />
          ))}

        {historikkinnslagDel.aarsak && <Normaltekst>{getKodeverknavn(historikkinnslagDel.aarsak)}</Normaltekst>}
        {historikkinnslagDel.begrunnelse && (
          <BubbleText bodyText={historikkinnslagDel.begrunnelse} className="snakkeboble-panel__tekst" />
        )}
        {historikkinnslagDel.begrunnelseFritekst && (
          <BubbleText bodyText={historikkinnslagDel.begrunnelseFritekst} className="snakkeboble-panel__tekst" />
        )}
        <div>
          {dokumentLinks &&
            dokumentLinks.map(dokumentLenke => (
              <HistorikkDokumentLenke
                key={`${dokumentLenke.tag}@${dokumentLenke.url}`}
                dokumentLenke={dokumentLenke}
                saksNr={saksNr}
              />
            ))}
        </div>
      </>
    </div>
  ));
};

HistorikkMalType7.propTypes = {
  historikkinnslagDeler: PropTypes.arrayOf(historikkinnslagDelPropType).isRequired,
  behandlingLocation: PropTypes.shape().isRequired,
  dokumentLinks: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  intl: PropTypes.shape().isRequired,
  saksNr: PropTypes.number.isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
};

export default injectIntl(HistorikkMalType7);
