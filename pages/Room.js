import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';

import {connect} from 'react-redux'
import io from "socket.io-client";
import { actionCreators } from '../store';


const socket = io.connect("http://localhost:5000");

const Room = ({props, storeMakeID, storeJoinGame}) => {

    const navigate = useNavigate(); //페이지 주소 전달 

    const navigateBack = () => {
        navigate('../', { replace: true });
        storeJoinGame(0);
    };

    return (

        <div>
            <Button variant="primary" type="submit" onClick={navigateBack}>
                방 나가기
          </Button>
            <h1>{props.room_number}번방 입니다.</h1>
            <h2>접속자</h2>
            <p>1. {props.id}</p>
            <p>플레이어2</p>
        </div>
    );
};

function mapStateToProps(state){
    console.log('state:',state)
    return { props: state };
}
function mapDispatchToProps(dispatch){
    return {
        storeMakeID: id => dispatch(actionCreators.storeMakeID(id)),
        storeJoinGame: room_number => dispatch(actionCreators.storeJoinGame(room_number)),
        storeMakeGame: (room_number )=> dispatch(actionCreators.storeMakeGame(room_number)), 
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Room);