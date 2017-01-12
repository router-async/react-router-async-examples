import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Placeholder } from 'react-router-async';
import { routes, hooks, createStore, Wrapper, errors } from './common';
import createHistory from 'history/createBrowserHistory';
import { Provider } from 'react-redux';
import { hookRedux } from 'hook-redux';
import { hookFetcher } from 'hook-fetcher';

const store = createStore(window.__data);
const clientHooks = [
    ...hooks,
    hookFetcher({ helpers: { dispatch: store.dispatch }, noFirstFetch: true }),
    hookRedux({ dispatch: store.dispatch })
];
const history = createHistory({
    basename: '/universal'
});
const mountNode = document.getElementById('app');

BrowserRouter.init({ history, routes, hooks: clientHooks, errors }).then(({ Router, routerProps, Component, componentProps, callback }) => {
    ReactDOM.render((
        <Provider store={store} key="provider">
            <Router {...routerProps}>
                <Wrapper>
                    <Placeholder {...{ Component, componentProps }} />
                </Wrapper>
            </Router>
        </Provider>
    ), mountNode, callback);
}).catch(error => console.log('Router.init', error));