import React from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import historikkOpplysningTypeCodes from '../../kodeverk/historikkOpplysningTypeCodes';
import historikkinnslagDelPropType from '../../propTypes/historikkinnslagDelPropType';
import Skjermlenke from './felles/Skjermlenke';

export const HistorikkMalTypeForeldelse = ({ historikkinnslagDeler, behandlingLocation, getKodeverknavn }) => {
  if (historikkinnslagDeler.length === 0) {
    return null;
  }
  return (
    <>
      <Skjermlenke
        skjermlenke={historikkinnslagDeler[0].skjermlenke}
        behandlingLocation={behandlingLocation}
        getKodeverknavn={getKodeverknavn}
        scrollUpOnClick
      />
      {historikkinnslagDeler.map(historikkinnslagDel => {
        const { begrunnelseFritekst, opplysninger, endredeFelter } = historikkinnslagDel;
        const periodeFom = opplysninger.find(
          o => o.opplysningType.kode === historikkOpplysningTypeCodes.PERIODE_FOM.kode,
        ).tilVerdi;
        const periodeTom = opplysninger.find(
          o => o.opplysningType.kode === historikkOpplysningTypeCodes.PERIODE_TOM.kode,
        ).tilVerdi;

        return (
          <div key={periodeFom + periodeTom}>
            <Normaltekst>
              <FormattedHTMLMessage
                id="Historikk.Template.Foreldelse.VurderingAvPerioden"
                values={{ periodeFom, periodeTom }}
              />
            </Normaltekst>
            {endredeFelter &&
              endredeFelter.map(felt => {
                const { endretFeltNavn, fraVerdi, tilVerdi } = felt;

                return (
                  <React.Fragment key={endretFeltNavn.kode}>
                    <Normaltekst>
                      <FormattedHTMLMessage
                        id={
                          felt.fraVerdi
                            ? 'Historikk.Template.Tilbakekreving.ChangedFromTo'
                            : 'Historikk.Template.Tilbakekreving.FieldSetTo'
                        }
                        values={{ navn: getKodeverknavn(endretFeltNavn), fraVerdi, tilVerdi }}
                      />
                    </Normaltekst>
                    <VerticalSpacer eightPx />
                  </React.Fragment>
                );
              })}
            <VerticalSpacer eightPx />
            <Normaltekst>{begrunnelseFritekst && begrunnelseFritekst}</Normaltekst>
            <VerticalSpacer eightPx />
          </div>
        );
      })}
    </>
  );
};

HistorikkMalTypeForeldelse.propTypes = {
  historikkinnslagDeler: PropTypes.arrayOf(historikkinnslagDelPropType).isRequired,
  behandlingLocation: PropTypes.shape().isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
};

export default HistorikkMalTypeForeldelse;
