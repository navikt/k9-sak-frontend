import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import AntallTimer from './AntallTimer';
import { DagerTimer } from './durationUtils';
import Nokkeltall, { Nokkeltalldetalj } from './Nokkeltall';
import styles from './nokkeltall.less';

interface ForbrukteDagerProps {
  navHarUtbetaltDagerTimer: DagerTimer;
  infotrygdDagerTimer: DagerTimer;
  forbrukteDagerTimer: DagerTimer;
  smittevernDagerTimer?: DagerTimer;
  utbetaltForMangeDagerTimer?: DagerTimer;
  visDetaljer: () => void;
  viserDetaljer: boolean;
  ar: string;
}

const forbrukteDagerDetaljer = (
  tidFraInfotrygd: DagerTimer,
  forbruktDagerTimer: DagerTimer,
  ar: string,
  smittevernDagerTimer?: DagerTimer,
  utbetaltForMangeDagerTimer?: DagerTimer,
): Nokkeltalldetalj[] => {
  const detaljer: Nokkeltalldetalj[] = [];

  if (tidFraInfotrygd.dager || tidFraInfotrygd.timer) {
    detaljer.push({
      antallDager: tidFraInfotrygd.dager,
      antallTimer: <AntallTimer timer={tidFraInfotrygd.timer} />,
      overskrifttekstId: 'Nøkkeltall.DagerFraInfotrygd',
      infotekstContent: tidFraInfotrygd.timer ? (
        <FormattedMessage id="Nøkkeltall.DagerFraInfotrygd.DagerOgTimer.InfoText" values={{ ...tidFraInfotrygd }} />
      ) : (
        <FormattedMessage id="Nøkkeltall.DagerFraInfotrygd.Dager.InfoText" values={{ dager: tidFraInfotrygd.dager }} />
      ),
    });
  }

  detaljer.push({
    antallDager: forbruktDagerTimer.dager,
    antallTimer: <AntallTimer timer={forbruktDagerTimer.timer} />,
    overskrifttekstId: 'Nøkkeltall.ForbrukteDager',
    infotekstContent: forbruktDagerTimer.timer ? (
      <FormattedMessage id="Nøkkeltall.ForbrukteDager.DagerOgTimer.InfoText" values={{ ...forbruktDagerTimer }} />
    ) : (
      <FormattedMessage id="Nøkkeltall.ForbrukteDager.Dager.InfoText" values={{ dager: forbruktDagerTimer.dager }} />
    ),
  });

  if (smittevernDagerTimer) {
    detaljer.push({
      antallDager: smittevernDagerTimer.dager,
      antallTimer: <AntallTimer timer={smittevernDagerTimer.timer} />,
      overskrifttekstId: 'Nøkkeltall.Smittevern',
      infotekstContent: <FormattedMessage id={`Nøkkeltall.Smittevern.InfoText.${ar}`} />,
    });
  } else if (utbetaltForMangeDagerTimer) {
    detaljer.push({
      antallDager: utbetaltForMangeDagerTimer.dager,
      antallTimer: <AntallTimer timer={utbetaltForMangeDagerTimer.timer} />,
      overskrifttekstId: 'Nøkkeltall.UtbetaltForMangeDager',
      infotekstContent: utbetaltForMangeDagerTimer.timer ? (
        <FormattedMessage
          id="Nøkkeltall.UtbetaltForMangeDager.DagerOgTimer.InfoText"
          values={{ ...utbetaltForMangeDagerTimer }}
        />
      ) : (
        <FormattedMessage
          id="Nøkkeltall.UtbetaltForMangeDager.Dager.InfoText"
          values={{ dager: utbetaltForMangeDagerTimer.dager }}
        />
      ),
    });
  }

  return detaljer;
};

const ForbrukteDager: React.FunctionComponent<ForbrukteDagerProps> = ({
  navHarUtbetaltDagerTimer,
  infotrygdDagerTimer,
  forbrukteDagerTimer,
  smittevernDagerTimer,
  utbetaltForMangeDagerTimer,
  viserDetaljer,
  visDetaljer,
  ar,
}) => (
  <Nokkeltall
    overskrift={{
      antallDager: navHarUtbetaltDagerTimer.dager,
      antallTimer: <AntallTimer timer={navHarUtbetaltDagerTimer.timer} />,
      overskrifttekstId: 'Nøkkeltall.DagerNavHarUtbetalt',
    }}
    detaljer={forbrukteDagerDetaljer(
      infotrygdDagerTimer,
      forbrukteDagerTimer,
      ar,
      smittevernDagerTimer,
      utbetaltForMangeDagerTimer,
    )}
    viserDetaljer={viserDetaljer}
    visDetaljer={visDetaljer}
    className={styles.dagerNavHarUtbetalt}
  />
);

export default ForbrukteDager;
