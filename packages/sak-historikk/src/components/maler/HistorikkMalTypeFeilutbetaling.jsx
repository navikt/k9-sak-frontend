import React from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import historikkOpplysningTypeCodes from '../../kodeverk/historikkOpplysningTypeCodes';
import historikkEndretFeltTypeCodes from '../../kodeverk/historikkEndretFeltTypeCodes';
import BubbleText from './felles/bubbleText';
import historikkinnslagDelPropType from '../../propTypes/historikkinnslagDelPropType';
import Skjermlenke from './felles/Skjermlenke';

const finnFomOpplysning = opplysninger => {
  const found = opplysninger.find(o => o.opplysningType.kode === historikkOpplysningTypeCodes.PERIODE_FOM.kode);
  return found.tilVerdi;
};

const finnTomOpplysning = opplysninger => {
  const found = opplysninger.find(o => o.opplysningType.kode === historikkOpplysningTypeCodes.PERIODE_TOM.kode);
  return found.tilVerdi;
};

const buildEndretFeltText = (endredeFelter, getKodeverknavn) => {
  const årsakFelt = endredeFelter.filter(
    felt => felt.endretFeltNavn.kode === historikkEndretFeltTypeCodes.FAKTA_OM_FEILUTBETALING_AARSAK.kode,
  )[0];
  const underÅrsakFelt = endredeFelter.filter(
    felt => felt.endretFeltNavn.kode === historikkEndretFeltTypeCodes.FAKTA_OM_FEILUTBETALING_UNDERAARSAK.kode,
  )[0];
  const underÅrsakFraVerdi = underÅrsakFelt
    ? getKodeverknavn({ kode: underÅrsakFelt.fraVerdi, kodeverk: underÅrsakFelt.klFraVerdi })
    : null;
  const underÅrsakTilVerdi = underÅrsakFelt
    ? getKodeverknavn({ kode: underÅrsakFelt.tilVerdi, kodeverk: underÅrsakFelt.klTilVerdi })
    : null;
  const endret = endredeFelter.filter(felt => felt.fraVerdi !== null).length > 0;

  const tilVerdiNavn = getKodeverknavn({ kode: årsakFelt.tilVerdi, kodeverk: årsakFelt.klTilVerdi });
  if (endret) {
    const årsakVerdi = årsakFelt.fraVerdi ? årsakFelt.fraVerdi : årsakFelt.tilVerdi;
    const fraVerdi = `${getKodeverknavn({ kode: årsakVerdi, kodeverk: årsakFelt.klFraVerdi })} ${
      underÅrsakFraVerdi ? `(${underÅrsakFraVerdi})` : ''
    }`;
    const tilVerdi = `${tilVerdiNavn} ${underÅrsakTilVerdi ? `(${underÅrsakTilVerdi})` : ''}`;
    return <FormattedHTMLMessage id="Historikk.Template.Feilutbetaling.endretFelt" values={{ fraVerdi, tilVerdi }} />;
  }
  const feltVerdi = `${tilVerdiNavn} ${underÅrsakTilVerdi ? `(${underÅrsakTilVerdi})` : ''}`;
  return <FormattedHTMLMessage id="Historikk.Template.Feilutbetaling.sattFelt" values={{ feltVerdi }} />;
};

const HistorikkMalTypeFeilutbetaling = ({
  historikkinnslagDeler,
  behandlingLocation,
  getKodeverknavn,
  createLocationForSkjermlenke,
}) => (
  <>
    <Skjermlenke
      skjermlenke={historikkinnslagDeler[0].skjermlenke}
      behandlingLocation={behandlingLocation}
      getKodeverknavn={getKodeverknavn}
      scrollUpOnClick
      createLocationForSkjermlenke={createLocationForSkjermlenke}
    />
    {historikkinnslagDeler.map((historikkinnslagDel, index) =>
      historikkinnslagDel.endredeFelter ? (
        <div key={`historikkinnslagDel${index + 1}`}>
          <FormattedHTMLMessage
            id="Historikk.Template.Feilutbetaling.FaktaFeilutbetalingPeriode"
            values={{
              periodeFom: finnFomOpplysning(historikkinnslagDel.opplysninger),
              periodeTom: finnTomOpplysning(historikkinnslagDel.opplysninger),
            }}
          />
          <Normaltekst>{buildEndretFeltText(historikkinnslagDel.endredeFelter, getKodeverknavn)}</Normaltekst>
          <VerticalSpacer eightPx />
        </div>
      ) : null,
    )}
    {historikkinnslagDeler[0] && historikkinnslagDeler[0].begrunnelseFritekst && (
      <BubbleText bodyText={historikkinnslagDeler[0].begrunnelseFritekst} className="snakkeboble-panel__tekst" />
    )}
  </>
);

HistorikkMalTypeFeilutbetaling.propTypes = {
  historikkinnslagDeler: PropTypes.arrayOf(historikkinnslagDelPropType).isRequired,
  behandlingLocation: PropTypes.shape().isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
  createLocationForSkjermlenke: PropTypes.func.isRequired,
};

export default HistorikkMalTypeFeilutbetaling;
