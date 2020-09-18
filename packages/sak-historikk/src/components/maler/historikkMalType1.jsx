import React from 'react';
import PropTypes from 'prop-types';
import { Element } from 'nav-frontend-typografi';

import BubbleText from './felles/bubbleText';
import { findHendelseText } from './felles/historikkUtils';
import HistorikkDokumentLenke from './felles/HistorikkDokumentLenke';
import historikkinnslagDelPropType from '../../propTypes/historikkinnslagDelPropType';

const HistorikkMalType1 = ({ historikkinnslagDeler, dokumentLinks, saksNr, getKodeverknavn }) => (
  <>
    {historikkinnslagDeler[0] && historikkinnslagDeler[0].hendelse && (
      <Element>{findHendelseText(historikkinnslagDeler[0].hendelse, getKodeverknavn)}</Element>
    )}

    {historikkinnslagDeler[0].begrunnelse && (
      <BubbleText bodyText={getKodeverknavn(historikkinnslagDeler[0].begrunnelse)} cutOffLength={70} />
    )}
    {historikkinnslagDeler[0].begrunnelseFritekst && (
      <BubbleText bodyText={historikkinnslagDeler[0].begrunnelseFritekst} />
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
);

HistorikkMalType1.propTypes = {
  historikkinnslagDeler: PropTypes.arrayOf(historikkinnslagDelPropType).isRequired,
  dokumentLinks: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  saksNr: PropTypes.string.isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
};

export default HistorikkMalType1;

/*
 https://confluence.adeo.no/display/MODNAV/OMR-13+SF4+Sakshistorikk+-+UX+og+grafisk+design

 Fem design patterns:

 +----------------------------+
 | Type 1                     |
 | BEH_VENT                   |
 | BEH_GJEN                   |
 | KØET_BEH_GJEN              |
 | BEH_STARTET                |
 | VEDLEGG_MOTTATT            |
 | BREV_SENT                  |
 | BREV_BESTILT               |
 | MANGELFULL_SØKNAD          |
 +----------------------------+
 <tidspunkt> // <rolle> <id>
 <hendelse>
 <begrunnelsestekst>
 <dokumentLinker>

 +----------------------------+
 | Type 2                     |
 | FORSLAG_VEDTAK             |
 | FORSLAG_VEDTAK_UTEN_TOTRINN|
 | VEDTAK_FATTET              |
 | VEDTAK_FATTET_AUTOMATISK   |
 | OVERSTYRT (hvis beslutter) |
 | REGISTRER_OM_VERGE         |
 +----------------------------+
 <tidspunkt> // <rolle> <id>
 <hendelse>: <resultat>
 <skjermlinke>


 +----------------------------+
 | Type 3                     |
 | SAK_RETUR                  |
 +----------------------------+
 <tidspunkt> // <rolle> <id>
 <hendelse>
 <begrunnelsestekst>
 <dokumentLinker>


 +----------------------------+
 | Type 4                     |
 | AVBRUTT_BEH                |
 | OVERSTYRT (hvis saksbeh.)  |
 +----------------------------+
 <tidspunkt> // <rolle> <id>
 <hendelse>
 <årsak>
 <begrunnelsestekst>


 +----------------------------+
 | Type 5                     |
 | FAKTA_ENDRET               |
 +----------------------------+
 <tidspunkt> // <rolle> <id>
 <skjermlinke>
 <feltnavn> er endret <fra-verdi> til <til-verdi>
 <radiogruppe> er satt til <verdi>
 <begrunnelsestekst>
 <dokumentLinker>

 +----------------------------+
 | Type 6                     |
 | NY_INFO_FRA_TPS            |
 +----------------------------+
 Ikke definert

 +----------------------------+
 | Type 7                     |
 | OVERSTYRT                  |
 +----------------------------+
 <tidspunkt> // <rolle> <id>
 <skjermlinke>
 Overstyrt <vurdering/beregning>: <Utfallet/beløpet> er endret fra <fra-verdi> til <til-verdi>
 <begrunnelsestekst>

+----------------------------+
 | Type 8                     |
 | ???                        |
 +----------------------------+
 Ikke definiert

 */
