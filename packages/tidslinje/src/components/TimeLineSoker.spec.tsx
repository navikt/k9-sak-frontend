import React from 'react';
import { mountWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import Image from '@fpsak-frontend/shared-components/src/Image';
// eslint-disable-next-line import/extensions
import { KjønnkodeEnum } from '@k9-sak-web/types/src/Kjønnkode';
import TimeLineSoker from './TimeLineSoker';

describe('<TimeLineSoker>', () => {
  it('skal teste at TimeLineSoker viser korrekte bilder för korrekte soker', () => {
    const wrapper = mountWithIntl(
      <TimeLineSoker hovedsokerKjonnKode={KjønnkodeEnum.KVINNE} medsokerKjonnKode={KjønnkodeEnum.MANN} />,
    );
    const rows = wrapper.find('Row');
    expect(rows).toHaveLength(2);
    expect(rows.find(Image).at(0).props().tooltip).toEqual('Kvinne');
    expect(rows.find(Image).at(1).props().tooltip).toEqual('Mann');
  });
});
