import { createLocationForHistorikkItems } from '@fpsak-frontend/fp-felles';
import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { AksjonspunktHelpText } from '@fpsak-frontend/shared-components';
import {
  BehandlingStatusType,
  SkjermlenkeTyper,
  TotrinnskontrollAksjonspunkter,
  BehandlingKlageVurdering,
  AlleKodeverk,
} from '@fpsak-frontend/types';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './approvalPanel.less';
import ToTrinnsForm from './ToTrinnsForm';

export const mapPropsToContext = (
  toTrinnsBehandling: boolean,
  props: ApprovalPanelProps,
  skjemalenkeTyper: SkjermlenkeTyper[],
) => {
  if (toTrinnsBehandling) {
    let skjermlenkeContext;
    if (props.behandlingStatus.kode === BehandlingStatus.FATTER_VEDTAK && props.totrinnskontrollSkjermlenkeContext) {
      skjermlenkeContext = props.totrinnskontrollSkjermlenkeContext;
    }
    if (skjermlenkeContext) {
      const totrinnsContext = skjermlenkeContext.map(context => {
        const skjermlenkeTypeKodeverk = skjemalenkeTyper.find(
          skjemalenkeType => skjemalenkeType.kode === context.skjermlenkeType,
        );
        return {
          contextCode: context.skjermlenkeType,
          skjermlenke: createLocationForHistorikkItems(props.location, context.skjermlenkeType),
          skjermlenkeNavn: skjermlenkeTypeKodeverk?.navn,
          aksjonspunkter: context.totrinnskontrollAksjonspunkter,
        };
      });
      return totrinnsContext || null;
    }
  }
  return null;
};

/**
 * ApprovalPanel
 *
 * Containerklass ansvarlig for att rita opp vilkår og aksjonspunkter med toTrinnskontroll
 */
export class ApprovalPanel extends Component<ApprovalPanelProps, ApprovalPanelState> {
  constructor(props: ApprovalPanelProps) {
    super(props);
    this.state = {
      approvals: [],
    };

    const { totrinnskontrollSkjermlenkeContext, toTrinnsBehandling, skjemalenkeTyper } = props;
    if (totrinnskontrollSkjermlenkeContext) {
      this.state = {
        ...this.state,
        approvals: mapPropsToContext(toTrinnsBehandling, props, skjemalenkeTyper),
      };
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: ApprovalPanelProps) {
    if (nextProps.totrinnskontrollSkjermlenkeContext) {
      this.setState({
        approvals: mapPropsToContext(nextProps.toTrinnsBehandling, nextProps, nextProps.skjemalenkeTyper),
      });
    }
  }

  componentWillUnmount() {
    this.setState({ approvals: [] });
  }

  render() {
    const {
      behandlingId,
      behandlingVersjon,
      behandlingStatus,
      location,
      readOnly,
      onSubmit,
      forhandsvisVedtaksbrev,
      behandlingKlageVurdering,
      isForeldrepengerFagsak,
      alleKodeverk,
      erBehandlingEtterKlage,
      disableGodkjennKnapp,
    } = this.props;
    const { approvals } = this.state;
    const hasApprovals = approvals && approvals.length > 0;

    if (hasApprovals) {
      return (
        <div className={styles.approvalContainer}>
          {!readOnly && (
            <AksjonspunktHelpText isAksjonspunktOpen marginBottom>
              {[<FormattedMessage key={1} id="HelpText.ToTrinnsKontroll" />]}
            </AksjonspunktHelpText>
          )}
          <ToTrinnsForm
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            totrinnskontrollContext={approvals}
            initialValues={{ approvals }}
            onSubmit={onSubmit}
            location={location}
            forhandsvisVedtaksbrev={forhandsvisVedtaksbrev}
            readOnly={readOnly}
            isForeldrepengerFagsak={isForeldrepengerFagsak}
            behandlingKlageVurdering={behandlingKlageVurdering}
            behandlingStatus={behandlingStatus}
            alleKodeverk={alleKodeverk}
            erBehandlingEtterKlage={erBehandlingEtterKlage}
            disableGodkjennKnapp={disableGodkjennKnapp}
          />
        </div>
      );
    }

    return null;
  }
}

interface ApprovalPanelProps {
  behandlingId: number;
  behandlingVersjon: number;
  totrinnskontrollSkjermlenkeContext: TotrinnskontrollAksjonspunkter[];
  behandlingStatus: BehandlingStatusType;
  toTrinnsBehandling: boolean;
  location: Location;
  skjemalenkeTyper: SkjermlenkeTyper[];
  onSubmit: () => void;
  readOnly: boolean;
  forhandsvisVedtaksbrev: () => void;
  isForeldrepengerFagsak: boolean;
  behandlingKlageVurdering?: BehandlingKlageVurdering;
  alleKodeverk: AlleKodeverk;
  erBehandlingEtterKlage: boolean;
  disableGodkjennKnapp: boolean;
}

export interface Approvals {
  contextCode: string;
  skjermlenke: string;
  aksjonspunkter: TotrinnskontrollAksjonspunkter[];
  skjermlenkeNavn?: string;
}

interface ApprovalPanelState {
  approvals: Approvals[] | null;
}

export default ApprovalPanel;
