import hide from '@fpsak-frontend/assets/images/hide.svg';
import show from '@fpsak-frontend/assets/images/show.svg';
import { Image, Table, TableRow } from '@fpsak-frontend/shared-components/index';
import { calcDays, convertHoursToDays, utledArbeidsforholdNavn } from '@fpsak-frontend/utils';
import {
  ArbeidsforholdV2,
  ArbeidsgiverOpplysningerPerId,
  KodeverkMedNavn,
  Utfalltype,
  Uttaksperiode,
  Vilkår,
  VilkårEnum,
} from '@k9-sak-web/types';
import NavFrontendChevron from 'nav-frontend-chevron';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import Panel from 'nav-frontend-paneler';
import Tabs from 'nav-frontend-tabs';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import React, { FunctionComponent, ReactNode, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { FraværÅrsakEnum } from '@k9-sak-web/types/src/omsorgspenger/Uttaksperiode';
import stjerneImg from '@fpsak-frontend/assets/images/stjerne.svg';
import styles from './aktivitetTabell.less';
import NøkkeltallContainer, { Nokkeltalltype } from './nokkeltall/NokkeltallContainer';
import Utfall from './Utfall';
import { durationTilTimerMed7ogEnHalvTimesDagsbasis, formatDate, periodeErIKoronaperioden } from './utils';

interface AktivitetTabellProps {
  arbeidsforhold?: ArbeidsforholdV2;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  arbeidsforholdtypeKode: string;
  uttaksperioder: Uttaksperiode[];
  aktivitetsstatuser: KodeverkMedNavn[];
  gjeldandeBehandling: boolean;
}

const periodevisning = (periode: string): string => {
  const [fom, tom] = periode.split('/');
  return `${formatDate(fom)} - ${formatDate(tom)}`;
};

const antallDager = (periode: string): string => {
  const [fom, tom] = periode.split('/');
  return calcDays(fom, tom, false);
};

const dagerOgTimer = (duration?: string) => {
  if (duration) {
    const timer = durationTilTimerMed7ogEnHalvTimesDagsbasis(duration);
    return convertHoursToDays(timer);
  }
  return { days: 0, hours: 0 };
};

const formaterFravær = (periode: string, delvisFravær?: string): ReactNode => {
  if (delvisFravær) {
    const { days, hours } = dagerOgTimer(delvisFravær);
    if (days > 0) {
      return <FormattedMessage id="Uttaksplan.DelvisFraværMedDager" values={{ dager: days, timer: hours }} />;
    }
    return <FormattedMessage id="Uttaksplan.DelvisFravær" values={{ timer: hours }} />;
  }
  const dager = antallDager(periode);
  return <FormattedMessage id="Uttaksplan.FulltFravær" values={{ dager }} />;
};

const formaterFraværsårsak = (fraværsårsak: string): ReactNode => {
  switch (fraværsårsak) {
    case FraværÅrsakEnum.ORDINÆRT_FRAVÆR:
      return <FormattedMessage id="Uttaksplan.Årsak.ORDINÆRT_FRAVÆR" />;
    case FraværÅrsakEnum.STENGT_SKOLE_ELLER_BARNEHAGE:
      return <FormattedMessage id="Uttaksplan.Årsak.STENGT_SKOLE_ELLER_BARNEHAGE" />;
    case FraværÅrsakEnum.SMITTEVERNHENSYN:
      return <FormattedMessage id="Uttaksplan.Årsak.SMITTEVERNHENSYN" />;
    default:
      return null;
  }
};

const utfallErIngenUtbetaling = (delvisFravær: string) => {
  if (delvisFravær) {
    const { days, hours } = dagerOgTimer(delvisFravær);

    if (days === 0 && hours === 0) {
      return true;
    }
  }
  return false;
};

const arbeidsforholdSist = (_, [vilkår2]: [Vilkår, Utfalltype]): number =>
  vilkår2 === VilkårEnum.ARBEIDSFORHOLD ? -1 : 0;

const AktivitetTabell: FunctionComponent<AktivitetTabellProps> = ({
  arbeidsforhold,
  arbeidsgiverOpplysningerPerId,
  arbeidsforholdtypeKode,
  uttaksperioder,
  aktivitetsstatuser,
  gjeldandeBehandling,
}) => {
  const [valgtPeriodeIndex, velgPeriodeIndex] = useState<number>();
  const [valgteDetaljfaner, velgDetaljfaner] = useState<number[]>();
  const [listeApneNokkeltall, endreListeApneNokkeltall] = useState<Nokkeltalltype[][]>();

  const velgPeriode = (index: number) => {
    if (valgtPeriodeIndex === index) {
      velgPeriodeIndex(null);
    } else {
      velgPeriodeIndex(index);
    }
  };

  const velgDetaljfane = (faneindex: number) =>
    velgDetaljfaner(Object.assign([], valgteDetaljfaner, { [valgtPeriodeIndex]: faneindex }));

  const apneNokkeltall = listeApneNokkeltall?.[valgtPeriodeIndex];

  const viserAlleDetaljer = apneNokkeltall && Object.values(apneNokkeltall).length === 4;

  const endreApneNokkeltall = (nyeApneNokkeltall: Nokkeltalltype[]) =>
    endreListeApneNokkeltall(Object.assign([], listeApneNokkeltall, { [valgtPeriodeIndex]: nyeApneNokkeltall }));

  const visEllerSkjulAlleNokkeltalldetaljer = () =>
    endreApneNokkeltall(
      viserAlleDetaljer
        ? []
        : [
            Nokkeltalltype.DAGER_SOKER_HAR_RETT_PA,
            Nokkeltalltype.DAGER_NAV_KAN_UTBETALE,
            Nokkeltalltype.FORBRUKTE_DAGER,
            Nokkeltalltype.RESTDAGER,
          ],
    );

  const visEllerSkjulNokkeltalldetaljer = (nokkeltalltype: Nokkeltalltype) => {
    if (apneNokkeltall?.includes(nokkeltalltype)) {
      endreApneNokkeltall(apneNokkeltall.filter(type => type !== nokkeltalltype));
    } else {
      endreApneNokkeltall(apneNokkeltall ? apneNokkeltall.concat([nokkeltalltype]) : [nokkeltalltype]);
    }
  };

  const arbeidsforholdType: string =
    aktivitetsstatuser.find(aktivitetsstatus => aktivitetsstatus.kode === arbeidsforholdtypeKode)?.navn ||
    arbeidsforholdtypeKode;

  const beskrivelse = arbeidsforhold
    ? `${arbeidsforholdType}, ${utledArbeidsforholdNavn(arbeidsforhold, arbeidsgiverOpplysningerPerId)}`
    : arbeidsforholdType;

  const skalÅrsakVises =
    uttaksperioder.find(periode => periode.fraværÅrsak !== FraværÅrsakEnum.UDEFINERT) !== undefined;

  const antallKolonner = skalÅrsakVises ? 6 : 5;

  enum Fanenavn {
    VILKAR,
    HJEMMEL,
    NOKKELTALL,
  }

  return (
    <Panel border className={styles.aktivitetTabell}>
      <div className={styles.header}>
        <Element>{beskrivelse}</Element>
        {gjeldandeBehandling && (
          <Image
            className={styles.starImage}
            src={stjerneImg}
            tooltip={<FormattedMessage id="Uttaksplan.GjeldendeBehandling" />}
            alignTooltipLeft
          />
        )}
      </div>
      <Table
        suppliedHeaders={
          <>
            <th>
              <FormattedMessage id="Uttaksplan.Periode" />
            </th>
            <th>
              <FormattedMessage id="Uttaksplan.Utfall" />
            </th>
            <th>
              <FormattedMessage id="Uttaksplan.Fravær" />
            </th>
            {skalÅrsakVises && (
              <th>
                <FormattedMessage id="Uttaksplan.Årsak" />
              </th>
            )}
            <th>
              <FormattedMessage id="Uttaksplan.Utbetalingsgrad" />
            </th>
            <th />
          </>
        }
        noHover
        withoutTbody
        notFocusableHeader
      >
        {uttaksperioder.map(
          (
            { periode, delvisFravær, utfall, utbetalingsgrad, vurderteVilkår, hjemler, nøkkeltall, fraværÅrsak },
            index,
          ) => {
            const erValgt = valgtPeriodeIndex === index;
            const erKoronaperiode = useMemo(() => periodeErIKoronaperioden(periode), [periode]);
            const sorterteVilkår = useMemo(() => Object.entries(vurderteVilkår.vilkår).sort(arbeidsforholdSist), [
              vurderteVilkår.vilkår,
            ]);
            const utfallIngenUtbetaling = utfallErIngenUtbetaling(delvisFravær);
            const ar = periode.match(/^\d{4}/)[0];

            const visVilkarHjemlerEllerNokkeltall = faneindex => {
              switch (faneindex) {
                case Fanenavn.HJEMMEL:
                  return (
                    <td colSpan={antallKolonner}>
                      {hjemler.map(hjemmel => (
                        <div key={`${periode}--${hjemmel}`}>
                          <FormattedMessage id={`Uttaksplan.Hjemmel.${hjemmel}`} />
                        </div>
                      ))}
                    </td>
                  );

                case Fanenavn.NOKKELTALL:
                  return (
                    <td colSpan={antallKolonner}>
                      <NøkkeltallContainer
                        totaltAntallDager={nøkkeltall.totaltAntallDager}
                        antallDagerArbeidsgiverDekker={nøkkeltall.antallDagerArbeidsgiverDekker}
                        antallDagerInfotrygd={nøkkeltall.antallDagerInfotrygd}
                        antallKoronadager={nøkkeltall.antallKoronadager}
                        forbrukteDager={nøkkeltall.antallForbrukteDager}
                        forbruktTid={nøkkeltall.forbruktTid}
                        restTid={nøkkeltall.restTid}
                        smitteverndager={nøkkeltall.smittevernTid}
                        uttaksperioder={[]}
                        benyttetRammemelding
                        apneNokkeltall={apneNokkeltall}
                        visEllerSkjulNokkeltalldetaljer={visEllerSkjulNokkeltalldetaljer}
                        migrertData={nøkkeltall.migrertData}
                        ar={ar}
                      />
                    </td>
                  );

                default:
                  return (
                    <>
                      <td>
                        {sorterteVilkår.map(([vilkår, vilkårsutfall]) => (
                          <Normaltekst key={`${periode}--${vilkår}`}>
                            <FormattedMessage
                              id={
                                vilkår === VilkårEnum.ARBEIDSFORHOLD
                                  ? `Uttaksplan.Vilkår.${vilkår}_${vilkårsutfall}`
                                  : `Uttaksplan.Vilkår.${vilkår}`
                              }
                            />
                          </Normaltekst>
                        ))}
                      </td>
                      <td>
                        {sorterteVilkår.map(([key, vilkårsutfall]) => (
                          <Utfall utfall={vilkårsutfall} key={`${periode}--${key}.${vilkårsutfall}`} />
                        ))}
                      </td>
                      <td colSpan={antallKolonner - 2} />
                    </>
                  );
              }
            };

            const faner = ['Uttaksplan.Vilkår', 'Uttaksplan.Hjemler'];
            if (nøkkeltall) {
              faner.push(nøkkeltall.migrertData ? 'Uttaksplan.Nokkeltall.Migrert' : 'Uttaksplan.Nokkeltall');
            }

            return (
              <tbody key={periode} className={erKoronaperiode ? styles.koronaperiode : undefined}>
                <TableRow notFocusable>
                  <td>
                    <Normaltekst>{periodevisning(periode)}</Normaltekst>
                  </td>
                  <td>
                    <Utfall
                      utfall={utfall}
                      textId={utfallIngenUtbetaling ? 'Uttaksplan.Utfall.IngenUtbetaling' : undefined}
                    />
                  </td>
                  <td>{formaterFravær(periode, delvisFravær)}</td>
                  {skalÅrsakVises && <td>{formaterFraværsårsak(fraværÅrsak)}</td>}
                  <td>{`${utbetalingsgrad}%`}</td>
                  <td>
                    <button className={styles.utvidelsesknapp} onClick={() => velgPeriode(index)} type="button">
                      <NavFrontendChevron type={erValgt ? 'opp' : 'ned'} />
                    </button>
                  </td>
                </TableRow>
                {erValgt && (
                  <>
                    <TableRow className={styles.fanerad} notFocusable>
                      <td colSpan={antallKolonner}>
                        <div className={styles.fanewrapper}>
                          <Tabs
                            tabs={faner.map(id => ({ label: <FormattedMessage id={id} /> }))}
                            onChange={(e, i) => velgDetaljfane(i)}
                            kompakt
                            defaultAktiv={valgteDetaljfaner?.[index]}
                          />
                          {!nøkkeltall && (
                            <>
                              {/* Nav-frontend-tabs støtter ikke deaktiverte faner */}
                              <div className={styles.deaktivertFane}>
                                <FormattedMessage id="Uttaksplan.Nokkeltall" />
                              </div>
                              <Hjelpetekst>
                                <FormattedMessage id="Nøkkeltall.Deaktivert" />
                              </Hjelpetekst>
                            </>
                          )}
                          {valgteDetaljfaner?.[valgtPeriodeIndex] === Fanenavn.NOKKELTALL && (
                            <button
                              className={styles.knappForAlleUtregninger}
                              onClick={visEllerSkjulAlleNokkeltalldetaljer}
                              type="button"
                            >
                              <FormattedMessage
                                id={viserAlleDetaljer ? 'Nøkkeltall.SkjulUtregninger' : 'Nøkkeltall.VisUtregninger'}
                              />
                              <Image src={viserAlleDetaljer ? hide : show} />
                            </button>
                          )}
                        </div>
                      </td>
                    </TableRow>
                    <TableRow
                      className={classNames(styles.innholdsrad, !valgteDetaljfaner?.[index] && styles.vilkar)}
                      notFocusable
                    >
                      {visVilkarHjemlerEllerNokkeltall(valgteDetaljfaner?.[index])}
                    </TableRow>
                  </>
                )}
              </tbody>
            );
          },
        )}
      </Table>
    </Panel>
  );
};

export default AktivitetTabell;
