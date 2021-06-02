import { MicroFrontend } from '@fpsak-frontend/utils';
import * as React from 'react';
import { ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';

const initializeUttak = (
  elementId,
  uttaksperioder,
  behandlingUuid: string,
  arbeidsforhold: ArbeidsgiverOpplysningerPerId,
) => {
  (window as any).renderUttakApp(elementId, {
    uttaksperioder,
    aktivBehandlingUuid: behandlingUuid,
    arbeidsforhold,
  });
};

interface UttakProps {
  uuid: string;
  uttaksperioder: any;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

const uttakAppID = 'uttakApp';
export default ({ uuid, uttaksperioder, arbeidsgiverOpplysningerPerId }: UttakProps) => (
  <MicroFrontend
    id={uttakAppID}
    jsSrc="/k9/microfrontend/psb-uttak/1.1.1/app.js"
    jsIntegrity="sha384-zzTDBuAkgPruMUkTzTVYR9yZGT/BZ9EpBT5w6TYOvaXMwYcuQEGR9QQJYZcK/Yzt"
    stylesheetSrc="/k9/microfrontend/psb-uttak/1.1.1/styles.css"
    stylesheetIntegrity="sha384-UUI4y1WdDyn2tOLW2fSL359hFdAEucuTi2k1cYf3QLW7I9OGg9few+qjaGvgoOee"
    onReady={() => initializeUttak(uttakAppID, uttaksperioder, uuid, arbeidsgiverOpplysningerPerId)}
  />
);
