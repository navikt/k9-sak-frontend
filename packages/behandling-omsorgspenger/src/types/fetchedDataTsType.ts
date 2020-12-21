import {
  Aksjonspunkt,
  Beregningsgrunnlag,
  ArbeidsgiverOpplysningerPerId,
  Personopplysninger,
  SimuleringResultat,
  Soknad,
  Vilkar,
  BeregningsresultatUtbetalt,
} from '@k9-sak-web/types';
import ÅrskvantumForbrukteDager from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/ÅrskvantumForbrukteDager';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  personopplysninger: Personopplysninger;
  soknad: Soknad;
  beregningsresultatUtbetaling: BeregningsresultatUtbetalt;
  beregningsgrunnlag: Beregningsgrunnlag;
  simuleringResultat: SimuleringResultat;
  forbrukteDager: ÅrskvantumForbrukteDager;
  arbeidsgivere: {
    arbeidsgivere: ArbeidsgiverOpplysningerPerId;
  };
}

export default FetchedData;
