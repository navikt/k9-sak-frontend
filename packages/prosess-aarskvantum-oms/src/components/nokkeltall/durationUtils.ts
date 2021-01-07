import moment from 'moment';

export interface DagerTimer {
  dager: number;
  timer?: number;
}

const formaterTimerDesimal = (timerDesimal: number): number => Number.parseFloat(timerDesimal.toFixed(2));

export const konverterDesimalTilDagerOgTimer = (desimal: number): DagerTimer => {
  const dager = desimal > 0 ? Math.floor(desimal) : Math.ceil(desimal);
  const timerDesimal = desimal % 1;

  return {
    dager,
    timer: timerDesimal !== 0 ? formaterTimerDesimal(timerDesimal * 7.5) : null,
  };
};

export const beregnDagerTimer = (dagerTimer: string): DagerTimer => {
  const duration = moment.duration(dagerTimer);
  const totaltAntallTimer = duration.asHours();

  return {
    dager: totaltAntallTimer > 0 ? Math.floor(totaltAntallTimer / 7.5) : Math.ceil(totaltAntallTimer / 7.5),
    timer: totaltAntallTimer % 7.5,
  };
};

export const sumTid = (dagerTimer1: DagerTimer, dagerTimer2: DagerTimer): DagerTimer => {
  const sumTimer = (dagerTimer2.timer || 0) + (dagerTimer1.timer || 0);

  return {
    dager: dagerTimer2.dager + dagerTimer1.dager + Math.floor(sumTimer / 7.5),
    timer: formaterTimerDesimal(sumTimer % 7.5),
  };
};
