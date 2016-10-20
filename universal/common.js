import React from 'react';
import { RootRoute, Route, Middleware, Redirect, Link, RouterError } from 'react-router-async';
import hookFetcher from 'hook-fetcher';
import fetch from 'isomorphic-fetch';

const Home = () => (
    <div>
        <p>Home, sweet Home, here some links:</p>
        <ul>
            <li><Link to="/test">test</Link></li>
            <li><Link to="/param/123">param 123</Link></li>
            <li><Link to="/poteryashka">broken</Link></li>
            <li><Link to="/redirect">redirect</Link></li>
            <li><Link to="/users">middleware root</Link></li>
            <li><Link to="/users/2342342342342342134231421342134">broken from api</Link></li>
        </ul>
    </div>
);

const  Test = () => (
    <div>Test, go to <Link to="/">home</Link></div>
);

const Param = () => (
    <div>Route with param</div>
);

export const NotFound = () => (
    <div>Not Found Component</div>
);

const Users = props => (
    <div>
        Welcome to users list!
        <ul>
            {props.router.ctx.fetcher.data.users.map(({ login }) => (
                <li key={login}>
                    <Link to={`/users/${login}`}>{login}</Link>
                </li>
            ))}
        </ul>
    </div>
);

const User = props => (
    <div>{`Welcome to ${props.router.ctx.fetcher.data && props.router.ctx.fetcher.data.user ? props.router.ctx.fetcher.data.user.login : ':('} user!`}</div>
);

function get(url) {
    return fetch(url).then(response => {
        if (response.status >= 400) {
            throw new Error('Bad response from server');
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
        <Middleware path="/users" action={async ({ next }, options) => {
            {/*console.log('middleware start');*/}
            const result = await next(options);
            {/*console.log('middleware end');*/}
            return result;
        }}>
            <Route path="/" action={({ ctx }) => {
                ctx.fetcher.items.push({
                    promise: async () => {
                        const users = await get('https://api.github.com/users');
                        ctx.fetcher.data ? ctx.fetcher.data.users = users : ctx.fetcher.data = { users };
                    }
                });
                return Users;
            }} />
            <Route path=":login" action={({ ctx }) => {
                ctx.fetcher.items.push({
                    promise: async ({ params }) => {
                        try {
                            const user = await get(`https://api.github.com/users/${params.login}`);
                            ctx.fetcher.data ? ctx.fetcher.data.user = user : ctx.fetcher.data = { user };
                        } catch (error) {
                            throw error;
                        }
                    },
                    critical: true
                });
                return User;
            }} />
        </Middleware>
        <Route path="*" status={404} action={() => NotFound} />
    </RootRoute>
);

export const hooks = [
    hookFetcher()
];