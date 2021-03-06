import React from 'react';
import { BarnType } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';
import { FormattedMessage } from 'react-intl';
import { shallowWithIntl } from '../../i18n';
import BarnSeksjon from './BarnSeksjon';
import KombinertBarnOgRammevedtak from '../dto/KombinertBarnOgRammevedtak';

describe('<BarnSeksjon>', () => {
  it('Rendrer hvert barn', () => {
    const barn: KombinertBarnOgRammevedtak[] = [
      {
        personIdent: '150915',
        barnRelevantIBehandling: {
          personIdent: '150915',
          fødselsdato: '2013-08-31',
          dødsdato: null,
          harSammeBosted: true,
          barnType: BarnType.VANLIG,
        },
      },
      {
        personIdent: '150915',
        barnRelevantIBehandling: {
          personIdent: '150915',
          fødselsdato: '2013-08-31',
          dødsdato: null,
          harSammeBosted: true,
          barnType: BarnType.VANLIG,
        },
      },
    ];
    const wrapper = shallowWithIntl(<BarnSeksjon barn={barn} startIndex={0} tekstId="FaktaBarn.Behandlingsdato" />);

    const elementerMedFormatterTekstId = tekstId =>
      wrapper.find(FormattedMessage).filterWhere(formatert => formatert.prop('id') === tekstId);

    const tekstBarnBehandling = elementerMedFormatterTekstId('FaktaBarn.Behandlingsdato');
    expect(tekstBarnBehandling).toHaveLength(1);
  });
});
