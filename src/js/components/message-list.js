import React from 'react';
import {bindActionCreators} from 'redux';
import * as messageActions from '../actions/message-actions';

const MessageList = ({ messages }) => {
	return (
		<ul>
			{messages.map((msg) => <li>{msg}</li>)}
		</ul>
	);
};

export default MessageList;
