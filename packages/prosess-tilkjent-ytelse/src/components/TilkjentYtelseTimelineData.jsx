import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Table, TableColumn, TableRow, VerticalSpacer, FloatRight } from '@fpsak-frontend/shared-components';
import { calcDaysAndWeeksWithWeekends, DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import { TimeLineButton, TimeLineDataContainer } from '@fpsak-frontend/tidslinje';
import { TabsPure } from 'nav-frontend-tabs';
import tilkjentYtelseBeregningresultatPropType from '../propTypes/tilkjentYtelseBeregningresultatPropType';
import styles from './tilkjentYtelse.less';

const finnAktivitetsstatusIntlKey = aktivitetStatusKode => {
  const prefix = 'TilkjentYtelse.PeriodeData.Aktivitetsstatus.';
  if (aktivitetStatusKode === 'AT') {
    return `${prefix}Arbeidstaker`;
  }
  if (aktivitetStatusKode === 'SN') {
    return `${prefix}SelvstendigNæringsdrivende`;
  }
  if (aktivitetStatusKode === 'FL') {
    return `${prefix}Frilans`;
  }
  return `${prefix}${aktivitetStatusKode}`;
};

const finnTabLabel = ({ arbeidsgiverNavn, arbeidsgiverOrgnr, aktivitetStatus: { kode } }) => {
  if (kode === 'AT') {
    return `${arbeidsgiverNavn} (${arbeidsgiverOrgnr})`;
  }
  if (kode === 'SN') {
    return 'Selvstendig næringsdrivende';
  }
  if (kode === 'FL') {
    return 'Frilans';
  }
  return kode;
};

/**
 * TimeLineData
 *
 * Viser opp data fra valgt periode i tilkjent ytelse-tidslinjen
 */
const TilkjentYtelseTimeLineData = ({
  selectedItemStartDate,
  selectedItemEndDate,
  selectedItemData,
  callbackForward,
  callbackBackward,
}) => {
  const [activeTab, setActiveTab] = React.useState(0);
  React.useEffect(() => {
    setActiveTab(0);
  }, [selectedItemData]);
  const { andeler } = selectedItemData;
  const valgtAndel = andeler[activeTab];

  const numberOfDaysAndWeeks = calcDaysAndWeeksWithWeekends(selectedItemStartDate, selectedItemEndDate);
  const intl = useIntl();

  return (
    <TimeLineDataContainer>
      <Row>
        <Column xs="10">
          <Element>
            <FormattedMessage id="TilkjentYtelse.PeriodeData.Detaljer" />
          </Element>
        </Column>
        <Column xs="2">
          <FloatRight>
            <TimeLineButton
              text={intl.formatMessage({ id: 'Timeline.prevPeriod' })}
              type="prev"
              callback={callbackBackward}
            />
            <TimeLineButton
              text={intl.formatMessage({ id: 'Timeline.nextPeriod' })}
              type="next"
              callback={callbackForward}
            />
          </FloatRight>
        </Column>
      </Row>
      <VerticalSpacer eightPx />

      <div className={styles.detailsPeriode}>
        <Row>
          <Column xs="7">
            <Element>
              <FormattedMessage
                id="TilkjentYtelse.PeriodeData.Periode"
                values={{
                  fomVerdi: moment(selectedItemStartDate).format(DDMMYYYY_DATE_FORMAT).toString(),
                  tomVerdi: moment(selectedItemEndDate).format(DDMMYYYY_DATE_FORMAT).toString(),
                }}
              />
            </Element>
          </Column>
          <div>
            <Column xs="5">
              <Normaltekst>
                <FormattedMessage
                  id={numberOfDaysAndWeeks.id}
                  values={{
                    weeks: numberOfDaysAndWeeks.weeks.toString(),
                    days: numberOfDaysAndWeeks.days.toString(),
                  }}
                />
              </Normaltekst>
            </Column>
          </div>
        </Row>
        <VerticalSpacer fourPx />
        <Row>
          <Column xs="12">
            <FormattedMessage
              id="TilkjentYtelse.PeriodeData.Dagsats"
              values={{ dagsatsVerdi: selectedItemData.dagsats, b: chunks => <b>{chunks}</b> }}
            />
          </Column>
        </Row>
      </div>
      <VerticalSpacer eightPx />
      <TabsPure
        tabs={andeler.map((andel, currentAndelIndex) => {
          const label = finnTabLabel(andel);
          return {
            aktiv: activeTab === currentAndelIndex,
            label,
          };
        })}
        onChange={(e, clickedIndex) => setActiveTab(clickedIndex)}
      />

      <div style={{ padding: '1rem' }}>
        <Row>
          <Column xs="12">
            <FormattedMessage
              id="TilkjentYtelse.PeriodeData.UtbetaltRefusjon"
              values={{ utbetaltRefusjonVerdi: valgtAndel?.refusjon, b: chunks => <b>{chunks}</b> }}
            />
          </Column>
        </Row>
        <Row>
          <Column xs="12">
            <FormattedMessage
              id="TilkjentYtelse.PeriodeData.UtbetaltTilSoker"
              values={{ utbetaltTilSokerVerdi: valgtAndel?.tilSoker, b: chunks => <b>{chunks}</b> }}
            />
          </Column>
        </Row>
        <Row>
          <Column xs="12">
            <FormattedMessage
              id="TilkjentYtelse.PeriodeData.Utbetalingsgrad"
              values={{ utbetalingsgradVerdi: valgtAndel?.utbetalingsgrad, b: chunks => <b>{chunks}</b> }}
            />
          </Column>
        </Row>
        <Row>
          <Column xs="12">
            <FormattedMessage
              id="TilkjentYtelse.PeriodeData.Aktivitetsstatus"
              values={{
                aktivitetsstatusVerdi: intl.formatMessage({
                  id: finnAktivitetsstatusIntlKey(valgtAndel?.aktivitetStatus.kode),
                }),
                b: chunks => <b>{chunks}</b>,
              }}
            />
          </Column>
        </Row>

        {valgtAndel && valgtAndel.uttak && valgtAndel.uttak.length > 0 && (
          <Table
            headerTextCodes={[
              'TilkjentYtelse.PeriodeData.Column.Uttaksperiode',
              'TilkjentYtelse.PeriodeData.Column.Utbetalingsgrad',
              'TilkjentYtelse.PeriodeData.Column.Utfall',
            ]}
          >
            {valgtAndel.uttak.map(({ periode, utbetalingsgrad, utfall }, index) => (
              <TableRow key={`index${index + 1}`}>
                <TableColumn>
                  <Normaltekst>
                    <FormattedMessage
                      id="TilkjentYtelse.PeriodeData.Periode"
                      values={{
                        fomVerdi: moment(periode.fom).format(DDMMYYYY_DATE_FORMAT).toString(),
                        tomVerdi: moment(periode.tom).format(DDMMYYYY_DATE_FORMAT).toString(),
                      }}
                    />
                  </Normaltekst>
                </TableColumn>
                <TableColumn>
                  <Normaltekst>{utbetalingsgrad}</Normaltekst>
                </TableColumn>
                <TableColumn>
                  <Normaltekst>{utfall}</Normaltekst>
                </TableColumn>
              </TableRow>
            ))}
          </Table>
        )}
      </div>
    </TimeLineDataContainer>
  );
};

TilkjentYtelseTimeLineData.propTypes = {
  selectedItemStartDate: PropTypes.string.isRequired,
  selectedItemEndDate: PropTypes.string.isRequired,
  selectedItemData: tilkjentYtelseBeregningresultatPropType,
  callbackForward: PropTypes.func.isRequired,
  callbackBackward: PropTypes.func.isRequired,
};

TilkjentYtelseTimeLineData.defaultProps = {
  selectedItemData: undefined,
};

export default TilkjentYtelseTimeLineData;
