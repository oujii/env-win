import React, { useState, useRef, useEffect } from "react";
import { X, HelpCircle, Phone, PhoneIncoming, PauseCircle, PhoneOff, UserPlus, FileText, Search, Play, Ban, Forward, Volume2, Headset, RefreshCw } from "lucide-react"; // Added RefreshCw
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea"; // Use Shadcn Textarea
import { Input } from "@/components/ui/input"; // Use Shadcn Input
import { Button } from "@/components/ui/button"; // Import Button for new actions
// Mock data for calls - Added vpNumber
interface Call {
  id: number;
  vpNumber: number; // Added VP Number (e.g., 533)
  plats: string;
  status: "Inkommande" | "Aktiv" | "Väntande" | "Avslutad";
  duration: string;
  operator: string;
  startTime?: number;
  notes?: string;
  polisInvolved?: boolean;
  polisUnitId?: string;
  ambulansInvolved?: boolean;
  ambulansUnitId?: string;
  brandkarInvolved?: boolean;
  brandkarUnitId?: string;
  isSpeakerphone?: boolean; // Added speakerphone state
}

// Updated mock data with vpNumber and adjusted statuses/times for better demo
const initialCalls: Call[] = [
  { id: 1262, vpNumber: 701, plats: "Södra Stockholm", status: "Aktiv", duration: "00:20", operator: "8321", startTime: Date.now() - 20 * 1000, notes: "Akut assistans pågår.", polisInvolved: true, polisUnitId: "P-320", ambulansInvolved: true, isSpeakerphone: false },
  
  { id: 1263, vpNumber: 702, plats: "Östra Stockholm", status: "Väntande", duration: "01:15", operator: "8902", notes: "Väntar på operatör.", isSpeakerphone: false },
  { id: 1264, vpNumber: 703, plats: "Västra Stockholm", status: "Väntande", duration: "00:50", operator: "8115", notes: "Avvaktar resurs.", isSpeakerphone: false },
  { id: 1265, vpNumber: 704, plats: "Norra Stockholm", status: "Väntande", duration: "01:05", operator: "8321", notes: "Förbereder koppling.", isSpeakerphone: false },

  { id: 1266, vpNumber: 705, plats: "Norrköping", status: "Inkommande", duration: "00:00", operator: "-", notes: "", isSpeakerphone: true },
  { id: 1267, vpNumber: 706, plats: "Västerås", status: "Inkommande", duration: "00:00", operator: "-", notes: "", isSpeakerphone: true },
  
  { id: 1268, vpNumber: 707, plats: "Södra Stockholm", status: "Avslutad", duration: "03:40", operator: "8902", notes: "Avslutat utan åtgärd.", polisInvolved: false, ambulansInvolved: false, isSpeakerphone: false },
  { id: 1269, vpNumber: 708, plats: "Västra Stockholm", status: "Avslutad", duration: "04:20", operator: "8115", notes: "Patrull rapporterad.", polisInvolved: true, polisUnitId: "P-411", ambulansInvolved: false, isSpeakerphone: false },
  
  { id: 1270, vpNumber: 709, plats: "Norra Stockholm", status: "Avslutad", duration: "02:55", operator: "8321", notes: "Överlämnat till vårdgivare.", polisInvolved: false, ambulansInvolved: true, isSpeakerphone: false },
  { id: 1271, vpNumber: 710, plats: "Östra Stockholm", status: "Avslutad", duration: "01:45", operator: "8902", notes: "Samtal avslutat efter rådgivning.", polisInvolved: false, ambulansInvolved: false, isSpeakerphone: false },

  { id: 1272, vpNumber: 711, plats: "Södra Stockholm", status: "Väntande", duration: "00:40", operator: "8115", notes: "Väntar på ledig linje.", isSpeakerphone: false },
  { id: 1273, vpNumber: 712, plats: "Västra Stockholm", status: "Inkommande", duration: "00:00", operator: "-", notes: "", isSpeakerphone: true },
  
  { id: 1274, vpNumber: 713, plats: "Norra Stockholm", status: "Väntande", duration: "01:25", operator: "8321", notes: "Resurs tilldelas inom kort.", isSpeakerphone: false },
  { id: 1275, vpNumber: 714, plats: "Östra Stockholm", status: "Aktiv", duration: "00:15", operator: "8902", startTime: Date.now() - 15 * 1000, notes: "Pågående samtal om sjukdomsfall.", polisInvolved: false, ambulansInvolved: true, isSpeakerphone: false },

  { id: 1276, vpNumber: 715, plats: "Södertälje", status: "Avslutad", duration: "02:30", operator: "8115", notes: "Åtgärdat på plats.", polisInvolved: true, polisUnitId: "P-522", ambulansInvolved: false, isSpeakerphone: false },
  { id: 1277, vpNumber: 716, plats: "Lidingö", status: "Inkommande", duration: "00:00", operator: "-", notes: "", isSpeakerphone: true },
];


