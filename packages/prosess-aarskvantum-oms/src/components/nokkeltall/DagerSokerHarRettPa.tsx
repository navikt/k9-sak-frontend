import { formatQueryString, parseQueryString } from '@fpsak-frontend/utils';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import Lenke from 'nav-frontend-lenker';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';
import Nokkeltall from './Nokkeltall';
import styles from './nokkeltall.less';

interface DagerSokerHarRettPaProps {
  dagerRettPå: number;
  antallOmsorgsdager: number;
  antallKoronadager: number;
  erIKoronaperioden: boolean;
  benyttetRammemelding: boolean;
  visDetaljer: () => void;
  viserDetaljer: boolean;
  ar: string;
}

const DagerSokerHarRettPa: React.FunctionComponent<DagerSokerHarRettPaProps> = ({
  dagerRettPå,
  antallOmsorgsdager,
  antallKoronadager,
  erIKoronaperioden,
  benyttetRammemelding,
  visDetaljer,
  viserDetaljer,
  ar,
}) => {
  const location = useLocation();
  const { search, pathname } = location;
  const faktapanelUttak = {
    ...parseQueryString(search),
    fakta: faktaPanelCodes.UTTAK,
  };

  const detaljer = [
    {
      antallDager: antallOmsorgsdager,
      overskrifttekstId: 'Nøkkeltall.DagerGrunnrett',
      infotekstContent: (
        <>
          <FormattedMessage id="Nøkkeltall.DagerGrunnrett.InfoText" />
          {benyttetRammemelding && (
            <>
              &nbsp;
              <FormattedMessage
                id="Nøkkeltall.Rammemelding"
                values={{
                  a: (...lenketekst) => (
                    <Lenke href={`/k9/web${pathname}${formatQueryString(faktapanelUttak)}`}>{lenketekst}</Lenke>
                  ),
                }}
              />
            </>
          )}
        </>
      ),
    },
  ];

  if (erIKoronaperioden || antallKoronadager > 0) {
    detaljer.push({
      antallDager: antallKoronadager,
      overskrifttekstId: 'Nøkkeltall.Koronadager',
      infotekstContent: <FormattedMessage id={`Nøkkeltall.Koronadager.InfoText.${ar}`} />,
    });
  }

  return (
    <Nokkeltall
      overskrift={{ antallDager: dagerRettPå, overskrifttekstId: 'Nøkkeltall.DagerSøkerHarRettPå' }}
      detaljer={detaljer}
      viserDetaljer={viserDetaljer}
      visDetaljer={visDetaljer}
      className={styles.dagerSokerHarRettPa}
    />
  );
};

export default DagerSokerHarRettPa;
