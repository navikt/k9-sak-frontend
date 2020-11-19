import { expect } from 'chai';
import fagsakStatusCode from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import {
  byttBehandlendeEnhetAccess,
  gjenopptaBehandlingAccess,
  henleggBehandlingAccess,
  opneBehandlingForEndringerAccess,
  opprettNyForstegangsBehandlingAccess,
  opprettRevurderingAccess,
  settBehandlingPaVentAccess,
} from './accessMenu';

const forEachFagsakAndBehandlingStatus = callback =>
  Object.values(fagsakStatusCode).forEach(fagsakStatus =>
    Object.values(behandlingStatusCode).forEach(behandlingStatus => callback(fagsakStatus, behandlingStatus)),
  );

const getTestName = (accessName, expected, fagsakStatus, behandlingStatus) =>
  `skal${
    expected ? '' : ' ikke'
  } ha ${accessName} når fagsakStatus er '${fagsakStatus}' og behandlingStatus er '${behandlingStatus}'`;

const ansatt = {
  brukernavn: 'Espen Utvikler',
  navn: 'Espen Utvikler',
  kanBehandleKode6: false,
  kanBehandleKode7: false,
  kanBehandleKodeEgenAnsatt: false,
  kanBeslutte: false,
  kanOverstyre: false,
  kanSaksbehandle: false,
  kanVeilede: false,
};

