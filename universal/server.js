import express from 'express';
import { ServerRouter } from 'react-router-async';
import { routes, hooks, createStore } from './common';
import React, { Component, createFactory } from 'react';
import ReactDOM from 'react-dom/server';
import assets from './../webpack-assets.json';
import { hookRedux } from 'hook-redux';
import { hookFetcher } from 'hook-fetcher';
import { Provider } from 'react-redux';
import serialize from 'serialize-javascript';

class Html extends Component {
    render() {
        return (
            <html>
                <head>
                    <meta charSet="utf-8" />
                </head>
                <body>
                    <div id="app" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
                    <script src={this.props.assets.javascript.universal} defer></script>
                    <script dangerouslySetInnerHTML={{__html: this.props.state}}></script>
                </body>
            </html>
        )
    }
}
const HtmlComponent = createFactory(Html);

const renderMiddleware = (req, res) => {
    console.log('Incoming request', req.path);
    let path = req.path.replace('/universal', '');
    path = path === '' ? '/' : path;

    const store = createStore();
    const serverHooks = [
        ...hooks,
        hookFetcher({ helpers: { dispatch: store.dispatch } }),
        hookRedux({ dispatch: store.dispatch })
    ];

    ServerRouter.init({ path, routes, hooks: serverHooks }).then(({ Router, routerProps, Component, componentProps, status, redirect }) => {
        if (redirect) {
            res.redirect(status, redirect);
        } else {
            let exposed = 'window.__data=' + serialize(store.getState()) + ';';
            const html = ReactDOM.renderToStaticMarkup(HtmlComponent({
                markup: ReactDOM.renderToString((
                    <Provider store={store} key="provider">
                        <Router {...routerProps}>
                            <div>
                                <h1>Wrapper</h1>
                                <Component {...componentProps} />
                            </div>
                        </Router>
                    </Provider>
                )),
                assets: assets,
                state: exposed
            }));
            console.log('Sending markup');
            res.status(status).send('<!DOCTYPE html>' + html);
        }
    }).catch(error => {
        console.log('ERROR', error);
        if (error.name === 'RouterError') {
            res.status(error.status).send(error.message);
        } else {
            res.status(500).send('Internal error');
        }
    });
};

const expressApp = express();
expressApp.use(renderMiddleware);
expressApp.listen(process.env.PORT, function() {
    console.log('Listening on => ' + process.env.PORT);
});