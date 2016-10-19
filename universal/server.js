import express from 'express';
import { Router } from 'react-router-async';
import { routes, hooks } from './common';
import React, { Component, createFactory } from 'react';
import ReactDOM from 'react-dom/server';
import assets from './../webpack-assets.json';

let expressApp = express();

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
                </body>
            </html>
        )
    }
}
const HtmlComponent = createFactory(Html);

expressApp.use((req, res, next) => {
    console.log('Incoming request', req.path);

    let path = req.path.replace('/universal', '');
    path = path === '' ? '/' : path;
    console.log('path', path);

    Router.init({ path, routes, hooks }).then(({ Component, status, redirect }) => {
        if (redirect) {
            res.redirect(status, redirect);
        } else {
            const html = ReactDOM.renderToStaticMarkup(HtmlComponent({
                markup: ReactDOM.renderToString(<Component />),
                assets: assets
            }));
            console.log('Sending markup');
            res.status(status).send('<!DOCTYPE html>' + html);
        }
    }).catch(error => {
        console.log('ERROR', error);
        if (error.name === 'RouterError') {
            res.status(error.code).send(error.message);
        } else {
            res.status(500).send('Internal error');
        }
    });
});

expressApp.listen(process.env.PORT, function() {
    console.log('Listening on => ' + process.env.PORT);
});