describe('accessMenu', () => {
  const saksbehandlerAnsatt = { ...ansatt, kanSaksbehandle: true };
  const veilederAnsatt = { ...ansatt, kanVeilede: true };

  describe('henleggBehandlingAccess', () => {
    const validFagsakStatuser = [fagsakStatusCode.UNDER_BEHANDLING];
    const validFagsakStatus = { kode: validFagsakStatuser[0], kodeverk: 'FAGSAK_STATUS' };

    const validBehandlingStatuser = [behandlingStatusCode.OPPRETTET, behandlingStatusCode.BEHANDLING_UTREDES];
    const validBehandlingStatus = { kode: validBehandlingStatuser[0] };

    it('saksbehandler skal ha tilgang til henlegge behandling', () => {
      const accessForSaksbehandler = henleggBehandlingAccess(
        saksbehandlerAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        BehandlingType.FORSTEGANGSSOKNAD,
      );

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', true);
    });

    it('veileder skal ikke ha aktivert tilgang til henlegge behandling', () => {
      const accessForVeileder = henleggBehandlingAccess(
        veilederAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        BehandlingType.FORSTEGANGSSOKNAD,
      );

      expect(accessForVeileder).to.have.property('employeeHasAccess', true);
      expect(accessForVeileder).to.have.property('isEnabled', false);
    });

    forEachFagsakAndBehandlingStatus((fagsakStatus, behandlingStatus) => {
      const expected = validFagsakStatuser.includes(fagsakStatus) && validBehandlingStatuser.includes(behandlingStatus);
      it(getTestName('tilgang til henlegge behandling', expected, fagsakStatus, behandlingStatus), () => {
        const access = henleggBehandlingAccess(
          saksbehandlerAnsatt,
          { kode: fagsakStatus },
          { kode: behandlingStatus },
          BehandlingType.FORSTEGANGSSOKNAD,
        );

        expect(access).to.have.property('isEnabled', expected);
      });
    });
  });

  describe('settBehandlingPaVentAccess når behandling har søknad', () => {
    const validFagsakStatuser = [fagsakStatusCode.UNDER_BEHANDLING];
    const validFagsakStatus = { kode: validFagsakStatuser[0] };

    const validBehandlingStatuser = [
      behandlingStatusCode.OPPRETTET,
      behandlingStatusCode.BEHANDLING_UTREDES,
      behandlingStatusCode.FORESLA_VEDTAK,
    ];
    const validBehandlingStatus = { kode: validBehandlingStatuser[0] };

    it('saksbehandler skal ha tilgang til å sette behandling på vent', () => {
      const accessForSaksbehandler = settBehandlingPaVentAccess(
        saksbehandlerAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        BehandlingType.FORSTEGANGSSOKNAD,
      );

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', true);
    });

    it('veileder skal ikke ha aktivert tilgang til å sette behandling på vent', () => {
      const accessForVeileder = settBehandlingPaVentAccess(
        veilederAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        BehandlingType.FORSTEGANGSSOKNAD,
      );

      expect(accessForVeileder).to.have.property('employeeHasAccess', true);
      expect(accessForVeileder).to.have.property('isEnabled', false);
    });

    forEachFagsakAndBehandlingStatus((fagsakStatus, behandlingStatus) => {
      const expected = validFagsakStatuser.includes(fagsakStatus) && validBehandlingStatuser.includes(behandlingStatus);
      it(getTestName('tilgang til å sette behandling på vent', expected, fagsakStatus, behandlingStatus), () => {
        const access = settBehandlingPaVentAccess(
          saksbehandlerAnsatt,
          { kode: fagsakStatus },
          { kode: behandlingStatus },
          BehandlingType.FORSTEGANGSSOKNAD,
        );

        expect(access).to.have.property('isEnabled', expected);
      });
    });
  });

  describe('saksbehandler skal ha tilgang til å sette behandling på vent når aksjonspunkt er REGISTRER_PAPIRSOKNAD', () => {
    const validFagsakStatuser = [fagsakStatusCode.UNDER_BEHANDLING];
    const validFagsakStatus = { kode: validFagsakStatuser[0] };

    const validBehandlingStatuser = [
      behandlingStatusCode.OPPRETTET,
      behandlingStatusCode.BEHANDLING_UTREDES,
      behandlingStatusCode.FORESLA_VEDTAK,
    ];
    const validBehandlingStatus = { kode: validBehandlingStatuser[1] };

    it('saksbehandler skal ha tilgang til å sette behandling på vent når aksjonspunkt er REGISTRER_PAPIRSOKNAD', () => {
      const accessForSaksbehandler = settBehandlingPaVentAccess(
        saksbehandlerAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        BehandlingType.FORSTEGANGSSOKNAD,
      );

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', true);
    });

    it('veileder skal ikke ha aktivert tilgang til å sette behandling på vent', () => {
      const accessForVeileder = settBehandlingPaVentAccess(
        veilederAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        BehandlingType.FORSTEGANGSSOKNAD,
      );

      expect(accessForVeileder).to.have.property('employeeHasAccess', true);
      expect(accessForVeileder).to.have.property('isEnabled', false);
    });

    forEachFagsakAndBehandlingStatus((fagsakStatus, behandlingStatus) => {
      const expected = validFagsakStatuser.includes(fagsakStatus) && validBehandlingStatuser.includes(behandlingStatus);
      it(getTestName('tilgang til å sette behandling på vent', expected, fagsakStatus, behandlingStatus), () => {
        const access = settBehandlingPaVentAccess(
          saksbehandlerAnsatt,
          { kode: fagsakStatus },
          { kode: behandlingStatus },
          BehandlingType.FORSTEGANGSSOKNAD,
        );

        expect(access).to.have.property('isEnabled', expected);
      });
    });
  });

  describe('saksbehandler skal ha tilgang til å sette behandling på vent når det er behandling av klage', () => {
    const validFagsakStatuser = [fagsakStatusCode.UNDER_BEHANDLING];
    const validFagsakStatus = { kode: validFagsakStatuser[0] };

    const validBehandlingStatuser = [
      behandlingStatusCode.OPPRETTET,
      behandlingStatusCode.BEHANDLING_UTREDES,
      behandlingStatusCode.FORESLA_VEDTAK,
    ];
    const validBehandlingStatus = { kode: validBehandlingStatuser[0] };

    it('saksbehandler skal ha tilgang til å sette behandling på vent når det er behandling av klage', () => {
      const accessForSaksbehandler = settBehandlingPaVentAccess(
        saksbehandlerAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        BehandlingType.FORSTEGANGSSOKNAD,
      );

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', true);
    });

    it('veileder skal ikke ha aktivert tilgang til å sette behandling på vent', () => {
      const accessForVeileder = settBehandlingPaVentAccess(
        veilederAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        BehandlingType.FORSTEGANGSSOKNAD,
      );

      expect(accessForVeileder).to.have.property('employeeHasAccess', true);
      expect(accessForVeileder).to.have.property('isEnabled', false);
    });

    forEachFagsakAndBehandlingStatus((fagsakStatus, behandlingStatus) => {
      const expected = validFagsakStatuser.includes(fagsakStatus) && validBehandlingStatuser.includes(behandlingStatus);
      it(getTestName('tilgang til å sette behandling på vent', expected, fagsakStatus, behandlingStatus), () => {
        const access = settBehandlingPaVentAccess(
          saksbehandlerAnsatt,
          { kode: fagsakStatus },
          { kode: behandlingStatus },
          BehandlingType.FORSTEGANGSSOKNAD,
        );

        expect(access).to.have.property('isEnabled', expected);
      });
    });
  });

  describe('byttBehandlendeEnhetAccess', () => {
    const validFagsakStatuser = [fagsakStatusCode.UNDER_BEHANDLING];
    const validFagsakStatus = { kode: validFagsakStatuser[0], kodeverk: '' };

    const validBehandlingStatuser = [behandlingStatusCode.OPPRETTET, behandlingStatusCode.BEHANDLING_UTREDES];
    const validBehandlingStatus = { kode: validBehandlingStatuser[0], kodeverk: '' };

    it('saksbehandler skal ha tilgang til å bytte behandlende enhet', () => {
      const accessForSaksbehandler = byttBehandlendeEnhetAccess(
        saksbehandlerAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        BehandlingType.FORSTEGANGSSOKNAD,
      );

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', true);
    });

    it('veileder skal ikke ha aktivert tilgang til å bytte behandlende enhet', () => {
      const accessForVeileder = byttBehandlendeEnhetAccess(
        veilederAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        BehandlingType.FORSTEGANGSSOKNAD,
      );

      expect(accessForVeileder).to.have.property('employeeHasAccess', true);
      expect(accessForVeileder).to.have.property('isEnabled', false);
    });

    forEachFagsakAndBehandlingStatus((fagsakStatus, behandlingStatus) => {
      const expected = validFagsakStatuser.includes(fagsakStatus) && validBehandlingStatuser.includes(behandlingStatus);
      it(getTestName('tilgang til å bytte behandlende enhet', expected, fagsakStatus, behandlingStatus), () => {
        const access = byttBehandlendeEnhetAccess(
          saksbehandlerAnsatt,
          { kode: fagsakStatus, kodeverk: '' },
          { kode: behandlingStatus, kodeverk: '' },
          BehandlingType.FORSTEGANGSSOKNAD,
        );

        expect(access).to.have.property('isEnabled', expected);
      });
    });
  });

  describe('opprettRevurderingAccess - Foreldrepenger', () => {
    const validFagsakStatuser = [
      fagsakStatusCode.OPPRETTET,
      fagsakStatusCode.UNDER_BEHANDLING,
      fagsakStatusCode.LOPENDE,
      fagsakStatusCode.AVSLUTTET,
    ];
    const validFagsakStatus = { kode: validFagsakStatuser[0] };

    const validBehandlingStatuser = [behandlingStatusCode.IVERKSETTER_VEDTAK, behandlingStatusCode.AVSLUTTET];
    const validBehandlingStatus = { kode: validBehandlingStatuser[0] };

    const kanIkkeOppretteRevurdering = false;
    const kanOppretteRevurdering = true;
    const sakstype = { kode: fagsakYtelseType.FORELDREPENGER };
    const behandlingType = {
      kode: BehandlingType.REVURDERING,
    };

    it('saksbehandler skal ha tilgang til å opprette revurdering', () => {
      const accessForSaksbehandler = opprettRevurderingAccess(
        saksbehandlerAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        kanOppretteRevurdering,
        sakstype,
        behandlingType,
      );

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', true);
    });

    it('saksbehandler skal ha tilgang til å opprette revurdering hvis fagsaktilstand tillater det', () => {
      const accessForSaksbehandler = opprettRevurderingAccess(
        saksbehandlerAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        kanIkkeOppretteRevurdering,
        sakstype,
        behandlingType,
      );

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', false);
    });

    it('veileder skal ikke ha aktivert tilgang til å opprette revurdering', () => {
      const accessForVeileder = opprettRevurderingAccess(
        veilederAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        kanOppretteRevurdering,
        sakstype,
        behandlingType,
      );

      expect(accessForVeileder).to.have.property('employeeHasAccess', true);
      expect(accessForVeileder).to.have.property('isEnabled', false);
    });

    forEachFagsakAndBehandlingStatus((fagsakStatus, behandlingStatus) => {
      const expected = validFagsakStatuser.includes(fagsakStatus) && validBehandlingStatuser.includes(behandlingStatus);
      it(getTestName('tilgang til å opprette revurdering', expected, fagsakStatus, behandlingStatus), () => {
        const access = opprettRevurderingAccess(
          saksbehandlerAnsatt,
          { kode: fagsakStatus },
          { kode: behandlingStatus },
          kanOppretteRevurdering,
          sakstype,
          behandlingType,
        );
        expect(access).to.have.property('isEnabled', expected);
      });
    });
  });

  describe('opprettRevurderingAccess - Engangsstønad', () => {
    const validFagsakStatuser = [fagsakStatusCode.AVSLUTTET];
    const validFagsakStatus = { kode: validFagsakStatuser[0], kodeverk: '' };

    const validBehandlingStatuser = [behandlingStatusCode.IVERKSETTER_VEDTAK, behandlingStatusCode.AVSLUTTET];
    const validBehandlingStatus = { kode: validBehandlingStatuser[0], kodeverk: '' };

    const kanIkkeOppretteRevurdering = false;
    const kanOppretteRevurdering = true;
    const sakstype = { kode: fagsakYtelseType.ENGANGSSTONAD, kodeverk: '' };
    const behandlingType = {
      kode: BehandlingType.REVURDERING,
      kodeverk: '',
    };

    it('saksbehandler skal ha tilgang til å opprette revurdering', () => {
      const accessForSaksbehandler = opprettRevurderingAccess(
        saksbehandlerAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        kanOppretteRevurdering,
        sakstype,
        behandlingType,
      );

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', true);
    });

    it('saksbehandler skal ha tilgang til å opprette revurdering hvis fagsaktilstand tillater det', () => {
      const accessForSaksbehandler = opprettRevurderingAccess(
        saksbehandlerAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        kanIkkeOppretteRevurdering,
        sakstype,
        behandlingType,
      );

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', false);
    });

    it('veileder skal ikke ha aktivert tilgang til å opprette revurdering', () => {
      const accessForVeileder = opprettRevurderingAccess(
        veilederAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        kanOppretteRevurdering,
        sakstype,
        behandlingType,
      );

      expect(accessForVeileder).to.have.property('employeeHasAccess', true);
      expect(accessForVeileder).to.have.property('isEnabled', false);
    });

    forEachFagsakAndBehandlingStatus((fagsakStatus, behandlingStatus) => {
      const expected = validFagsakStatuser.includes(fagsakStatus) && validBehandlingStatuser.includes(behandlingStatus);
      it(getTestName('tilgang til å opprette revurdering', expected, fagsakStatus, behandlingStatus), () => {
        const access = opprettRevurderingAccess(
          saksbehandlerAnsatt,
          { kode: fagsakStatus },
          { kode: behandlingStatus },
          kanOppretteRevurdering,
          sakstype,
          behandlingType,
        );
        expect(access).to.have.property('isEnabled', expected);
      });
    });
  });

  describe('opprettNyForstegangsBehandlingAccess', () => {
    const validFagsakStatuser = [fagsakStatusCode.AVSLUTTET];
    const validFagsakStatus = { kode: validFagsakStatuser[0], kodeverk: '' };

    const validBehandlingStatuser = [behandlingStatusCode.AVSLUTTET];
    const validBehandlingStatus = { kode: validBehandlingStatuser[0], kodeverk: '' };

    it('saksbehandler skal ha tilgang til å opprette ny førstegangsbehandling', () => {
      const accessForSaksbehandler = opprettNyForstegangsBehandlingAccess(
        saksbehandlerAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        BehandlingType.FORSTEGANGSSOKNAD,
      );

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', true);
    });

    it('veileder skal ikke ha aktivert tilgang til å opprette ny førstegangsbehandling', () => {
      const accessForVeileder = opprettNyForstegangsBehandlingAccess(
        veilederAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        BehandlingType.FORSTEGANGSSOKNAD,
      );

      expect(accessForVeileder).to.have.property('employeeHasAccess', true);
      expect(accessForVeileder).to.have.property('isEnabled', false);
    });

    forEachFagsakAndBehandlingStatus((fagsakStatus, behandlingStatus) => {
      const expected = validFagsakStatuser.includes(fagsakStatus) && validBehandlingStatuser.includes(behandlingStatus);
      it(
        getTestName('tilgang til å opprette ny førstegangsbehandling', expected, fagsakStatus, behandlingStatus),
        () => {
          const access = opprettNyForstegangsBehandlingAccess(
            saksbehandlerAnsatt,
            { kode: fagsakStatus, kodeverk: 'FAGSAK_STATUS' },
            { kode: behandlingStatus, kodeverk: 'BEHANDLING_TYPE' },
            BehandlingType.FORSTEGANGSSOKNAD,
          );

          expect(access).to.have.property('isEnabled', expected);
        },
      );
    });
  });

  describe('gjenopptaBehandlingAccess', () => {
    const validFagsakStatuser = [fagsakStatusCode.UNDER_BEHANDLING];
    const validFagsakStatus = { kode: validFagsakStatuser[0], kodeverk: '' };

    const validBehandlingStatuser = [behandlingStatusCode.BEHANDLING_UTREDES];
    const validBehandlingStatus = { kode: validBehandlingStatuser[0], kodeverk: '' };

    it('saksbehandler skal ha tilgang til å gjenoppta behandling', () => {
      const accessForSaksbehandler = gjenopptaBehandlingAccess(
        saksbehandlerAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        BehandlingType.FORSTEGANGSSOKNAD,
      );

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', true);
    });

    it('veileder skal ikke ha aktivert tilgang til å gjenoppta behandling', () => {
      const accessForVeileder = gjenopptaBehandlingAccess(
        veilederAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        BehandlingType.FORSTEGANGSSOKNAD,
      );

      expect(accessForVeileder).to.have.property('employeeHasAccess', true);
      expect(accessForVeileder).to.have.property('isEnabled', false);
    });

    forEachFagsakAndBehandlingStatus((fagsakStatus, behandlingStatus) => {
      const expected = validFagsakStatuser.includes(fagsakStatus) && validBehandlingStatuser.includes(behandlingStatus);
      it(getTestName('tilgang til å gjenoppta behandling', expected, fagsakStatus, behandlingStatus), () => {
        const access = gjenopptaBehandlingAccess(
          saksbehandlerAnsatt,
          { kode: fagsakStatus, kodeverk: 'FAGSAK_STATUS' },
          { kode: behandlingStatus, kodeverk: 'BEHANDLING_TYPE' },
          BehandlingType.FORSTEGANGSSOKNAD,
        );

        expect(access).to.have.property('isEnabled', expected);
      });
    });
  });

  describe('opneBehandlingForEndringerAccess', () => {
    const validFagsakStatuser = [fagsakStatusCode.UNDER_BEHANDLING];
    const validFagsakStatus = { kode: validFagsakStatuser[0], kodeverk: 'FAGSAK_STATUS' };

    const validBehandlingStatuser = [behandlingStatusCode.BEHANDLING_UTREDES];
    const validBehandlingStatus = { kode: validBehandlingStatuser[0], kodeverk: 'BEHANDLING_STATUS' };

    it('saksbehandler skal ha tilgang til å åpne behandling for endringer når behandlingstype er revurdering', () => {
      const behandlingType = {
        kode: BehandlingType.REVURDERING,
        kodeverk: 'BEHANDLING_TYPE',
      };
      const accessForSaksbehandler = opneBehandlingForEndringerAccess(
        behandlingType,
        saksbehandlerAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
      );

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', true);
    });

    it('saksbehandler skal ikke ha tilgang til å åpne behandling for endringer når behandlingstype er ulik revurdering', () => {
      const behandlingType = {
        kode: BehandlingType.KLAGE,
        kodeverk: 'BEHANDLING_TYPE',
      };
      const accessForSaksbehandler = opneBehandlingForEndringerAccess(
        behandlingType,
        saksbehandlerAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
      );

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', false);
    });

    forEachFagsakAndBehandlingStatus((fagsakStatus, behandlingStatus) => {
      const behandlingType = {
        kode: BehandlingType.REVURDERING,
        kodeverk: 'BEHANDLING_TYPE',
      };
      const expected = validFagsakStatuser.includes(fagsakStatus) && validBehandlingStatuser.includes(behandlingStatus);
      it(getTestName('tilgang til å åpne behandling for endringer', expected, fagsakStatus, behandlingStatus), () => {
        const access = opneBehandlingForEndringerAccess(
          behandlingType,
          saksbehandlerAnsatt,
          { kode: fagsakStatus, kodeverk: 'FAGSAK_STATUS' },
          { kode: behandlingStatus, kodeverk: 'BEHANDLING_STATUS' },
        );

        expect(access).to.have.property('isEnabled', expected);
      });
    });
  });
});
