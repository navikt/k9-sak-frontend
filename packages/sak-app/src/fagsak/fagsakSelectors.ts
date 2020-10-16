import { createSelector } from 'reselect';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { Fagsak, Kodeverk } from '@k9-sak-web/types';

import fpsakApi from '../data/fpsakApi';

const getFetchFagsakResult = fpsakApi.FETCH_FAGSAK.getRestApiData();

// TODO (TOR) Flytt denne til duck. (Må fikse circular dependency først)
export const getFagsakContext = state => state.default.fagsak;

export const getSelectedSaksnummer = state => getFagsakContext(state).selectedSaksnummer;

// NB! Ikke bruk denne i eksterne filer (utover dagens bruk)
export const getSelectedFagsak = createSelector(
  [getSelectedSaksnummer, getFetchFagsakResult],
  (selectedSaksnummer, fagsak?: Fagsak) => (fagsak && fagsak.saksnummer === selectedSaksnummer ? fagsak : undefined),
);

export const getSelectedFagsakDekningsgrad = createSelector(getSelectedFagsak, fagsak =>
  fagsak ? fagsak.dekningsgrad : undefined,
);
export const getSelectedFagsakStatus = createSelector(getSelectedFagsak, fagsak =>
  fagsak ? fagsak.status : undefined,
);
export const getFagsakPerson = createSelector(getSelectedFagsak, fagsak => (fagsak ? fagsak.person : undefined));
export const getSaksnummer = createSelector(getSelectedFagsak, fagsak => (fagsak ? fagsak.saksnummer : undefined));
export const getFagsakYtelseType = createSelector(getSelectedFagsak, fagsak => (fagsak ? fagsak.sakstype : undefined));
export const getAktorid = createSelector(getFagsakPerson, person => (person ? person.aktørId : undefined));
export const isForeldrepengerFagsak = createSelector(
  getFagsakYtelseType,
  (ytelseType: Kodeverk) => ytelseType && ytelseType.kode === fagsakYtelseType.FORELDREPENGER,
);
export const isSvangerskapFagsak = createSelector(
  getFagsakYtelseType,
  (ytelseType: Kodeverk) => ytelseType && ytelseType.kode === fagsakYtelseType.SVANGERSKAPSPENGER,
);

export const isPleiepengerFagsak = createSelector(
  getFagsakYtelseType,
  (ytelseType: Kodeverk) => ytelseType && ytelseType.kode === fagsakYtelseType.PLEIEPENGER,
);
export const getKanRevurderingOpprettes = createSelector(getSelectedFagsak, fagsak =>
  fagsak ? fagsak.kanRevurderingOpprettes : undefined,
);
export const getSkalBehandlesAvInfotrygd = createSelector(getSelectedFagsak, fagsak =>
  fagsak ? fagsak.skalBehandlesAvInfotrygd : undefined,
);