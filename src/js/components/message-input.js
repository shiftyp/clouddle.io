import React from 'react';

const MessageInput = ({ sendMessage }) => {
	let onSubmit = (e) => {
		e.preventDefault();
		var input = e.target.querySelector('input[type="text"]');
		sendMessage(input.value);
	};
	return (
		<form onSubmit={onSubmit}>
			<input type="text" />
			<button type="submit">Send Message</button>
		</form>
	);
}

export default MessageInput;
