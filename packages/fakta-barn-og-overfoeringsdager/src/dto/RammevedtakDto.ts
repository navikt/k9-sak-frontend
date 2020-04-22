import Informasjonskilde from './Informasjonskilde';

interface RammevedtakDto {
  kilde: Informasjonskilde;
  fom?: string;
  tom?: string;
}

export interface UtvidetRettDto extends RammevedtakDto {
  fnrKroniskSyktBarn?: string;
  idKroniskSyktBarn?: string;
}

export interface MidlertidigAleneOmOmsorgen extends RammevedtakDto {
  erMidlertidigAlene?: boolean;
}

export interface OverføringFår extends RammevedtakDto {
  antallDager: number;
  avsendersFnr?: string;
}

export interface OverføringGir extends RammevedtakDto {
  antallDager: number;
  mottakersFnr?: string;
}

export interface UidentifisertRammevedtak {
  fritekst?: string;
}
