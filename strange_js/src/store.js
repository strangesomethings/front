import { createStore } from "redux";

const MAKE_ID = "MAKE_ID";
const MAKE_GAME = "MAKE_GAME";
const JOIN_GAME = "JOIN_GAME";
const LEAVE_GAME = "LEAVE_GAME";

const storeMakeID = (id) => ({ type: MAKE_ID, id });
const storeMakeGame = (room_number) => ({ type: MAKE_GAME, room_number });
const storeJoinGame = (room_number) => ({ type: JOIN_GAME, room_number });
const storeLeaveGame = (room_number) => ({ type: LEAVE_GAME, room_number });

const player_state = {
	id: undefined, //닉네임
	room_number: 0, // 들어가있는 방번호
	host: false, // 방장인가?
	joined_room: false, //방에 들어가있나 아닌가 여부
};

const reducer = (state = player_state, action) => {
	switch (action.type) {
		case MAKE_ID:
			return {
				...state,
				id: action.id,
			};
		case MAKE_GAME:
			return {
				...state,
				room_number: action.room_number,
				host: true,
				joined_room: true,
			};
		case JOIN_GAME:
			return {
				...state,
				room_number: action.room_number,
				host: false,
				joined_room: true,
			};
		case LEAVE_GAME:
			return {
				...state,
				room_number: action.room_number,
				host: false,
				joined_room: false,
			};
		default:
			return state;
	}
};

const store = createStore(reducer);

export const actionCreators = {
	storeMakeID,
	storeMakeGame,
	storeJoinGame,
	storeLeaveGame,
};

export default store;
