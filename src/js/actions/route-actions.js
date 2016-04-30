import { initializeMessageSockets } from './message-actions';

export const initializeIndex = (nextState, replaceState) => {
	return (dispatch, getState) => {
		dispatch(initializeMessageSockets());
	};
};	
