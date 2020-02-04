import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import classNames from 'classnames';

import { DateLabel, VerticalSpacer } from '@fpsak-frontend/shared-components';

/* TODO Ta i bruk fpsakApi - Flytt url ut av komponent */
const DOCUMENT_SERVER_URL = '/k9/sak/api/vedtak/hent-vedtaksdokument';
const getLink = document => `${DOCUMENT_SERVER_URL}?behandlingId=${document.dokumentId}`;

/**
 * VedtakDocuments
 *
 * Presentasjonskomponent.
 */
class VedtakDocuments extends Component {
  constructor() {
    super();

    this.toggleDocuments = this.toggleDocuments.bind(this);
    this.state = {
      showDocuments: false,
    };
  }

  toggleDocuments(evt) {
    this.setState(prevState => ({
      showDocuments: !prevState.showDocuments,
    }));
    evt.preventDefault();
  }

  render() {
    const { vedtaksdokumenter, behandlingTypes } = this.props;
    const { showDocuments } = this.state;
    return (
      <>
        <a href="" onClick={this.toggleDocuments} className="lenke lenke--frittstaende">
          <Normaltekst>
            <FormattedHTMLMessage
              id="DocumentListInnsyn.Vedtaksdokumentasjon"
              values={{ numberOfDocuments: vedtaksdokumenter.length }}
            />
            <i
              className={classNames(
                'nav-frontend-chevron chevronboks ',
                showDocuments ? 'chevron--ned' : 'chevron--opp',
              )}
            />
          </Normaltekst>
        </a>
        {showDocuments && (
          <>
            <VerticalSpacer fourPx />
            {vedtaksdokumenter.map(document => (
              <Row key={document.dokumentId}>
                <Column xs="2">
                  <DateLabel dateString={document.opprettetDato} />
                </Column>
                <Column xs="10">
                  <a
                    href={getLink(document)}
                    className="lenke lenke--frittstaende"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {behandlingTypes.find(bt => bt.kode === document.tittel).navn}
                  </a>
                </Column>
              </Row>
            ))}
          </>
        )}
      </>
    );
  }
}

VedtakDocuments.propTypes = {
  behandlingTypes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  vedtaksdokumenter: PropTypes.arrayOf(
    PropTypes.shape({
      dokumentId: PropTypes.string.isRequired,
      tittel: PropTypes.string.isRequired,
      opprettetDato: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};

export default VedtakDocuments;
