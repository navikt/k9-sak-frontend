import sinon from 'sinon';

import asyncPollingStatus from './asyncPollingStatus';
import RequestProcess from './RequestProcess';
import NotificationMapper from './NotificationMapper';

class NotificationHelper {
  mapper: NotificationMapper;

  requestStartedCallback = sinon.spy();

  requestFinishedCallback = sinon.spy();

  requestErrorCallback = sinon.spy();

  statusRequestStartedCallback = sinon.spy();

  statusRequestFinishedCallback = sinon.spy();

  updatePollingMessageCallback = sinon.spy();

  addPollingTimeoutEventHandler = sinon.spy();

  constructor() {
    const mapper = new NotificationMapper();
    mapper.addRequestStartedEventHandler(this.requestStartedCallback);
    mapper.addRequestFinishedEventHandler(this.requestFinishedCallback);
    mapper.addRequestErrorEventHandler(this.requestErrorCallback);
    mapper.addStatusRequestStartedEventHandler(this.statusRequestStartedCallback);
    mapper.addStatusRequestFinishedEventHandler(this.statusRequestFinishedCallback);
    mapper.addUpdatePollingMessageEventHandler(this.updatePollingMessageCallback);
    mapper.addPollingTimeoutEventHandler(this.addPollingTimeoutEventHandler);
    this.mapper = mapper;
  }
}

const httpClientGeneralMock = {
  get: () => undefined,
  post: () => undefined,
  put: () => undefined,
  getBlob: () => undefined,
  postBlob: () => undefined,
  postAndOpenBlob: () => undefined,
  getAsync: () => undefined,
  postAsync: () => undefined,
  putAsync: () => undefined,
};

describe('RequestProcess', () => {
  const HTTP_ACCEPTED = 202;
  const defaultConfig = {
    maxPollingLimit: undefined,
  };

  it('skal hente data via get-kall', async () => {
    const response = {
      data: 'data',
      status: 200,
      headers: {
        location: '',
      },
    };
    const httpClientMock = {
      ...httpClientGeneralMock,
      get: () => Promise.resolve(response),
    };

    const process = new RequestProcess(httpClientMock, httpClientMock.get, 'behandling', defaultConfig);
    const notificationHelper = new NotificationHelper();
    process.setNotificationEmitter(notificationHelper.mapper.getNotificationEmitter());
    const params = {
      behandlingId: 1,
    };

    const result = await process.run(params);

    expect(result).toStrictEqual({ payload: 'data' });
    expect(notificationHelper.requestStartedCallback.calledOnce).toBe(true);
    expect(notificationHelper.requestFinishedCallback.calledOnce).toBe(true);
    expect(notificationHelper.requestFinishedCallback.getCalls()[0].args[0]).toBe('data');
    expect(notificationHelper.requestErrorCallback.called).toBe(false);
  });

  it('skal utføre long-polling request som når maks polling-forsøk', async () => {
    const response = {
      data: 'data',
      status: 200,
      headers: {
        location: '',
      },
    };

    const allGetResults = [
      {
        ...response,
        data: {
          status: asyncPollingStatus.PENDING,
          message: 'Polling continues',
          pollIntervalMillis: 0,
        },
      },
      {
        ...response,
        data: {
          status: asyncPollingStatus.PENDING,
          message: 'Polling continues',
          pollIntervalMillis: 0,
        },
      },
    ];

    const httpClientMock = {
      ...httpClientGeneralMock,
      getAsync: () =>
        Promise.resolve({
          ...response,
          status: HTTP_ACCEPTED,
          headers: {
            location: 'http://polling.url',
          },
        }),
      get: () => Promise.resolve(allGetResults.shift()),
    };

    const params = {
      behandlingId: 1,
    };

    const config = {
      ...defaultConfig,
      maxPollingLimit: 1, // Vil nå taket etter første førsøk
    };

    const process = new RequestProcess(httpClientMock, httpClientMock.getAsync, 'behandling', config);
    const notificationHelper = new NotificationHelper();
    process.setNotificationEmitter(notificationHelper.mapper.getNotificationEmitter());

    await expect(process.run(params)).rejects.toMatchObject({
      message: 'Maximum polling attempts exceeded',
    });

    expect(notificationHelper.requestStartedCallback.calledOnce).toBe(true);
    expect(notificationHelper.statusRequestStartedCallback.calledOnce).toBe(true);
    expect(notificationHelper.statusRequestFinishedCallback.calledOnce).toBe(true);
    expect(notificationHelper.updatePollingMessageCallback.calledOnce).toBe(true);
    expect(notificationHelper.updatePollingMessageCallback.getCalls()[0].args[0]).toBe('Polling continues');
  });

  it('skal utføre long-polling request som en så avbryter manuelt', async () => {
    const response = {
      data: 'data',
      status: 200,
      headers: {
        location: '',
      },
    };

    const httpClientMock = {
      ...httpClientGeneralMock,
      getAsync: () =>
        Promise.resolve({
          ...response,
          status: HTTP_ACCEPTED,
          headers: {
            location: 'test',
          },
        }),
      get: () =>
        Promise.resolve({
          ...response,
          data: {
            status: asyncPollingStatus.PENDING,
            message: 'Polling continues',
            pollIntervalMillis: 0,
          },
        }),
    };

    const params = {
      behandlingId: 1,
    };

    const process = new RequestProcess(httpClientMock, httpClientMock.getAsync, 'behandling', defaultConfig);
    const mapper = new NotificationMapper();
    // Etter en runde med polling vil en stoppe prosessen via event
    mapper.addUpdatePollingMessageEventHandler(() => {
      process.cancel();
      return Promise.resolve('');
    });
    process.setNotificationEmitter(mapper.getNotificationEmitter());

    const resResponse = await process.run(params);

    expect(resResponse).toStrictEqual({ payload: 'INTERNAL_CANCELLATION' });
  });

  it('skal hente data med nullverdi', async () => {
    const response = {
      data: null,
      status: 200,
      headers: {
        location: '',
      },
    };

    const httpClientMock = {
      ...httpClientGeneralMock,
      get: () => Promise.resolve(response),
    };

    const process = new RequestProcess(httpClientMock, httpClientMock.get, 'behandling', defaultConfig);
    const notificationHelper = new NotificationHelper();
    process.setNotificationEmitter(notificationHelper.mapper.getNotificationEmitter());
    const params = {
      behandlingId: 1,
    };

    const result = await process.run(params);

    expect(result).toStrictEqual({ payload: undefined });
    // eslint-disable-next-line no-unused-expressions
    expect(notificationHelper.requestFinishedCallback.getCalls()[0].args[0]).toBe(null);
  });
});