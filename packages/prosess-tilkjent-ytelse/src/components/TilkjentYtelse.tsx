import React, { Component, RefObject } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import Timeline from 'react-visjs-timeline';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { BeregningsresultatPeriode, KodeverkMedNavn } from '@k9-sak-web/types';
import {
  calcDaysAndWeeksWithWeekends,
  DDMMYY_DATE_FORMAT,
  ISO_DATE_FORMAT,
  getKodeverknavnFn,
} from '@fpsak-frontend/utils';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { TimeLineControl } from '@fpsak-frontend/tidslinje';
import TilkjentYtelseTimelineData from './TilkjentYtelseTimelineData';
import { createVisningsnavnForAndel } from './TilkjentYtelseUtils';

import styles from './tilkjentYtelse.less';

export type PeriodeMedId = BeregningsresultatPeriode & { id: number };

const parseDateString = dateString => moment(dateString, ISO_DATE_FORMAT).toDate();

const getOptions = (nyePerioder: PeriodeMedId[]) => {
  const firstPeriod = nyePerioder[0];
  const lastPeriod = nyePerioder[nyePerioder.length - 1];

  return {
    end: moment(lastPeriod?.tom).add(2, 'days'),
    locale: moment.locale('nb'),
    margin: { item: 10 },
    moment,
    orientation: { axis: 'top' },
    showCurrentTime: false,
    stack: false,
    start: moment(firstPeriod?.fom).subtract(1, 'days'),
    tooltip: { followMouse: true },
    width: '100%',
    zoomMax: 1000 * 60 * 60 * 24 * 31 * 40,
    zoomMin: 1000 * 60 * 60 * 24 * 30,
  };
};

const createTooltipContent = (intl, item, getKodeverknavn) => {
  const { formatMessage } = intl;
  const periodeDato = `${moment(item.fom).format(DDMMYY_DATE_FORMAT)} - ${moment(item.tom).format(DDMMYY_DATE_FORMAT)}`;
  return `
  <p>
    ${periodeDato}
     ${formatMessage(
       { id: calcDaysAndWeeksWithWeekends(moment(item.fom), moment(item.tom)).id },
       {
         weeks: calcDaysAndWeeksWithWeekends(moment(item.fom), moment(item.tom)).weeks,
         days: calcDaysAndWeeksWithWeekends(moment(item.fom), moment(item.tom)).days,
       },
     )}
    <br />
    ${formatMessage(
      { id: 'Timeline.tooltip.dagsats' },
      {
        dagsats: item.dagsats,
      },
    )}
    <br />
    ${
      (item.andeler || []).length > 1
        ? item.andeler
            .map(andel =>
              formatMessage(
                { id: 'Timeline.tooltip.dagsatsPerAndel' },
                {
                  arbeidsgiver: createVisningsnavnForAndel(andel, getKodeverknavn),
                  dagsatsPerAndel: Number(andel.refusjon) + Number(andel.tilSoker),
                  br: '<br />',
                },
              ),
            )
            .join('')
        : ''
    }
   </p>
`;
};

const andelerUtgjør100ProsentTilsammen = periode => {
  const { andeler } = periode;
  const totalUtbetalingsgrad = (andeler || []).reduce((accumulator, andel) => accumulator + andel.utbetalingsgrad, 0);
  if (totalUtbetalingsgrad >= 100) {
    return true;
  }
  return false;
};

const prepareTimelineData = (periode, index, intl, getKodeverknavn) => {
  return {
    ...periode,
    className: andelerUtgjør100ProsentTilsammen(periode) ? 'innvilget' : 'gradert',
    group: 1,
    id: index,
    start: parseDateString(periode.fom),
    end: moment(parseDateString(periode.tom)).add(1, 'day'),
    title: createTooltipContent(intl, periode, getKodeverknavn),
  };
};

interface OwnProps {
  items: PeriodeMedId[];
  groups: {
    id: number;
    content: string;
  }[];
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
}

interface OwnState {
  selectedItem?: PeriodeMedId;
}

/**
 * TilkjentYtelse
 *
 * Presentationskomponent. Masserer data og populerer felten samt formatterar tidslinjen for tilkjent ytelse
 */

export class TilkjentYtelse extends Component<OwnProps & WrappedComponentProps, OwnState> {
  timelineRef: RefObject<any>;

