import React, { useState, useRef, useEffect } from "react";
import { X, HelpCircle, FileText, Search, Filter, Download, Printer, Eye, Edit, Trash2, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Mock data for reports
interface Report {
  id: string;
  title: string;
  type: string;
  date: string;
  status: "Utkast" | "Sparad" | "Inskickad" | "Godkänd";
  author: string;
}

// Interface for the report data including the highlight flag
interface DisplayReport extends Report {
  highlight: boolean;
}

const mockReports: Report[] = [ // Removed isUrgent from mock data
  { id: "R-2023-001", title: "Trafikolycka E4 Södertälje", type: "Incident", date: "2023-11-15", status: "Godkänd", author: "A. Andersson" },
  { id: "R-2023-002", title: "Brand i flerfamiljshus Huddinge", type: "Incident", date: "2023-11-18", status: "Godkänd", author: "M. Svensson" },
  { id: "R-2023-003", title: "Veckorapport SOS Alarm", type: "Veckovis", date: "2023-11-20", status: "Inskickad", author: "J. Johansson" },
  { id: "R-2023-004", title: "Översvämning Mälaren", type: "Incident", date: "2023-11-22", status: "Sparad", author: "L. Lindberg" },
  { id: "R-2023-005", title: "Månadssummering November", type: "Månadsvis", date: "2023-11-30", status: "Utkast", author: "K. Karlsson" },
  { id: "R-2023-006", title: "Strömavbrott Norrmalm", type: "Incident", date: "2023-12-01", status: "Sparad", author: "P. Persson" },
  { id: "R-2023-007", title: "Trafikolycka Essingeleden", type: "Incident", date: "2023-12-03", status: "Utkast", author: "A. Andersson" },
  { id: "R-2023-008", title: "Veckorapport SOS Alarm", type: "Veckovis", date: "2023-12-04", status: "Utkast", author: "J. Johansson" },
  { id: "R-2024-009", title: "Inbrott Centralstationen", type: "Incident", date: "2024-01-05", status: "Godkänd", author: "M. Svensson" },
  { id: "R-2024-010", title: "Systemunderhåll Rapport", type: "Teknisk", date: "2024-01-10", status: "Inskickad", author: "System Admin" },
  { id: "R-2024-011", title: "Misstänkt hjärtstopp Gamla Stan", type: "Incident", date: "2024-01-12", status: "Sparad", author: "L. Lindberg" },
  { id: "R-2024-012", title: "Månadssummering December", type: "Månadsvis", date: "2024-01-15", status: "Godkänd", author: "K. Karlsson" },
  { id: "R-2024-013", title: "Personalmöte Protokoll", type: "Möte", date: "2024-01-18", status: "Sparad", author: "Admin" },
  { id: "R-2024-014", title: "Gasläcka Södermalm", type: "Incident", date: "2024-01-20", status: "Utkast", author: "P. Persson" },
  { id: "R-2024-015", title: "Veckorapport SOS Alarm", type: "Veckovis", date: "2024-01-22", status: "Inskickad", author: "J. Johansson" },
  { id: "R-2024-016", title: "Större polisinsats Rinkeby", type: "Incident", date: "2024-01-25", status: "Godkänd", author: "A. Andersson" },
  { id: "R-2024-017", title: "IT-incident Serverrum", type: "Teknisk", date: "2024-01-28", status: "Sparad", author: "System Admin" },
  { id: "R-2024-018", title: "Månadssummering Januari", type: "Månadsvis", date: "2024-01-31", status: "Utkast", author: "K. Karlsson" },
];

export const ViewReportsWindow = ({ onClose }: { onClose?: () => void }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [displayReports, setDisplayReports] = useState<DisplayReport[]>([]); // State for reports with random highlight
  const [filteredReports, setFilteredReports] = useState<DisplayReport[]>([]); // State for filtered/sorted reports
  const [sortField, setSortField] = useState<keyof Report>("date"); // Sort field remains keyof Report
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  
  // Dragging functionality
  const [position, setPosition] = useState({ x: 200, y: 120 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Randomize highlights on mount
  useEffect(() => {
    const randomized = mockReports.map(report => ({
      ...report,
      highlight: Math.random() < 0.5 // Assign random highlight flag
    }));
    setDisplayReports(randomized);
  }, []); // Empty dependency array ensures this runs only once on mount

  // Filter and sort reports based on displayReports
  useEffect(() => {
    let results = [...displayReports]; // Start with the randomized reports

    // Apply search filter
    if (searchTerm) {
      results = results.filter(report => 
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type/status filter
    if (selectedFilter !== "all") {
      if (["Incident", "Daglig", "Veckovis", "Månadsvis", "Årsrapport"].includes(selectedFilter)) {
        results = results.filter(report => report.type === selectedFilter);
      } else {
        results = results.filter(report => report.status === selectedFilter);
      }
    }
    
    // Apply sorting
    results.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    
    setFilteredReports(results);
  }, [searchTerm, sortField, sortDirection, selectedFilter, displayReports]); // Add displayReports dependency

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

  // Handle sorting
  const handleSort = (field: keyof Report) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get status color
  const getStatusColor = (status: Report["status"]) => {
    switch (status) {
      case "Utkast": return "bg-gray-200 text-gray-800";
      case "Sparad": return "bg-blue-100 text-blue-800";
      case "Inskickad": return "bg-yellow-100 text-yellow-800";
      case "Godkänd": return "bg-green-100 text-green-800";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div 
      ref={windowRef}
      className={cn(
        "flex flex-col bg-[#f0f0f0] shadow-xl border border-[#aaaaaa] absolute",
        "w-[800px] h-[600px]"
      )} 
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        resize: "both",
        overflow: "hidden",
        minWidth: "500px",
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
          <span className="text-sm font-medium text-black">Visa rapporter</span>
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

      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-[#aaaaaa] bg-[#e5e5e5]">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1.5 h-4 w-4 text-gray-500" />
            <Input
              className="h-7 text-xs pl-8 w-[200px]"
              placeholder="Sök rapporter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="h-7 text-xs border border-[#7a7a7a] rounded px-2"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="all">Alla rapporter</option>
            <option disabled>──────────</option>
            <option value="Incident">Incident</option>
            <option value="Daglig">Daglig</option>
            <option value="Veckovis">Veckovis</option>
            <option value="Månadsvis">Månadsvis</option>
            <option value="Årsrapport">Årsrapport</option>
            <option disabled>──────────</option>
            <option value="Utkast">Utkast</option>
            <option value="Sparad">Sparad</option>
            <option value="Inskickad">Inskickad</option>
            <option value="Godkänd">Godkänd</option>
          </select>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs bg-[#e0e0e0] hover:bg-[#d0d0d0] flex items-center gap-1"
            disabled={!selectedReportId}
          >
            <Eye size={12} />
            <span>Visa</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs bg-[#e0e0e0] hover:bg-[#d0d0d0] flex items-center gap-1"
            disabled={!selectedReportId}
          >
            <Download size={12} />
            <span>Exportera</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs bg-[#e0e0e0] hover:bg-[#d0d0d0] flex items-center gap-1"
            disabled={!selectedReportId}
          >
            <Printer size={12} />
            <span>Skriv ut</span>
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Reports Table */}
        <div className="flex-1 overflow-y-auto windows-scrollbar">
          <table className="w-full text-xs border-collapse">
            <thead className="sticky top-0 bg-[#e0e0e0]">
              <tr>
                <th 
                  className="p-1 text-left border-b border-r border-[#aaaaaa] font-normal cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center">
                    <span>ID</span>
                    {sortField === "id" && (
                      <ArrowUpDown size={12} className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="p-1 text-left border-b border-r border-[#aaaaaa] font-normal cursor-pointer"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center">
                    <span>Titel</span>
                    {sortField === "title" && (
                      <ArrowUpDown size={12} className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="p-1 text-left border-b border-r border-[#aaaaaa] font-normal cursor-pointer"
                  onClick={() => handleSort("type")}
                >
                  <div className="flex items-center">
                    <span>Typ</span>
                    {sortField === "type" && (
                      <ArrowUpDown size={12} className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="p-1 text-left border-b border-r border-[#aaaaaa] font-normal cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    <span>Datum</span>
                    {sortField === "date" && (
                      <ArrowUpDown size={12} className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="p-1 text-left border-b border-r border-[#aaaaaa] font-normal cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    <span>Status</span>
                    {sortField === "status" && (
                      <ArrowUpDown size={12} className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="p-1 text-left border-b border-[#aaaaaa] font-normal cursor-pointer"
                  onClick={() => handleSort("author")}
                >
                  <div className="flex items-center">
                    <span>Författare</span>
                    {sortField === "author" && (
                      <ArrowUpDown size={12} className="ml-1" />
                    )}
                  </div>
                </th>
                <th className="p-1 text-center border-b border-[#aaaaaa] font-normal w-[80px]">Åtgärder</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report, index) => (
                <tr
                  key={report.id}
                  className={cn(
                    "hover:bg-[#e5e5e5] cursor-pointer",
                    // Apply red background based on the random 'highlight' flag
                    report.highlight ? "bg-red-100" : (index % 2 === 0 ? "bg-white" : "bg-gray-50"), // Alternate non-highlighted rows
                    selectedReportId === report.id ? "!bg-[#cce4ff]" : "" // Selection overrides other backgrounds
                  )}
                  onClick={() => setSelectedReportId(report.id)}
                >
                  <td className="p-1 border-r border-b border-[#aaaaaa]">{report.id}</td>
                  <td className="p-1 border-r border-b border-[#aaaaaa]">{report.title}</td>
                  <td className="p-1 border-r border-b border-[#aaaaaa]">{report.type}</td>
                  <td className="p-1 border-r border-b border-[#aaaaaa]">{report.date}</td>
                  <td className="p-1 border-r border-b border-[#aaaaaa]">
                    <span className={cn(
                      "px-1.5 py-0.5 rounded text-[10px]",
                      getStatusColor(report.status),
                      report.highlight ? "border border-red-300" : "" // Optional: add border to status if highlighted
                      )}>
                      {report.status}
                    </span>
                  </td>
                  <td className="p-1 border-b border-[#aaaaaa]">{report.author}</td>
                  <td className="p-1 border-b border-[#aaaaaa] text-center">
                    <div className="flex justify-center gap-1">
                      {/* Adjust hover based on highlight */}
                      <button className={cn("p-1 hover:bg-[#d0d0d0] rounded", report.highlight ? "hover:bg-red-200" : "")}>
                        <Eye size={12} className="text-blue-600" />
                      </button>
                      <button className={cn("p-1 hover:bg-[#d0d0d0] rounded", report.highlight ? "hover:bg-red-200" : "")}>
                        <Edit size={12} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-[#e0e0e0] rounded">
                        <Trash2 size={12} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-500">
                    Inga rapporter hittades
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Status Bar */}
        <div className="flex items-center justify-between px-3 py-1 bg-[#e0e0e0] border-t border-[#aaaaaa] text-xs">
          <div>Totalt antal rapporter: {filteredReports.length}</div>
          <div>Användare: 8734 (Operatör)</div>
        </div>
      </div>
    </div>
  );
};
