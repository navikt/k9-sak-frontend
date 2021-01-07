import checkImg from '@fpsak-frontend/assets/images/check.svg';
import advarselImg from '@fpsak-frontend/assets/images/remove.svg';
import opptjeningAktivitetKlassifisering from '@fpsak-frontend/prosess-vilkar-opptjening-oms/src/kodeverk/opptjeningAktivitetKlassifisering';
import { Image } from '@fpsak-frontend/shared-components';
import { TimeLineButton } from '@fpsak-frontend/tidslinje';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import moment from 'moment';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import React, { FormEvent, FunctionComponent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { TimelineItem } from './OpptjeningTimeLineLight';
import styles from './timeLineData.less';

const MELLOMLIGGENDE_PERIODE = 'MELLOMLIGGENDE_PERIODE';

const isoToDdMmYyyy = string => {
  const parsedDate = moment(string, ISO_DATE_FORMAT, true);
  return parsedDate.isValid() ? parsedDate.format(DDMMYYYY_DATE_FORMAT) : string;
};

const backgroundStyle = kode =>
  kode === MELLOMLIGGENDE_PERIODE ||
  kode === opptjeningAktivitetKlassifisering.ANTATT_GODKJENT ||
  kode === opptjeningAktivitetKlassifisering.BEKREFTET_GODKJENT
    ? 'godkjent'
    : 'avvist';

const periodStatus = periodState =>
  periodState === opptjeningAktivitetKlassifisering.BEKREFTET_AVVIST ||
  periodState === opptjeningAktivitetKlassifisering.ANTATT_AVVIST
    ? 'OpptjeningVilkarView.Avslatt'
    : 'OpptjeningVilkarView.Godkjent';

const isPeriodGodkjent = period =>
  !!(
    period.kode === opptjeningAktivitetKlassifisering.BEKREFTET_GODKJENT ||
    period.kode === opptjeningAktivitetKlassifisering.ANTATT_GODKJENT ||
    period.kode === MELLOMLIGGENDE_PERIODE
  );

interface TimeLineDataProps {
  selectedPeriod: TimelineItem;
  selectNextPeriod: (event: FormEvent) => void;
  selectPrevPeriod: (event: FormEvent) => void;
}

const TimeLineData: FunctionComponent<TimeLineDataProps> = ({ selectedPeriod, selectNextPeriod, selectPrevPeriod }) => {
  const intl = useIntl();
  return (
    <div>
      <Row>
        <Element>
          <FormattedMessage id="OpptjeningVilkarView.DetailsForSelectedPeriod" />
        </Element>
      </Row>
      <Row>
        <Column xs="6" className={backgroundStyle(selectedPeriod.data.klasse.kode)}>
          <Row className={styles.timeLineDataContainer}>
            <Column xs="6">
              <div>
                <Element>
                  {`${isoToDdMmYyyy(selectedPeriod.data.fom)} - ${isoToDdMmYyyy(selectedPeriod.data.tom)}`}
                </Element>
              </div>
            </Column>
            <Column xs="6">
              {isPeriodGodkjent(selectedPeriod.data.klasse) && (
                <span className={styles.image}>
                  <Image src={checkImg} className={styles.image} />
                </span>
              )}
              {!isPeriodGodkjent(selectedPeriod.data.klasse) && (
                <span className={styles.image}>
                  <Image src={advarselImg} className={styles.image} />
                </span>
              )}
              <FormattedMessage id={periodStatus(selectedPeriod.data.klasse.kode)} />
            </Column>
          </Row>
        </Column>
        <Column xs="6">
          <TimeLineButton
            text={intl.formatMessage({ id: 'TimeLineData.prevPeriod' })}
            type="prev"
            callback={selectPrevPeriod}
          />
          <TimeLineButton
            text={intl.formatMessage({ id: 'TimeLineData.nextPeriod' })}
            type="next"
            callback={selectNextPeriod}
          />
        </Column>
      </Row>
      <Row />
    </div>
  );
};

export default TimeLineData;
