import React, { useState, useRef, useEffect } from "react";
import { Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import WindowTitleBar from "./WindowTitleBar";

// Define props interface
interface ChatWindowProps {
  isMinimized: boolean;
  setIsMinimized: React.Dispatch<React.SetStateAction<boolean>>;
  isClosed: boolean;
  setIsClosed: React.Dispatch<React.SetStateAction<boolean>>;
  isActive: boolean;
  onFocus: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ 
  isMinimized, 
  setIsMinimized, 
  isClosed, 
  setIsClosed,
  isActive,
  onFocus
}) => {
  const [isMaximized, setIsMaximized] = useState(false); // Start windowed
  const [message, setMessage] = useState("");
  const windowRef = useRef<HTMLDivElement>(null);
  
  // Windowed mode state
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Will be calculated on first render
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 }); // Will be calculated on first render
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Calculate default windowed size and position
  const calculateWindowedDimensions = () => {
    const taskbarHeight = 48; // Height of taskbar (h-12 = 48px)
    const availableWidth = window.innerWidth;
    const availableHeight = window.innerHeight - taskbarHeight;
    
    // Smaller size for chat window
    const width = Math.floor(availableWidth * 0.4); // 40% width
    const height = Math.floor(availableHeight * 0.6); // 60% height
    
    // Position offset from browser window
    const x = Math.floor(availableWidth * 0.5); // Start more to the right
    const y = Math.floor((availableHeight - height) / 4); // Start higher up
    
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
    // Actually close the window (not just minimize)
    setIsClosed(true);
    setIsMinimized(false); // Reset minimize state when closing
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  // Dragging functionality
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only allow dragging in windowed mode and on the titlebar
    if (isMaximized || !e.target || !(e.target instanceof Element)) return;
    
    // Prevent dragging when clicking buttons or other interactive elements
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('svg')) {
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
    if (!isDragging || isMaximized) return;

    const taskbarHeight = 48;
    const availableWidth = window.innerWidth;
    const availableHeight = window.innerHeight - taskbarHeight;
    const windowRect = windowRef.current?.getBoundingClientRect();

    if (windowRect) {
      // Calculate new position
      let newX = e.clientX - dragOffset.x;
      let newY = e.clientY - dragOffset.y;

      // Constrain to viewport boundaries
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

  // Handle window resize to keep window within bounds
  useEffect(() => {
    const handleWindowResize = () => {
      if (!isMaximized && windowRef.current) {
        const taskbarHeight = 48;
        const availableWidth = window.innerWidth;
        const availableHeight = window.innerHeight - taskbarHeight;
        const windowRect = windowRef.current.getBoundingClientRect();

        // Ensure window doesn't go off-screen
        let newX = position.x;
        let newY = position.y;

        if (position.x + windowRect.width > availableWidth) {
          newX = Math.max(0, availableWidth - windowRect.width);
        }
        if (position.y + windowRect.height > availableHeight) {
          newY = Math.max(0, availableHeight - windowRect.height);
        }

        if (newX !== position.x || newY !== position.y) {
          setPosition({ x: newX, y: newY });
        }
      }
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [position, isMaximized]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: Implement actual message sending
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleWindowClick = () => {
    onFocus(); // Bring this window to front
  };

  if (isMinimized || isClosed) return null; // Don't render if minimized or closed

  return (
    // Main container for chat window
    <div 
      ref={windowRef}
      className={cn(
        "flex flex-col bg-[#dee1e6] shadow-xl border border-[#a0a0a0]", // Same background as browser window
        isMaximized ? "fixed inset-0 bottom-12" : "absolute" // Adjust styling based on mode
      )}
      style={isMaximized ? { 
        zIndex: isActive ? 40 : 30 
      } : { 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        width: `${windowSize.width}px`,
        height: `${windowSize.height}px`,
        resize: "both", // Allow resizing in windowed mode
        overflow: "hidden", // Hide overflow during resize
        minWidth: "300px", // Minimum window size
        minHeight: "400px",
        cursor: isDragging ? "grabbing" : "default",
        zIndex: isActive ? 40 : 30
      }}
      onClick={handleWindowClick}
    >
      {/* Use WindowTitleBar for standard window controls */}
      <WindowTitleBar
        title="Chat | Polismyndigheten" // Chat window title
        isMainWindow={true} // Use same style as browser window
        isChatWindow={true} // Use clean chat variant without tabs
        isFullscreen={isMaximized}
        isActive={isActive}
        onClose={handleClose}
        onMinimize={handleMinimize}
        onMaximize={toggleMaximize}
        onMouseDown={handleMouseDown} // Add dragging support
      />

      {/* Chat Content Area - Three column layout */}
      <div className={`flex-1 flex overflow-hidden ${!isMaximized ? '' : ''}`}>

        {/* Far Left Sidebar - Vertical Icons */}
        <div className="w-12 bg-[#F3F3F3] border-[#d0d0d0] flex flex-col items-center py-4 space-y-4">
          {/* Hamburger Menu Icon */}
          <button className="w-8 h-8 flex items-center justify-center text-gray-400 opacity-60 hover:bg-[#d0d0d0] rounded">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

        

          {/* Phone Icon (Filled) */}
          <button className="w-8 h-8 flex items-center justify-center text-gray-400 opacity-60 hover:bg-[#d0d0d0] rounded">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </button>

          {/* Spacer to push bottom icons down */}
          <div className="flex-1"></div>

          {/* Trash Icon */}
          <button className="w-8 h-8 flex items-center justify-center text-gray-400 opacity-60 hover:bg-[#d0d0d0] rounded">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6"/>
              <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0 0 1 2 2V6"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
          </button>

          {/* Settings Icon */}
          <button className="w-8 h-8 flex items-center justify-center text-gray-400 opacity-60 hover:bg-[#d0d0d0] rounded">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        </div>

        {/* Middle Sidebar - Contact List */}
        <div className="w-80 bg-[#e5e5e5] border-r border-[#d0d0d0] flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-[#d0d0d0]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-medium text-black">Chattar</h2>
              <div className="flex items-center space-x-2">
                <button className="p-1 hover:bg-[#d0d0d0] rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button className="p-1 hover:bg-[#d0d0d0] rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Sök eller starta en ny chatt"
                className="w-full pl-10 pr-3 py-2 bg-white border border-[#c0c0c0] rounded text-sm focus:outline-none focus:border-[#0078d4]"
              />
            </div>
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto">
            {/* Contact Items */}
            <div className="p-2 space-y-1">
              <div className="flex items-center p-3 bg-[#BDBFC4] hover:bg-[#d0d0d0] rounded cursor-pointer">
                <div className="w-10 h-10 bg-[#8c8c8c] rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                  TB
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-black truncate">Thomas Berg</div>
                    <div className="text-xs text-gray-600">20/06/2025</div>
                  </div>
                  <div className="text-xs text-gray-600 truncate">Jag behöver din hjälp</div>
                </div>
              </div>

              <div className="flex items-center p-3 hover:bg-[#d0d0d0] rounded cursor-pointer">
                <div className="w-10 h-10 bg-[#8c8c8c] rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                  AB
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-black truncate">Anna Björkman</div>
                    <div className="text-xs text-gray-600">12/06/2025</div>
                  </div>
                  <div className="text-xs text-gray-600 truncate">Vi hörs om det där sen.</div>
                </div>
              </div>

              <div className="flex items-center p-3 hover:bg-[#d0d0d0] rounded cursor-pointer">
                <div className="w-10 h-10 bg-[#8c8c8c] rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                  JH
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-black truncate">Jonas Hellström</div>
                    <div className="text-xs text-gray-600">10/06/2025</div>
                  </div>
                  <div className="text-xs text-gray-600 truncate">Okej, återkopplar när jag</div>
                </div>
              </div>

              <div className="flex items-center p-3 hover:bg-[#d0d0d0] rounded cursor-pointer">
                <div className="w-10 h-10 bg-[#8c8c8c] rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                  MS
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-black truncate">Maria Sjöholm</div>
                    <div className="text-xs text-gray-600">07/06/2025</div>
                  </div>
                  <div className="text-xs text-gray-600 truncate">Okej, då inväntar vi rapport.</div>
                </div>
              </div>

              <div className="flex items-center p-3 hover:bg-[#d0d0d0] rounded cursor-pointer">
                <div className="w-10 h-10 bg-[#8c8c8c] rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                  DB
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-black truncate">Daniel Bergström</div>
                    <div className="text-xs text-gray-600">07/06/2025</div>
                  </div>
                  <div className="text-xs text-gray-600 truncate">Säkerhetsgenomgång klar</div>
                </div>
              </div>

              <div className="flex items-center p-3 hover:bg-[#d0d0d0] rounded cursor-pointer">
                <div className="w-10 h-10 bg-[#8c8c8c] rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                  NS
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-black truncate">Nina Ström</div>
                    <div className="text-xs text-gray-600">06/06/2025</div>
                  </div>
                  <div className="text-xs text-gray-600 truncate">Skickar protokollet direkt.</div>
                </div>
              </div>

              <div className="flex items-center p-3 hover:bg-[#d0d0d0] rounded cursor-pointer">
                <div className="w-10 h-10 bg-[#8c8c8c] rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                  FH
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-black truncate">Fredrik Holm</div>
                    <div className="text-xs text-gray-600">05/06/2025</div>
                  </div>
                  <div className="text-xs text-gray-600 truncate">Avstämning klar för idag.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Chat Area */}
        <div className="flex-1 flex flex-col bg-[#F0F0F0]">
          {/* Chat Header */}
          <div className="p-4 border-b border-[#e0e0e0] bg-[#f8f8f8]">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#8c8c8c] rounded-full flex items-center justify-center text-white mr-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div className="text-md font-medium text-black">Max Abrahamsson</div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-[#e0e0e0] rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </button>
                <button className="p-2 hover:bg-[#e0e0e0] rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="23 7 16 12 23 17 23 7"/>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                  </svg>
                </button>
                <button className="p-2 hover:bg-[#e0e0e0] rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {/* Message from Thomas Berg */}
              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 bg-[#464951] rounded-sm flex items-center justify-center text-white text-sm font-medium">
                  MA
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-0.1">
                    <div className="text-sm font-[600] text-black">Thomas Berg</div>
                    <div className="text-xs text-gray-500">11:57</div>
                  </div>
                  <div className="text-sm text-gray-800">Skicka mig hans personakt</div>
                </div>
              </div>

              {/* Messages from Max Abrahamsson */}
              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 bg-[#828A9E] rounded-sm flex items-center justify-center text-white text-sm font-medium">
                  MA
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="text-sm font-medium text-black">Max Abrahamsson</div>
                    <div className="text-xs text-gray-500">11:57</div>
                  </div>
                  <div className="text-sm text-gray-800">Jajjemen det kan du hoppa upp o sätta dig på!</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 bg-[#6c6c6c] rounded-sm flex items-center justify-center text-white text-sm font-medium">
                  MA
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="text-sm font-medium text-black">Max Abrahamsson</div>
                    <div className="text-xs text-gray-500">11:57</div>
                  </div>
                  <div className="text-sm text-gray-800">Jajjemen det kan du hoppa upp o sätta dig på!</div>
                </div>
              </div>
            </div>
          </div>

          {/* Message Input Area */}
          <div className="border-t border-[#e0e0e0] p-4 bg-white">
            <div className="flex items-center space-x-2">
            
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                <Paperclip size={16} />
              </button>
               {/* Smiley Icon */}
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                  <line x1="9" y1="9" x2="9.01" y2="9"/>
                  <line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder=""
                  className="w-full px-3 py-2 border border-[#c0c0c0] rounded text-sm focus:outline-none focus:border-[#0078d4]"
                />
              </div>
             
              {/* Microphone Icon */}
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
