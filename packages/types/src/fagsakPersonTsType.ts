import Kodeverk from './kodeverk';

type FagsakPerson = Readonly<{
  erDod: boolean;
  navn: string;
  alder: number;
  personnummer: string;
  erKvinne: boolean;
  personstatusType: Kodeverk;
  diskresjonskode?: Kodeverk;
  dodsdato?: string;
}>;

export default FagsakPerson;
