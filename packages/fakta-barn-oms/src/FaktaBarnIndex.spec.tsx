import React from 'react';
import { FormattedMessage } from 'react-intl';
import { BarnType } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';
import { shallowWithIntl } from '../i18n';
import FaktaBarnIndex from './FaktaBarnIndex';
import VanligeBarn from './components/VanligeBarn';
import BarnFraRammevedtak from './components/BarnFraRammevedtak';

describe('<FaktaBarnIndex>', () => {
  it('hvis ingen barn, rendres info om dette', () => {
    const wrapper = shallowWithIntl(<FaktaBarnIndex barn={[]} />);

    expect(wrapper.find(FormattedMessage).prop('id')).toEqual('FaktaBarn.IngenBarn');
  });

  it('viser vanlige barn og rammevedtaksbarn', () => {
    const wrapper = shallowWithIntl(
      <FaktaBarnIndex
        barn={[
          {
            personIdent: '123',
            barnType: BarnType.VANLIG,
            harSammeBosted: true,
          },
          {
            personIdent: '456',
            barnType: BarnType.UTENLANDSK_BARN,
            harSammeBosted: false,
          },
        ]}
      />,
    );

    expect(wrapper.find(VanligeBarn)).toHaveLength(1);
    expect(wrapper.find(BarnFraRammevedtak)).toHaveLength(1);
  });
});
