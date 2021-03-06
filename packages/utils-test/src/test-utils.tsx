import React, { FC, ReactElement } from 'react';
import { render as rtlRender } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import { reducer } from 'redux-form';

import defaultMessages from '../../../public/sprak/nb_NO.json';

export { default as messages } from '../../../public/sprak/nb_NO.json';

export function renderWithIntl(ui: ReactElement, { locale, messages, ...renderOptions }: any = {}) {
  const Wrapper: FC = ({ children }) => (
    <IntlProvider locale={locale || 'nb-NO'} messages={messages || defaultMessages}>
      {children}
    </IntlProvider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export function renderWithReduxForm(ui: ReactElement, { ...renderOptions } = {}) {
  const Wrapper: FC = ({ children }) => (
    <Provider store={createStore(combineReducers({ form: reducer }))}>{children}</Provider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export function renderWithIntlAndReduxForm(ui: ReactElement, { locale, messages, ...renderOptions }: any = {}) {
  const Wrapper: FC = ({ children }) => (
    <Provider store={createStore(combineReducers({ form: reducer }))}>
      <IntlProvider locale={locale || 'nb-NO'} messages={messages || defaultMessages}>
        {children}
      </IntlProvider>
    </Provider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from '@testing-library/react';
