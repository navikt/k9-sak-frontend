import React from 'react';
import sinon from 'sinon';
import moment from 'moment';

import Timeline from 'react-visjs-timeline';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { ISO_DATE_FORMAT } from '@fpsak-frontend/utils';

import { TimeLineControl } from '@fpsak-frontend/tidslinje';
import TilbakekrevingTimeline from './TilbakekrevingTimeline';
import shallowWithIntl from '../../../i18n';

describe('<TilbakekrevingTimeline>', () => {
  it('skal rendre tidslinje korrekt', () => {
    const perioder = [
      {
        id: 1,
        fom: '2019-10-10',
        tom: '2019-11-10',
        isAksjonspunktOpen: true,
        isGodkjent: true,
      },
      {
        id: 2,
        fom: '2019-11-11',
        tom: '2019-12-10',
        isAksjonspunktOpen: false,
        isGodkjent: true,
      },
    ];
    const valgtPeriode = {
      id: 1,
      fom: '2019-10-10',
      tom: '2019-11-10',
      isAksjonspunktOpen: true,
      isGodkjent: true,
    };

    const wrapper = shallowWithIntl(
      <TilbakekrevingTimeline.WrappedComponent
        intl={intlMock}
        perioder={perioder}
        selectedPeriod={valgtPeriode}
        toggleDetaljevindu={sinon.spy()}
        selectPeriodCallback={sinon.spy()}
        hjelpetekstKomponent={<div>test</div>}
        kjonn="MANN"
      />,
    );

    expect(wrapper.find(TimeLineControl)).toHaveLength(1);

    const tidslinje = wrapper.find(Timeline);
    const options = tidslinje.prop('options') as { min: moment.Moment; max: moment.Moment };
    expect(options.min.format(ISO_DATE_FORMAT)).toEqual('2019-09-12');
    expect(options.max.format(ISO_DATE_FORMAT)).toEqual('2023-10-10');

    expect(tidslinje.prop('groups')).toEqual([{ id: 1, content: '' }]);
  });
});
