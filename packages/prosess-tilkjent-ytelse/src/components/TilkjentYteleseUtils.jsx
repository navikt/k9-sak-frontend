export const getAktivitet = (aktivitetStatus, getKodeverknavn) => {
  return getKodeverknavn(aktivitetStatus);
};

const getEndCharFromId = id => (id ? `...${id.substring(id.length - 4, id.length)}` : '');

export const createVisningsnavnForAndel = (andel, getKodeverknavn) => {
  if (!andel.arbeidsgiverNavn) {
    return andel.aktivitetStatus ? getKodeverknavn(andel.aktivitetStatus) : '';
  }
  return andel.arbeidsforholdId
    ? `${andel.arbeidsgiverNavn} (${andel.arbeidsgiverOrgnr})${getEndCharFromId(andel.eksternArbeidsforholdId)}`
    : `${andel.arbeidsgiverNavn} (${andel.arbeidsgiverOrgnr})`;
};

export default createVisningsnavnForAndel;
