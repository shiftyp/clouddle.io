import React from 'react';

const MessageList = ({ messages }) => {
	return (
		<ul>
			{messages.map((msg) => <li>{msg}</li>)}
		</ul>
	);
};

export default MessageList;
