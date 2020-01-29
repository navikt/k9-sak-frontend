import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { NavLink } from 'react-router-dom';
import { Systemtittel, Normaltekst } from 'nav-frontend-typografi';
import { EtikettInfo } from 'nav-frontend-etiketter';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-sak-fagsak-profil';
import { FagsakProfile } from './FagsakProfile';

describe('<FagsakProfile>', () => {
  const alleKodeverk = {
    [kodeverkTyper.FAGSAK_YTELSE]: [
      {
        kode: 'ES',
        navn: 'Engangsstønad',
        kodeverk: 'FAGSAK_YTELSE',
      }, {
      kode: 'FP',
      navn: 'Foreldrepenger',
      kodeverk: 'FAGSAK_YTELSE',
    },
    ],
    [kodeverkTyper.FAGSAK_STATUS]: [
      {
        kode: 'OPPR',
        navn: 'Opprettet',
        kodeverk: 'FAGSAK_STATUS',
      },
    ],
  };

  it('skal vise en fagsak med tilhørende informasjon', () => {
    const sakstype = {
      kode: 'ES',
      kodeverk: 'FAGSAK_YTELSE',
    };
    const status = {
      kode: 'OPPR',
      kodeverk: 'FAGSAK_STATUS',
    };
    const wrapper = shallowWithIntl(
      <FagsakProfile
        saksnummer="12345"
        sakstype={sakstype}
        fagsakStatus={status}
        toggleShowAll={sinon.spy()}
        alleKodeverk={alleKodeverk}
        createLink={() => 'lenke'}
        renderBehandlingMeny={sinon.spy()}
        renderBehandlingVelger={sinon.spy()}
        annenPartLink={{
          saksnr: {
            verdi: 9876,
          },
          behandlingId: 123,
        }}
        dekningsgrad={100}
        intl={intlMock}
      />,
    );

    const systemtittel = wrapper.find(Systemtittel);
    expect(systemtittel).to.have.length(1);
    expect(systemtittel.childAt(0).text()).is.eql('Engangsstønad');

    const normaltekst = wrapper.find(Normaltekst);
    expect(normaltekst).to.have.length(1);
    expect(normaltekst.childAt(0).text()).is.eql('12345 - Opprettet');

    const lenke = wrapper.find(NavLink);
    expect(lenke).to.have.length(1);
    expect(lenke.prop('to')).is.eql('lenke');
  });

  it('skal vise dekningsgrad for foreldrepenger om den eksisterer', () => {
    const sakstype = {
      kode: 'FP',
      kodeverk: 'FAGSAK_YTELSE',
    };
    const status = {
      kode: 'OPPR',
      kodeverk: 'FAGSAK_STATUS',
    };
    const wrapper = shallowWithIntl(<FagsakProfile
      saksnummer={12345}
      sakstype={sakstype}
      fagsakStatus={status}
      toggleShowAll={sinon.spy()}
      alleKodeverk={alleKodeverk}
      createLink={() => 'lenke'}
      renderBehandlingMeny={sinon.spy()}
      renderBehandlingVelger={sinon.spy()}
      annenPartLink={{
        saksnr: {
          verdi: 9876,
        },
        behandlingId: 123,
      }}
      dekningsgrad={100}
      intl={intlMock}
    />);

    const systemtittel = wrapper.find(Systemtittel);
    expect(systemtittel).to.have.length(1);
    expect(systemtittel.childAt(0).text()).is.eql('Foreldrepenger');

    const normaltekst = wrapper.find(Normaltekst);
    expect(normaltekst).to.have.length(1);
    expect(normaltekst.childAt(0).text()).is.eql('12345 - Opprettet');

    const etikettinfo = wrapper.find(EtikettInfo);
    expect(etikettinfo).to.have.length(1);
    expect(etikettinfo.prop('title')).is.eql('Dekningsgraden er 100%');

    const lenke = wrapper.find(NavLink);
    expect(lenke).to.have.length(1);
    expect(lenke.prop('to')).is.eql('lenke');
  });

  it('skal ikke vise dekningsgrad for foreldrepenger om den ikke eksisterer', () => {
    const sakstype = {
      kode: 'FP',
      kodeverk: 'FAGSAK_YTELSE',
    };
    const status = {
      kode: 'OPPR',
      kodeverk: 'FAGSAK_STATUS',
    };
    const wrapper = shallowWithIntl(<FagsakProfile
      saksnummer={12345}
      sakstype={sakstype}
      fagsakStatus={status}
      toggleShowAll={sinon.spy()}
      alleKodeverk={alleKodeverk}
      createLink={() => 'lenke'}
      renderBehandlingMeny={sinon.spy()}
      renderBehandlingVelger={sinon.spy()}
      annenPartLink={{
        saksnr: {
          verdi: 9876,
        },
        behandlingId: 123,
      }}
      intl={intlMock}
    />);

    console.log(wrapper.debug()); // eslint-disable-line
    const systemtittel = wrapper.find(Systemtittel);
    expect(systemtittel).to.have.length(1);
    expect(systemtittel.childAt(0).text()).is.eql('Foreldrepenger');

    const normaltekst = wrapper.find(Normaltekst);
    expect(normaltekst).to.have.length(1);
    expect(normaltekst.childAt(0).text()).is.eql('12345 - Opprettet');

    const etikettinfo = wrapper.find(EtikettInfo);
    expect(etikettinfo).to.have.length(0);

    const lenke = wrapper.find(NavLink);
    expect(lenke).to.have.length(1);
    expect(lenke.prop('to')).is.eql('lenke');
  });

  it('skal ikke vise ugyldig dekningsgrad for foreldrepenger', () => {
    const sakstype = {
      kode: 'FP',
      kodeverk: 'FAGSAK_YTELSE',
    };
    const status = {
      kode: 'OPPR',
      kodeverk: 'FAGSAK_STATUS',
    };
    const wrapper = shallowWithIntl(<FagsakProfile
      saksnummer={12345}
      sakstype={sakstype}
      fagsakStatus={status}
      toggleShowAll={sinon.spy()}
      alleKodeverk={alleKodeverk}
      createLink={() => 'lenke'}
      renderBehandlingMeny={sinon.spy()}
      renderBehandlingVelger={sinon.spy()}
      annenPartLink={{
        saksnr: {
          verdi: 9876,
        },
        behandlingId: 123,
      }}
      dekningsgrad={73}
      intl={intlMock}
    />);

    console.log(wrapper.debug()); // eslint-disable-line
    const systemtittel = wrapper.find(Systemtittel);
    expect(systemtittel).to.have.length(1);
    expect(systemtittel.childAt(0).text()).is.eql('Foreldrepenger');

    const normaltekst = wrapper.find(Normaltekst);
    expect(normaltekst).to.have.length(1);
    expect(normaltekst.childAt(0).text()).is.eql('12345 - Opprettet');

    const etikettinfo = wrapper.find(EtikettInfo);
    expect(etikettinfo).to.have.length(0);

    const lenke = wrapper.find(NavLink);
    expect(lenke).to.have.length(1);
    expect(lenke.prop('to')).is.eql('lenke');
  });
});
