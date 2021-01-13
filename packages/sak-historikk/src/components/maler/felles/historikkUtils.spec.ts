import { expect } from 'chai';

import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import { findResultatText } from './historikkUtils';

const noenKodeverk = {
  VedtakResultatType: [
    {
      kode: 'VEDTAK_I_KLAGEBEHANDLING',
      navn: 'vedtak i klagebehandling',
      kodeverk: 'VEDTAK_RESULTAT_TYPE',
    },
  ],
  HistorikkResultatType: [
    {
      kode: 'KLAGE_HJEMSENDE_UTEN_OPPHEVE',
      navn: 'Behandling er hjemsendt',
      kodeverk: 'HISTORIKK_RESULTAT_TYPE',
    },
  ],
};

describe('historikkUtils', () => {
  it('findResultatText henter navn fra alle kodeverk, med fallback for tilbakekrevingskoder', () => {
    const historikkResultatNavn = findResultatText(
      noenKodeverk.HistorikkResultatType[0].kode,
      intlMock,
      getKodeverknavnFn(noenKodeverk, kodeverkTyper),
    );
    expect(historikkResultatNavn).to.equal(noenKodeverk.HistorikkResultatType[0].navn);

    const vedtakResultatNavn = findResultatText(
      noenKodeverk.VedtakResultatType[0].kode,
      intlMock,
      getKodeverknavnFn(noenKodeverk, kodeverkTyper),
    );
    expect(vedtakResultatNavn).to.equal(noenKodeverk.VedtakResultatType[0].navn);
  });

  it('findResultatText har fallback for tilbekekrevingskoder', () => {
    const historikkResultatNavn = findResultatText(
      'FULL_TILBAKEBETALING',
      intlMock,
      getKodeverknavnFn(noenKodeverk, kodeverkTyper),
    );
    expect(historikkResultatNavn).to.equal('HistorikkResultat.FullTilbakebetaling');
  });
});
