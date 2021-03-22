interface Gyldighetsperiode {
  fom: string;
  tom: string;
}

export default interface Barn {
  kroniskSykdom?: Gyldighetsperiode[];
  aleneomsorg?: Gyldighetsperiode;
  fosterbarn?: Gyldighetsperiode;
  utenlandskBarn?: Gyldighetsperiode;
  deltBosted?: Gyldighetsperiode;
  fødselsnummer: string;
}
