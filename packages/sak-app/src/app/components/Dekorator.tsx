import React, { FunctionComponent, useMemo } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

import EventType from '@fpsak-frontend/rest-api-old/src/requestApi/eventType';
import HeaderWithErrorPanel from '@fpsak-frontend/sak-dekorator';
import { RETTSKILDE_URL, SYSTEMRUTINE_URL } from '@k9-sak-web/konstanter';
import rettskildeneIkonUrl from '@fpsak-frontend/assets/images/rettskildene.svg';
import systemrutineIkonUrl from '@fpsak-frontend/assets/images/rutine.svg';
import { decodeHtmlEntity } from '@fpsak-frontend/utils';

import { getPathToFplos } from '../paths';

const lagFeilmeldinger = (intl, errorMessages, queryStrings) => {
  const resolvedErrorMessages = [];
  if (queryStrings.errorcode) {
    resolvedErrorMessages.push({ message: intl.formatMessage({ id: queryStrings.errorcode }) });
  }
  if (queryStrings.errormessage) {
    resolvedErrorMessages.push({ message: queryStrings.errormessage });
  }
  errorMessages.forEach(message => {
    let msg = {
      message: message.code ? intl.formatMessage({ id: message.code }, message.params) : message.text,
      additionalInfo: undefined,
    };
    if (message.params && message.params.errorDetails) {
      msg = {
        ...msg,
        additionalInfo: JSON.parse(decodeHtmlEntity(message.params.errorDetails)),
      };
    }
    resolvedErrorMessages.push(msg);
  });
  return resolvedErrorMessages;
};

interface OwnProps {
  queryStrings: {
    errorcode?: string;
    errormessage?: string;
  };
  navAnsattName: string;
  removeErrorMessage: () => void;
  showDetailedErrorMessages?: boolean;
  hideErrorMessages?: boolean;
  errorMessages?: {
    type: EventType;
    code?: string;
    params?: {
      errorDetails?: string;
    };
    text?: string;
  }[];
  setSiteHeight: (headerHeight: number) => void;
}

const Dekorator: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  errorMessages = [],
  navAnsattName,
  queryStrings,
  setSiteHeight,
  removeErrorMessage: removeErrorMsg,
  showDetailedErrorMessages = false,
  hideErrorMessages = false,
}) => {
  const resolvedErrorMessages = useMemo(() => lagFeilmeldinger(intl, errorMessages, queryStrings), [
    errorMessages,
    queryStrings,
  ]);

  const iconLinks = useMemo(
    () => [
      {
        url: RETTSKILDE_URL,
        icon: rettskildeneIkonUrl,
        text: intl.formatMessage({ id: 'Header.Rettskilde' }),
      },
      {
        url: SYSTEMRUTINE_URL,
        icon: systemrutineIkonUrl,
        text: intl.formatMessage({ id: 'Header.Systemrutine' }),
      },
    ],
    [],
  );

  return (
    <HeaderWithErrorPanel
      systemTittel={intl.formatMessage({ id: 'Header.Ytelse' })}
      iconLinks={iconLinks}
      queryStrings={queryStrings}
      navAnsattName={navAnsattName}
      removeErrorMessage={removeErrorMsg}
      showDetailedErrorMessages={showDetailedErrorMessages}
      errorMessages={hideErrorMessages ? [] : resolvedErrorMessages}
      setSiteHeight={setSiteHeight}
      getPathToFplos={getPathToFplos}
    />
  );
};

export default injectIntl(Dekorator);
