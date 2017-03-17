import React, { Component, PropTypes } from 'react';
import { RootRoute, Route, Redirect, Link, RouterError, DynamicRedirect } from 'react-router-async';
import fetch from 'isomorphic-fetch';
import { createStore as _createStore, combineReducers, applyMiddleware } from 'redux';
import { reducer as routerReducer } from 'hook-redux';
import { connect } from 'react-redux';
import thunk from 'redux-thunk';
import style from './style.pcss';

class Home extends Component {
    static contextTypes = {
        router: React.PropTypes.object
    };
    goTo = e => {
        this.context.router.push({
            pathname: '/query',
            query: {
                string: 456
            }
        });
    };
    render() {
        return (
            <div>
                <p>Home. Here some links for you:</p>
                <ul>
                    <li><Link to="/test">Test</Link></li>
                    <li><Link to="/param/123">With param 123</Link></li>
                    <li><Link to="/query?string=456">With query string=456</Link></li>
                    <li onClick={this.goTo}>PUSH ME</li>
                    <li><Link to="#" onClick={e => {
                        e.preventDefault();
                        console.log('custom handler');
                    }}>Link custom handler</Link></li>
                    <li><Link to="/poteryashka">Broken (Not Found)</Link></li>
                    <li><Link to="/redirect">Redirect</Link></li>
                    <li><Link to="/redirect-dynamic">Redirect Dynamic</Link></li>
                    <li><Link to="/users">GitHub Users (deffered)</Link></li>
                    <li><Link to="/users/2342342342342342134231421342134">Broken from api (Not Found)</Link></li>
                    <li><Link to="/delayed-action-test">Delayed Test</Link></li>
                    <li><Link to="/delayed-middleware-test">Delayed Test</Link></li>
                </ul>
            </div>
        );
    }
}

const Test = () => (
    <div>Test, go to <Link to="/" activeClassName="active" activeOnlyWhenExact={true}>home</Link>. Show me <Link to="/test" activeClassName="active">active link</Link></div>
);

const Param = props => (
    <div>{`Route with param: ${props.router.params.id}`}</div>
);

const Query = props => (
    <div>
        {`Route with query: ${props.router.location.search}`}
    </div>
);

class Error extends Component {
    render () {
        return <div>Error Component: {this.props.router.error.message}</div>
    }
}
export const errors = {
    404: Error
};

export class Wrapper extends Component {
    render() {
        return (
            <div>
                <h1>Menu</h1>
                <ul>
                    <li><Link to="/" activeClassName="active" activeOnlyWhenExact={true}>home</Link></li>
                    <li><Link to="/test" activeClassName="active" activeOnlyWhenExact={true}>test</Link></li>
                </ul>
                {this.props.children}
            </div>
        )
    }
}

@connect(state => ({
    data: state.data
}))
class Users extends Component {
    render() {
        return (
            <div>
                Welcome to users list!
                <ul>
                    {this.props.data.users.map(({ login }) => (
                        <li key={login}>
                            <Link to={`/users/${login}`}>{login}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

@connect(state => ({
    data: state.data
}))
class User extends Component {
    render() {
        return (
            <div>{`Welcome to ${this.props.data.user && this.props.data.user.login} user!`}</div>
        )
    }
}

function requestUsers() {
    return dispatch => {
        dispatch({type: 'REQUEST_USERS'});
        return get(`https://api.github.com/users`)
            .then(result => {
                dispatch({type: 'REQUEST_USERS_SUCCESS', payload: result});
            })
            .catch(error => {
                dispatch({type: 'REQUEST_USERS_ERROR', payload: error});
                throw error;
            })
    }
}
function requestUser(params) {
    return dispatch => {
        dispatch({type: 'REQUEST_USER'});
        return get(`https://api.github.com/users/${params.login}`)
            .then(result => {
                dispatch({type: 'REQUEST_USER_SUCCESS', payload: result});
            })
            .catch(error => {
                dispatch({type: 'REQUEST_USER_ERROR', payload: error});
                throw error;
            })
    }
}

function get(url) {
    return fetch(url).then(response => {
        if (response.status >= 400) {
            throw new RouterError('Bad response from server', response.status);
        }
        return response.json();
    });
}

export const reducers = combineReducers({
    router: routerReducer,
    data: (state = { users: [], user: null }, action) => {
        switch (action.type) {
            case 'REQUEST_USER_SUCCESS':
                return {
                    ...state,
                    user: action.payload
                };
            case 'REQUEST_USERS_SUCCESS':
                return {
                    ...state,
                    users: action.payload
                };
            default:
                return state;
        }
    }
});

export const createStore = data => {
    const middleware = [thunk];
    if (__CLIENT__ && __DEVELOPMENT__) {
        const createLogger = require('redux-logger');
        const logger = createLogger({
            duration: true
        });
        middleware.push(logger);
    }
    let createStoreWithMiddleware = applyMiddleware(...middleware)(_createStore);
    return createStoreWithMiddleware(reducers, data);
};

export const routes = (
    <RootRoute>
        <Route path="/" action={() => Home} />
        <Route path="/test" action={() => Test} />
        <Route path="/param/:id" action={() => Param} />
        <Route path="/query" action={() => Query} />
        <Redirect path="/redirect" to="/redirect-next" />
        <Redirect path="/redirect-next" to="/param/123" />
        <Route path="/redirect-dynamic" action={() => new DynamicRedirect('/param/123')} />
        <Route path="/users" fetcher={[
            {
                promise: ({ helpers: { dispatch } }) => dispatch(requestUsers()),
                deferred: true
            }
        ]} action={() => Users} />
        <Route path="/users/:login" fetcher={[
            {
                promise: ({ params, helpers: { dispatch } }) => dispatch(requestUser(params)),
                critical: true
            }
        ]} action={() => User} />
        <Route path="/delayed-action-test" action={async () => {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return Test;
        }} />
        <Route path="/delayed-middleware-test" action={() => Test} />
    </RootRoute>
);

export const hooks = [
    /*{
        start: () => console.log('start'),
        match: () => console.log('match'),
        resolve: () => console.log('resolve'),
        render: () => console.log('render'),
        error: () => console.log('error'),
        cancel: () => console.log('cancel')
    },*/
    {
        start: async ({ path }) => {
            if (path === '/delayed-middleware-test') await new Promise(resolve => setTimeout(resolve, 2000))
        }
    }
];