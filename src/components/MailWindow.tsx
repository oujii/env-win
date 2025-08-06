import React, { useState, useRef, useEffect } from "react";
import { Search, Archive, Reply, ReplyAll, Forward, Delete, Flag, MoreHorizontal, ChevronDown, Sparkles, Usb, Clock, Star, Settings, Plus, Folder, RefreshCw, List, Send, X, Trash2, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import WindowTitleBar from "./WindowTitleBar";

// Define props interface
interface MailWindowProps {
  isMinimized: boolean;
  setIsMinimized: React.Dispatch<React.SetStateAction<boolean>>;
  isClosed: boolean;
  setIsClosed: React.Dispatch<React.SetStateAction<boolean>>;
  isActive: boolean;
  onFocus: () => void;
}

export const MailWindow: React.FC<MailWindowProps> = ({
  isMinimized,
  setIsMinimized,
  isClosed,
  setIsClosed,
  isActive,
  onFocus
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(0); // Index of selected email
  const [isComposing, setIsComposing] = useState(false);
  const [composeData, setComposeData] = useState({
    to: '',
    cc: '',
    subject: '',
    body: ''
  });
  const [showRecipientSuggestions, setShowRecipientSuggestions] = useState(false);
  const [showCcSuggestions, setShowCcSuggestions] = useState(false);
  const [showCc, setShowCc] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);
  
  // Windowed mode state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Recipient suggestions
  const recipientSuggestions = [
    { name: "Natalie Eklund", email: "natalie.eklund@polisen.se" },
    { name: "Thomas Berg", email: "thomas.berg@polisen.se" },
    { name: "Max Abrahamsson", email: "max.abrahamsson@polisen.se" },
    { name: "Mikael Östman", email: "mikael.ostman@polisen.se" },
    { name: "Anna Lindberg", email: "anna.lindberg@polisen.se" },
    { name: "Erik Johansson", email: "erik.johansson@polisen.se" }
  ];

  // Mock email data
  const emails = [
 {
      sender: "Polisens IT-avdelning",
      email: "it@polisen.se",
      subject: "Angående nya säkerhetsrutinerna",
      preview: "Hej, Som en del av vårt kontinuerliga arbete med att stärka informationssäkerheten har vi introducerat några nya säkerhetsrutiner...",
      time: "14:33",
      unread: true
    },
    {
      sender: "Mikael Östman",
      email: "mikael.ostman@polisen.se", 
      subject: "Avslutade avspärrningar vid Sergels",
      preview: "Hej, Jag fick ett beslut från ledningscentralen i natt om utökade avspärrningar runt Sergels torg med anledning av pågående utredning. Avspärringarna gäller främst nedgångarna till tunnelbanan samt området närmast fontänen...",
      time: "14:31",
      unread: false
    },
    {
      sender: "Elisabet Hager",
      email: "elisabet.hager@stockholm.se",
      subject: "Trafikstörningar runtom Stockholm",
      preview: "Information om trafikstörningar",
      time: "13:56",
      unread: false
    },
    {
      sender: "Olof Lundbäck", 
      email: "olof.lundback@polisen.se",
      subject: "Personalresurser Kungsholmen",
      preview: "Förfrågan om personalresurser",
      time: "09:45",
      unread: false
    },
    {
      sender: "Emma Karlsson",
      email: "e.karlsson@regionstockholm.se", 
      subject: "Utläggen till informationsmöte",
      preview: "Utläggen till informationsmöte",
      time: "mån 16:18",
      unread: false
    },
    {
      sender: "Patrik Eklund",
      email: "patrik.eklund@polisen.se",
      subject: "Personalresurser Södermalm",
      preview: "Förfrågan om personalresurser",
      time: "mån 11:09",
      unread: false
    }
  ];

  // Calculate default windowed size and position
  const calculateWindowedDimensions = () => {
    const taskbarHeight = 48;
    const availableWidth = window.innerWidth;
    const availableHeight = window.innerHeight - taskbarHeight;
    
    const width = Math.floor(availableWidth * 0.8); // 80% width
    const height = Math.floor(availableHeight * 0.8); // 80% height
    
    const x = Math.floor((availableWidth - width) / 2);
    const y = Math.floor((availableHeight - height) / 2);
    
    return { x, y, width, height };
  };

  // Initialize windowed dimensions on first render
  useEffect(() => {
    if (windowSize.width === 0 && windowSize.height === 0) {
      const dimensions = calculateWindowedDimensions();
      setPosition({ x: dimensions.x, y: dimensions.y });
      setWindowSize({ width: dimensions.width, height: dimensions.height });
    }
  }, [windowSize.width, windowSize.height]);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    setIsClosed(true);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  // Compose email functions
  const handleNewEmail = () => {
    setIsComposing(true);
    setComposeData({ to: '', cc: '', subject: '', body: '' });
    setShowCc(false);
  };

  const handleSendEmail = async () => {
    setIsSending(true);

    // Simulate sending email with delay
    console.log('Sending email:', composeData);

    // Small delay to simulate sending
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSending(false);
    setIsComposing(false);
    setComposeData({ to: '', cc: '', subject: '', body: '' });
  };

  const handleRecipientSelect = (recipient: { name: string; email: string }, field: 'to' | 'cc') => {
    const recipientString = `${recipient.name} <${recipient.email}>`;
    setComposeData(prev => ({ ...prev, [field]: recipientString }));
    setShowRecipientSuggestions(false);
    setShowCcSuggestions(false);
  };

  const handleRecipientInput = (value: string, field: 'to' | 'cc') => {
    setComposeData(prev => ({ ...prev, [field]: value }));
    if (field === 'to') {
      setShowRecipientSuggestions(value.length > 0);
    } else {
      setShowCcSuggestions(value.length > 0);
    }
  };

  const handleWindowClick = () => {
    onFocus();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  // Mouse event handlers for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || isMaximized) return;

      const taskbarHeight = 48;
      const availableWidth = window.innerWidth;
      const availableHeight = window.innerHeight - taskbarHeight;
      const windowRect = windowRef.current?.getBoundingClientRect();

      if (windowRect) {
        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;

        const maxX = availableWidth - windowRect.width;
        const maxY = availableHeight - windowRect.height;

        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, isMaximized]);

  if (isClosed || isMinimized) {
    return null;
  }

  return (
    <div
      ref={windowRef}
      className={cn(
        "flex flex-col bg-white shadow-xl border border-[#a0a0a0]",
        isMaximized ? "fixed inset-0 bottom-12" : "absolute"
      )}
      style={isMaximized ? {
        zIndex: isActive ? 40 : 30
      } : {
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${windowSize.width}px`,
        height: `${windowSize.height}px`,
        resize: "both",
        overflow: "hidden",
        minWidth: "800px",
        minHeight: "600px",
        cursor: isDragging ? "grabbing" : "default",
        zIndex: isActive ? 40 : 30
      }}
      onClick={handleWindowClick}
    >
      {/* Use WindowTitleBar for standard window controls */}
      <WindowTitleBar
        title="Mail"
        isMainWindow={true}
        isChatWindow={true}
        isMailWindow={true}
        isFullscreen={isMaximized}
        isActive={isActive}
        onClose={handleClose}
        onMinimize={handleMinimize}
        onMaximize={toggleMaximize}
        onMouseDown={handleMouseDown}
      />

      {/* Mail Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Far Left Sidebar - Icons */}
        <div className="w-12 bg-[#f8f9fa] border-r border-gray-200 flex flex-col items-center justify-start py-4">
          <div className="flex flex-col items-center space-y-4">
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded" title="Sparkles">
              <Sparkles size={18} className="text-gray-600" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded" title="USB">
              <Usb size={18} className="text-gray-600" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded" title="Clock">
              <Clock size={18} className="text-gray-600" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded" title="Favorite">
              <Star size={18} className="text-gray-600" />
            </button>
          </div>

          {/* Settings at bottom */}
          <div className="mt-auto">
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded" title="Settings">
              <Settings size={18} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Left Sidebar - Folders */}
        <div className="w-64 bg-[#337FA8] text-white flex flex-col" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
          {/* Account Section */}
          <div className="p-4 border-b border-[#2a6b8f]">
            <button
              className="flex items-center text-sm font-medium hover:bg-[#2a6b8f] rounded px-2 py-1 w-full text-left"
              onClick={handleNewEmail}
            >
              <Plus size={16} className="mr-2" />
              Ny E-post
            </button>
          </div>

          {/* Folders Section */}
          <div className="p-4 border-b border-[#2a6b8f]">
            <div className="flex items-center text-xs text-gray-200 mb-3">
              <Folder size={14} className="mr-2" />
              Foldrar
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 px-3 bg-[#2a6b8f] rounded text-sm">
                <span>Inkorg</span>
                <span className="text-xs">5</span>
              </div>
              <div className="py-2 px-3 text-sm hover:bg-[#2a6b8f] rounded cursor-pointer">Skickat</div>
              <div className="py-2 px-3 text-sm hover:bg-[#2a6b8f] rounded cursor-pointer">Aktiva ärenden</div>
              <div className="py-2 px-3 text-sm hover:bg-[#2a6b8f] rounded cursor-pointer">Avslutade ärenden</div>
              <div className="py-2 px-3 text-sm hover:bg-[#2a6b8f] rounded cursor-pointer">Samverkan</div>
              <div className="py-2 px-3 text-sm hover:bg-[#2a6b8f] rounded cursor-pointer">Mötesprotokoll</div>
              <div className="py-2 px-3 text-sm hover:bg-[#2a6b8f] rounded cursor-pointer">Personal</div>
              <div className="py-2 px-3 text-sm hover:bg-[#2a6b8f] rounded cursor-pointer">Press</div>

            </div>
          </div>

          {/* Police Logo */}
          <div className="mt-auto p-6 flex justify-center">
            <img
              src="/polislogga-mail.png"
              alt="Polisen Logo"
              className="w-30 h-30 object-contain"
              onError={(e) => {
                // Fallback if image doesn't load
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="h-12 bg-[#f8f9fa] border-b border-gray-200 flex items-center justify-end px-4 gap-2">
            <div className="flex items-center gap-2">
              {isComposing ? (
                /* Compose Mode Toolbar */
                <>
                  <button
                    className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${
                      isSending
                        ? 'bg-blue-600 text-white cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    onClick={handleSendEmail}
                    disabled={isSending}
                  >
                    {isSending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Skickar...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Skicka</span>
                      </>
                    )}
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded" title="Radera">
                    <Trash2 size={16} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded" title="Bifoga">
                    <Paperclip size={16} className="text-gray-600" />
                  </button>
                </>
              ) : (
                /* Read Mode Toolbar */
                <>
                  <button className="flex items-center gap-1 px-2 py-1 hover:bg-gray-200 rounded text-sm">
                    <Reply size={16} />
                    <span>Svara</span>
                  </button>
                  <button className="flex items-center gap-1 px-2 py-1 hover:bg-gray-200 rounded text-sm">
                    <ReplyAll size={16} />
                    <span>Svara alla</span>
                  </button>
                  <button className="flex items-center gap-1 px-2 py-1 hover:bg-gray-200 rounded text-sm">
                    <Forward size={16} />
                    <span>Vidarebefodra</span>
                  </button>
                  <button className="flex items-center gap-1 px-2 py-1 hover:bg-gray-200 rounded text-sm">
                    <Archive size={16} />
                    <span>Arkiv</span>
                  </button>
                  <button className="flex items-center gap-1 px-2 py-1 hover:bg-gray-200 rounded text-sm">
                    <Delete size={16} />
                    <span>Radera</span>
                  </button>
                  <button className="flex items-center gap-1 px-2 py-1 hover:bg-gray-200 rounded text-sm">
                    <Flag size={16} />
                    <span>Flagga</span>
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded">
                    <MoreHorizontal size={16} />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Email List */}
            <div className="w-80 border-r border-gray-200 overflow-y-auto">
              {/* Search Bar */}
              <div className="p-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Sök i e-post"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="p-2 hover:bg-gray-200 rounded" title="Refresh">
                    <RefreshCw size={16} className="text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded" title="List options">
                    <List size={16} className="text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600 bg-blue-50">
                    Prioriterad
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                    Andra
                  </button>
                  <div className="ml-auto p-2">
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <ChevronDown size={16} className="text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {emails.map((email, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-3 cursor-pointer hover:bg-gray-100",
                      selectedEmail === index ? "bg-gray-200" : "",
                      email.unread ? "bg-blue-25" : ""
                    )}
                    onClick={() => setSelectedEmail(index)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-[#013D8F] rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                        {email.sender.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className={cn("text-sm truncate", email.unread ? "font-semibold" : "font-medium")}>
                            {email.sender}
                          </div>
                          <div className="text-xs text-gray-500 ml-2">{email.time}</div>
                        </div>
                        <div className="text-xs text-gray-600 truncate">{email.email}</div>
                        <div className={cn("text-sm mt-1", email.unread ? "font-medium" : "")}>
                          {email.subject}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {email.preview}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {isComposing ? (
                /* Compose Email View */
                <div className="flex-1 flex flex-col p-4 bg-white">
                  {/* Compose Header */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-medium">Nytt meddelande</h2>
                      <button
                        className="p-1 hover:bg-gray-200 rounded"
                        onClick={() => setIsComposing(false)}
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* To Field */}
                    <div className="mb-4 relative">
                      <div className="flex items-center">
                        <label className="w-12 text-sm text-gray-600">Till:</label>
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={composeData.to}
                            onChange={(e) => handleRecipientInput(e.target.value, 'to')}
                            className="w-full px-2 py-2 border-0 border-b border-gray-300 text-sm focus:outline-none focus:border-b-2 focus:border-blue-500 bg-transparent"
                            placeholder="Ange namn eller e-postadress"
                          />
                          {showRecipientSuggestions && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 shadow-lg z-10 max-h-40 overflow-y-auto">
                              {recipientSuggestions
                                .filter(r => r.name.toLowerCase().includes(composeData.to.toLowerCase()) || r.email.toLowerCase().includes(composeData.to.toLowerCase()))
                                .map((recipient, index) => (
                                <div
                                  key={index}
                                  className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm flex items-center"
                                  onClick={() => handleRecipientSelect(recipient, 'to')}
                                >
                                  <div className="w-8 h-8 bg-[#013D8F] rounded-full flex items-center justify-center text-white text-xs font-medium mr-3 flex-shrink-0">
                                    {recipient.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div>
                                    <div className="font-medium">{recipient.name}</div>
                                    <div className="text-gray-600 text-xs">{recipient.email}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          className="ml-2 text-sm text-blue-600 hover:text-blue-800"
                          onClick={() => setShowCc(!showCc)}
                        >
                          Cc
                        </button>
                      </div>
                    </div>

                    {/* CC Field */}
                    {showCc && (
                      <div className="mb-4 relative">
                        <div className="flex items-center">
                          <label className="w-12 text-sm text-gray-600">Cc:</label>
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              value={composeData.cc}
                              onChange={(e) => handleRecipientInput(e.target.value, 'cc')}
                              className="w-full px-2 py-2 border-0 border-b border-gray-300 text-sm focus:outline-none focus:border-b-2 focus:border-blue-500 bg-transparent"
                              placeholder="Ange namn eller e-postadress"
                            />
                            {showCcSuggestions && (
                              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 shadow-lg z-10 max-h-40 overflow-y-auto">
                                {recipientSuggestions
                                  .filter(r => r.name.toLowerCase().includes(composeData.cc.toLowerCase()) || r.email.toLowerCase().includes(composeData.cc.toLowerCase()))
                                  .map((recipient, index) => (
                                  <div
                                    key={index}
                                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm flex items-center"
                                    onClick={() => handleRecipientSelect(recipient, 'cc')}
                                  >
                                    <div className="w-8 h-8 bg-[#013D8F] rounded-full flex items-center justify-center text-white text-xs font-medium mr-3 flex-shrink-0">
                                      {recipient.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                      <div className="font-medium">{recipient.name}</div>
                                      <div className="text-gray-600 text-xs">{recipient.email}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Subject Field */}
                    <div className="mb-4">
                      <div className="flex items-center">
                        <label className="w-12 text-sm text-gray-600">Ämne:</label>
                        <input
                          type="text"
                          value={composeData.subject}
                          onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                          className="flex-1 px-2 py-2 border-0 border-b border-gray-300 text-sm focus:outline-none focus:border-b-2 focus:border-blue-500 bg-transparent"
                          placeholder="Ange ämne"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email Body */}
                  <div className="flex-1 bg-white">
                    <textarea
                      value={composeData.body}
                      onChange={(e) => setComposeData(prev => ({ ...prev, body: e.target.value }))}
                      className="w-full h-full p-4 text-sm resize-none focus:outline-none bg-transparent border-0"
                      placeholder="Skriv ditt meddelande här..."
                      style={{ fontFamily: 'Segoe UI, sans-serif' }}
                    />
                  </div>
                </div>
              ) : (
                selectedEmail !== null && emails[selectedEmail] && (
                  <>
                    {/* Email Header */}
                    <div className="p-4 border-b border-gray-200">
                      <h1 className="text-xl font-semibold mb-2">{emails[selectedEmail].subject}</h1>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#013D8F] rounded-full flex items-center justify-center text-white font-medium">
                          {emails[selectedEmail].sender.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium">{emails[selectedEmail].sender}</div>
                          <div className="text-sm text-gray-600">{emails[selectedEmail].email}</div>
                        </div>
                      </div>
                    </div>

                    {/* Email Body */}
                    <div className="flex-1 p-4 overflow-y-auto">
                     <div className="prose max-w-none">
  <p>Hej,</p>
  <p>Som en del av vårt kontinuerliga arbete med att stärka informationssäkerheten inför vi nya säkerhetsrutiner som gäller från och med idag.</p>

  <p>Vi ber dig att genomföra den obligatoriska säkerhetsutbildningen som finns tillgänglig nu på intranätet. Din medverkan är avgörande för att vi ska kunna skydda våra data och upprätthålla allmänhetens förtroende.</p>
  <p>Vid frågor eller behov av support, kontakta IT-supporten på <a href="mailto:it@polisen.se">it-support@polisen.se</a></p>
  <br></br><p>Tack för din förståelse och ditt engagemang.</p>
  <p>Med vänliga hälsningar,<br/>
  IT-avdelningen<br/>
  Polismyndigheten</p>
</div>
                    </div>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
