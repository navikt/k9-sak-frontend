import React, { FunctionComponent } from 'react';
import { injectIntl, FormattedMessage, WrappedComponentProps } from 'react-intl';
import { FieldArray, FieldArrayFieldsProps, FieldArrayMetaProps } from 'redux-form';
import AlertStripe from 'nav-frontend-alertstriper';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Arbeidsforhold, Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';
import {
  FlexRow,
  FlexColumn,
  Table,
  TableRow,
  TableColumn,
  Image,
  VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import removePeriod from '@fpsak-frontend/assets/images/remove.svg';
import removePeriodDisabled from '@fpsak-frontend/assets/images/remove_disabled.svg';
import { DatepickerField } from '@fpsak-frontend/form';
import Andeler from './Andeler';

import styles from './periode.less';

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
  isAnyFormOpen: (...args: any[]) => any;
  arbeidsforhold: Arbeidsforhold[];
}

const headerTextCodes = ['TilkjentYtelse.Periode', 'TilkjentYtelse.Andeler'];

const PeriodeRad: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  fields,
  meta,
  openSlettPeriodeModalCallback,
  alleKodeverk,
  intl,
  isNyPeriodeFormOpen,
  readOnly,
  arbeidsforhold,
  isAnyFormOpen,
}) => {
  const isAnyFormOrNyPeriodeOpen = isAnyFormOpen() || isNyPeriodeFormOpen;
  return (
    <div>
      {meta.error && <AlertStripe type="feil">{meta.error}</AlertStripe>}
      {meta.warning && <AlertStripe type="info">{meta.warning}</AlertStripe>}

      <VerticalSpacer twentyPx />
      <Ekspanderbartpanel tittel={<FormattedMessage id="TilkjentYtelse.Perioder" />}>
        <Table headerTextCodes={headerTextCodes}>
          {fields.map((fieldId: string, index: number, field: FieldArrayFieldsProps<any>) => {
            const periode = field.get(index);
            return (
              <TableRow key={periode.id} id={periode.id}>
                <TableColumn>
                  <FlexRow>
                    <FlexColumn>
                      <DatepickerField
                        name={`${fieldId}.fom`}
                        label=""
                        // @ts-ignore
                        value={periode.fom}
                        readOnly
                      />
                    </FlexColumn>
                    <FlexColumn>
                      <DatepickerField
                        name={`${fieldId}.tom`}
                        label=""
                        // @ts-ignore
                        value={periode.tom}
                        readOnly
                      />
                    </FlexColumn>
                  </FlexRow>
                </TableColumn>
                <TableColumn>
                  <FieldArray
                    name={`${fieldId}.andeler`}
                    // @ts-ignore
                    component={Andeler}
                    arbeidsforhold={arbeidsforhold}
                    readOnly
                    alleKodeverk={alleKodeverk}
                  />
                </TableColumn>
                <TableColumn>
                  {!readOnly && (
                    <div className={styles.iconContainer}>
                      <Image
                        className={styles.removeIcon}
                        src={isAnyFormOrNyPeriodeOpen ? removePeriodDisabled : removePeriod}
                        onClick={
                          isAnyFormOrNyPeriodeOpen ? () => undefined : () => openSlettPeriodeModalCallback(periode.id)
                        }
                        alt={intl.formatMessage({ id: 'TilkjentYtelse.SlettPerioden' })}
                      />
                    </div>
                  )}
                </TableColumn>
              </TableRow>
            );
          })}
        </Table>
      </Ekspanderbartpanel>
    </div>
  );
};

export default injectIntl(PeriodeRad);
