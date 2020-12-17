import moment from 'moment';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { visningsdato } from '@fpsak-frontend/utils';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import BarnDto, { BarnType } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';

interface BarnInfoProps {
  barnet: BarnDto;
  barnnummer: number;
}

export const BarnPanel = styled.article`
  background-color: #ffffff;
  border: 1px solid #c6c2bf;
  border-radius: 4px;
  max-width: 700px;
  min-width: 400px;
  margin-top: 1em;
`;

const PanelHeader = styled.span`
  display: flex;
  padding: 0.5em 1em;
  background-color: #e9e7e7;
  h4 {
    font-weight: 600;
    margin: 0 1em 0 0;
    flex-grow: 1;
  }
`;

const PanelContent = styled.div`
  padding: 0.5em 1em;
`;

const Fodselsinfo = styled.div`
  flex-grow: 1;
`;

const BarnInfo: FunctionComponent<BarnInfoProps> = ({ barnet, barnnummer }) => {
  const { personIdent, harSammeBosted, fødselsdato, dødsdato, barnType } = barnet;
  return (
    <BarnPanel key={personIdent}>
      <PanelHeader>
        <h4>
          <FormattedMessage id="FaktaBarn.BarnNummer" values={{ index: barnnummer }} />
        </h4>
        <Fodselsinfo>
          <FormattedMessage
            id="FaktaBarn.Fødselsinfo"
            values={{
              b: chunks => <b>{chunks}</b>,
              i: chunks => <i>{chunks}</i>,
              dato: visningsdato(fødselsdato),
              alder: moment().diff(fødselsdato, 'years')
            }}
          />
        </Fodselsinfo>
      </PanelHeader>
      <PanelContent>
        <Normaltekst>
          <FormattedMessage
            id={harSammeBosted ? 'FaktaBarn.BorMedSøker' : 'FaktaBarn.BorIkkeMedSøker'}
            values={{ b: chunks => <b>{chunks}</b> }}
          />
        </Normaltekst>
        {dødsdato && (
          <Normaltekst>
            <FormattedMessage id="FaktaBarn.Død" values={{ dødsdato: visningsdato(dødsdato) }} />
          </Normaltekst>
        )}
        {barnType === BarnType.FOSTERBARN && (
          <Normaltekst>
            <FormattedMessage id="FaktaBarn.Fosterbarn" />
          </Normaltekst>
        )}
        {barnType === BarnType.UTENLANDSK_BARN && (
          <Normaltekst>
            <FormattedMessage id="FaktaBarn.UtenlandskBarn" />
          </Normaltekst>
        )}
      </PanelContent>
    </BarnPanel>
  );
};

export default BarnInfo;
