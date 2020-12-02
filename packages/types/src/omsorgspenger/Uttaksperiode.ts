import stringEnum from '../tsUtils';

export const VilkårEnum = stringEnum({
  OMSORGSVILKÅRET: 'OMSORGSVILKÅRET',
  NOK_DAGER: 'NOK_DAGER',
  INNGANGSVILKÅR: 'INNGANGSVILKÅR',
  ALDERSVILKÅR_SØKER: 'ALDERSVILKÅR_SØKER',
  ALDERSVILKÅR_BARN: 'ALDERSVILKÅR_BARN',
  SMITTEVERN: 'SMITTEVERN',
  UIDENTIFISERT_RAMMEVEDTAK: 'UIDENTIFISERT_RAMMEVEDTAK',
  ARBEIDSFORHOLD: 'ARBEIDSFORHOLD',
});

export type Vilkår = typeof VilkårEnum[keyof typeof VilkårEnum];

export const UtfallEnum = stringEnum({
  INNVILGET: 'INNVILGET',
  AVSLÅTT: 'AVSLÅTT',
  UAVKLART: 'UAVKLART',
});

export type Utfalltype = typeof UtfallEnum[keyof typeof UtfallEnum];

export type Map<Key extends string | number, Value> = {
  [key in Key]?: Value;
};

export type VurderteVilkår = Map<Vilkår, Utfalltype>;

export interface Uttaksperiode {
  periode: string; // fom/tom
  delvisFravær?: string; // Duration
  utfall: Utfalltype;
  utbetalingsgrad: number;
  vurderteVilkår: {
    vilkår: VurderteVilkår;
  };
  hjemler: string[];
  nøkkeltall?: Nøkkeltall;
}

export interface Nøkkeltall {
  totaltAntallDager: number;
  antallKoronadager: number;
  antallDagerArbeidsgiverDekker: number;
  antallDagerInfotrygd: number;
  antallForbrukteDager: number;
  migrertData: boolean;
}

export default Uttaksperiode;
