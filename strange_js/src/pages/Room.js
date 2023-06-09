import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import ToggleButton from "react-bootstrap/ToggleButton";

import { connect } from "react-redux";
import io from "socket.io-client";
import { actionCreators } from "../store";

const socket = io.connect("http://localhost:5000");

const Room = ({ props, storeMakeID, storeJoinGame, storeLeaveGame }) => {
	const navigate = useNavigate(); //페이지 주소 전달
	const [allState, setAllState] = useState();
	const [ready, setReady] = useState(false);
	let all_state;

	useEffect(() => {
		console.log("room useEffect");
		// socket.emit("joingame", { name: props.id, room: props.room_number });
		socket.on("joingame", (data) => {
			const { code, message } = data;

			console.log("Room 받아온 데이터:", data.player);

			all_state = data.player;
			if (all_state !== allState) {
				setAllState(all_state);
			}
			// console.log("allState = ", allState);
			// console.log("all_state = ", all_state);

			// console.log('socket:'+code,message)
		});
		socket.on("ready", (data) => {
			console.log("socket ready");
			console.log(data);
		});
	});

	const navigateBack = () => {
		console.log("props.room_number", props.room_number);
		socket.emit("leavegame", { name: props.id, room: props.room_number });
		navigate("../", { replace: true });
		storeLeaveGame(0);
	};

	const gameReady = () => {
		if (ready === false) {
			console.log("ready");
			socket.emit("ready", { name: props.id, room: props.room_number });
		} else {
			console.log("ready 해제");
			socket.emit("ready", { name: props.id, room: props.room_number });
		}
	};

	return (
		<div>
			{console.log("allState = ", allState)}
			{console.log(props)}
			<Button variant='primary' type='submit' onClick={navigateBack}>
				방 나가기
			</Button>
			<h1>{props.room_number}번방 입니다.</h1>
			<h2>접속자</h2>
			{/* {player_list(allState)} */}
			{allState
				? allState.map((x) => {
						console.log(x.name, x.ready);
						return (
							<div>
								<h3>
									플레이어{x.player_number}: {x.name}{" "}
									{x.name === props.id
										? ready
											? "READY"
											: "NOT READY"
										: x.ready
										? "READY"
										: "NOT READY"}
									{console.log("x.ready: ", x.ready)}
								</h3>
							</div>
						);
				  })
				: ""}

			<br></br>
			{props.host ? (
				<Button variant='primary' type='submit' onClick={navigateBack}>
					Game Start
				</Button>
			) : (
				<ToggleButton
					className='mb-2'
					id='toggle-check'
					type='checkbox'
					variant='outline-danger'
					checked={ready}
					value='1'
					onChange={(e) => setReady(e.currentTarget.checked)}
					onClick={gameReady}
				>
					Ready
				</ToggleButton>
			)}
		</div>
	);
};

function mapStateToProps(state) {
	console.log("state:", state);
	return { props: state };
}
function mapDispatchToProps(dispatch) {
	return {
		storeMakeID: (id) => dispatch(actionCreators.storeMakeID(id)),
		storeJoinGame: (room_number) =>
			dispatch(actionCreators.storeJoinGame(room_number)),
		storeMakeGame: (room_number) =>
			dispatch(actionCreators.storeMakeGame(room_number)),
		storeLeaveGame: (room_number) =>
			dispatch(actionCreators.storeLeaveGame(room_number)),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Room);
