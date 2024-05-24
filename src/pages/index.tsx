import React, { useState, useEffect, useRef } from 'react';
import Login from "@/components/auth/login/login";
import MissionCard from "@/components/missions/missioncard";
import MultiplayerWaitingRoom from "@/components/multiplayer/multiplayerwaitingroom";
import { Socket, io } from 'socket.io-client';

interface Player {
  name: string;
}

export default function Home() {
  const [player, setPlayer] = useState<Player>({ name: "" });
  const [waitingForPlayer, setWaitingForPlayer] = useState<boolean>(false);
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [game, setGame] = useState<any>({});
  const [gameMessage, setGameMessage] = useState<string>("");
  const [currentMusic, setCurrentMusic] = useState<object>(null);
  const [musicIndex, setMusicIndex] = useState<number>(0);
  const [topVisitors, setTopVisitors] = useState<any>([]);
  const socket = useRef<Socket | null>(null);
  const videoRef = useRef(null);

  useEffect(() => {
    socket.current = io("ws://127.0.0.1:3003", {
      rejectUnauthorized: false,
      reconnection: false,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
      protocols: ["websocket"],
      });   
      setIsSocketConnected(true);

      socket.current.on("game start",(data)=>{
        console.log("Game started", data);
        setGame(data.data);
        setGameMessage(data.message);
        setIsGameStarted(true);
        setCurrentMusic(data.data.musics[musicIndex]);
      })

      socket.current.on('user joined', (data) => {
        console.log("User joined", data);
      }
      );

      socket.current.on("leave room success", (data) => {
        console.log("Leave room success", data);
        setGameMessage(data.message);
        setIsGameStarted(false);
      }
      );

      socket.current.on("answer error", (data) => {
        console.log("Answer error", data);
        setGameMessage(data.message);
      }
      );

      socket.current.on("correct answer", (data) => {
        console.log("Correct answer", data);
        setGameMessage("Correct answer be ready for the next music is coming!"); 
        
        setMusicIndex(prevIndex => {
          const newIndex = prevIndex + 1;
          setCurrentMusic(data.room?.musics[newIndex]);
          
          if (newIndex === data.room?.musics.length) {
            socket.current?.emit("leaveRoom", { roomId: data.room._id });
            console.log("Game finished");
            setGameMessage("Game finished");
            setIsGameStarted(false);
            return 0; // Reset the index to 0 if the game is finished
          }
          
          console.log("Music index", newIndex);
          console.log("Music length", data.room?.musics.length);
          return newIndex;
        });
      });
      
      socket.current.on("wrong answer", (data) => {
        setGameMessage("Wrong answer the answer was " + data.room?.musics[musicIndex].answer);
        
        setMusicIndex(prevIndex => {
          const newIndex = prevIndex + 1;
          setCurrentMusic(data.room?.musics[newIndex]);
          
          if (newIndex === data.room?.musics.length) {
            console.log("Game finished");
            socket.current?.emit("leaveRoom", { roomId: data.room._id });
            setGameMessage("Game finished");
            setIsGameStarted(false);
            setCurrentMusic(null);
            return 0; // Reset the index to 0 if the game is finished
          }
          
          console.log("Music index", newIndex);
          console.log("Music length", data.room?.musics.length);
          return newIndex;
        });
      });

      socket.current.on("next music", (data) => {
        console.log("Next music", data);
        if(data.data){
          setCurrentMusic(null)
          setCurrentMusic(data.data);
        }
        setGameMessage(data.message);
      }
      );

      socket.current.on("top visitors", (data) => {
        console.log("Top visitors", data);
        setTopVisitors(data.topVisitors);
      }
      )
  }
  , []); 

  useEffect(() => {
    if (videoRef.current && currentMusic?.path) {
      videoRef.current.load();
      videoRef.current.play();
    }
  }, [currentMusic]);

  // Function to handle adding a player
  const handlePlayerJoin = (playerInfo: Player) => {
    setPlayer(playerInfo);
    setWaitingForPlayer(false);
  };

  const handleAnswer = (answer: string) => {
    socket.current?.emit("answer", { roomId : game?._id , answer: answer, musicIndex: musicIndex });
  }

  return (
    <div className="max-w-screen-2xl mx-auto h-full">
      <Login setPlayer={setPlayer} socket={socket}/>
      {/* Header */}
      <header className="bg-gray-900 text-white py-4 px-6 h-1/4 rounded-b-lg">
        {/* Your header content goes here */}
        <h1>Music Guess App</h1>
      </header>
      {/* Body */}
      <div className="flex mt-4 h-[90vh]">
        {/* Left Side */}
        <aside className="w-1/4 bg-gray-800 p-4 rounded-l-lg">
          {/* Your left side content goes here */}
          <h2>Lobby</h2>
          {waitingForPlayer ? (
            <p>Waiting for another player to join...</p>
          ) : (
            isSocketConnected && <MultiplayerWaitingRoom player={player} handlePlayerJoin={handlePlayerJoin} socket={socket} />
          )}          
        </aside>

        {/* Main Content */}
        <main className="w-1/2 bg-gray-700 p-4">
          {/* Your main content goes here */}
          {isGameStarted ? (
            <div className='flex flex-col w-full h-full items-center'>
              <div className='flex flex-col w-full h-full items-center'>
              <h2>Game Started</h2>
              <img src={"http://localhost:3003/"+game?.logo} alt="Game Logo" className="w-1/3 rounded-lg" />
              <p>{game?.name}</p>
              <h1>{musicIndex + 1} / {game?.musics.length} musics left</h1>
              </div>
              <div className='flex flex-col w-full h-full items-center'>
              <h2>{gameMessage}</h2>
              {currentMusic?.path &&
                  <video ref={videoRef} key={currentMusic?.path} controls autoPlay name="media" className='hidden'>
                    <source src={"http://localhost:3003" + currentMusic?.path} type="audio/mpeg" />
                  </video>
              }
              <div>
                {currentMusic?.questions?.map((question: any, index: number) => (
                  <button key={index} onClick={()=>{handleAnswer(question)}} className='bg-gray-900 rounded-lg p-3 m-2'>{question}</button>
                ))}
              </div>
              </div>
            </div>
          ) : (
          <div className='flex flex-col items-center justify-center'>
            <h1 className='text-2xl'>Welcome to the GuessMusicApp get ready for music battle</h1>                
            <img src="waiting.gif"></img> 
          </div>
          )}
        </main>

        {/* Right Side */}
        <aside className="w-1/4 bg-gray-800 p-4 rounded-r-lg flex flex-col gap-3">
          {/* Your right side content goes here */}
          <h2>Top Visitors</h2>
          <ul className='flex flex-col gap-3'>
            {topVisitors.map((visitor: any, index: number) => (
              <li key={index} className='bg-gray-900 rounded-lg p-3'>{visitor.name} - {visitor.points} Points</li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
