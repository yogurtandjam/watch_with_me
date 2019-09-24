import { useState, useEffect, useCallback } from "react";
import _ from "lodash";

const PlaylistHooks = socket => {
  const [queue, setQueue] = useState([]);

  const syncVideo = useCallback(
    newQueue => {
      if (!_.isEqual(queue, newQueue)) {
        setQueue(newQueue);
      }
    },
    [queue]
  );

  const addVideo = useCallback(
    input => {
      if (input.length) {
        let newArr = queue.concat(input);
        setQueue(newArr);
        socket.emit("queue", input);
      }
    },
    [queue, socket]
  );

  const removeVideo = useCallback(
    idx => {
      let newArr = queue.slice(0, idx).concat(queue.slice(idx + 1));
      setQueue(newArr);
      socket.emit("remove", idx);
    },
    [queue, socket]
  );

  const dequeueVideo = useCallback(() => {
    let newArr = queue.slice();
    newArr.shift();
    setQueue(newArr);
    socket.emit("dequeue");
  }, [queue, socket]);

  useEffect(() => {
    socket.on("sync playlist", ({ action, payload }) => {
      console.log(action, payload);
      switch (action) {
        case "sync":
          console.log("synced", action, payload);
          syncVideo([...payload]);
          break;
        case "queue":
          console.log("queued", action, payload);
          let addQueue = queue.concat(payload);
          setQueue(addQueue);
          break;
        case "dequeue":
          console.log("dequeued", action, payload);
          let dequeue = queue.slice();
          dequeue.shift();
          setQueue(dequeue);
          break;
        case "remove":
          console.log("remove", action, payload);
          let removeQueue = queue
            .slice(0, payload)
            .concat(queue.slice(payload + 1));
          setQueue(removeQueue);
          break;
        default:
          break;
      }
    });

    return () => {
      socket.off("sync playlist");
    };
  }, [socket, queue, syncVideo]);

  return {
    queue,
    removeVideo,
    addVideo,
    dequeueVideo
  };
};

export default PlaylistHooks;
