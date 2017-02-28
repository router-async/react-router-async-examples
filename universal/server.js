import express from 'express';
import { ServerRouter } from 'react-router-async';
import { routes, hooks, createStore, Wrapper, errors } from './common';
import React, { Component, createFactory } from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
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
    console.log('Incoming request', req.url);
    let path = req.url.replace('/universal', '');
    path = path === '' ? '/' : path;

    const store = createStore();
    const serverHooks = [
        ...hooks,
        hookFetcher({ helpers: { dispatch: store.dispatch } }),
        hookRedux({ dispatch: store.dispatch })
    ];

    ServerRouter.init({ path, routes, hooks: serverHooks, errors }).then(({ Router, routerProps, Component, componentProps, status, redirect }) => {
        if (redirect) {
            res.redirect(status, redirect);
        } else {
            let exposed = 'window.__data=' + serialize(store.getState()) + ';';
            const html = ReactDOM.renderToStaticMarkup(HtmlComponent({
                markup: ReactDOM.renderToString((
                    <Provider store={store} key="provider">
                        <Router {...routerProps}>
                            <Wrapper>
                                <ReactCSSTransitionGroup
                                    component="div"
                                    className="container"
                                    transitionName="page"
                                    transitionEnterTimeout={500}
                                    transitionLeaveTimeout={300}
                                >
                                    <div key={componentProps.router.path} className="content">
                                        <Component {...componentProps} />
                                    </div>
                                </ReactCSSTransitionGroup>
                            </Wrapper>
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
        res.status(500).send('Internal error');
    });
};

const expressApp = express();
expressApp.use(renderMiddleware);
expressApp.listen(process.env.PORT, function() {
    console.log('Listening on => ' + process.env.PORT);
});