import React from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';

import configureStore from './store/configure-store';
import { renderDevTools } from './utils/dev-tools';
import * as routeActions from './actions/route-actions';

import App from './containers/app';

const store = configureStore();

const { initializeIndex }  = bindActionCreators(routeActions, store.dispatch);

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
	<Router>
		<Route path="/" component={wrapperGenerator(App)} onEnter={initializeIndex} />
	</Router>
);

initializeIndex();

var Wrapper = wrapperGenerator(App);

ReactDOM.render(<Wrapper />, document.getElementById('main'));
