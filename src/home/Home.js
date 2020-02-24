import React, {useState, useEffect} from 'react';
import './Home.css';
import dog from './../common/images/dag.jfif';
import openSocket from 'socket.io-client';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { makeId } from './../common/helperFunctions';

function Home() {
  const dispatch = useDispatch();
  let [roomId, setRoomId] = useState("");

  const handleOnClick = (e) => {
    if (roomId === '') {
      window.location = '/lobby?roomId=' + makeId(5);
    }
  }

  return (
    <div>
      <img src={dog}/>
      <div>
        <h1>Lobby Key (leave blank to create new)</h1>
        <input placeholder="URL" type="text" onChange={(e)=>{setRoomId(e.target.value)}}/>
      </div>
      <div>
        <Link onClick={handleOnClick} to={'/lobby?roomId=' + roomId}>
          <button>Create Lobby</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
