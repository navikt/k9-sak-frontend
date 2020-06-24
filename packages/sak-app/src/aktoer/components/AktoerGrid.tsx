import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Lenkepanel from 'nav-frontend-lenkepanel';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import VisittkortSakIndex from '@fpsak-frontend/sak-visittkort';
import { Kodeverk, KodeverkMedNavn, Fagsak, FagsakPerson } from '@k9-sak-web/types';

import { getAlleFpSakKodeverk } from '../../kodeverk/duck';
import { pathToFagsak } from '../../app/paths';
import { getBehandlingSprak } from '../../behandling/duck';

import styles from './aktoerGrid.less';

interface OwnProps {
  data: {
    fagsaker: Fagsak[];
    person: FagsakPerson;
  };
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  sprakkode?: Kodeverk;
}

export const AktoerGrid: FunctionComponent<OwnProps> = ({ data, alleKodeverk, sprakkode }) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  return (
    <>
      <VisittkortSakIndex
        alleKodeverk={alleKodeverk}
        sprakkode={sprakkode}
        fagsak={
          {
            person: data.person,
          } as Fagsak
        }
      />
      <div className={styles.list}>
        {data.fagsaker.length ? (
          data.fagsaker.map(fagsak => (
            <Lenkepanel
              linkCreator={props => (
                <Link to={pathToFagsak(fagsak.saksnummer)} className={props.className}>
                  {props.children}
                </Link>
              )}
              key={fagsak.saksnummer}
              href="#"
              tittelProps="normaltekst"
            >
              {getKodeverknavn(fagsak.sakstype)}
              {` (${fagsak.saksnummer}) `}
              {getKodeverknavn(fagsak.status)}
            </Lenkepanel>
          ))
        ) : (
          <FormattedMessage id="AktoerGrid.IngenFagsaker" />
        )}
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  alleKodeverk: getAlleFpSakKodeverk(state),
  sprakkode: getBehandlingSprak(state),
});

export default connect(mapStateToProps)(AktoerGrid);
