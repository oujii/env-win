import React, { useState, useRef, useEffect } from "react";
import { X, HelpCircle, Bell, BellOff, CheckCircle } from "lucide-react"; // Using Bell icons
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Alarm {
  id: number;
  type: "System" | "Kommunikation" | "Resurs";
  severity: "Kritisk" | "Hög" | "Medel" | "Låg";
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

// Updated mock alarms with more entries and night-time timestamps
const initialAlarms: Alarm[] = [
  { id: 1, type: "System", severity: "Kritisk", message: "Databasanslutning förlorad!", timestamp: "23:46:10", acknowledged: false },
  { id: 2, type: "Kommunikation", severity: "Hög", message: "Rakel-nätverk instabilt (Zon 3)", timestamp: "23:51:35", acknowledged: false },
  { id: 8, type: "Resurs", severity: "Medel", message: "Ambulans A-301 behöver påfyllning syrgas", timestamp: "23:55:02", acknowledged: false },
  { id: 3, type: "Resurs", severity: "Medel", message: "Enhet P-115 rapporterar lågt batteri", timestamp: "23:58:45", acknowledged: true },
  { id: 9, type: "System", severity: "Hög", message: "Backup-jobb misslyckades (Server BK-01)", timestamp: "00:05:18", acknowledged: false },
  { id: 4, type: "System", severity: "Låg", message: "Diskutrymme under 10% på server SRV-02", timestamp: "00:15:29", acknowledged: false },
  { id: 5, type: "Resurs", severity: "Hög", message: "Enhet A-210 har inte rapporterat position på 5 min", timestamp: "00:30:50", acknowledged: false },
  { id: 6, type: "Kommunikation", severity: "Medel", message: "Hög latens i VPN-tunnel till Region Syd", timestamp: "00:48:12", acknowledged: true },
  { id: 10, type: "Kommunikation", severity: "Låg", message: "Tillfällig störning telefoni (SIP Trunk 2)", timestamp: "01:02:44", acknowledged: false },
  { id: 7, type: "System", severity: "Kritisk", message: "Autentiseringsserver svarar ej!", timestamp: "01:13:05", acknowledged: false },
];

export const AlarmPanelWindow = ({ onClose }: { onClose?: () => void }) => {
  const [alarms, setAlarms] = useState<Alarm[]>(initialAlarms);

  // Dragging functionality state
  const [position, setPosition] = useState({ x: 450, y: 180 }); // Initial position
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Get container reference on mount
  useEffect(() => {
    const workArea = document.querySelector(".flex-1.bg-\\[\\#b9b9b9\\]");
    if (workArea) {
      containerRef.current = workArea as HTMLDivElement;
    }
  }, []);

  // Mouse handling for dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof Element && (e.target.closest('button') || !e.target.closest('.window-titlebar'))) {
      return; // Don't drag on interactive elements or outside titlebar
    }
    setIsDragging(true);
    const windowRect = windowRef.current?.getBoundingClientRect();
    if (windowRect) {
      setDragOffset({
        x: e.clientX - windowRect.left,
        y: e.clientY - windowRect.top
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const windowRect = windowRef.current?.getBoundingClientRect();
    if (windowRect) {
      const maxX = containerRect.width - windowRect.width;
      const maxY = containerRect.height - windowRect.height;
      let newX = e.clientX - containerRect.left - dragOffset.x;
      let newY = e.clientY - containerRect.top - dragOffset.y;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Set up event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const acknowledgeAlarm = (id: number) => {
    setAlarms(currentAlarms =>
      currentAlarms.map(alarm =>
        alarm.id === id ? { ...alarm, acknowledged: true } : alarm
      )
    );
    console.log(`Alarm ${id} acknowledged.`);
  };

  const getSeverityColor = (severity: Alarm['severity']) => {
    switch (severity) {
      case "Kritisk": return "bg-red-500";
      case "Hög": return "bg-orange-500";
      case "Medel": return "bg-yellow-400";
      case "Låg": return "bg-blue-400";
      default: return "bg-gray-400";
    }
  };

  return (
    <div
      ref={windowRef}
      className={cn(
        "flex flex-col bg-[#f0f0f0] shadow-xl border border-[#aaaaaa] absolute",
        "w-[350px] h-[250px]" // Smaller default size
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        resize: "both",
        overflow: "hidden",
        minWidth: "250px",
        minHeight: "180px"
      }}
    >
      {/* Title Bar */}
      <div
        className="flex items-center justify-between px-2 py-1 bg-[#dfdfdf] border-b border-[#aaaaaa] window-titlebar cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-1">
          <Bell size={14} className="text-black" />
          <span className="text-sm font-medium text-black">Larmpanel</span>
        </div>
        <div className="flex items-center">
          <button className="px-3 py-1 hover:bg-[#e5e5e5] text-black">
            <HelpCircle size={14} />
          </button>
          <button
            className="px-3 py-1 hover:bg-[#e5e5e5] hover:text-white hover:bg-red-600 text-black"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto windows-scrollbar text-xs">
        {alarms.length === 0 ? (
          <div className="p-4 text-center text-gray-500 italic">Inga aktiva larm.</div>
        ) : (
          alarms.map(alarm => (
            <div
              key={alarm.id}
              className={cn(
                "flex items-center justify-between p-2 border-b border-[#cccccc]",
                alarm.acknowledged ? "bg-gray-100 text-gray-500" : "bg-white"
              )}
            >
              <div className="flex items-center gap-2 flex-1 mr-2">
                 <span className={cn("w-3 h-3 rounded-full shrink-0", getSeverityColor(alarm.severity))} title={alarm.severity}></span>
                 <div className="flex flex-col">
                    <span className={cn("font-medium", alarm.acknowledged ? "" : "text-black")}>{alarm.message}</span>
                    <span className="text-[10px] text-gray-500">{alarm.timestamp} - {alarm.type}</span>
                 </div>
              </div>
              {!alarm.acknowledged && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-1 text-green-700 hover:bg-green-100"
                  onClick={() => acknowledgeAlarm(alarm.id)}
                  title="Kvittera larm"
                >
                  <CheckCircle size={14} />
                </Button>
              )}
            </div>
          ))
        )}
      </div>
       {/* Optional Footer */}
       {/* <div className="h-6 bg-[#dfdfdf] border-t border-[#aaaaaa] flex items-center px-2 justify-end">
           <Button variant="ghost" size="sm" className="h-5 px-1 text-xs">Tysta alla</Button>
       </div> */}

      {/* Resize handle */}
      <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-10">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 2L2 22" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 8L8 22" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 14L14 22" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
};
