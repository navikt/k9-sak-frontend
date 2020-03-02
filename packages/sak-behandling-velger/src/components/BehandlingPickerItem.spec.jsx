import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { NavLink } from 'react-router-dom';

import BehandlingPickerItemContent from './BehandlingPickerItemContent';
import BehandlingPickerItem from './BehandlingPickerItem';

const saksnummer = '12345';

describe('<BehandlingPickerItem>', () => {
  const behandlingTemplate = {
    id: 1,
    versjon: 123,
    type: {
      kode: '',
      navn: '',
    },
    status: {
      kode: 'FVED',
      navn: 'Fatter vedtak',
    },
    fagsakId: 1,
    opprettet: '15.10.2017',
    behandlendeEnhetId: '1242424',
    behandlendeEnhetNavn: 'test',
    links: [
      {
        href: '/fpsak/test',
        rel: 'test',
        type: 'GET',
      },
    ],
    førsteÅrsak: {
      behandlingArsakType: {
        kode: '-',
      },
      erAutomatiskRevurdering: false,
      manueltOpprettet: false,
    },
    gjeldendeVedtak: false,
  };

  it('skal vise behandling uten lenke når det kun finnes en behandling og denne er valgt', () => {
    const wrapper = shallow(
      <BehandlingPickerItem
        onlyOneBehandling
        behandling={behandlingTemplate}
        saksnummer={saksnummer}
        isActive
        showAll
        toggleShowAll={() => undefined}
        alleKodeverk={{}}
      />,
    );

    expect(wrapper.find(BehandlingPickerItemContent)).has.length(1);
    expect(wrapper.find(NavLink)).has.length(0);
  });

  it('skal vise behandling med lenke når det kun finnes en behandling og denne ikke er valgt', () => {
    const wrapper = shallow(
      <BehandlingPickerItem
        onlyOneBehandling
        behandling={behandlingTemplate}
        saksnummer={saksnummer}
        isActive={false}
        showAll
        toggleShowAll={() => undefined}
        alleKodeverk={{}}
      />,
    );

    expect(wrapper.find(BehandlingPickerItemContent)).has.length(1);
    expect(wrapper.find(NavLink)).has.length(1);
  });

  it('skal vise behandling med knapp for visning av alle behandlinger når ingen behandlinger er valgt og innslag er aktivt', () => {
    const wrapper = shallow(
      <BehandlingPickerItem
        onlyOneBehandling={false}
        behandling={behandlingTemplate}
        saksnummer={saksnummer}
        isActive
        showAll={false}
        toggleShowAll={() => undefined}
        alleKodeverk={{}}
      />,
    );

    expect(wrapper.find(BehandlingPickerItemContent)).has.length(1);
    expect(wrapper.find('button')).has.length(1);
  });
});
