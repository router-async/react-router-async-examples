import React from 'react';
import { RootRoute, Route, Middleware, Redirect, Link } from 'react-router-async';

const Home = () => (
    <div>
        <p>Home, sweet Home, here some links:</p>
        <ul>
            <li><Link to="/test">test</Link></li>
            <li><Link to="/param/123">param 123</Link></li>
            <li><Link to="/poteryashka">broken</Link></li>
            <li><Link to="/redirect">redirect</Link></li>
            <li><Link to="/news">middleware root</Link></li>
            <li><Link to="/news/456">child route</Link></li>
        </ul>
    </div>
);

const  Test = () => (
    <div>Test, go to <Link to="/">home</Link></div>
);

const Param = () => (
    <div>Route with param</div>
);

const NotFound = () => (
    <div>Not Found Component</div>
);

const News = () => (
    <div>Welcome to news!</div>
);

const NewsItem = () => (
    <div>Welcome to news item!</div>
);

export const routes = (
    <RootRoute>
        <Route path="/" action={() => Home} />
        <Route path="/test" action={() => Test} />
        <Route path="/param/:id" action={() => Param} />
        <Redirect path="/redirect" to="/redirect-next" />
        <Redirect path="/redirect-next" to="/param/123" />
        <Middleware path="/news" action={async ({ next }, options) => {
            console.log('middleware start');
            const result = await next(options);
            console.log('middleware end');
            return result;
        }}>
            <Route path="/" action={() => News} />
            <Route path=":id" action={() => NewsItem} />
        </Middleware>
        <Route path="*" status={404} action={() => NotFound} />
    </RootRoute>
);

export const hooks = [
    /*
    {
        start: () => console.log('start hook'),
        match: ({ route, params, ctx }) => console.log('match hook', route, params, ctx),
        resolve: () => console.log('resolve hook'),
        render: () => console.log('render hook')
    }
    */
];