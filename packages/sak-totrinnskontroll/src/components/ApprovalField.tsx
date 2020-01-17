import { NavFieldGroup, RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  BehandlingKlageVurdering,
  BehandlingStatusType,
  Kodeverk,
  TotrinnskontrollAksjonspunkter,
} from '@fpsak-frontend/types';
import { Normaltekst } from 'nav-frontend-typografi';
import React, { useMemo } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import styles from './ApprovalField.less';
import getAksjonspunktText from './ApprovalTextUtils';
import ReasonsField from './ReasonsField';

/*
 * ApprovalField
 *
 * Presentasjonskomponent. Holds the radiobuttons for approving or disapproving the decisions of the handler
 *
 * Eksempel:
 * ```html
 * <ApprovalField
 *   key={aksjonspunkt.aksjonspunktId}
 *   aksjonspunkt={aksjonspunkt}
 *   currentValue={formState[vilkarIndex].toTrinnsAksjonspunkter[approvalIndex]}
 *   vilkarIndex={vilkarIndex}
 *   approvalIndex={approvalIndex}
 *   showBegrunnelse={akspktDef}
 * />
 * ```
 */
export const ApprovalFieldImpl = ({
  aksjonspunkt,
  readOnly,
  currentValue,
  approvalIndex,
  contextIndex,
  showBegrunnelse,
  klageKA,
  isForeldrepengerFagsak,
  behandlingKlageVurdering,
  behandlingStatus,
  arbeidsforholdHandlingTyper,
}: ApprovalFieldImplProps & WrappedComponentProps) => {
  const aksjonspunktText = useMemo(
    () =>
      getAksjonspunktText(
        isForeldrepengerFagsak,
        behandlingKlageVurdering,
        behandlingStatus,
        arbeidsforholdHandlingTyper,
        aksjonspunkt,
      ),
    [isForeldrepengerFagsak, behandlingKlageVurdering, behandlingStatus, arbeidsforholdHandlingTyper, aksjonspunkt],
  );
  const fieldName = `approvals[${contextIndex}].aksjonspunkter[${approvalIndex}]`;
  const erKlageKA = klageKA && currentValue && currentValue.totrinnskontrollGodkjent;
  const erAnke =
    aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.MANUELL_VURDERING_AV_ANKE &&
    currentValue.totrinnskontrollGodkjent === true;
  const showOnlyBegrunnelse = erAnke || erKlageKA ? currentValue.totrinnskontrollGodkjent : showBegrunnelse;
  const showReasons = erAnke || (currentValue && currentValue.totrinnskontrollGodkjent === false) || erKlageKA;
  return (
    <div className={styles.approvalItemContainer}>
      {aksjonspunktText.map((formattedMessage, index) => (
        <div
          key={aksjonspunkt.aksjonspunktKode.concat('_'.concat(`${index}`))}
          className={styles.aksjonspunktTextContainer}
        >
          <Normaltekst key={aksjonspunkt.aksjonspunktKode.concat('_'.concat(`${index}`))}>
            {formattedMessage}
          </Normaltekst>
        </div>
      ))}
      <NavFieldGroup>
        <RadioGroupField name={`${fieldName}.totrinnskontrollGodkjent`} bredde="M" readOnly={readOnly}>
          <RadioOption label={{ id: 'ApprovalField.Godkjent' }} value />
          <RadioOption label={{ id: 'ApprovalField.Vurder' }} value={false} />
        </RadioGroupField>
        {showReasons && (
          <ReasonsField fieldName={fieldName} godkjentHosKA={erKlageKA} showOnlyBegrunnelse={showOnlyBegrunnelse} />
        )}
      </NavFieldGroup>
    </div>
  );
};

interface ApprovalFieldImplProps {
  aksjonspunkt: TotrinnskontrollAksjonspunkter;
  readOnly: boolean;
  approvalIndex?: number;
  contextIndex?: number;
  currentValue?: TotrinnskontrollAksjonspunkter;
  showBegrunnelse?: boolean;
  klageKA?: boolean;
  isForeldrepengerFagsak: boolean;
  behandlingKlageVurdering?: BehandlingKlageVurdering;
  behandlingStatus: BehandlingStatusType;
  arbeidsforholdHandlingTyper: Kodeverk[];
}

export default injectIntl(ApprovalFieldImpl);
