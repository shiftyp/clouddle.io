import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { sendMessage } from '../actions/message-actions';
import MessageList from '../components/message-list';
import MessageInput from '../components/message-input';

const App = ({ messages, sendMessage }) => {
	return (
		<div>
			<MessageInput sendMessage={sendMessage} />
			<MessageList messages={messages} />
		</div>
	);
};

const mapState = (state) => ({ messages: state.messages });
const mapActionCreators = (dispatch) => bindActionCreators({
	sendMessage
}, dispatch);

export default connect(mapState, mapActionCreators)(App);
