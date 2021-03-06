import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { Table, TableRow, DateLabel } from '@fpsak-frontend/shared-components';
import { Fagsak, KodeverkMedNavn } from '@k9-sak-web/types';

import FagsakList from './FagsakList';

const FAGSAK_STATUS_KODEVERK = 'FAGSAK_STATUS';
const FAGSAK_YTELSE_KODEVERK = 'FAGSAK_YTELSE';

const alleKodeverk = {
  [kodeverkTyper.FAGSAK_STATUS]: [
    {
      kode: fagsakStatus.UNDER_BEHANDLING,
      navn: 'Under behandling',
      kodeverk: FAGSAK_STATUS_KODEVERK,
    },
    {
      kode: fagsakStatus.AVSLUTTET,
      navn: 'Avsluttet',
      kodeverk: FAGSAK_STATUS_KODEVERK,
    },
  ],
  [kodeverkTyper.FAGSAK_YTELSE]: [
    {
      kode: fagsakYtelseType.ENGANGSSTONAD,
      navn: 'Engangsstønad',
      kodeverk: FAGSAK_YTELSE_KODEVERK,
    },
  ],
};

describe('<FagsakList>', () => {
  const fagsak = {
    saksnummer: '12345',
    sakstype: {
      kode: 'ES',
      kodeverk: FAGSAK_YTELSE_KODEVERK,
    },
    relasjonsRolleType: {
      kode: 'TEST',
      kodeverk: '',
    },
    status: {
      kode: 'UBEH',
      kodeverk: FAGSAK_STATUS_KODEVERK,
    },
    barnFodt: null,
    opprettet: '2019-02-17T13:49:18.645',
    endret: '2019-02-17T13:49:18.645',
    antallBarn: 1,
    kanRevurderingOpprettes: false,
    skalBehandlesAvInfotrygd: false,
    dekningsgrad: 100,
  } as Fagsak;

  const headerTextCodes = ['FagsakList.Saksnummer', 'FagsakList.Sakstype', 'FagsakList.Status', 'FagsakList.BarnFodt'];

  it('skal vise en tabell med en rad og tilhørende kolonnedata', () => {
    const clickFunction = sinon.spy();
    const wrapper = shallow(
      <FagsakList
        fagsaker={[fagsak]}
        selectFagsakCallback={clickFunction}
        alleKodeverk={alleKodeverk as { [key: string]: [KodeverkMedNavn] }}
      />,
    );

    const table = wrapper.find(Table);
    expect(table).toHaveLength(1);

    expect(table.prop('headerTextCodes')).toEqual(headerTextCodes);

    const tableRows = table.children();
    expect(tableRows).toHaveLength(1);
    const tableColumns = tableRows.children();
    expect(tableColumns).toHaveLength(4);
    expect(tableColumns.first().childAt(0).text()).toEqual('12345');
    expect(tableColumns.at(1).childAt(0).text()).toEqual('Engangsstønad');
    expect(tableColumns.at(2).childAt(0).text()).toEqual('Under behandling');
    expect(tableColumns.last().childAt(0)).toBeUndefined;
  });

  it('skal sortere søkeresultat der avsluttede skal vises sist, mens sist endrede skal vises først', () => {
    const fagsak2 = {
      saksnummer: 23456,
      sakstype: {
        kode: 'ES',
        kodeverk: FAGSAK_YTELSE_KODEVERK,
      },
      status: {
        kode: 'UBEH',
        kodeverk: FAGSAK_STATUS_KODEVERK,
      },
      barnFodt: null,
      opprettet: '2019-02-18T13:49:18.645',
      endret: '2019-02-18T13:49:18.645',
      dekningsgrad: 100,
    };
    const fagsak3 = {
      saksnummer: 34567,
      sakstype: {
        kode: 'ES',
        kodeverk: FAGSAK_YTELSE_KODEVERK,
      },
      status: {
        kode: 'AVSLU',
        kodeverk: FAGSAK_STATUS_KODEVERK,
      },
      barnFodt: null,
      opprettet: '2019-02-18T13:49:18.645',
      endret: '2019-02-18T13:49:18.645',
      dekningsgrad: 100,
    };

    const fagsaker = [fagsak, fagsak2, fagsak3];
    const wrapper = shallow(
      <FagsakList
        fagsaker={fagsaker as Fagsak[]}
        selectFagsakCallback={() => true}
        alleKodeverk={alleKodeverk as { [key: string]: [KodeverkMedNavn] }}
      />,
    );

    const table = wrapper.find(Table);
    const tableRows = table.children();
    expect(tableRows).toHaveLength(3);

    const tableColumnsRow1 = tableRows.first().children();
    expect(tableColumnsRow1).toHaveLength(4);
    expect(tableColumnsRow1.first().childAt(0).text()).toEqual('23456');
    expect(tableColumnsRow1.at(1).childAt(0).text()).toEqual('Engangsstønad');
    expect(tableColumnsRow1.at(2).childAt(0).text()).toEqual('Under behandling');
    expect(tableColumnsRow1.last().childAt(0)).toBeUndefined;

    const tableColumnsRow2 = tableRows.at(1).children();
    expect(tableColumnsRow2).toHaveLength(4);
    expect(tableColumnsRow2.first().childAt(0).text()).toEqual('12345');
    expect(tableColumnsRow2.at(1).childAt(0).text()).toEqual('Engangsstønad');
    expect(tableColumnsRow2.at(2).childAt(0).text()).toEqual('Under behandling');
    expect(tableColumnsRow2.last().childAt(0)).toBeUndefined;

    const tableColumnsRow3 = tableRows.last().children();
    expect(tableColumnsRow3).toHaveLength(4);
    expect(tableColumnsRow3.first().childAt(0).text()).toEqual('34567');
    expect(tableColumnsRow3.at(1).childAt(0).text()).toEqual('Engangsstønad');
    expect(tableColumnsRow3.at(2).childAt(0).text()).toEqual('Avsluttet');
    expect(tableColumnsRow3.last().childAt(0)).toBeUndefined;
  });

  it('skal vise DateLabel i tabell kun om barn er født', () => {
    const fagsak4 = {
      saksnummer: '23456',
      sakstype: {
        kode: 'ES',
        kodeverk: FAGSAK_YTELSE_KODEVERK,
      },
      status: {
        kode: 'UBEH',
        kodeverk: FAGSAK_STATUS_KODEVERK,
      },
      barnFodt: '2019-02-18T13:49:18.645',
      opprettet: '2019-02-18T13:49:18.645',
      endret: '2019-02-18T13:49:18.645',
      dekningsgrad: 100,
    };

    const clickFunction = sinon.spy();
    const wrapper = shallow(
      <FagsakList
        fagsaker={[fagsak, fagsak4 as Fagsak]}
        selectFagsakCallback={clickFunction}
        alleKodeverk={alleKodeverk as { [key: string]: [KodeverkMedNavn] }}
      />,
    );
    const tableRows = wrapper.find(TableRow);
    expect(tableRows).toHaveLength(2);

    expect(tableRows.first().find(DateLabel).prop('dateString')).toEqual('2019-02-18T13:49:18.645');
    expect(tableRows.last().find(DateLabel)).toHaveLength(0);
  });
});
