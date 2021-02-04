import Kodeverk from './kodeverkTsType';

export type BeregningsresultatPeriodeAndel = Readonly<{
  arbeidsgiverNavn: string;
  arbeidsgiverOrgnr: string;
  refusjon: number;
  tilSoker: number;
  uttak: any[];
  utbetalingsgrad: number;
  sisteUtbetalingsdato: string;
  aktivitetStatus: Kodeverk;
  arbeidsforholdId: string;
  eksternArbeidsforholdId: string;
  aktørId: string;
  arbeidsforholdType: Kodeverk;
  stillingsprosent: number;
}>;

export type BeregningsresultatUtbetalt = Readonly<{
  opphoersdato?: string;
  perioder: {
    andeler: Kodeverk[];
    dagsats: number;
    fom: string;
    tom: string;
  }[];
  skalHindreTilbaketrekk: boolean;
  utbetaltePerioder: any[];
}>;

export type BeregningsresultatPeriode = Readonly<{
  fom: string;
  tom: string;
  dagsats: number;
  andeler?: BeregningsresultatPeriodeAndel[];
}>;

export default BeregningsresultatUtbetalt;
