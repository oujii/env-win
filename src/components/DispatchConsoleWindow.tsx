import React, { useState, useRef, useEffect } from "react";
import { X, HelpCircle, RadioTower } from "lucide-react"; // Using RadioTower icon
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Example UI element

// Mock data structure (can be expanded)
interface Unit {
  id: string;
  type: "Polis" | "Ambulans" | "Brandkår";
  status: "Tillgänglig" | "Ute på larm" | "Paus" | "Avslutad";
  location: string;
}

const initialUnits: Unit[] = [
  { id: "P-112", type: "Polis", status: "Tillgänglig", location: "Station Öst" },
  { id: "A-210", type: "Ambulans", status: "Ute på larm", location: "Incident #440" },
  { id: "B-305", type: "Brandkår", status: "Tillgänglig", location: "Station Syd" },
  { id: "P-115", type: "Polis", status: "Paus", location: "Station Öst" },
  { id: "A-211", type: "Ambulans", status: "Tillgänglig", location: "Station Väst" },
];

export const DispatchConsoleWindow = ({ onClose }: { onClose?: () => void }) => {
  const [units, setUnits] = useState<Unit[]>(initialUnits);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  // Removed timestamps from initial log
  const [messageLog, setMessageLog] = useState<string>("Enhet P-112 tilldelad Incident #440\nEnhet A-210 status ändrad till Ute på larm");

  // Dragging functionality state
  const [position, setPosition] = useState({ x: 300, y: 100 }); // Initial position
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
    if (e.target instanceof Element && (e.target.closest('button, input, textarea, select') || !e.target.closest('.window-titlebar'))) {
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

  // Mock function to add log entry (timestamp removed)
  const addLog = (message: string) => {
      // const time = new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }); // Timestamp removed
      setMessageLog(prev => `${prev}\n${message}`); // Just add the message
  }

  // Mock function to change unit status
  const changeUnitStatus = (unitId: string, newStatus: Unit['status']) => {
      setUnits(prevUnits => prevUnits.map(unit =>
          unit.id === unitId ? { ...unit, status: newStatus } : unit
      ));
      addLog(`Enhet ${unitId} status ändrad till ${newStatus}`);
      setSelectedUnitId(null); // Deselect after action
  }

  const selectedUnit = units.find(u => u.id === selectedUnitId);

  return (
    <div
      ref={windowRef}
      className={cn(
        "flex flex-col bg-[#f0f0f0] shadow-xl border border-[#aaaaaa] absolute",
        "w-[650px] h-[500px]" // Default size
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        resize: "both",
        overflow: "hidden",
        minWidth: "400px",
        minHeight: "350px"
      }}
    >
      {/* Title Bar */}
      <div
        className="flex items-center justify-between px-2 py-1 bg-[#dfdfdf] border-b border-[#aaaaaa] window-titlebar cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-1">
          <RadioTower size={14} className="text-black" />
          <span className="text-sm font-medium text-black">Utryckningskonsol</span>
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
      <div className="flex-1 flex flex-col overflow-hidden p-2 gap-2 text-xs">
        {/* Top Section: Unit List & Details/Actions */}
        <div className="flex gap-2 h-[60%]">
          {/* Unit List */}
          <div className="w-1/3 flex flex-col border border-[#aaaaaa] bg-white">
            <div className="p-1 bg-[#e0e0e0] border-b border-[#aaaaaa] font-semibold">Tillgängliga Enheter</div>
            <div className="flex-1 overflow-y-auto windows-scrollbar">
              {units.map(unit => (
                <div
                  key={unit.id}
                  className={cn(
                    "p-1 border-b border-[#cccccc] cursor-pointer hover:bg-[#e5f1fb]",
                    selectedUnitId === unit.id ? "bg-[#0078d7] text-white hover:bg-[#005a9e]" : ""
                  )}
                  onClick={() => setSelectedUnitId(unit.id)}
                >
                  <div className="font-medium">{unit.id} ({unit.type})</div>
                  <div className={cn("text-xs", selectedUnitId === unit.id ? "text-white/80" : "text-gray-600")}>
                    Status: {unit.status} | Plats: {unit.location}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unit Details & Actions */}
          <div className="w-2/3 flex flex-col border border-[#aaaaaa] bg-white p-2 gap-2">
            <div className="font-semibold border-b border-[#cccccc] pb-1">
              Detaljer/Åtgärder {selectedUnit ? `för ${selectedUnit.id}` : ""}
            </div>
            {selectedUnit ? (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>Typ: {selectedUnit.type}</div>
                  <div>Nuvarande Status: {selectedUnit.status}</div>
                  <div>Plats: {selectedUnit.location}</div>
                </div>
                <div className="flex flex-wrap gap-2 border-t border-[#cccccc] pt-2">
                   <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => changeUnitStatus(selectedUnit.id, 'Tillgänglig')} disabled={selectedUnit.status === 'Tillgänglig'}>Sätt Tillgänglig</Button>
                   <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => changeUnitStatus(selectedUnit.id, 'Ute på larm')} disabled={selectedUnit.status === 'Ute på larm'}>Sätt Ute på larm</Button>
                   <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => changeUnitStatus(selectedUnit.id, 'Paus')} disabled={selectedUnit.status === 'Paus'}>Sätt Paus</Button>
                   <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => changeUnitStatus(selectedUnit.id, 'Avslutad')} disabled={selectedUnit.status === 'Avslutad'}>Sätt Avslutad</Button>
                </div>
                 <div className="flex gap-2 items-end">
                    <div className="flex-1">
                        <Label htmlFor="assign-incident" className="text-xs mb-1 block">Tilldela Incident:</Label>
                        <Input id="assign-incident" placeholder="Incident ID (ex: #440)" className="h-7 text-xs" />
                    </div>
                    <Button size="sm" className="text-xs h-7">Tilldela</Button>
                 </div>
                 <div className="flex gap-2 items-end">
                    <div className="flex-1">
                        <Label htmlFor="send-message" className="text-xs mb-1 block">Skicka Meddelande:</Label>
                        <Input id="send-message" placeholder="Meddelande till enhet..." className="h-7 text-xs" />
                    </div>
                    <Button size="sm" className="text-xs h-7">Skicka</Button>
                 </div>
              </>
            ) : (
              <div className="text-gray-500 italic">Välj en enhet i listan...</div>
            )}
          </div>
        </div>

        {/* Bottom Section: Message Log */}
        <div className="flex flex-col border border-[#aaaaaa] bg-white h-[40%]">
          <div className="p-1 bg-[#e0e0e0] border-b border-[#aaaaaa] font-semibold">Kommunikationslogg</div>
          <Textarea
            readOnly
            value={messageLog}
            className="flex-1 resize-none windows-scrollbar rounded-none border-0 text-xs p-1"
          />
        </div>
      </div>

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
