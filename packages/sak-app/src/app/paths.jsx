import { buildPath, formatQueryString, parseQueryString } from '@fpsak-frontend/utils';

export const fagsakPath = '/fagsak/:saksnummer/';
export const aktoerPath = '/aktoer/:aktoerId(\\d+)';
export const behandlingerPath = `${fagsakPath}behandling/`;
export const behandlingPath = `${behandlingerPath}:behandlingId(\\d+)/`;

export const pathToFagsak = saksnummer => buildPath(fagsakPath, { saksnummer });
export const pathToBehandlinger = saksnummer => buildPath(behandlingerPath, { saksnummer });
export const pathToBehandling = (saksnummer, behandlingId) => buildPath(behandlingPath, { saksnummer, behandlingId });
export const pathToMissingPage = () => '/404';

const emptyQueryString = queryString => queryString === '?' || !queryString;

const updateQueryParams = (queryString, nextParams) => {
  const prevParams = emptyQueryString(queryString) ? {} : parseQueryString(queryString);
  return formatQueryString({
    ...prevParams,
    ...nextParams,
  });
};

export const getLocationWithQueryParams = (location, queryParams) => ({
  ...location,
  search: updateQueryParams(location.search, queryParams),
});

export const getSupportPanelLocationCreator = location => supportPanel =>
  getLocationWithQueryParams(location, { stotte: supportPanel });
export const getBehandlingspunktLocation = location => behandlingspunkt =>
  getLocationWithQueryParams(location, { punkt: behandlingspunkt });
export const getFaktaLocation = location => fakta => getLocationWithQueryParams(location, { fakta });
export const getRiskPanelLocationCreator = location => isRiskPanelOpen =>
  getLocationWithQueryParams(location, { risiko: isRiskPanelOpen });

export const DEFAULT_FAKTA = 'default';
export const DEFAULT_BEHANDLINGSPROSESS = 'default';

// eslint-disable-next-line
export const getLocationWithDefaultBehandlingspunktAndFakta = location =>
  getLocationWithQueryParams(location, { punkt: DEFAULT_BEHANDLINGSPROSESS, fakta: DEFAULT_FAKTA });

export const getPathToFplos = () => {
  const { host } = window.location;
  if (host === 'app-q1.adeo.no') {
    return 'https://k9-los-web.nais.preprod.local/';
  }
  if (host === 'app.adeo.no') {
    return 'https://k9-los-web.nais.adeo.no/';
  }
  return null;
};
