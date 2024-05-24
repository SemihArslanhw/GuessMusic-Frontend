import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from "socket.io-client";

interface Player {
  name: string;
}

interface Props {
  player: Player;
  handlePlayerJoin: (playerInfo: Player) => void;
}

const MultiplayerWaitingRoom: React.FC<Props> = ({ player , handlePlayerJoin, socket }) => {
  const [searching, setSearching] = useState(false);
  const [searchingMessage, setSearchingMessage] = useState("");
  const [playerInput, setPlayerInput] = useState("");
  const [roomList, setRoomList] = useState([] as string[]);
  const [roomId, setRoomId] = useState("");
  const [currentRoom, setCurrentRoom] = useState({} as any);
  const imageList = [
    "/lists/2010's-pop.jpeg",
    "/lists/theweeknd.jpeg",
    "/lists/turkey-20.png",
  ];

  useEffect(() => {  
    socket.current.on("connect", () => {
      console.log("Connected to the server!");
    });

    socket.current.on("selam", (data) => {
      console.log("Selam", data);
    });
    
    socket.current.on("rooms", (data) => {
      console.log("Rooms", data.rooms);
      setRoomList(data.rooms);
    });

    socket.current.on("connect_error", (err) => {
      // Log the reason of the error
      console.log("Connection error:", err.message, err.cause);
    });
    
    socket.current.on("error", (error: Error) => {
      // Log WebSocket connection error
      console.error("WebSocket connection error:", error);
    });

    socket.current.on("room info", (data) => {
      console.log("Room info", data);
      setCurrentRoom(data?.room);
    });

    socket.current.on("join error", (error: Error) => {
      // Log WebSocket connection error
      console.error("Join error:", error);
      handleStopSearch();
    });
  
    return () => {
      if (socket.current) {
        console.log("Disconnecting from the server...");
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [socket]);

  const handleStartSearch = (roomId) => {
    setRoomId(roomId);
    socket.current?.emit("joinRoom", { roomId: roomId });

    if (player && player.name.trim() !== "") {
      setSearching(true);
      setSearchingMessage("Searching for a game...");
      // Here you would trigger the logic to start searching for a game, 
      // such as sending a request to the server.
    } else {
      setSearchingMessage("Please enter your name to start searching.");
    }
  }


  const handleJoin = (roomId) => {
    console.log("Emitting join event to the server...")
    socket.current?.emit("join", { name: playerInput });
    handlePlayerJoin({ name: playerInput });
  };

  const handleStopSearch = () => {
    socket.current?.emit("leaveRoom", { roomId: roomId } );
    setSearching(false);
    setSearchingMessage("");
    setCurrentRoom({});
    // Here you would trigger the logic to stop searching for a game, 
    // such as sending a request to the server to cancel the search.
  }

  return (
    <div className={`p-4 w-full multiplayer-waiting-room ${searching ? 'fade-out' : ''}`}>
      {player.name !=="" ? (
        <div>
          <p>Player: {player.name}</p>
          
          {currentRoom._id && 
          <ul>
            
            <li>Room ID: {currentRoom?._id}</li>
            <li>Room Name: {currentRoom?.name}</li>
            <li><img src={"http://localhost:3003/"+currentRoom?.logo} alt="Room Logo" className="w-20 h-20" /></li>
            <li>Player Count: {currentRoom?.visitors?.length}</li>
            <li>Game Status: {currentRoom?.isGameStarted}</li>
            <li>Players: 
              <ul className='gap-3 flex flex-col'>
                {currentRoom?.visitors?.map(player => (
                  <li key={player._id} className='bg-gray-900 rounded-lg p-3'>{player.name}</li>
                ))}
              </ul>
              </li>
            
          </ul>
          }
          {searching ?
           // Looks like league of legends game search
           <div className="flex flex-col gap-2">
            <h2>Multiplayer Waiting Room</h2>
             <div className="loader"></div>
             <button className="bg-red-500 text-white p-2 rounded-md" onClick={handleStopSearch}>Stop Searching</button>
            </div>

            :
          
          <div>
            <p>Choose an image to start searching for a game:</p>
            <div className="flex gap-2">
              {roomList?.map((room, index) => (
                <button key={index} className="bg-blue-500 text-white p-2 rounded-md w-1/3" onClick={()=>{handleStartSearch(room._id)}}>
                <img src={"http://localhost:3003/"+room.logo} alt={`Image ${index}`} key={index} className="w-full h-full" />
                </button>
              ))}
            </div>
          </div>}
        </div>
      ) : (
        <div>
          <p>Enter your name to start searching for a game:</p>
          <input type="text" placeholder="Your Name" className="p-2 border border-gray-300 rounded-md text-black" onChange={(e)=>{setPlayerInput(e.target.value)}} />
          <button className="bg-blue-500 text-white p-2 rounded-md" onClick={handleJoin}>Start</button> 
        </div>
      )}
      {searching && <p>{
      currentRoom?.isGameStarted ? "Game is starting..." : searchingMessage
      }</p>}
    </div>
  );
};

export default MultiplayerWaitingRoom;
