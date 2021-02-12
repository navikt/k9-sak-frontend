import React, { FunctionComponent } from 'react';
import { InjectedFormProps } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import {
  behandlingForm,
  getBehandlingFormPrefix,
  getBehandlingFormValues,
} from '@fpsak-frontend/form/src/behandlingForm';
import { FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components/index';
import transferIcon from '@fpsak-frontend/assets/images/data-transfer-horizontal.svg';
import user from '@fpsak-frontend/assets/images/user.svg';
import users from '@fpsak-frontend/assets/images/users.svg';
import { Element } from 'nav-frontend-typografi';
import { Rammevedtak, RammevedtakEnum } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
import { hjem } from '@fpsak-frontend/assets/images';
import mapDtoTilFormValues from '../dto/mapping';
import FormValues from '../types/FormValues';
import MidlertidigAlene from './MidlertidigAlene';
import { OverføringsretningEnum } from '../types/Overføring';
import { rammevedtakFormName } from './formNames';
import OverføringsdagerPanelgruppe from './OverføringsdagerPanelgruppe';
import Seksjon from './Seksjon';
import FastBreddeAligner from './FastBreddeAligner';
import BarnVisning from './BarnVisning';
import UidentifiserteRammevedtak from './UidentifiserteRammevedtak';
import DeltBosted from './DeltBosted/DeltBosted';

interface RammevedtakFaktaFormProps {
  rammevedtak: Rammevedtak[];
  behandlingId: number;
  behandlingVersjon: number;
  formValues?: FormValues;
}

export const RammevedtakFaktaFormImpl: FunctionComponent<RammevedtakFaktaFormProps & InjectedFormProps> = ({
  rammevedtak,
  formValues,
  behandlingId,
  behandlingVersjon,
}) => {
  if (isEmpty(formValues)) {
    return null;
  }

  const {
    barn,
    overføringGir,
    overføringFår,
    fordelingGir,
    fordelingFår,
    koronaoverføringGir,
    koronaoverføringFår,
    midlertidigAleneansvar,
  } = formValues;

  const detFinnesOverføringer =
    [
      ...overføringGir,
      ...overføringFår,
      ...fordelingGir,
      ...fordelingFår,
      ...koronaoverføringGir,
      ...koronaoverføringFår,
    ].length > 0;

  return (
    <>
      <UidentifiserteRammevedtak type={RammevedtakEnum.UIDENTIFISERT} rammevedtak={rammevedtak} />
      <UidentifiserteRammevedtak type={RammevedtakEnum.UTVIDET_RETT} rammevedtak={rammevedtak} />
      <UidentifiserteRammevedtak type={RammevedtakEnum.ALENEOMSORG} rammevedtak={rammevedtak} />
      <UidentifiserteRammevedtak type={RammevedtakEnum.FOSTERBARN} rammevedtak={rammevedtak} />
      <Seksjon bakgrunn="grå" title={{ id: 'FaktaRammevedtak.Overføringer.Tittel' }} imgSrc={transferIcon} medMarg>
        {detFinnesOverføringer ? (
          <>
            <FlexRow spaceBetween>
              <FastBreddeAligner
                rad={{ padding: '0 0 0 1em' }}
                kolonner={[
                  {
                    width: '225px',
                    id: 'overføring.tittel.totalt',
                    content: (
                      <Element>
                        <FormattedMessage id="FaktaRammevedtak.Overføringer.Totalt" />
                      </Element>
                    ),
                  },
                  {
                    width: '150px',
                    id: 'overføring.tittel.type',
                    content: (
                      <Element>
                        <FormattedMessage id="FaktaRammevedtak.Overføringer.Type" />
                      </Element>
                    ),
                  },
                ]}
              />
              <Hjelpetekst>
                <FormattedMessage id="FaktaRammevedtak.Overføringer.Hjelpetekst" values={{ br: <br /> }} />
              </Hjelpetekst>
            </FlexRow>
            <OverføringsdagerPanelgruppe
              overføringer={overføringFår}
              fordelinger={fordelingFår}
              koronaoverføringer={koronaoverføringFår}
              retning={OverføringsretningEnum.INN}
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
            />
            <VerticalSpacer thirtyTwoPx />
            <OverføringsdagerPanelgruppe
              overføringer={overføringGir}
              fordelinger={fordelingGir}
              koronaoverføringer={koronaoverføringGir}
              retning={OverføringsretningEnum.UT}
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
            />
          </>
        ) : (
          <FormattedMessage id="FaktaRammevedtak.Overføringer.IngenOverføringer" />
        )}
      </Seksjon>
      <Seksjon bakgrunn="hvit" title={{ id: 'FaktaRammevedtak.Barn.Tittel' }} imgSrc={users} medMarg>
        <>
          {!barn.length && <FormattedMessage id="FaktaRammevedtak.Barn.IngenBarn" />}
          {barn.map((barnet, index) => (
            <BarnVisning barnet={barnet} index={index} key={barnet.fødselsnummer} />
          ))}
        </>
      </Seksjon>
      <Seksjon bakgrunn="grå" title={{ id: 'FaktaRammevedtak.ErMidlertidigAlene.Tittel' }} imgSrc={user} medMarg>
        <MidlertidigAlene midlertidigAlene={midlertidigAleneansvar} />
      </Seksjon>
      <Seksjon bakgrunn="hvit" title={{ id: 'FaktaRammevedtak.harDeltBosted.Tittel' }} imgSrc={hjem} medMarg>
        <>
          {!barn.length && <FormattedMessage id="FaktaRammevedtak.harDeltBosted.IngenRammemelding" />}
          {barn.map((barnet, index) => (
            <DeltBosted barnet={barnet} index={index} key={barnet.fødselsnummer} />
          ))}
        </>
      </Seksjon>
    </>
  );
};

const mapStateToPropsFactory = (_initialState, initialOwnProps: RammevedtakFaktaFormProps) => {
  const { rammevedtak } = initialOwnProps;

  return (state, { behandlingId, behandlingVersjon }: RammevedtakFaktaFormProps) => {
    const behandlingFormPrefix = getBehandlingFormPrefix(behandlingId, behandlingVersjon);
    const formValues = getBehandlingFormValues(rammevedtakFormName, behandlingId, behandlingVersjon)(state) || {};

    return {
      initialValues: mapDtoTilFormValues(rammevedtak),
      behandlingFormPrefix,
      formValues,
    };
  };
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: rammevedtakFormName,
    enableReinitialize: true,
  })(RammevedtakFaktaFormImpl),
);
