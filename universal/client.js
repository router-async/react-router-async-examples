import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Placeholder } from 'react-router-async';
import { routes, hooks, Error, createStore, Wrapper } from './common';
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
        router.replaceComponent(Error, { error });
    } else {
        console.error('Internal Error', error);
    }
};

const mountNode = document.getElementById('app');
const path = history.location.pathname;
// TODO: move silent to fetcher options, move all Router props to single props object(move history to init)
BrowserRouter.init({ path, routes, hooks: clientHooks, history, silent: true }).then(({ Router, routerProps, Component, componentProps, callback }) => {
    ReactDOM.render((
        <Provider store={store} key="provider">
            <Router {...{...routerProps, errorHandler}}>
                <Wrapper>
                    <Placeholder {...{ Component, componentProps }} />
                </Wrapper>
            </Router>
        </Provider>
    ), mountNode, callback);
}).catch(error => console.log('Router.init', error));