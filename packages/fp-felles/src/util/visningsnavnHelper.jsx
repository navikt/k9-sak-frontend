import moment from 'moment';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';

const getEndCharFromId = id => (id ? `...${id.substring(id.length - 4, id.length)}` : '');

export const createVisningsnavnForAktivitet = (aktivitet, getKodeverknavn, arbeidsgiverOpplysningerPerId) => {
  const arbeidsgiverNavn =
    arbeidsgiverOpplysningerPerId && arbeidsgiverOpplysningerPerId[aktivitet.arbeidsgiverId]
      ? arbeidsgiverOpplysningerPerId[aktivitet.arbeidsgiverId].navn
      : '';

  if (!arbeidsgiverNavn) {
    return aktivitet.arbeidsforholdType ? getKodeverknavn(aktivitet.arbeidsforholdType) : '';
  }

  return `${arbeidsgiverNavn} (${aktivitet.arbeidsgiverId})${getEndCharFromId(aktivitet.eksternArbeidsforholdId)}`;
};

// vanlig arbeidsgivernavn (orgnr)...arbeidsforholdid
// privatperson - KLANG...(18.08.1980)
const formatDate = dato => moment(dato).format(DDMMYYYY_DATE_FORMAT);

export const lagVisningsNavn = (arbeidsgiver = {}, eksternArbeidsforholdId) => {
  const { navn, fødselsdato, virksomhet, identifikator } = arbeidsgiver;

  let visningsNavn = `${navn}`;
  if (virksomhet) {
    visningsNavn = identifikator ? `${visningsNavn} (${identifikator})` : visningsNavn;
    visningsNavn = `${visningsNavn}${getEndCharFromId(eksternArbeidsforholdId)}`;
  } else {
    visningsNavn = `${navn.substr(0, 5)}...(${formatDate(fødselsdato)})`;
  }
  return visningsNavn;
};
