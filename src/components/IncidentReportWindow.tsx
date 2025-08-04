
import React, { useState, useRef, useEffect } from "react";
import { ChevronRight, ChevronDown, X, HelpCircle, Search, AlertCircle, MapPin, Users, Truck, FileText, Phone, Clock, FileEdit, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useToast } from "@/hooks/use-toast";

export const IncidentReportWindow = ({ onClose }: { onClose?: () => void }) => {
  const { toast } = useToast();
  const [isMaximized, setIsMaximized] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    "Olyckstyp": true,
  });
  const [selectedCategory, setSelectedCategory] = useState("Brott");
  const [selectedIncident, setSelectedIncident] = useState("Överfall - Våldsbrott");
  const [currentPriority, setCurrentPriority] = useState(1);
  const [activeTab, setActiveTab] = useState("information");
  
  // Form data state
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [locationDescription, setLocationDescription] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [reporterPhone, setReporterPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [incidentId, setIncidentId] = useState("#23489");
  const [logEntries, setLogEntries] = useState([
    { time: "01:15:22", user: "System", text: "Incident skapad, ID: #23489" },
    { time: "01:15:05", user: "8734 (Operatör)", text: "Prioritet satt till 1" },
    { time: "01:15:32", user: "System", text: "Ambulans AE-231 tilldelad" },
    { time: "01:15:17", user: "System", text: "Brandbil BE-125 tilldelad" },
    { time: "01:15:08", user: "4512 (Räddningstjänst)", text: "Vi är på väg, ETA 8 min" },
    { time: "01:15:55", user: "6723 (Ambulans)", text: "ETA 5 min till olycksplatsen" },
  ]);
  
  // Resources state
  const [resources, setResources] = useState([
    { id: "AE-231", type: "Ambulans", station: "Solna", status: "På väg", eta: "5 min" },
    { id: "BE-125", type: "Brandbil", station: "Kungsholmen", status: "Mobiliserad", eta: "8 min" },
    { id: "PE-442", type: "Polis", station: "Södermalm", status: "Ej tilldelad", eta: "-" },
  ]);
  const [newResourceType, setNewResourceType] = useState("Ambulans");
  const [newResourcePriority, setNewResourcePriority] = useState("Prioritet 1");

  // Victims state
  const [victims, setVictims] = useState([
    { id: "P-001", status: "Vaken", triage: "Gul", transport: "Karolinska" },
  ]);
  const [newVictimStatus, setNewVictimStatus] = useState("Vaken");
  const [newVictimTriage, setNewVictimTriage] = useState("Röd");
  
  // Dragging functionality
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Time state
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Initialize with current time
  useEffect(() => {
    // Set current time
    setCurrentDateTime(new Date());
    
    // Get reference to the container (#b9b9b9 area)
    const workArea = document.querySelector(".flex-1.bg-\\[\\#b9b9b9\\]");
    if (workArea) {
      containerRef.current = workArea as HTMLDivElement;
    }
  }, []);
  
  // Format current time as HH:MM:SS
  const formatTime = (date: Date) => {
    return "01:15:00";
  };
  
  // Toggling expanded items
  const toggleExpand = (item: string) => {
    setExpandedItems({
      ...expandedItems,
      [item]: !expandedItems[item],
    });
  };

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
  const handleSaveIncident = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      // Add new log entry
      setLogEntries([
        ...logEntries,
        { time: "01:15:00", user: "8734 (Operatör)", text: "Händelseinformation uppdaterad" }
      ]);
      
      setIsSubmitting(false);
      
      // Show success toast
      toast({
        title: "Händelserapport sparad",
        description: "Incidentrapportering har uppdaterats.",
      });
    }, 800);
  };
  
  // Add a new resource
  const handleAddResource = () => {
    const newId = `${newResourceType.charAt(0)}E-${Math.floor(Math.random() * 900) + 100}`;
    const stations = ["Solna", "Kungsholmen", "Södermalm", "Norrmalm", "Östermalm"];
    const randomStation = stations[Math.floor(Math.random() * stations.length)];
    const eta = `${Math.floor(Math.random() * 20) + 5} min`;
    
    const newResource = {
      id: newId,
      type: newResourceType,
      station: randomStation,
      status: "Mobiliserad",
      eta: eta
    };
    
    setResources([...resources, newResource]);
    
    // Add log entry
    setLogEntries([
      ...logEntries,
      { time: "01:15:00", user: "System", text: `${newResourceType} ${newId} tilldelad` }
    ]);
    
    toast({
      title: "Resurs tillagd",
      description: `${newResourceType} ${newId} har blivit tilldelad till incidenten.`,
    });
  };
  
  // Add a new victim
  const handleAddVictim = () => {
    const newId = `P-${(victims.length + 1).toString().padStart(3, '0')}`;
    const hospitals = ["Karolinska", "Södersjukhuset", "Danderyds sjukhus", "S:t Görans sjukhus"];
    const randomHospital = hospitals[Math.floor(Math.random() * hospitals.length)];
    
    const newVictim = {
      id: newId,
      status: newVictimStatus,
      triage: newVictimTriage,
      transport: randomHospital
    };
    
    setVictims([...victims, newVictim]);
    
    // Add log entry
    setLogEntries([
      ...logEntries,
      { time: "01:15:00", user: "8734 (Operatör)", text: `Drabbad ${newId} registrerad (${newVictimTriage})` }
    ]);
    
    toast({
      title: "Drabbad tillagd",
      description: `Drabbad ${newId} har registrerats.`,
    });
  };
  
  // Add user note to the log
  const handleAddNoteToLog = () => {
    if (!notes.trim()) return;
    
    // Add log entry
    setLogEntries([
      ...logEntries,
      { time: "01:15:00", user: "8734 (Operatör)", text: notes }
    ]);
    
    // Clear notes
    setNotes("");
    
    // Show success toast
    toast({
      title: "Anteckning tillagd",
      description: "Din anteckning har lagts till i loggen.",
    });
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

  const incidentCategories = [
    "Olyckstyp",
    "Platsinfo",
    "Drabbade",
    "Resurser",
    "Åtgärder",
    "Externa enheter",
    "Noteringar",
  ];

  const incidentTypes = [
    "Brott",
    "Trafikolycka",
    "Brand",
    "Sjukvårdslarm",
    "Drunkning",
    "Miljöolycka",
    "Kemisk olycka",
    "Fallolycka",
    "Arbetsplatsolycka",
    "Naturkatastrof",
  ];

  // Add crime-related incidents
  const crimeIncidents = [
    "Överfall - Våldsbrott",
    "Inbrott",
    "Rån",
    "Skottlossning",
    "Knivhuggning",
    "Misshandel",
    "Kidnappning",
    "Hot",
    "Pågående brott",
    "Misstänkt förövare",
  ];

  const trafficAccidents = [
    "Kollision - Fordon/Fordon",
    "Kollision - Fordon/Cykel",
    "Kollision - Fordon/Fotgängare",
    "Kollision - Fordon/Fast föremål",
    "Singelolycka - Avkörning",
    "Singelolycka - Vältning",
    "Kollision - Spårfordon",
    "Tågolycka",
    "Flygolycka",
    "Båtolycka",
  ];

  // Get the right incident subcategory based on the selected main category
  const getIncidentSubcategory = () => {
    switch(selectedCategory) {
      case "Brott":
        return crimeIncidents;
      case "Trafikolycka":
        return trafficAccidents;
      default:
        return trafficAccidents; // Default to traffic accidents for now
    }
  };

  // Status update for formatting
  const getLastUpdated = () => {
    return "Idag 01:15";
  };

  return (
    <div 
      ref={windowRef}
      className={cn(
        "flex flex-col bg-[#f0f0f0] shadow-xl border border-[#aaaaaa] absolute",
        isMaximized ? "w-full h-full" : "w-[900px] h-[650px]"
      )} 
      style={{ 
        left: isMaximized ? 0 : `${position.x}px`, 
        top: isMaximized ? 0 : `${position.y}px`,
        resize: "both",
        overflow: "hidden"
      }}
    >
      {/* Title Bar */}
      <div 
        className="flex items-center justify-between px-2 py-1 bg-[#dfdfdf] border-b border-[#aaaaaa] window-titlebar cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-black">SOS CAD - Incidentrapportering</span>
        </div>
        <div className="flex items-center">
          <button className="px-3 py-1 hover:bg-[#e5e5e5] text-black">
            <HelpCircle size={14} />
          </button>
          <button 
            className="px-3 py-1 hover:bg-[#e5e5e5] text-black"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Tabs Bar - VS Code style */}
      <div className="flex bg-[#f0f0f0] border-b border-[#aaaaaa]">
        <button 
          onClick={() => setActiveTab("information")}
          className={cn(
            "px-3 py-1.5 text-xs border-r border-[#aaaaaa] flex items-center gap-1",
            activeTab === "information" ? "bg-white" : "bg-[#e0e0e0] hover:bg-[#e5e5e5]"
          )}
        >
          <FileText size={14} />
          <span>Händelseinformation</span>
        </button>
        <button 
          onClick={() => setActiveTab("resources")}
          className={cn(
            "px-3 py-1.5 text-xs border-r border-[#aaaaaa] flex items-center gap-1",
            activeTab === "resources" ? "bg-white" : "bg-[#e0e0e0] hover:bg-[#e5e5e5]"
          )}
        >
          <Truck size={14} />
          <span>Resurser</span>
        </button>
        <button 
          onClick={() => setActiveTab("victims")}
          className={cn(
            "px-3 py-1.5 text-xs border-r border-[#aaaaaa] flex items-center gap-1",
            activeTab === "victims" ? "bg-white" : "bg-[#e0e0e0] hover:bg-[#e5e5e5]"
          )}
        >
          <Users size={14} />
          <span>Drabbade</span>
        </button>
        <button 
          onClick={() => setActiveTab("log")}
          className={cn(
            "px-3 py-1.5 text-xs border-r border-[#aaaaaa] flex items-center gap-1",
            activeTab === "log" ? "bg-white" : "bg-[#e0e0e0] hover:bg-[#e5e5e5]"
          )}
        >
          <Clock size={14} />
          <span>Logg</span>
        </button>
        <button 
          onClick={() => setActiveTab("notes")}
          className={cn(
            "px-3 py-1.5 text-xs border-r border-[#aaaaaa] flex items-center gap-1",
            activeTab === "notes" ? "bg-white" : "bg-[#e0e0e0] hover:bg-[#e5e5e5]"
          )}
        >
          <FileEdit size={14} />
          <span>Noteringar</span>
        </button>
      </div>

      {/* Content Area - VS Code inspired layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Explorer */}
        <div className="w-[220px] border-r border-[#aaaaaa] bg-[#f8f8f8] flex flex-col">
          {/* Explorer Header */}
          <div className="px-2 py-1.5 bg-[#e0e0e0] border-b border-[#aaaaaa] text-xs font-medium">
            HÄNDELSENAVIGERING
          </div>
          
          {/* Explorer Content with Windows-style scrollbar */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full windows-scrollbar overflow-y-auto p-1">
              {incidentCategories.map((category) => (
                <div key={category} className="mb-1">
                  <div 
                    onClick={() => toggleExpand(category)} 
                    className={cn(
                      "flex items-center px-1 py-0.5 cursor-pointer hover:bg-[#e5e5e5] text-xs",
                      selectedCategory === category && "bg-[#cce8ff]"
                    )}>
                    {expandedItems[category] ? (
                      <ChevronDown size={12} className="shrink-0" />
                    ) : (
                      <ChevronRight size={12} className="shrink-0" />
                    )}
                    <span className="ml-1">{category}</span>
                  </div>

                  {expandedItems[category] && category === "Olyckstyp" && (
                    <div className="pl-4">
                      {incidentTypes.map((item) => (
                        <div 
                          key={item}
                          onClick={() => setSelectedCategory(item)}
                          className={cn(
                            "px-1 py-0.5 text-xs cursor-pointer hover:bg-[#e5e5e5]", 
                            selectedCategory === item ? "bg-[#0078d7] text-white" : ""
                          )}>
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Main Content with Tab-specific content */}
          <div className="flex-1 p-3 overflow-hidden">
            {activeTab === "information" && (
              <div className="h-full overflow-y-auto windows-scrollbar">
                {/* Incident Header */}
                <div className="mb-4">
                  <div className="flex items-center">
                    <AlertCircle size={16} className="text-red-600 mr-2" />
                    <div className="text-base font-semibold">Händelseinformation - ID: {incidentId}</div>
                  </div>
                  <div className="text-sm mt-1 text-gray-700">Registrerad: Idag 01:15</div>
                </div>
                
                {/* Priority and Status section */}
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <div className="text-xs mb-1 font-medium">Prioritet:</div>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4].map((priority) => (
                        <button 
                          key={priority}
                          onClick={() => setCurrentPriority(priority)}
                          className={cn(
                            "px-3 py-1 border text-xs",
                            currentPriority === priority 
                              ? "bg-[#0078d7] text-white border-[#0078d7]"
                              : "border-[#adadad] bg-[#e1e1e1] hover:bg-[#e5e5e5]"
                          )}
                        >
                          {priority}
                        </button>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {currentPriority === 1 && "Akut livsfara - Omedelbar respons krävs"}
                      {currentPriority === 2 && "Allvarlig situation - Hög prioritet"}
                      {currentPriority === 3 && "Standardprioritering - Normal respons"}
                      {currentPriority === 4 && "Låg prioritet - Kan vänta vid behov"}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs mb-1 font-medium">Status:</div>
                    <select className="bg-white border border-[#7a7a7a] text-xs px-2 py-1 w-[150px]">
                      <option>Pågående</option>
                      <option>Avslutad</option>
                      <option>Pausad</option>
                      <option>Väntar på resurser</option>
                    </select>
                  </div>
                </div>

                {/* Two-column layout for incident type */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Incident Type Selection */}
                  <div>
                    <div className="text-xs mb-1 font-medium">Typ av incident:</div>
                    <div className="relative border border-[#7a7a7a] bg-white">
                      <select 
                        className="w-full p-1 text-xs appearance-none outline-none bg-transparent"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        {incidentTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <div className="absolute right-0 top-0 h-full flex items-center px-2 pointer-events-none">
                        <ChevronDown size={12} />
                      </div>
                    </div>
                  </div>

                  {/* Specific Incident Selection */}
                  <div>
                    <div className="text-xs mb-1 font-medium">Specificera händelse:</div>
                    <div className="relative border border-[#7a7a7a] bg-white">
                      <select 
                        className="w-full p-1 text-xs appearance-none outline-none bg-transparent"
                        value={selectedIncident}
                        onChange={(e) => setSelectedIncident(e.target.value)}
                      >
                        {getIncidentSubcategory().map(incident => (
                          <option key={incident} value={incident}>{incident}</option>
                        ))}
                      </select>
                      <div className="absolute right-0 top-0 h-full flex items-center px-2 pointer-events-none">
                        <ChevronDown size={12} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="mb-4">
                  <div className="flex items-center mb-1">
                    <MapPin size={14} className="mr-1" />
                    <span className="text-xs font-medium">Platsinformation</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <div className="text-xs mb-1">Adress:</div>
                      <input 
                        type="text" 
                        className="w-full p-1 text-xs border border-[#7a7a7a] outline-none" 
                        placeholder="Gatuadress"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    <div>
                      <div className="text-xs mb-1">Ort:</div>
                      <input 
                        type="text" 
                        className="w-full p-1 text-xs border border-[#7a7a7a] outline-none" 
                        placeholder="Ort"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="text-xs mb-1">Platsbeskrivning:</div>
                  <textarea 
                    className="w-full p-1 text-xs border border-[#7a7a7a] outline-none h-[60px] resize-none"
                    placeholder="Beskriv platsen för incidenten..."
                    value={locationDescription}
                    onChange={(e) => setLocationDescription(e.target.value)}
                  ></textarea>
                </div>

                {/* Reporter Information */}
                <div className="mb-4">
                  <div className="flex items-center mb-1">
                    <Phone size={14} className="mr-1" />
                    <span className="text-xs font-medium">Anmälare</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-xs mb-1">Namn:</div>
                      <input 
                        type="text" 
                        className="w-full p-1 text-xs border border-[#7a7a7a] outline-none" 
                        placeholder="Namn på anmälaren"
                        value={reporterName}
                        onChange={(e) => setReporterName(e.target.value)}
                      />
                    </div>
                    <div>
                      <div className="text-xs mb-1">Telefonnummer:</div>
                      <input 
                        type="text" 
                        className="w-full p-1 text-xs border border-[#7a7a7a] outline-none" 
                        placeholder="Telefonnummer"
                        value={reporterPhone}
                        onChange={(e) => setReporterPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "resources" && (
              <div className="h-full p-2 overflow-y-auto windows-scrollbar">
                <h3 className="text-sm font-medium mb-2">Tillgängliga Resurser</h3>
                <div className="border border-[#7a7a7a] mb-4">
                  <table className="w-full text-xs">
                    <thead className="bg-[#e0e0e0]">
                      <tr>
                        <th className="p-1 text-left border-b border-r border-[#7a7a7a]">ID</th>
                        <th className="p-1 text-left border-b border-r border-[#7a7a7a]">Typ</th>
                        <th className="p-1 text-left border-b border-r border-[#7a7a7a]">Station</th>
                        <th className="p-1 text-left border-b border-r border-[#7a7a7a]">Status</th>
                        <th className="p-1 text-left border-b border-[#7a7a7a]">ETA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resources.map((resource, index) => (
                        <tr key={resource.id} className={index % 2 === 0 ? "bg-white" : "bg-[#f9f9f9]"}>
                          <td className="p-1 border-r border-b border-[#7a7a7a]">{resource.id}</td>
                          <td className="p-1 border-r border-b border-[#7a7a7a]">{resource.type}</td>
                          <td className="p-1 border-r border-b border-[#7a7a7a]">{resource.station}</td>
                          <td className="p-1 border-r border-b border-[#7a7a7a]">
                            <span className={cn(
                              "px-1",
                              resource.status === "På väg" ? "bg-green-100 text-green-800" :
                              resource.status === "Mobiliserad" ? "bg-blue-100 text-blue-800" :
                              "bg-gray-100 text-gray-800"
                            )}>
                              {resource.status}
                            </span>
                          </td>
                          <td className="p-1 border-b border-[#7a7a7a]">{resource.eta}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <h3 className="text-sm font-medium mb-2">Begär ytterligare resurser</h3>
                <div className="flex gap-2">
                  <select 
                    className="bg-white border border-[#7a7a7a] text-xs p-1"
                    value={newResourceType}
                    onChange={(e) => setNewResourceType(e.target.value)}
                  >
                    <option>Ambulans</option>
                    <option>Brandbil</option>
                    <option>Polis</option>
                    <option>Helikopter</option>
                    <option>Specialfordon</option>
                  </select>
                  <select 
                    className="bg-white border border-[#7a7a7a] text-xs p-1"
                    value={newResourcePriority}
                    onChange={(e) => setNewResourcePriority(e.target.value)}
                  >
                    <option>Prioritet 1</option>
                    <option>Prioritet 2</option>
                    <option>Prioritet 3</option>
                    <option>Prioritet 4</option>
                  </select>
                  <button 
                    className="px-2 py-1 border border-[#adadad] bg-[#e1e1e1] hover:bg-[#e5e5e5] text-xs"
                    onClick={handleAddResource}
                  >
                    Lägg till
                  </button>
                </div>
              </div>
            )}

            {activeTab === "victims" && (
              <div className="h-full p-2 overflow-y-auto windows-scrollbar">
                <h3 className="text-sm font-medium mb-2">Drabbade</h3>
                <div className="border border-[#7a7a7a] mb-4">
                  <table className="w-full text-xs">
                    <thead className="bg-[#e0e0e0]">
                      <tr>
                        <th className="p-1 text-left border-b border-r border-[#7a7a7a]">ID</th>
                        <th className="p-1 text-left border-b border-r border-[#7a7a7a]">Status</th>
                        <th className="p-1 text-left border-b border-r border-[#7a7a7a]">Triagering</th>
                        <th className="p-1 text-left border-b border-[#7a7a7a]">Transport</th>
                      </tr>
                    </thead>
                    <tbody>
                      {victims.map((victim, index) => (
                        <tr key={victim.id} className={index % 2 === 0 ? "bg-white" : "bg-[#f9f9f9]"}>
                          <td className="p-1 border-r border-b border-[#7a7a7a]">{victim.id}</td>
                          <td className="p-1 border-r border-b border-[#7a7a7a]">{victim.status}</td>
                          <td className="p-1 border-r border-b border-[#7a7a7a]">
                            <span className={cn(
                              "px-1",
                              victim.triage === "Röd" ? "bg-red-100 text-red-800" :
                              victim.triage === "Gul" ? "bg-yellow-100 text-yellow-800" :
                              victim.triage === "Grön" ? "bg-green-100 text-green-800" :
                              "bg-gray-100 text-gray-800"
                            )}>
                              {victim.triage}
                            </span>
                          </td>
                          <td className="p-1 border-b border-[#7a7a7a]">{victim.transport}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h3 className="text-sm font-medium mb-2">Lägg till drabbad</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs mb-1">Status:</div>
                    <select 
                      className="w-full p-1 text-xs border border-[#7a7a7a] outline-none"
                      value={newVictimStatus}
                      onChange={(e) => setNewVictimStatus(e.target.value)}
                    >
                      <option>Vaken</option>
                      <option>Medvetslös</option>
                      <option>Avliden</option>
                      <option>Okänd</option>
                    </select>
                  </div>
                  <div>
                    <div className="text-xs mb-1">Triagering:</div>
                    <select 
                      className="w-full p-1 text-xs border border-[#7a7a7a] outline-none"
                      value={newVictimTriage}
                      onChange={(e) => setNewVictimTriage(e.target.value)}
                    >
                      <option>Grön</option>
                      <option>Gul</option>
                      <option>Röd</option>
                      <option>Svart</option>
                    </select>
                  </div>
                </div>
                <div className="mt-2">
                  <button 
                    className="px-2 py-1 border border-[#adadad] bg-[#e1e1e1] hover:bg-[#e5e5e5] text-xs"
                    onClick={handleAddVictim}
                  >
                    Lägg till drabbad
                  </button>
                </div>
              </div>
            )}

            {activeTab === "log" && (
              <div className="h-full p-2 overflow-y-auto windows-scrollbar">
                <h3 className="text-sm font-medium mb-2">Händelselogg</h3>
                <div className="border border-[#7a7a7a] bg-white h-[calc(100%-115px)] overflow-y-auto windows-scrollbar">
                  {logEntries.map((entry, index) => (
                    <div key={index} className={cn("p-1 border-b border-[#7a7a7a]", index % 2 === 0 ? "bg-[#f8f8f8]" : "")}>
                      <div className="text-xs font-medium">{entry.time} - {entry.user}</div>
                      <div className="text-xs">{entry.text}</div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3">
                  <div className="text-xs mb-1">Lägg till i loggen:</div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      className="flex-1 p-1 text-xs border border-[#7a7a7a] outline-none" 
                      placeholder="Skriv loggmeddelande..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddNoteToLog()}
                    />
                    <button 
                      className="px-2 py-1 border border-[#adadad] bg-[#e1e1e1] hover:bg-[#e5e5e5] text-xs"
                      onClick={handleAddNoteToLog}
                    >
                      Lägg till
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notes" && (
              <div className="h-full p-2 overflow-y-auto windows-scrollbar">
                <h3 className="text-sm font-medium mb-2">Anteckningar</h3>
                <textarea 
                  className="w-full h-[calc(100%-40px)] p-1 text-xs border border-[#7a7a7a] outline-none resize-none bg-white"
                  placeholder="Skriv anteckningar här..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>
            )}
          </div>
          
          {/* Status Bar */}
          <div className="flex items-center justify-between px-3 py-1 bg-[#e0e0e0] border-t border-[#aaaaaa] text-xs">
            <div>Användare: 8734 (Operatör)</div>
            <div>Senast uppdaterad: {getLastUpdated()}</div>
          </div>
        </div>

        {/* Optional Right Sidebar for Details */}
        <div className="w-[200px] border-l border-[#aaaaaa] bg-[#f8f8f8] flex flex-col">
          <div className="px-2 py-1.5 bg-[#e0e0e0] border-b border-[#aaaaaa] text-xs font-medium">
            DETALJER
          </div>
          <div className="p-2 overflow-y-auto windows-scrollbar flex-1">
            <div className="mb-3">
              <div className="text-xs font-medium">ID</div>
              <div className="text-xs">{incidentId}</div>
            </div>
            <div className="mb-3">
              <div className="text-xs font-medium">Skapad</div>
              <div className="text-xs">Idag 01:15</div>
            </div>
            <div className="mb-3">
              <div className="text-xs font-medium">Operatör</div>
              <div className="text-xs">8734</div>
            </div>
            <div className="mb-3">
              <div className="text-xs font-medium">Prioritet</div>
              <div className="text-xs">{currentPriority} - {
                currentPriority === 1 ? "Akut" : 
                currentPriority === 2 ? "Hög" : 
                currentPriority === 3 ? "Normal" : 
                "Låg"
              }</div>
            </div>
            <div className="mb-3">
              <div className="text-xs font-medium">Status</div>
              <div className="text-xs">Pågående</div>
            </div>
            <div className="mb-3">
              <div className="text-xs font-medium">Tilldelade resurser</div>
              <div className="text-xs">Ambulans: {resources.filter(r => r.type === "Ambulans").length}</div>
              <div className="text-xs">Brandkår: {resources.filter(r => r.type === "Brandbil").length}</div>
              <div className="text-xs">Polis: {resources.filter(r => r.type === "Polis").length}</div>
              <div className="text-xs">Övrigt: {resources.filter(r => !["Ambulans", "Brandbil", "Polis"].includes(r.type)).length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex justify-end gap-2 p-2 border-t border-[#aaaaaa] bg-[#f0f0f0]">
        <button 
          className="px-6 py-1 bg-red-600 text-white hover:bg-red-700 border border-red-600 text-xs"
          onClick={() => {
            toast({
              title: "Nödanrop skickat",
              description: "Nödanrop har skickats till alla enheter.",
              variant: "destructive"
            });
            
            // Add to log
            setLogEntries([
              ...logEntries,
              { time: "01:15:00", user: "System", text: "NÖDANROP SKICKAT TILL ALLA ENHETER" }
            ]);
          }}
        >
          Nödanrop
        </button>
        <button 
          className="px-6 py-1 bg-[#0078d7] text-white hover:bg-[#106ebe] border border-[#0078d7] text-xs flex items-center gap-1"
          onClick={handleSaveIncident}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin">
                <svg className="h-3 w-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
              <span>Sparar...</span>
            </>
          ) : (
            <>
              <Check size={14} />
              <span>Spara</span>
            </>
          )}
        </button>
        <button 
          className="px-4 py-1 border border-[#adadad] bg-[#e1e1e1] hover:bg-[#e5e5e5] text-xs"
          onClick={onClose}
        >
          Avbryt
        </button>
      </div>
      
      {/* Resize handle */}
      <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 2L2 22" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 8L8 22" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 14L14 22" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
};
