import React, { useState, useRef, useEffect } from "react";
import { X, HelpCircle, FileText, Save, Calendar, Clock, User, Users, MapPin, AlertCircle, Clipboard, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const CreateReportWindow = ({ onClose }: { onClose?: () => void }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  
  // Form data state
  const [reportTitle, setReportTitle] = useState("");
  const [reportType, setReportType] = useState("Incident");
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportTime, setReportTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
  const [reportLocation, setReportLocation] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportPersonnel, setReportPersonnel] = useState("");
  const [reportStatus, setReportStatus] = useState("Utkast");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Dragging functionality
  const [position, setPosition] = useState({ x: 150, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Mouse handling for dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
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
  
  // Handle form submission
  const handleSaveReport = () => {
    if (!reportTitle.trim()) {
      toast({
        title: "Fel",
        description: "Rapporttitel måste anges.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setReportStatus("Sparad");
      
      // Show success toast
      toast({
        title: "Rapport sparad",
        description: "Rapporten har sparats.",
      });
    }, 800);
  };
  
  // Set up event listeners for dragging
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Get reference to the container (#b9b9b9 area)
    const workArea = document.querySelector(".flex-1.bg-\\[\\#b9b9b9\\]");
    if (workArea) {
      containerRef.current = workArea as HTMLDivElement;
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Get current date and time for display
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString('sv-SE');
  };

  return (
    <div 
      ref={windowRef}
      className={cn(
        "flex flex-col bg-[#f0f0f0] shadow-xl border border-[#aaaaaa] absolute",
        "w-[700px] h-[550px]"
      )} 
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        resize: "both",
        overflow: "hidden",
        minWidth: "400px",
        minHeight: "400px"
      }}
    >
      {/* Title Bar */}
      <div 
        className="flex items-center justify-between px-2 py-1 bg-[#dfdfdf] border-b border-[#aaaaaa] window-titlebar cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-1">
          <FileText size={14} className="text-black" />
          <span className="text-sm font-medium text-black">Skapa rapport</span>
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

      {/* Tabs */}
      <div className="flex border-b border-[#aaaaaa] bg-[#e5e5e5]">
        <button
          className={cn(
            "px-4 py-1 text-xs border-r border-[#aaaaaa]",
            activeTab === "general" ? "bg-white" : "hover:bg-[#f0f0f0]"
          )}
          onClick={() => setActiveTab("general")}
        >
          Allmänt
        </button>
        <button
          className={cn(
            "px-4 py-1 text-xs border-r border-[#aaaaaa]",
            activeTab === "details" ? "bg-white" : "hover:bg-[#f0f0f0]"
          )}
          onClick={() => setActiveTab("details")}
        >
          Detaljer
        </button>
        <button
          className={cn(
            "px-4 py-1 text-xs border-r border-[#aaaaaa]",
            activeTab === "attachments" ? "bg-white" : "hover:bg-[#f0f0f0]"
          )}
          onClick={() => setActiveTab("attachments")}
        >
          Bilagor
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Main Content with Tab-specific content */}
        <div className="flex-1 p-3 overflow-hidden">
          {activeTab === "general" && (
            <div className="h-full overflow-y-auto windows-scrollbar">
              {/* Report Header */}
              <div className="mb-4">
                <div className="flex items-center">
                  <FileText size={16} className="text-blue-600 mr-2" />
                  <div className="text-base font-semibold">Ny rapport</div>
                </div>
                <div className="text-sm mt-1 text-gray-700">Status: {reportStatus}</div>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  <label className="text-xs font-medium">Rapporttitel *</label>
                  <Input
                    className="h-7 text-xs"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder="Ange rapporttitel"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Rapporttyp</label>
                    <select
                      className="w-full h-7 text-xs border border-[#7a7a7a] rounded px-2"
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                    >
                      <option value="Incident">Incident</option>
                      <option value="Daglig">Daglig</option>
                      <option value="Veckovis">Veckovis</option>
                      <option value="Månadsvis">Månadsvis</option>
                      <option value="Årsrapport">Årsrapport</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium">Status</label>
                    <select
                      className="w-full h-7 text-xs border border-[#7a7a7a] rounded px-2"
                      value={reportStatus}
                      onChange={(e) => setReportStatus(e.target.value)}
                      disabled
                    >
                      <option value="Utkast">Utkast</option>
                      <option value="Sparad">Sparad</option>
                      <option value="Inskickad">Inskickad</option>
                      <option value="Godkänd">Godkänd</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Datum</label>
                    <div className="relative">
                      <Calendar className="absolute left-2 top-1.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="date"
                        className="h-7 text-xs pl-8"
                        value={reportDate}
                        onChange={(e) => setReportDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium">Tid</label>
                    <div className="relative">
                      <Clock className="absolute left-2 top-1.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="time"
                        className="h-7 text-xs pl-8"
                        value={reportTime}
                        onChange={(e) => setReportTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium">Plats</label>
                  <div className="relative">
                    <MapPin className="absolute left-2 top-1.5 h-4 w-4 text-gray-500" />
                    <Input
                      className="h-7 text-xs pl-8"
                      value={reportLocation}
                      onChange={(e) => setReportLocation(e.target.value)}
                      placeholder="Ange plats"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium">Beskrivning</label>
                  <Textarea
                    className="text-xs min-h-[100px] resize-none"
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Ange beskrivning av händelsen eller rapporten"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div className="h-full overflow-y-auto windows-scrollbar">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium">Personal</label>
                  <div className="relative">
                    <Users className="absolute left-2 top-1.5 h-4 w-4 text-gray-500" />
                    <Input
                      className="h-7 text-xs pl-8"
                      value={reportPersonnel}
                      onChange={(e) => setReportPersonnel(e.target.value)}
                      placeholder="Ange involverad personal (kommaseparerad)"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium">Prioritet</label>
                  <select
                    className="w-full h-7 text-xs border border-[#7a7a7a] rounded px-2"
                  >
                    <option value="Låg">Låg</option>
                    <option value="Medium">Medium</option>
                    <option value="Hög">Hög</option>
                    <option value="Kritisk">Kritisk</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium">Kategori</label>
                  <select
                    className="w-full h-7 text-xs border border-[#7a7a7a] rounded px-2"
                  >
                    <option value="Olycka">Olycka</option>
                    <option value="Brand">Brand</option>
                    <option value="Sjukvård">Sjukvård</option>
                    <option value="Polis">Polis</option>
                    <option value="Övrigt">Övrigt</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium">Åtgärder</label>
                  <Textarea
                    className="text-xs min-h-[100px] resize-none"
                    placeholder="Beskriv vidtagna åtgärder"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "attachments" && (
            <div className="h-full overflow-y-auto windows-scrollbar">
              <div className="space-y-4">
                <div className="border border-dashed border-[#aaaaaa] rounded p-4 text-center">
                  <p className="text-xs text-gray-500 mb-2">Dra och släpp filer här eller klicka för att bläddra</p>
                  <button className="bg-[#e0e0e0] hover:bg-[#d0d0d0] text-xs px-3 py-1 rounded border border-[#aaaaaa]">
                    Bläddra...
                  </button>
                </div>

                <div className="text-xs font-medium">Bifogade filer</div>
                <div className="border border-[#aaaaaa] rounded p-2 min-h-[200px]">
                  <div className="text-xs text-gray-500 italic">Inga filer bifogade</div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="p-3 border-t border-[#aaaaaa] bg-[#e0e0e0] flex justify-between items-center">
          <div className="text-xs text-gray-600">* Obligatoriska fält</div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs bg-[#e0e0e0] hover:bg-[#d0d0d0]"
              onClick={onClose}
            >
              Avbryt
            </Button>
            <Button
              size="sm"
              className="h-7 text-xs bg-[#0078d7] hover:bg-[#006cc1] text-white flex items-center gap-1"
              onClick={handleSaveReport}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="h-3 w-3 rounded-full border-2 border-t-transparent border-white animate-spin mr-1" />
              ) : (
                <Save size={12} />
              )}
              Spara rapport
            </Button>
          </div>
        </div>
        
        {/* Status Bar */}
        <div className="flex items-center justify-between px-3 py-1 bg-[#e0e0e0] border-t border-[#aaaaaa] text-xs">
          <div>Användare: 8734 (Operatör)</div>
          <div>Senast uppdaterad: {getCurrentDateTime()}</div>
        </div>
      </div>
    </div>
  );
};
