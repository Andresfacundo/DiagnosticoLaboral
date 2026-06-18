import { useEffect } from "react";
import { socket } from "../../src/socket";

export const useSocket = (eventName, callback) => {
  useEffect(() => {
    const so = socket;

    if (eventName && callback) {
      so.on(eventName, callback);
    }

    return () => {
      if (eventName && callback) so.off(eventName, callback);
    };
  }, [eventName, callback]);
};

export const emitSocketEvent = (eventName, data) => {
  const so = socket;
  so.emit(eventName, data);
};
