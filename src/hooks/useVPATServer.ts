import { useCallback, useEffect, useState } from "react";

export function useVPATServer() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000/vpat");

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onclose = () => {
      setConnected(false);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const runScan = useCallback(() => {
    if (socket && connected) {
      socket.send("run-scan");
    }
  },[socket,connected])

  return { runScan };
}