  constructor(props: OwnProps & WrappedComponentProps) {
    super(props);

    this.state = {
      selectedItem: null,
    };

    this.selectHandler = this.selectHandler.bind(this);
    this.goForward = this.goForward.bind(this);
    this.goBackward = this.goBackward.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.nextPeriod = this.nextPeriod.bind(this);
    this.prevPeriod = this.prevPeriod.bind(this);
    this.openPeriodInfo = this.openPeriodInfo.bind(this);

    this.timelineRef = React.createRef();
  }

  componentDidMount() {
    // TODO Fjern når denne er retta: https://github.com/Lighthouse-io/react-visjs-timeline/issues/40
    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(this.timelineRef.current);
    if (node) {
      node.children[0].style.visibility = 'visible';
    }
  }

  openPeriodInfo() {
    const {
      props: { items },
      state: { selectedItem },
    } = this;
    if (selectedItem) {
      this.setState({
        selectedItem: null,
      });
    } else {
      this.setState({
        selectedItem: items[0],
      });
    }
  }

  nextPeriod() {
    const {
      props: { items },
      state: { selectedItem: currentSelectedItem },
    } = this;
    const newIndex = items.findIndex(item => item.id === currentSelectedItem.id) + 1;
    if (newIndex < items.length) {
      const selectedItem = items[newIndex];
      this.setState({
        selectedItem,
      });
    }
  }

  prevPeriod() {
    const {
      props: { items },
      state: { selectedItem: currentSelectedItem },
    } = this;
    const newIndex = items.findIndex(item => item.id === currentSelectedItem.id) - 1;
    if (newIndex >= 0) {
      const selectedItem = items[newIndex];
      this.setState({
        selectedItem,
      });
    }
  }

  selectHandler(eventProps: { items: number[] }) {
    const {
      props: { items },
    } = this;
    const selectedItem = items.find(item => item.id === eventProps.items[0]);
    this.setState({
      selectedItem,
    });
  }

  zoomIn() {
    const timeline = this.timelineRef.current.$el;
    timeline.zoomIn(0.5);
  }

  zoomOut() {
    const timeline = this.timelineRef.current.$el;
    timeline.zoomOut(0.5);
  }

  goForward() {
    const timeline = this.timelineRef.current.$el;
    const currentWindowTimes = timeline.getWindow();
    const newWindowTimes = {
      start: new Date(currentWindowTimes.start).setDate(currentWindowTimes.start.getDate() + 42),
      end: new Date(currentWindowTimes.end).setDate(currentWindowTimes.end.getDate() + 42),
    };

    timeline.setWindow(newWindowTimes);
  }

  goBackward() {
    const timeline = this.timelineRef.current.$el;
    const currentWindowTimes = timeline.getWindow();
    const newWindowTimes = {
      start: new Date(currentWindowTimes.start).setDate(currentWindowTimes.start.getDate() - 42),
      end: new Date(currentWindowTimes.end).setDate(currentWindowTimes.end.getDate() - 42),
    };

    timeline.setWindow(newWindowTimes);
  }

  render() {
    const {
      nextPeriod,
      prevPeriod,
      goBackward,
      goForward,
      openPeriodInfo,
      props: { groups, items, intl, alleKodeverk },
      selectHandler,
      state: { selectedItem },
      zoomIn,
      zoomOut,
    } = this;
    const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);

    const timelineData = items.map((periode, index) => prepareTimelineData(periode, index, intl, getKodeverknavn));
    return (
      <div className={styles.timelineContainer}>
        <VerticalSpacer sixteenPx />
        <VerticalSpacer sixteenPx />
        <Row>
          <Column xs="12">
            <div className={styles.timeLineWrapper}>
              <Timeline
                ref={this.timelineRef}
                options={getOptions(items)}
                items={timelineData}
                groups={groups}
                selectHandler={selectHandler}
                selection={[selectedItem ? selectedItem.id : null]}
              />
            </div>
          </Column>
        </Row>
        <Row>
          <Column xs="12">
            <TimeLineControl
              goBackwardCallback={goBackward}
              goForwardCallback={goForward}
              zoomInCallback={zoomIn}
              zoomOutCallback={zoomOut}
              openPeriodInfo={openPeriodInfo}
            />
          </Column>
        </Row>
        {selectedItem && (
          <TilkjentYtelseTimelineData
            alleKodeverk={alleKodeverk}
            selectedItemStartDate={selectedItem.fom.toString()}
            selectedItemEndDate={selectedItem.tom.toString()}
            selectedItemData={selectedItem}
            callbackForward={nextPeriod}
            callbackBackward={prevPeriod}
          />
        )}
      </div>
    );
  }
}

export default injectIntl(TilkjentYtelse);
