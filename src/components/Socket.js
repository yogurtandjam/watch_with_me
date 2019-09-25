import { useState } from "react";
import socketIOClient from "socket.io-client";

let connectSocket = function(room) {
  return socketIOClient("http://localhost:4000", {
    query: "r_var=" + room
  });
};

export const Sockets = roomId => {
  const [socket] = useState(connectSocket(roomId.slice(1)).connect());

  return {
    socket
  };
};