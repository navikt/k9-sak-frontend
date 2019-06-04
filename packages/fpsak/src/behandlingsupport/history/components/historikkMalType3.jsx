import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { historikkinnslagDelPropType } from '@fpsak-frontend/prop-types';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { injectKodeverk } from '@fpsak-frontend/fp-felles';

import { getAlleKodeverk } from 'kodeverk/duck';
import { createLocationForHistorikkItems } from 'kodeverk/skjermlenkeCodes';
import { findHendelseText } from './historikkUtils';

const aksjonspunktCodesToTextCode = {
  [aksjonspunktCodes.TERMINBEKREFTELSE]: 'TermindatoFaktaForm.ApplicationInformation',
  [aksjonspunktCodes.ADOPSJONSDOKUMENTAJON]: 'DokumentasjonFaktaForm.ApplicationInformation',
  [aksjonspunktCodes.OM_ADOPSJON_GJELDER_EKTEFELLES_BARN]: 'EktefelleFaktaForm.ApplicationInformation',
  [aksjonspunktCodes.OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE]: 'MannAdoptererAleneFaktaForm.ApplicationInformation',
  [aksjonspunktCodes.SOKNADSFRISTVILKARET]: 'ErSoknadsfristVilkaretOppfyltForm.ApplicationInformation',
  [aksjonspunktCodes.VURDER_SOKNADSFRIST_FORELDREPENGER]: 'ErSoknadsfristVilkaretOppfyltForm.ApplicationInformation',
  [aksjonspunktCodes.OMSORGSOVERTAKELSE]: 'OmsorgOgForeldreansvarInfoPanel.Omsorg',
  [aksjonspunktCodes.TILLEGGSOPPLYSNINGER]: 'TilleggsopplysningerInfoPanel.Tilleggsopplysninger',
  [aksjonspunktCodes.MEDLEMSKAP]: 'MedlemskapInfoPanel.Medlemskap',
  [aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING]: 'Behandlingspunkt.Opptjeningsvilkaret',
  [aksjonspunktCodes.MANUELL_VURDERING_AV_OMSORGSVILKARET]: 'OmsorgOgForeldreansvarFaktaForm.ApplicationInformation',
  [aksjonspunktCodes.REGISTRER_PAPIRSOKNAD_ENGANGSSTONAD]: 'Registrering.RegistrerePapirSoknadAksPkt',
  [aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_2_LEDD]:
    'ErForeldreansvar2LeddVilkaarOppfyltForm.Foreldreansvar',
  [aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_4_LEDD]:
    'ErForeldreansvar4LeddVilkaarOppfyltForm.Foreldreansvar',
  [aksjonspunktCodes.VARSEL_REVURDERING_ETTERKONTROLL]: 'VarselOmRevurderingInfoPanel.Etterkontroll',
  [aksjonspunktCodes.VARSEL_REVURDERING_MANUELL]: 'VarselOmRevurderingInfoPanel.Manuell',
  [aksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN]: 'HistorikkAksjonpunktMapping.SokersStonadGjelderSammeBarn',
  [aksjonspunktCodes.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN]:
    'HistorikkAksjonpunktMapping.AnnenForeldersStonadGjelderSammeBarn',
  [aksjonspunktCodes.AVKLAR_VERGE]: 'Verge.AvklarVerge',
  [aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL]: 'SjekkFodselDokForm.ApplicationInformation',
  [aksjonspunktCodes.BEHANDLE_KLAGE_NFP]: 'Klage.KlageNFP.Fastsett',
  [aksjonspunktCodes.BEHANDLE_KLAGE_NK]: 'Klage.KlageKA.Fastsett',
  [aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP]: 'Klage.KlageNFP.Formkrav',
  [aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA]: 'Klage.KlageKA.Formkrav',
  [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD]: 'Arbeidsforhold.AvklarArbeidsforhold',
  [aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD]: 'Opphold.Lovlig',
  [aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT]: 'Opphold.Bosatt',
  [aksjonspunktCodes.AVKLAR_OPPHOLDSRETT]: 'Opphold.Rett',
  [aksjonspunktCodes.AVKLAR_PERSONSTATUS]: 'BehandlingsprosessIndex.CheckAvklarPersonstatus',
  [aksjonspunktCodes.OVERSTYR_FODSELSVILKAR]: 'Overstyr.fodselsvilkar',
  [aksjonspunktCodes.OVERSTYR_FODSELSVILKAR_FAR_MEDMOR]: 'Overstyr.fodselsvilkar',
  [aksjonspunktCodes.OVERSTYR_ADOPSJONSVILKAR]: 'Overstyr.adopsjonsvilkar',
  [aksjonspunktCodes.OVERSTYRING_AV_ADOPSJONSVILKÅRET_FP]: 'Overstyr.adopsjonsvilkar',
  [aksjonspunktCodes.OVERSTYRING_AV_OPPTJENINGSVILKARET]: 'Overstyr.opptjeningsvilkår',
  [aksjonspunktCodes.OVERSTYR_MEDLEMSKAPSVILKAR]: 'Overstyr.medlemskapsvilkar',
  [aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR]: 'Overstyr.soknadsfristvilkar',
  [aksjonspunktCodes.OVERSTYR_BEREGNING]: 'Overstyr.beregning',
  [aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER]: 'Overstyr.uttak',
  [aksjonspunktCodes.MANUELL_AVKLAR_FAKTA_UTTAK]: 'UttakInfoPanel.FaktaUttak',
  [aksjonspunktCodes.OVERSTYR_AVKLAR_FAKTA_UTTAK]: 'UttakInfoPanel.FaktaUttak',
  [aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_ALENEOMSORG]:
    'OmsorgFaktaForm.Aleneomsorg.ApplicationInformation',
  [aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_OMSORG]: 'OmsorgFaktaForm.Omsorg.ApplicationInformation',
  [aksjonspunktCodes.AVKLAR_UTTAK]: 'UttakInfoPanel.FaktaUttak',
  [aksjonspunktCodes.ANNEN_FORELDER_IKKE_RETT_OG_LØPENDE_VEDTAK]: 'UttakInfoPanel.FaktaUttak',
  [aksjonspunktCodes.FASTSETT_UTTAKPERIODER]: 'Fastsett.Manuelt',
  [aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_DØD]: 'Uttak.OpplysningerOmDod',
  [aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST]: 'Uttak.OpplysningerOmSoknadsfrist',
  [aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_MEDLEMSKAP]: 'Uttak.OpplysningerOmMedlemskap',
  [aksjonspunktCodes.KONTROLLER_REALITETSBEHANDLING_ELLER_KLAGE]: 'Uttak.OpplysningerOmKlage',
  [aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_FORDELING_AV_STØNADSPERIODEN]:
    'Uttak.OpplysningerOmFordelingStonadsperiode',
  [aksjonspunktCodes.KONTROLLER_TILSTØTENDE_YTELSER_INNVILGET]: 'Uttak.OpplysningerOmTilstotendeYtelser.Innvilget',
  [aksjonspunktCodes.KONTROLLER_TILSTØTENDE_YTELSER_OPPHØRT]: 'Uttak.OpplysningerOmTilstotendeYtelser.Opphort',
  [aksjonspunktCodes.TILKNYTTET_STORTINGET]: 'Uttak.TilknyttetStortinget',
  [aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS]: 'Beregning.BeregningsgrunnlagManueltATFL',
  [aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE]:
    'Beregning.VurderVarigEndring',
  [aksjonspunktCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE]:
    'Beregning.BeregningsgrunnlagManueltSN',
  [aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD]:
    'Beregning.BeregningsgrunnlagManueltTidsbegrenset',
  [aksjonspunktCodes.AVKLAR_BEREGNINGSGRUNNLAG_OG_INNTEKTSKATEGORI_FOR_BRUKER_MED_TILSTOTENDE_YTELSE]:
    'Beregning.BeregningsgrunnlagOgInntektskategoriTY',
  [aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET]:
    'Beregning.BeregningsgrunnlagManueltSNNYIArbeidslivet',
  [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: 'Beregning.VurderFaktaATFLSN',
  [aksjonspunktCodes.FORESLA_VEDTAK]: 'Vedtak.Fritekstbrev',
  [aksjonspunktCodes.AVKLAR_FØRSTE_UTTAKSDATO]: 'UttakInfoPanel.FaktaUttak.ForsteUttakDato',
  [aksjonspunktCodes.AVKLAR_ANNEN_FORELDER_RETT]: 'UttakInfoPanel.FaktaUttak.VurderAnnenForelder',
};

const scrollUp = () => {
  if (window.innerWidth < 1305) {
    window.scroll(0, 0);
  }
  return false;
};

const formaterAksjonspunkt = (aksjonspunkt, intl) => {
  const aksjonspktText = aksjonspunktCodesToTextCode[aksjonspunkt.aksjonspunktKode];
  const { formatMessage } = intl;

  if (aksjonspunkt.godkjent) {
    return (
      <Normaltekst>
        {aksjonspktText && `${formatMessage({ id: aksjonspktText })} ${formatMessage({ id: 'Totrinnskontroll.godkjent' })}`}
        {!aksjonspktText && formatMessage({ id: 'Totrinnskontroll.godkjentKomplett' })}
      </Normaltekst>
    );
  }
  return (
    <span>
      <Element>
        {aksjonspktText && `${formatMessage({ id: aksjonspktText })} ${formatMessage({ id: 'Totrinnskontroll.ikkeGodkjent' })}`}
        {!aksjonspktText && formatMessage({ id: 'Totrinnskontroll.ikkeGodkjentKomplett' })}
      </Element>
      <Normaltekst>{aksjonspunkt.aksjonspunktBegrunnelse}</Normaltekst>
    </span>
  );
};

const HistorikkMalType3 = ({
  historikkinnslagDeler,
  behandlingLocation,
  intl,
  getKodeverknavn,
}) => (
  <div>
    {historikkinnslagDeler && historikkinnslagDeler.map((historikkinnslagDel, index) => (
      <div key={`totrinnsvurdering${index + 1}`}>
        {historikkinnslagDel.hendelse && (
          <div>
            <Element>{findHendelseText(historikkinnslagDel.hendelse, getKodeverknavn)}</Element>
            <VerticalSpacer fourPx />
          </div>
        )}
        {historikkinnslagDel.skjermlenke
           ? (
             <Element>
               <NavLink
                 to={createLocationForHistorikkItems(behandlingLocation, historikkinnslagDel.skjermlenke.kode)}
                 onClick={scrollUp}
               >
                 {getKodeverknavn(historikkinnslagDel.skjermlenke)}
               </NavLink>
             </Element>
           )
           : null
        }
        {historikkinnslagDel.aksjonspunkter && historikkinnslagDel.aksjonspunkter.map(aksjonspunkt => (
          <div key={aksjonspunkt.aksjonspunktKode}>
            {formaterAksjonspunkt(aksjonspunkt, intl)}
            <VerticalSpacer fourPx />
          </div>
        ))}
      </div>
    ))}
  </div>
 );

HistorikkMalType3.propTypes = {
  historikkinnslagDeler: PropTypes.arrayOf(historikkinnslagDelPropType).isRequired,
  behandlingLocation: PropTypes.shape().isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(injectKodeverk(getAlleKodeverk)(HistorikkMalType3));
