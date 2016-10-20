import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-async';
import { routes, hooks, NotFound } from './common';
import createHistory from 'history/createBrowserHistory';

const history = createHistory({
    basename: '/universal'
});

const errorHandler = (error, router) => {
    console.log('Handle error', error, router);
    if (error.name === 'RouterError') {
        router.setState({
            Component: NotFound
        })
    } else {
        console.error('Internal Error', error);
    }
};
const mountNode = document.getElementById('app');
Router.init({ path: history.location.pathname, routes, hooks }).then(({ Router, Component, router, props, callback }) => {
    ReactDOM.render(<Router {...{ Component, router, history, props, errorHandler }} />, mountNode, callback);
}).catch(error => console.log('Router.init', error));