export const CallQueue1262Window = ({ onClose }: { onClose?: () => void }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [calls, setCalls] = useState<Call[]>(initialCalls);
  const [selectedCallId, setSelectedCallId] = useState<number | null>(null); // Start with no selection
  const [hoveredCallId, setHoveredCallId] = useState<number | null>(null); // Track hovered call
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedCallNotes, setSelectedCallNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Dragging functionality state
  const [position, setPosition] = useState({ x: 250, y: 80 }); // Initial position slightly offset
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
    // Prevent dragging when clicking buttons or other interactive elements inside the title bar if needed
    if (e.target instanceof Element && (e.target.closest('button') || !e.target.closest('.window-titlebar'))) {
      return;
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
      // Prevent dragging outside the container bounds
      const maxX = containerRect.width - windowRect.width;
      const maxY = containerRect.height - windowRect.height;

      let newX = e.clientX - containerRect.left - dragOffset.x;
      let newY = e.clientY - containerRect.top - dragOffset.y;

      // Constrain to container boundaries
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
  }, [isDragging, dragOffset]); // Re-add listeners if dragging state changes

  // Update notes state when selected call changes
  useEffect(() => {
    const selected = calls.find(call => call.id === selectedCallId);
    setSelectedCallNotes(selected?.notes || "");
  }, [selectedCallId]); // <-- REMOVED 'calls' from dependency array
  // --- Timer Logic ---
  useEffect(() => {
    // Clear existing timer if any
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Find the active call
    const activeCall = calls.find(call => call.status === "Aktiv");

    if (activeCall && activeCall.startTime) {
      // Start a new timer only if there's an active call with a start time
      timerRef.current = setInterval(() => {
        setCalls(currentCalls => currentCalls.map(call => {
          if (call.id === activeCall.id && call.startTime) {
            const elapsedSeconds = Math.floor((Date.now() - call.startTime) / 1000);
            const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
            const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
            return { ...call, duration: `${minutes}:${seconds}` };
          }
          return call;
        }));
      }, 1000); // Update every second
    }

    // Cleanup function to clear interval on unmount or when dependencies change
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [calls]); // Rerun effect if calls array changes (e.g., status change)
  // --- Mock Call Handling Functions ---
  const answerCall = (callId: number) => {
    // Stop timer for any previously active call before starting a new one
    if (timerRef.current) clearInterval(timerRef.current);

    setCalls(currentCalls => currentCalls.map(call => {
        // Deactivate previous active call, preserving its last duration
        if (call.status === "Aktiv") {
            return { ...call, status: "Väntande", startTime: undefined }; // Put previous active on hold
        }
        // Activate the new call
        if (call.id === callId && call.status !== 'Avslutad') { // Can't answer ended call
            return { ...call, status: "Aktiv", operator: "8734", startTime: Date.now(), duration: "00:00" };
        }
        return call;
    }));
    setSelectedCallId(callId);
    console.log(`Answering call ${callId}`);
  };

  const holdCall = (callId: number) => {
    setCalls(currentCalls => currentCalls.map(call =>
      (call.id === callId && call.status === 'Aktiv') ? { ...call, status: "Väntande", startTime: undefined } : call // Only hold active calls
    ));
    console.log(`Holding call ${callId}`);
  };

  const resumeCall = (callId: number) => {
    // Stop timer for any previously active call before resuming another
    if (timerRef.current) clearInterval(timerRef.current);

    setCalls(currentCalls => currentCalls.map(call => {
        // Deactivate previous active call
         if (call.status === "Aktiv") {
            return { ...call, status: "Väntande", startTime: undefined };
        }
        // Resume the selected call
        if (call.id === callId && call.status === 'Väntande') { // Only resume waiting calls
             // Attempt to calculate resumed duration - slightly complex/ugly
             let resumedStartTime = Date.now();
             try {
                 const parts = call.duration.split(':');
                 if (parts.length === 2) {
                    const previousSeconds = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
                    if (!isNaN(previousSeconds)) {
                       resumedStartTime = Date.now() - previousSeconds * 1000;
                    }
                 }
             } catch (e) { console.error("Error parsing duration", e); }
             return { ...call, status: "Aktiv", startTime: resumedStartTime };
        }
        return call;
    }));
    setSelectedCallId(callId);
    console.log(`Resuming call ${callId}`);
  };

  const endCall = (callId: number) => {
    // Mark call as Avslutad instead of removing
    setCalls(currentCalls => currentCalls.map(call => {
        if (call.id === callId && call.status !== 'Avslutad') {
            // Stop timer if it was the active call
            if (call.status === 'Aktiv' && timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            return { ...call, status: "Avslutad", startTime: undefined }; // Mark as ended, clear start time
        }
        return call;
    }));
    // Keep selection or clear it if the ended call was selected
    // if (selectedCallId === callId) {
    //    setSelectedCallId(null); // Optionally clear selection
    // }
    console.log(`Ending call ${callId}`);
  };

  // Set speakerphone mode for the active call
  const setSpeakerMode = (callId: number) => {
    setCalls(currentCalls => currentCalls.map(call =>
      (call.id === callId && call.status === 'Aktiv')
        ? { ...call, isSpeakerphone: true }
        : call
    ));
    console.log(`Setting speaker mode for call ${callId}`);
  };

  // Set headset mode for the active call
  const setHeadsetMode = (callId: number) => {
     setCalls(currentCalls => currentCalls.map(call =>
      (call.id === callId && call.status === 'Aktiv')
        ? { ...call, isSpeakerphone: false }
        : call
    ));
    console.log(`Setting headset mode for call ${callId}`);
  };
  // --- End Mock Call Handling ---

  // --- Mock Detail Panel Actions ---
  const saveNote = () => {
    if (selectedCallId === null) return;
    setCalls(currentCalls => currentCalls.map(call =>
      call.id === selectedCallId ? { ...call, notes: selectedCallNotes } : call
    ));
    console.log(`Saving notes for call ${selectedCallId}: "${selectedCallNotes}"`);
    // Maybe add a toast notification here later
  };

  const toggleParty = (party: 'polis' | 'ambulans' | 'brandkar') => { // Added 'brandkar'
     if (selectedCallId === null) return;
    // Generate mock Unit ID
    const generateUnitId = (type: 'polis' | 'ambulans' | 'brandkar'): string => {
      const prefix = type === 'polis' ? 'P' : type === 'ambulans' ? 'A' : 'B'; // Added 'B' prefix
      const num = Math.floor(Math.random() * 899) + 100; // Random 3-digit number
      return `${prefix}-${num}`;
    };

    setCalls(currentCalls => currentCalls.map(call => {
      if (call.id === selectedCallId) {
        let involvedKey: keyof Call, unitIdKey: keyof Call;
        if (party === 'polis') {
            involvedKey = 'polisInvolved'; unitIdKey = 'polisUnitId';
        } else if (party === 'ambulans') {
            involvedKey = 'ambulansInvolved'; unitIdKey = 'ambulansUnitId';
        } else { // brandkar
            involvedKey = 'brandkarInvolved'; unitIdKey = 'brandkarUnitId';
        }
        const currentlyInvolved = call[involvedKey];

        if (!currentlyInvolved) {
          // Toggle ON: set involved true and generate ID
          return { ...call, [involvedKey]: true, [unitIdKey]: generateUnitId(party) };
        } else {
          // Toggle OFF: set involved false and clear ID
          return { ...call, [involvedKey]: false, [unitIdKey]: undefined };
        }
      }
      return call;
     }));
     console.log(`Toggling ${party} for call ${selectedCallId}`);
  };
  // --- End Mock Detail Panel Actions ---

  // --- Fake Call Trigger ---
  const triggerFakeCall = () => {
    console.log("Triggering fake call in 5 seconds...");
    setTimeout(() => {
      const newCallId = Math.max(0, ...calls.map(c => c.id)) + 1; // Generate a unique ID
      const fakeCall: Call = {
        id: newCallId,
        vpNumber: 593, // Added placeholder VP number
        plats: "Södra Stockholm", // Placeholder for fake call
        status: "Inkommande",
        duration: "00:00",
        operator: "-",
        notes: "", // Keep notes empty
        polisInvolved: false,
        ambulansInvolved: false,
        brandkarInvolved: false,
        isSpeakerphone: false, // Default speakerphone state for new calls
      };
      setCalls(currentCalls => [fakeCall, ...currentCalls]); // Add the new call to the beginning of the list
      console.log("Fake incoming call added to queue!");
    }, 5000); // 5 seconds delay
  };
  // --- End Fake Call Trigger ---

  // --- Refresh Call Logic ---
  const refreshCall = (callId: number) => {
    const callToRefresh = calls.find(call => call.id === callId);
    if (!callToRefresh || callToRefresh.status === 'Avslutad') return; // Don't refresh ended calls

    console.log(`Refreshing call ${callId} in 5 seconds...`);

    // 1. Remove the call immediately
    setCalls(currentCalls => currentCalls.filter(call => call.id !== callId));

    // 2. Re-add the call after 5 seconds as 'Inkommande'
    setTimeout(() => {
      const refreshedCall: Call = {
        ...callToRefresh, // Keep original details like ID, vpNumber, plats
        status: "Inkommande",
        duration: "00:00",
        operator: "-", // Reset operator
        startTime: undefined, // Clear start time
        notes: "", // Optionally clear notes or keep them
        polisInvolved: false, // Reset involvement flags
        polisUnitId: undefined,
        ambulansInvolved: false,
        ambulansUnitId: undefined,
        brandkarInvolved: false,
        brandkarUnitId: undefined,
        isSpeakerphone: false, // Reset speakerphone
      };
      setCalls(currentCalls => [refreshedCall, ...currentCalls]); // Add to the top
      console.log(`Call ${callId} re-added as incoming.`);
    }, 5000); // 5 seconds delay
  };
  // --- End Refresh Call Logic ---


  return (
    <div
      ref={windowRef}
      className={cn(
        "flex flex-col bg-[#f0f0f0] shadow-xl border border-[#aaaaaa] absolute",
        "w-[550px] h-[550px]" // Increased default size for detail panel
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        resize: "both", // Allow resizing
        overflow: "hidden", // Hide overflow during resize
        minWidth: "300px", // Minimum size
        minHeight: "400px" // Increased min height
      }}
    >
      {/* Title Bar */}
      <div
        className="flex items-center justify-between px-2 py-1 bg-[#dfdfdf] border-b border-[#aaaaaa] window-titlebar cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-1">
          <Phone size={14} className="text-black" />
          <span className="text-sm font-medium text-black">Samtalskö #1262</span>
        </div>
        <div className="flex items-center">
          {/* Help button triggers the fake call */}
          <button
            className="px-3 py-1 hover:bg-[#e5e5e5] text-black"
            onClick={triggerFakeCall} // Add onClick handler here
          >
            <HelpCircle size={14} />
          </button>
          <button
            className="px-3 py-1 hover:bg-[#e5e5e5] hover:text-white hover:bg-red-600 text-black"
            onClick={onClose} // Use the passed onClose handler
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Call List - New Layout */}
        <div className="flex-1 overflow-y-auto windows-scrollbar">
          {calls.map((call, index) => {
            const isSelected = selectedCallId === call.id;
            const isHovered = hoveredCallId === call.id;
            const isActive = call.status === "Aktiv"; // Green state
            const isEnded = call.status === "Avslutad";
            const isIncoming = call.status === "Inkommande"; // Red state
            const isWaiting = call.status === "Väntande"; // For yellow state logic
            const showYellow = !isEnded && !isActive && !isIncoming && (isSelected || isHovered); // Yellow state (only for Väntande now)

            // Determine background color
            let bgColor = "bg-white"; // Default
            if (index % 2 !== 0) bgColor = "bg-[#f9f9f9]"; // Alternating
            if (isIncoming) bgColor = "bg-red-200"; // Incoming state (Red)
            if (isActive) bgColor = "bg-green-200"; // Active state (Green)
            if (showYellow) bgColor = "bg-yellow-200"; // Hover/Selected state for Waiting (Yellow)
            if (isEnded) bgColor = "bg-gray-200"; // Ended state (Gray)

            // Determine text color
            let textColor = "text-black";
            if (isIncoming) textColor = "text-red-800"; // Darker red text for red background
            if (isEnded) textColor = "text-gray-500";

            return (
              <div
                key={call.id}
                className={cn(
                  "flex items-center justify-between p-2 border-b border-[#cccccc] text-xs cursor-pointer",
                  bgColor,
                  textColor,
                  isEnded ? "cursor-default" : "cursor-pointer"
                )}
                onClick={() => !isEnded && setSelectedCallId(call.id)}
                onMouseEnter={() => !isEnded && setHoveredCallId(call.id)}
                onMouseLeave={() => setHoveredCallId(null)}
              >
                {/* Left Side: Queue Position, Refresh Button & Details */}
                <div className="flex items-center gap-3">
                   {/* Refresh Button - Top Left */}
                   {!isEnded && (
                     <button
                       onClick={(e) => { e.stopPropagation(); refreshCall(call.id); }}
                       className="p-1 text-gray-500 hover:text-blue-600"
                       aria-label={`Återställ samtal ${call.id}`}
                       title={`Återställ samtal ${call.id}`}
                     >
                       <RefreshCw size={12} />
                     </button>
                   )}
                   {isEnded && <div className="w-5 h-5"></div>} {/* Placeholder for alignment */}

                  <span className="font-medium w-4 text-center">{index + 1}</span> {/* Queue Position */}
                  <div className="flex flex-col">
                    <span className="font-semibold"># {call.id}</span>
                    <span># {call.vpNumber} VP {call.status}</span> {/* Combined VP & Status */}
                    <div className="flex items-center gap-1 text-gray-600">
                      {/* Placeholder for location icon if needed */}
                      {/* <MapPin size={12} /> */}
                      <span>{call.plats}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Duration, Audio Mode Buttons & Action Buttons */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                     {/* Audio Mode Buttons (only for active call) */}
                    {isActive && (
                      <div className="flex items-center border border-gray-400 rounded mr-1">
                        {/* Headset Button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); setHeadsetMode(call.id); }}
                          className={cn(
                            "p-1 rounded-l",
                            !call.isSpeakerphone ? "bg-blue-200" : "bg-white hover:bg-gray-100"
                          )}
                          aria-label="Använd headset"
                          title="Använd headset"
                        >
                          <Headset size={14} className={cn(!call.isSpeakerphone ? "text-blue-700" : "text-gray-600")} />
                        </button>
                         {/* Speaker Button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); setSpeakerMode(call.id); }}
                           className={cn(
                            "p-1 rounded-r border-l border-gray-400", // Add border between buttons
                            call.isSpeakerphone ? "bg-blue-200" : "bg-white hover:bg-gray-100"
                          )}
                          aria-label="Använd högtalare"
                          title="Använd högtalare"
                        >
                          <Volume2 size={14} className={cn(call.isSpeakerphone ? "text-blue-700" : "text-gray-600")} />
                        </button>
                      </div>
                    )}
                    {/* Placeholder for clock icon */}
                    {/* <Clock size={12} /> */}
                    <span>{call.duration}</span>
                  </div>

                  {/* Action Buttons - Conditional */}
                  <div className="flex gap-1">
                    {isEnded && (
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-gray-500" disabled>
                        <Forward size={14} className="mr-1" /> Överför
                      </Button>
                    )}
                    {/* Default state button (Not Incoming, Not Active, Not Hovered/Selected) */}
                    {!isEnded && !isActive && !isIncoming && !showYellow && (
                      <Button variant="ghost" size="sm" className="h-7 px-2" onClick={(e) => { e.stopPropagation(); console.log("Överför", call.id); }}>
                        <Forward size={14} className="mr-1" /> Överför
                      </Button>
                    )}
                    {/* Hover/Selected state for WAITING calls */}
                    {showYellow && isWaiting && (
                      <>
                        <Button variant="outline" size="sm" className="h-7 px-2 bg-white" onClick={(e) => { e.stopPropagation(); resumeCall(call.id); }}>
                          <Play size={14} className="mr-1" /> Återuppta
                        </Button>
                        <Button variant="destructive" size="sm" className="h-7 px-2" onClick={(e) => { e.stopPropagation(); endCall(call.id); }}>
                          <Ban size={14} className="mr-1" /> Avsluta
                        </Button>
                      </>
                    )}
                     {/* Hover/Selected state for INCOMING calls */}
                    {isIncoming && (isSelected || isHovered) && (
                      <>
                        <Button variant="outline" size="sm" className="h-7 px-2 bg-white border-green-600 text-green-700 hover:bg-green-50" onClick={(e) => { e.stopPropagation(); answerCall(call.id); }}>
                          <PhoneIncoming size={14} className="mr-1" /> Svara
                        </Button>
                        <Button variant="destructive" size="sm" className="h-7 px-2" onClick={(e) => { e.stopPropagation(); endCall(call.id); }}> {/* Maybe just ignore/reject? */}
                          <Ban size={14} className="mr-1" /> Avvisa {/* Changed from Avsluta */}
                        </Button>
                      </>
                    )}
                    {/* Default state for INCOMING calls (not hovered/selected) */}
                     {isIncoming && !(isSelected || isHovered) && (
                       <Button variant="ghost" size="sm" className="h-7 px-2" onClick={(e) => { e.stopPropagation(); console.log("Överför", call.id); }}>
                        <Forward size={14} className="mr-1" /> Överför
                      </Button>
                     )}
                    {/* Active state buttons */}
                    {isActive && (
                      <>
                        <Button variant="outline" size="sm" className="h-7 px-2 bg-white" onClick={(e) => { e.stopPropagation(); holdCall(call.id); }}>
                          <PauseCircle size={14} className="mr-1" /> Pausa
                        </Button>
                        <Button variant="destructive" size="sm" className="h-7 px-2" onClick={(e) => { e.stopPropagation(); endCall(call.id); }}>
                          <Ban size={14} className="mr-1" /> Avsluta
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons BELOW list are REMOVED */}

        {/* Detail Panel - Conditionally Rendered (Keep existing logic but ensure it works with new selection) */}
        {selectedCallId !== null && calls.find(c => c.id === selectedCallId && c.status !== 'Avslutad') && (
          <div className="p-2 border-t border-[#aaaaaa] bg-[#f8f8f8]">
             {/* Keep existing detail panel content */}
             <div className="text-xs font-semibold mb-2">Detaljer för samtal #{selectedCallId} ({calls.find(c => c.id === selectedCallId)?.plats})</div>
             <div className="grid grid-cols-2 gap-4">
                {/* Left Side: Parties & Search */}
                <div>
                   <div className="mb-3"> {/* Increased margin */}
                      <div className="text-xs mb-1">Inkludera i samtal:</div>
                      <div className="flex flex-col gap-1"> {/* Stack buttons and IDs */}
                         <div className="flex items-center gap-2">
                            <button
                               onClick={() => toggleParty('polis')}
                               className={cn(
                                   "px-2 py-1 border text-xs flex items-center gap-1 w-24 justify-center", // Fixed width
                                   calls.find(c => c.id === selectedCallId)?.polisInvolved
                                   ? "bg-blue-200 border-blue-400"
                                   : "border-[#adadad] bg-[#f0f0f0] hover:bg-[#e5f1fb]"
                               )}
                            >
                                Polis {/* Icon removed */}
                            </button>
                            {calls.find(c => c.id === selectedCallId)?.polisInvolved && (
                               <span className="text-xs text-gray-600">
                                  Enhets-ID: {calls.find(c => c.id === selectedCallId)?.polisUnitId}
                               </span>
                            )}
                         </div>
                         <div className="flex items-center gap-2">
                            <button
                               onClick={() => toggleParty('ambulans')}
                               className={cn(
                                   "px-2 py-1 border text-xs flex items-center gap-1 w-24 justify-center", // Fixed width
                                   calls.find(c => c.id === selectedCallId)?.ambulansInvolved
                                   ? "bg-red-200 border-red-400"
                                   : "border-[#adadad] bg-[#f0f0f0] hover:bg-[#e5f1fb]"
                               )}
                            >
                                Ambulans {/* Icon removed */}
                            </button>
                             {calls.find(c => c.id === selectedCallId)?.ambulansInvolved && (
                               <span className="text-xs text-gray-600">
                                  Enhets-ID: {calls.find(c => c.id === selectedCallId)?.ambulansUnitId}
                               </span>
                            )}
                         </div>
                         {/* Brandkår Button and ID */}
                         <div className="flex items-center gap-2">
                            <button
                               onClick={() => toggleParty('brandkar')}
                               className={cn(
                                   "px-2 py-1 border text-xs flex items-center gap-1 w-24 justify-center", // Fixed width
                                   calls.find(c => c.id === selectedCallId)?.brandkarInvolved
                                   ? "bg-yellow-200 border-yellow-400" // Example color for Brandkår
                                   : "border-[#adadad] bg-[#f0f0f0] hover:bg-[#e5f1fb]"
                               )}
                            >
                                Brandkår
                            </button>
                             {calls.find(c => c.id === selectedCallId)?.brandkarInvolved && (
                               <span className="text-xs text-gray-600">
                                  Enhets-ID: {calls.find(c => c.id === selectedCallId)?.brandkarUnitId}
                               </span>
                            )}
                         </div>
                      </div>
                   </div>
                   <div>
                      <div className="text-xs mb-1">Sök information:</div>
                      <div className="relative">
                         <Input
                            type="text"
                            placeholder="Sök..."
                            className="text-xs h-7 pl-7"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                         />
                         <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                   </div>
                </div>

                {/* Right Side: Notes */}
                <div className="flex flex-col">
                   <div className="text-xs mb-1">Anteckningar:</div>
                   <Textarea
                      placeholder="Skriv anteckningar för detta samtal..."
                      className="text-xs flex-1 resize-none mb-1"
                      value={selectedCallNotes}
                      onChange={(e) => setSelectedCallNotes(e.target.value)}
                   />
                   <button
                      className="px-3 py-1 border border-[#adadad] bg-[#f0f0f0] hover:bg-[#e5f1fb] hover:border-[#0078d7] text-xs self-end"
                      onClick={saveNote}
                   >
                      Spara Anteckning
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>

       {/* Resize handle */}
       <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-0">
         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M22 2L2 22" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
           <path d="M22 8L8 22" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 14L14 22" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      {/* Removed Fake Incoming Call Overlay */}
    </div>
  );
};
