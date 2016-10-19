import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link } from 'react-router-async';
import createHistory from 'history/createBrowserHistory';

const history = createHistory({
    basename: '/simple'
});

const Home = () => <div>Home, go to <Link to="/test">test</Link></div>
const Test = () => <div>Test, go to <Link to="/">home</Link></div>

const routes = [
    <Route path="/" action={() => Home} />,
    <Route path="/test" action={() => Test} />
];

const hooks = [
    {
        start: () => console.log('start hook'),
        match: () => console.log('match hook'),
        resolve: () => console.log('resolve hook'),
        render: () => console.log('render hook')
    }
];

const mountNode = document.getElementById('app');
Router.init({ path: history.location.pathname, routes, hooks }).then(({ Router, Component, router, callback }) => {
    ReactDOM.render(<Router {...{ Component, router, history }} />, mountNode, callback);
}).catch(error => console.log('Router.init', error));
