import { useCallback, useEffect, useState } from "react";

export function useVPATServer() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000/vpat");

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onclose = (e) => {
      console.log("WebSocket closed",e);
      setConnected(false);
      
    };

    ws.onmessage = (event) => {
      console.log('WebSocket message received:', event);
      event.stopPropagation();
      event.preventDefault();
      return false
    }

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = useCallback((message:string) => {
    if (socket && connected) {
      socket.send(message);
    }
    else
    {
      console.error("Socket is not connected",{
        socket,
        connected
      });
    }
  },[socket,connected]);

  const sendJSON = useCallback((json:unknown) => {
    sendMessage(JSON.stringify(json));
  },[sendMessage])

  const sendAction = useCallback((action:string,payload:unknown) => {
    sendJSON({
      action,
      payload
    })
  },[sendMessage, sendJSON])

  const runScan = useCallback((ids:string[]) => {
    sendAction('run-scan',{
      stories: ids
    })
  },[socket,connected])

  return { runScan };
}