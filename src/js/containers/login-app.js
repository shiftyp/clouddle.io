import React from 'react';
import lock from '../constants/lock';

const LoginApp = () => {
	return (
		<button onClick={() => lock.show()}>Login</button>
	);
};

export default LoginApp;
