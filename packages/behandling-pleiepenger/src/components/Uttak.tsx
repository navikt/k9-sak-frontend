import { MicroFrontend } from '@fpsak-frontend/utils';
import * as React from 'react';

const initializeUttak = (elementId, uttaksperioder, behandlingUuid: string) => {
  (window as any).renderUttakApp(elementId, {
    uttaksperioder,
    aktivBehandlingUuid: behandlingUuid,
  });
};

interface UttakProps {
  uuid: string;
  uttaksperioder: any;
}

const uttakAppID = 'uttakApp';
export default ({ uuid, uttaksperioder }: UttakProps) => (
  <MicroFrontend
    id={uttakAppID}
    jsSrc="https://psb-uttak-frontend.dev.adeo.no/1.0.2/app.js"
    jsIntegrity="sha384-vac17jZlI7vGTGemPYieQO/Eg7P5QxyVYIyBuQMamhlJPxFncX/plPfLQgo11/zx"
    stylesheetSrc="https://psb-uttak-frontend.dev.adeo.no/1.0.2/styles.css"
    stylesheetIntegrity="sha384-7Azm1w5ns5abNtQPahMeU8MZHrMNVwrX7yL4TmjT31DeqH1/sYzR6XGJSWB2lA+8"
    onReady={() => initializeUttak(uttakAppID, uttaksperioder, uuid)}
  />
);
