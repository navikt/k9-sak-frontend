import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { DataFetchPendingModal, requireProps } from '@fpsak-frontend/shared-components';
import { getRequestPollingMessage, trackRouteParam } from '@fpsak-frontend/fp-felles';

import { getSelectedAktoer, getSelectedAktoerId } from './aktoerSelectors';
import { setSelectedAktoerId } from './duck';
import AktoerGrid from './components/AktoerGrid';
import AktoerResolver from './AktoerResolver';

/**
 * AktoerIndex
 */
export const AktoerIndex = ({
  aktoerId, requestPendingMessage, selectedAktoer,
}) => (
  <>
    <AktoerResolver key={aktoerId}>
      {selectedAktoer.person ? <AktoerGrid data={selectedAktoer} /> : `Ugyldig aktoerId: ${aktoerId}`}
    </AktoerResolver>
    {requestPendingMessage && <DataFetchPendingModal pendingMessage={requestPendingMessage} />}
  </>
);

AktoerIndex.propTypes = {
  aktoerId: PropTypes.number.isRequired,
  requestPendingMessage: PropTypes.string,
  selectedAktoer: PropTypes.shape(),
};

AktoerIndex.defaultProps = {
  requestPendingMessage: undefined,
  selectedAktoer: undefined,
};

const mapStateToProps = (state) => ({
  aktoerId: getSelectedAktoerId(state),
  requestPendingMessage: getRequestPollingMessage(state),
  selectedAktoer: getSelectedAktoer(state),
});


export default trackRouteParam({
  paramName: 'aktoerId',
  parse: (aktoerIdFromUrl) => Number.parseInt(aktoerIdFromUrl, 10),
  paramPropType: PropTypes.number,
  storeParam: setSelectedAktoerId,
  getParamFromStore: getSelectedAktoerId,
})(connect(mapStateToProps)(requireProps(['aktoerId'])(AktoerIndex)));
