import React, { useState, useRef, useEffect } from "react";
import { X, HelpCircle, UserCircle, Radio } from "lucide-react"; // Using UserCircle icon
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OperatorStatus = "Tillgänglig" | "Upptagen (Samtal)" | "Upptagen (Admin)" | "Paus" | "Utryckning";

export const OperatorStatusWindow = ({ onClose }: { onClose?: () => void }) => {
  const [operatorId] = useState("8734"); // Mock operator ID
  const [status, setStatus] = useState<OperatorStatus>("Tillgänglig");

  // Dragging functionality state
  const [position, setPosition] = useState({ x: 400, y: 150 }); // Initial position
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
    if (e.target instanceof Element && (e.target.closest('button, select') || !e.target.closest('.window-titlebar'))) {
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

  const handleStatusChange = (newStatus: OperatorStatus) => {
    setStatus(newStatus);
    // Here you would typically also notify the backend/system
    console.log(`Operator ${operatorId} status changed to: ${newStatus}`);
  };

  return (
    <div
      ref={windowRef}
      className={cn(
        "flex flex-col bg-[#f0f0f0] shadow-xl border border-[#aaaaaa] absolute",
        "w-[280px] h-[200px]" // Smaller default size
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        resize: "both",
        overflow: "hidden",
        minWidth: "200px",
        minHeight: "150px"
      }}
    >
      {/* Title Bar */}
      <div
        className="flex items-center justify-between px-2 py-1 bg-[#dfdfdf] border-b border-[#aaaaaa] window-titlebar cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-1">
          <UserCircle size={14} className="text-black" />
          <span className="text-sm font-medium text-black">Operatörsstatus</span>
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
      <div className="flex-1 flex flex-col overflow-hidden p-3 gap-3 text-xs">
        <div className="flex items-center justify-between">
            <Label>Operatörs-ID:</Label>
            <span className="font-semibold">{operatorId}</span>
        </div>
        <div className="flex flex-col gap-1">
            <Label htmlFor="status-select">Nuvarande Status:</Label>
            <Select value={status} onValueChange={(value: OperatorStatus) => handleStatusChange(value)}>
                <SelectTrigger id="status-select" className="h-7 text-xs">
                    <SelectValue placeholder="Välj status..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Tillgänglig">Tillgänglig</SelectItem>
                    <SelectItem value="Upptagen (Samtal)">Upptagen (Samtal)</SelectItem>
                    <SelectItem value="Upptagen (Admin)">Upptagen (Admin)</SelectItem>
                    <SelectItem value="Paus">Paus</SelectItem>
                    <SelectItem value="Utryckning">Utryckning (Assisterar)</SelectItem>
                </SelectContent>
            </Select>
        </div>
         <div className="flex items-center justify-center mt-auto">
             <Radio size={14} className={cn("mr-1", status === "Tillgänglig" ? "text-green-600" : "text-orange-500")} />
             <span>{status}</span>
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
