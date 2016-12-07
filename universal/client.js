import React from 'react';
import ReactDOM from 'react-dom';
import { Router, PlaceHolder } from 'react-router-async';
import { routes, hooks, Error, createStore } from './common';
import createHistory from 'history/createBrowserHistory';
import { Provider } from 'react-redux';
import { hookRedux } from 'hook-redux';
import { hookFetcher } from 'hook-fetcher';

const store = createStore(window.__data);
const clientHooks = [
    ...hooks,
    hookFetcher({ helpers: { dispatch: store.dispatch } }),
    hookRedux({ dispatch: store.dispatch })
];

const history = createHistory({
    basename: '/universal'
});

const errorHandler = (error, router) => {
    console.log('ERROR HANDLER', error);
    if (error.name === 'RouterError') {
        router.changeComponent(Error, { error });
    } else {
        console.error('Internal Error', error);
    }
};

const mountNode = document.getElementById('app');
const path = history.location.pathname;
// TODO: move silent to fetcher options, move all Router props to single props object(move history to init)
Router.init({ path, routes, hooks: clientHooks, silent: true }).then(({ Router, Component, router, props, callback }) => {
    ReactDOM.render((
        <Provider store={store} key="provider">
            <Router {...{ router, history, errorHandler }}>
                <div>
                    <h1>Wrapper</h1>
                    <PlaceHolder {...{ Component, props }} />
                </div>
            </Router>
        </Provider>
    ), mountNode, callback);
}).catch(error => console.log('Router.init', error));