import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Middleware, Link, RouterError } from 'react-router-async';
import createHistory from 'history/createBrowserHistory';

const history = createHistory({
    basename: '/simple'
});

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
                <p>Grant access <input type="checkbox" onChange={this.changeAccess} defaultChecked={false} /></p>
                <ul>
                    <li>Home, go to <Link to="/test">test</Link></li>
                    <li><Link to="/secret">Secret with access rights</Link></li>
                </ul>
            </div>
        )
    }
}
const Secret = () => <div>You get access to secret</div>;
const Test = props => <div>Test, go to <Link to="/">home</Link>{ console.log('props', props) }</div>;

const routes = [
    <Route path="/" action={() => Home} />,
    <Route path="/test" action={() => Test} />,
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
