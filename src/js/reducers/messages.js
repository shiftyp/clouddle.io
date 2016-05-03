import { MESSAGE_RECIEVED } from '../constants/action-types';

const messages = (state = [], action) => {
	switch (action.type) {
		case MESSAGE_RECIEVED:
			return [...state, action.payload];
		default:
			return state;
	}
};

export default messages;
