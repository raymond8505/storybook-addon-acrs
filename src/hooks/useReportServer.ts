import { useCallback, useEffect, useState } from "react";

export interface WCAGRuleLink {
  label: string;
  url: string;
  tags?: string[];
  ruleTag?: string;
}
export interface UseVPATServerProps {
  onReportCreated?: (report: Record<string, string>) => void;
  onServerError?: (ev: Event) => any;
}

export interface ScanProgress {
  currentIndex: number;
  currentId: string;
  total: number;
  progress: number;
  estimatedMSRemaining: number;
}
export function useReportServer({
  onReportCreated,
  onServerError,
}: UseVPATServerProps) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [ruleDefinitions, setRuleDefinitions] = useState<WCAGRuleLink[]>([]);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<ScanProgress | null>(null);
  const [reports, setReports] = useState<string[]>([]);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000/vpat");

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onclose = (e) => {
      console.log("WebSocket closed", e);
      setConnected(false);
    };

    ws.addEventListener("error", onServerError);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.action) {
        case "report-created":
          setScanning(false);
          setScanProgress(null);
          if (onReportCreated) {
            setReports((prevReports) => [
              data.payload.report.id,
              ...prevReports,
            ]);
            onReportCreated(data.payload.report);
          }
          break;
        case "scan-progress":
          setScanProgress(data.payload.progress);
          break;
        case "ready":
          setRuleDefinitions(data.payload.ruleDefinitions);
          setReports(data.payload.reports);
          break;
        default:
          console.log("Unknown message", event.data);
      }
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [
    onReportCreated,
    setScanning,
    setRuleDefinitions,
    setScanProgress,
    setConnected,
    setSocket,
  ]);

  const sendMessage = useCallback(
    (message: string) => {
      if (socket && connected) {
        socket.send(message);
      } else {
        console.error("Socket is not connected", {
          socket,
          connected,
        });
      }
    },
    [socket, connected],
  );

  const sendJSON = useCallback(
    (json: unknown) => {
      sendMessage(JSON.stringify(json));
    },
    [sendMessage],
  );

  const sendAction = useCallback(
    (action: string, payload: unknown) => {
      sendJSON({
        action,
        payload,
      });
    },
    [sendMessage, sendJSON],
  );

  const runScan = useCallback(
    (stories: string[]) => {
      setScanning(true);
      sendAction("run-scan", {
        stories,
      });
    },
    [socket, connected, setScanning],
  );

  return {
    runScan,
    ruleDefinitions,
    scanning,
    scanProgress,
    connected,
    reports,
  };
}
