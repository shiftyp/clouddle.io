import React from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';

import configureStore from './store/configure-store';
import { renderDevTools } from './utils/dev-tools';
import * as routeActions from './actions/route-actions';

import App from './containers/app';
import LoginApp from './containers/login-app';

const store = configureStore();

const {
	initializeIndex,
	tearDownIndex,
	initializeLogin
} = bindActionCreators(routeActions, store.dispatch);

let wrapperGenerator = (Component) => {
	return (props) => {
		return (
			<div>
				<Provider store={store}>
					<Component {...props} />
				</Provider>
				{renderDevTools(store)}
			</div>
		);
	};
};

var Routes = (
	<Router history={browserHistory}>
		<Route path="/" component={wrapperGenerator(App)} onEnter={initializeIndex} onExit={tearDownIndex} />
		<Route path="/login" component={wrapperGenerator(LoginApp)} onEnter={initializeLogin} />
	</Router>
);

ReactDOM.render(Routes, document.getElementById('main'));
