import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-async';
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
        router.setState({
            Component: Error,
            props: {
                error
            }
        })
    } else {
        console.error('Internal Error', error);
    }
};

const mountNode = document.getElementById('app');
const path = history.location.pathname;
Router.init({ path, routes, hooks: clientHooks, silent: true }).then(({ Router, Component, router, props, callback }) => {
    ReactDOM.render((
        <Provider store={store} key="provider">
            <Router {...{ Component, router, history, props, errorHandler }} />
        </Provider>
    ), mountNode, callback);
}).catch(error => console.log('Router.init', error));