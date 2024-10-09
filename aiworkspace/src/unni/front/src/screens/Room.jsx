import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";
import { useSocket } from "../context/SocketProvider";
import "./RoomPage.css"; // Ensure this path matches your project structure

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenStream, setScreenStream] = useState(null);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  // Toggle Microphone
  const toggleMic = () => {
    myStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
    setIsMicOn((prev) => !prev);
  };

  // Toggle Camera
  const toggleCamera = () => {
    myStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
    setIsCameraOn((prev) => !prev);
  };

  // Toggle Screen Sharing
  const toggleScreenSharing = async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
      setIsScreenSharing(false);
  
      // Switch back to original camera stream
      const videoTrack = myStream.getVideoTracks()[0];
      peer.peer.getSenders().forEach((sender) => {
        if (sender.track.kind === "video") {
          sender.replaceTrack(videoTrack);
        }
      });
    } else {
      // Start screen sharing
      const screen = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setScreenStream(screen);
      setIsScreenSharing(true);
  
      // Replace the video track in the peer connection
      const videoTrack = myStream.getVideoTracks()[0];
      const screenTrack = screen.getVideoTracks()[0];
      peer.peer.getSenders().forEach((sender) => {
        if (sender.track === videoTrack) {
          sender.replaceTrack(screenTrack);
        }
      });
  
      // Ensure to revert back to the camera stream when the screen sharing ends
      screenTrack.onended = () => {
        toggleScreenSharing();
      };
    }
  };
  

  // Quit Call Functionality
  const quitCall = () => {
    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop());
      setMyStream(null);
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      setRemoteStream(null);
    }
    peer.peer.close();
    setRemoteSocketId(null);
  };

  return (
    <div className="room-container">
      <h1>Room Page</h1>
      <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
      {myStream && <button onClick={sendStreams}>Send Stream</button>}
      {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}
      {myStream && (
        <div className="video-container">
          <div>
            <h1>My Stream</h1>
            <ReactPlayer playing muted className="video-player" height="300px" width="400px" url={myStream} />
          </div>
          <div>
            <h1>Remote Stream</h1>
            <ReactPlayer playing muted className="video-player" height="300px" width="400px" url={remoteStream} />
          </div>
        </div>
      )}
      <div className="controls">
        {myStream && (
          <>
            <button onClick={toggleMic}>{isMicOn ? "Mute Mic" : "Unmute Mic"}</button>
            <button onClick={toggleCamera}>{isCameraOn ? "Turn Off Camera" : "Turn On Camera"}</button>
            <button onClick={toggleScreenSharing}>
              {isScreenSharing ? "Stop Sharing Screen" : "Share Screen"}
            </button>
            <button onClick={quitCall} style={{ backgroundColor: "red" }}>
              Quit Call
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RoomPage;
