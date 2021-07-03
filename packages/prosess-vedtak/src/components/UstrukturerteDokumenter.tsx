import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import * as React from 'react';
import Lenke from 'nav-frontend-lenker';
import styles from './ustrukturerteDokumenter.less';

const linkIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21 24H3V0H14L21 7V24ZM12 2H5V22H19V8H12V2ZM14 2.83V6L17.17 5.999L14 2.83Z"
      fill="#0067C5"
    />
  </svg>
);

const getLinks = links =>
  links.map(link => (
    <li key={link.navn} className={styles.ustrukturerteDokumenter__listItem}>
      {linkIcon}
      <Lenke href="#">{link.navn}</Lenke>
    </li>
  ));

const UstrukturerteDokumenter = () => (
  <div className={styles.ustrukturerteDokumenter}>
    <Undertittel>Uregistrerte opplysninger</Undertittel>
    <Normaltekst className={styles.ustrukturerteDokumenter__text}>
      Det finnes opplysninger som ikke er registrert i K9-sak. <br />
      Vennligst se gjennom følgende dokumenter for å se om det finnes opplysninger som vil påvirke saken:
    </Normaltekst>
    <ul className={styles.ustrukturerteDokumenter__linkList}>
      {getLinks([{ navn: 'Søknad om pleiepenger' }, { navn: 'Søknad om pleiepenger' }])}
    </ul>
  </div>
);

export default UstrukturerteDokumenter;
