import React, { Component } from 'react';
import { RootRoute, Route, Middleware, Redirect, Link, RouterError } from 'react-router-async';
import { hookFetcher, fetcher } from 'hook-fetcher';
import fetch from 'isomorphic-fetch';

class Home extends Component {
    componentDidMount() {
        localStorage.setItem('access', false);
    }
    changeAccess(e) {
        localStorage.setItem('access', e.target.checked);
    }
    render() {
        return (
            <div>
                <p>Home. Here some links for you:</p>
                <p>Grant access <input type="checkbox" onChange={this.changeAccess} defaultChecked={false} /></p>
                <ul>
                    <li><Link to="/test">Test</Link></li>
                    <li><Link to="/param/123">With param 123</Link></li>
                    <li><Link to="/poteryashka">Broken (Not Found)</Link></li>
                    <li><Link to="/redirect">Redirect</Link></li>
                    <li><Link to="/users">GitHub Users (deffered)</Link></li>
                    <li><Link to="/users/2342342342342342134231421342134">Broken from api (Not Found)</Link></li>
                    <li><Link to="/secret">Secret with access rights</Link></li>
                </ul>
            </div>
        )
    }
}

const  Test = () => (
    <div>Test, go to <Link to="/">home</Link></div>
);

const Param = props => (
    <div>{`Route with param: ${props.router.params.id}`}</div>
);

export const NotFound = props => (
    <div>Error Component</div>
);

export class Error extends Component {
    render () {
        return <div>Error Component: {this.props.router.error.message}</div>
    }
}

@fetcher([
    {
        promise: () => get (`https://api.github.com/users`),
        deferred: true,
        data: {
            key: 'users',
            value: []
        }
    }
])
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

const User = ({ data }) => (
    <div>{`Welcome to ${data.user.login} user!`}</div>
);
const UserWithFetcher = fetcher([
    {
        promise: ({ params }) => get(`https://api.github.com/users/${params.login}`),
        critical: true,
        data: {
            key: 'user',
            value: {}
        }
    }
])(User);

const Secret = () => <div>You get access to secret</div>;

function get(url) {
    return fetch(url).then(response => {
        if (response.status >= 400) {
            throw new RouterError('Bad response from server', response.status);
        }
        return response.json();
    });
}

export const routes = (
    <RootRoute>
        <Route path="/" action={() => Home} />
        <Route path="/test" action={() => Test} />
        <Route path="/param/:id" action={() => Param} />
        <Redirect path="/redirect" to="/redirect-next" />
        <Redirect path="/redirect-next" to="/param/123" />
        <Route path="/users" action={() => Users} />
        <Route path="/users/:login" action={() => UserWithFetcher} />
        <Middleware path="/secret" action={async (next, options) => {
            if (localStorage.getItem('access') === 'false') {
                throw new RouterError('Access Forbidden', 403);
            }
            const result = await next(options);
            console.log('middleware end');
            return result;
        }}>
            <Route path="/" action={() => Secret} />
        </Middleware>
        {/*<Route path="*" status={404} action={() => NotFound} />*/}
    </RootRoute>
);

export const hooks = [
    hookFetcher()
];