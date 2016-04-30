import React from 'react';
import {connect} from 'react-redux';

import MessageList from '../components/message-list';

const App = ({ messages }) => {
	return (
		<div>
			<MessageList messages={messages} />
		</div>
	);
};

const mapState = (state) => ({ messages: state.messages });

export default connect(mapState)(App);
