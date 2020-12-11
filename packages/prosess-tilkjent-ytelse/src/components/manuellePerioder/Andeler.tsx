import React, { FC } from 'react';
import { WrappedComponentProps } from 'react-intl';
import { FieldArrayFieldsProps, FieldArrayMetaProps } from 'redux-form';
import AlertStripe from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';
import { Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';
import { Table, TableColumn } from '@fpsak-frontend/shared-components';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import { createVisningsnavnForAndel, getInntektskategori } from '../TilkjentYtelseUtils';

interface OwnProps {
  fields: FieldArrayFieldsProps<any>;
  meta: FieldArrayMetaProps;
  openSlettPeriodeModalCallback: (...args: any[]) => any;
  updatePeriode: (...args: any[]) => any;
  editPeriode: (...args: any[]) => any;
  cancelEditPeriode: (...args: any[]) => any;
  readOnly: boolean;
  perioder: any[];
  isNyPeriodeFormOpen: boolean;
  behandlingVersjon: number;
  behandlingId: number;
  behandlingStatus: Kodeverk;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
}

const headerTextCodes = [
  'TilkjentYtelse.NyPeriode.Arbeidsforhold',
  'TilkjentYtelse.NyPeriode.Refusjon',
  'TilkjentYtelse.NyPeriode.Inntektskategori',
  'TilkjentYtelse.NyPeriode.Ubetalingsgrad',
];

const Andeler: FC<OwnProps & WrappedComponentProps> = ({ fields, meta, alleKodeverk }) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);

  return (
    <div>
      {meta.error && <AlertStripe type="feil">{meta.error}</AlertStripe>}
      {meta.warning && <AlertStripe type="info">{meta.warning}</AlertStripe>}

      <Table headerTextCodes={headerTextCodes}>
        {fields.map((fieldId: string, index: number, field: FieldArrayFieldsProps<any>) => {
          const andel = field.get(index);
          const label = createVisningsnavnForAndel(andel, getKodeverknavn);

          const inntektskategori = getInntektskategori(andel.inntektskategori, getKodeverknavn);

          return (
            <tr>
              <TableColumn>
                <Normaltekst>{label}</Normaltekst>
              </TableColumn>
              <TableColumn>
                <Normaltekst>{andel.refusjon}</Normaltekst>
              </TableColumn>
              <TableColumn>
                <Normaltekst>{inntektskategori}</Normaltekst>
              </TableColumn>
              <TableColumn>
                <Normaltekst>{andel.utbetalingsgrad}</Normaltekst>
              </TableColumn>
            </tr>
          );
        })}
      </Table>
    </div>
  );
};

export default Andeler;
