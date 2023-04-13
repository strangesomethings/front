import logo from '../logo.svg';
import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Swal from 'sweetalert2';

import {connect} from 'react-redux'
import io from "socket.io-client";
import { actionCreators } from '../store';

/* TODO 
* 1. 리덕트, mobx 사용해서 방나가기 해도 이름 유지되도록 하기 -> 플레이어 이름 저장 
* 2. 방번호 랜덤으로 만들어서 소켓 주소 만들어주기 (로컬서버면 크게 상관없음..?)
*/
const socket = io.connect("http://localhost:5000");

const Main = ({props, storeMakeID, storeMakeGame}) => {
    const [user, setUser] = useState({
        userName: '',
        messages: []
    })
    const [show, setShow] = useState(false); // 모달 show
    const [roomNumber, setRoomNumber] = useState(); //방 번호

    const connectRoom = (roomNumber) => {
        console.log('romNumber :', roomNumber)
        // navigateRoom();
    }
    /**
     *  방을 새로 생성하는 함수 
     *  1. 랜덤으로 방 번호 생성.
     *  2. 소켓 서버로 전송  
     */
    const MakeRoom = () => {
        let room_number = parseInt(Math.random()*(9999-1000)+1000);
        storeMakeGame(room_number); 
        navigateRoom(room_number);
        socket.emit("joingame", { name: props.id, room: room_number });
    }

    useEffect(() => {
        console.log('useEffect')
        socket.on('joingame',(data) => {
            const {code,message} = data
            console.log(data);
            // console.log('socket:'+code,message)
        })
    },[]);

    const navigate = useNavigate(); //페이지 주소 전달 
    /**
     * 새로 방을 생성하는 함수 
     * @param {*} room_number 새로 생성하는 방 번호
     */
    const navigateRoom = (room_number) => {
        navigate('../'+room_number, { replace: true });
    };

    const handleClose = () => {
        setShow(false);
        setRoomNumber();
    }
    const handleShow = () => setShow(true);
    const handleChange = ({ target: { value } }) => setRoomNumber(value);
    // const setUserName = ({ target: { value } }) => setUser({ ...user, userName: value });
    const setUserName = ({ target: { value } }) => setUser({ ...user, userName: value });
    const confirmUserName = () => {
        storeMakeID(user.userName)
        console.log('user name : ', user.userName)
    }
    const roomExist = () => {
        setShow(false);
        console.log('입력되었습니다. : ' + roomNumber)
        if (roomNumber == 1) { // 일단 생성되는 방의 번호는 무조건 1로 고정
            console.log('방 이동');
            setRoomNumber();
            //navigate('../room', { replace: true })
            connectRoom(roomNumber);
            return
        } else {
            return Swal.fire('방이 존재하지 않습니다.')
        }
    }

    return (
        <div className="App">
            {props.id ?
                <div>
                    <h1>어마무시한 무언가</h1>
                    <p>어서오세요 {props.id} 님</p>
                    <img src={logo} className="App-logo" alt="logo" />
                    <br />
                    <Button variant="primary" onClick={handleShow}>
                        입장하기
                    </Button>
                    <br />
                    <Button variant="success" onClick={MakeRoom}>
                        방만들기
                    </Button>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>입장하려는 방 번호를 입력하세요</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Control
                                type="textarea" value={roomNumber} onChange={handleChange} placeholder="room number : 1을 입력하세요.(test)"
                            />
                            {console.log(roomNumber)}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                취소
                    </Button>
                            <Button variant="primary" type="submit" onClick={roomExist}>
                                확인
                    </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
                : <div style={{ padding: '200px 40px' }}>
                    <Form.Control
                        type="textarea" value={user.userName} onChange={setUserName} placeholder="이름을 입력해주세요!"
                    />
                    <Button variant="secondary" onClick={confirmUserName}>
                        확인
                    </Button>
                </div>
            }
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

export default connect(mapStateToProps, mapDispatchToProps)(Main);