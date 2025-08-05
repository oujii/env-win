import React, { useState, useRef, useEffect, useCallback } from "react";
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
  isScriptedSequenceActive?: boolean;
  setIsScriptedSequenceActive?: React.Dispatch<React.SetStateAction<boolean>>;
  systemDateTime: Date;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  isMinimized,
  setIsMinimized,
  isClosed,
  setIsClosed,
  isActive,
  onFocus,
  isScriptedSequenceActive = false,
  setIsScriptedSequenceActive,
  systemDateTime
}) => {
  const [isMaximized, setIsMaximized] = useState(false); // Start windowed
  const [message, setMessage] = useState("");
  const windowRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scripted conversation state
  const [messages, setMessages] = useState<Array<{id: number, sender: 'Thomas' | 'Max', text: string, timestamp: string}>>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isWaitingForUserInput, setIsWaitingForUserInput] = useState(false);
  const [showFileDialog, setShowFileDialog] = useState(false);
  const [forcedText, setForcedText] = useState('');
  const [forcedTextIndex, setForcedTextIndex] = useState(0);

  // Scripted conversation sequence
  const conversationScript = [
    { type: 'thomas', text: 'Jag behöver din hjälp', delay: 0 }, // Already shown in notification
    { type: 'thomas', text: 'Är du där?', delay: 4000 }, // 4 seconds after opening (was 2)
    { type: 'user_input', expectedText: 'Jag är här.', delay: 0 }, // User input
    { type: 'thomas', text: 'Ge mig all uniformerad personal som anklagats för våld i tjänsten. Dom senaste fem åren.', delay: 6000 }, // 6 seconds after user input (was 3)
    { type: 'user_input', expectedText: 'Det är många.', delay: 0 }, // User input
    { type: 'thomas', text: 'Exkludera kvinnlig personal och män med annat etniskt ursprung.', delay: 6000 }, // 6 seconds after user input (was 3)
    { type: 'user_input', expectedText: '16 kvar.', delay: 0 }, // User input
    { type: 'thomas', text: 'Och I tjänst under mordnätterna?', delay: 5000 }, // 5 seconds (was 2)
    { type: 'user_input', expectedText: '1.', delay: 0 }, // User input
    { type: 'thomas', text: 'Skicka mig hans personalakt', delay: 4000 }, // 4 seconds (was 2)
    { type: 'file_attachment', delay: 0 }, // File attachment action
    { type: 'thomas', text: 'Tack, gamle vän.', delay: 4000 } // 4 seconds after file sent (was 2)
  ];
  
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

    // Larger size for chat window
    const width = Math.floor(availableWidth * 0.6); // 60% width (increased from 40%)
    const height = Math.floor(availableHeight * 0.7); // 70% height (increased from 60%)

    // Position offset from browser window
    const x = Math.floor(availableWidth * 0.15); // Start more to the left (was 0.5)
    const y = Math.floor((availableHeight - height) / 4); // Start higher up

    return { x, y, width, height };
  };

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to add a message to the conversation
  const addMessage = useCallback((sender: 'Thomas' | 'Max', text: string) => {
    const newMessage = {
      id: Date.now(),
      sender,
      text,
      timestamp: systemDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    };
    setMessages(prev => [...prev, newMessage]);
    // Auto-scroll to bottom after adding message
    setTimeout(scrollToBottom, 100);
  }, [systemDateTime]);



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

  // Effect to start scripted sequence when activated
  useEffect(() => {
    if (isScriptedSequenceActive) {
      // Reset everything immediately when sequence starts
      setMessages([]);
      setCurrentStep(0);
      setIsWaitingForUserInput(false);
      setForcedText('');
      setForcedTextIndex(0);
      setMessage('');
      setShowFileDialog(false);

      // Add the initial Thomas message after reset is complete
      setTimeout(() => {
        setMessages([{
          id: Date.now(),
          sender: 'Thomas',
          text: 'Jag behöver din hjälp',
          timestamp: systemDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
        }]);
        setCurrentStep(1);
        setTimeout(scrollToBottom, 100);
      }, 50);
    }
  }, [isScriptedSequenceActive]);

  // Effect to handle step progression
  useEffect(() => {
    if (isScriptedSequenceActive && currentStep > 0 && currentStep < conversationScript.length) {
      const currentScriptStep = conversationScript[currentStep];

      if (currentScriptStep.type === 'thomas') {
        setTimeout(() => {
          addMessage('Thomas', currentScriptStep.text);
          setCurrentStep(prev => prev + 1);
        }, currentScriptStep.delay);
      } else if (currentScriptStep.type === 'user_input') {
        setIsWaitingForUserInput(true);
        setForcedText(currentScriptStep.expectedText);
        setForcedTextIndex(0);
        setMessage(''); // Clear input
      } else if (currentScriptStep.type === 'file_attachment') {
        setIsWaitingForUserInput(false);
      }
    }
  }, [currentStep, isScriptedSequenceActive, addMessage]);

  // Handle input change with forced typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isScriptedSequenceActive && isWaitingForUserInput && forcedText) {
      // In forced typing mode, advance one character for each keystroke
      if (forcedTextIndex < forcedText.length) {
        const nextIndex = forcedTextIndex + 1;
        setForcedTextIndex(nextIndex);
        setMessage(forcedText.substring(0, nextIndex));
      }
    } else {
      // Normal typing mode
      setMessage(e.target.value);
    }
  };

  const handleSendMessage = () => {
    if (isScriptedSequenceActive && isWaitingForUserInput) {
      // In scripted mode, send the expected text regardless of what user typed
      const currentScriptStep = conversationScript[currentStep];
      if (currentScriptStep && currentScriptStep.type === 'user_input') {
        addMessage('Max', currentScriptStep.expectedText);
        setMessage("");
        setIsWaitingForUserInput(false);
        setForcedText('');
        setForcedTextIndex(0);
        setCurrentStep(prev => prev + 1);
      }
    } else if (message.trim()) {
      // Normal chat mode
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
                  <div className="text-xs text-gray-600 truncate">
                    {messages.length > 0 ? messages[messages.length - 1].text : 'Jag behöver din hjälp'}
                  </div>
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
            <div className="space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className="flex space-x-3">
                  <div className={`w-9 h-9 rounded-sm flex items-center justify-center text-white text-sm font-medium flex-shrink-0 mt-1 ${
                    msg.sender === 'Thomas' ? 'bg-[#464951]' : 'bg-[#828A9E]'
                  }`}>
                    {msg.sender === 'Thomas' ? 'TB' : 'MA'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-0.1">
                      <div className="text-sm font-[600] text-black">
                        {msg.sender === 'Thomas' ? 'Thomas Berg' : 'Max Abrahamsson'}
                      </div>
                      <div className="text-xs text-gray-500">{msg.timestamp}</div>
                    </div>
                    <div className="text-sm text-gray-800">{msg.text}</div>
                  </div>
                </div>
              ))}

              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input Area */}
          <div className="border-t border-[#e0e0e0] p-4 bg-white">
            <div className="flex items-center space-x-2">
            
              <button
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => {
                  if (isScriptedSequenceActive && currentStep === conversationScript.length - 2) {
                    // In scripted mode at file attachment step
                    setShowFileDialog(true);
                  }
                }}
              >
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
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
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

      {/* File Dialog */}
      {showFileDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border border-[#a0a0a0] shadow-xl w-96 h-80">
            {/* Dialog Title Bar */}
            <div className="bg-[#F3F3F3] border-b border-[#a0a0a0] px-3 py-2 flex items-center justify-between">
              <span className="text-sm font-normal">Bifoga fil</span>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowFileDialog(false)}
              >
                ×
              </button>
            </div>

            {/* Dialog Content */}
            <div className="p-4 flex-1">
              <div className="mb-4">
                <div className="text-sm mb-2">Välj fil att bifoga:</div>
                <div className="border border-[#c0c0c0] p-2 bg-white h-32 overflow-y-auto">
                  <div className="space-y-1">
                    <div className="flex items-center p-1 hover:bg-blue-100 cursor-pointer">
                      <span className="text-sm">📄 PersonalAkt_Officer_001.pdf</span>
                    </div>
                    <div className="flex items-center p-1 hover:bg-blue-100 cursor-pointer">
                      <span className="text-sm">📄 Incident_Report_2024.docx</span>
                    </div>
                    <div className="flex items-center p-1 hover:bg-blue-100 cursor-pointer">
                      <span className="text-sm">📄 Background_Check.pdf</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dialog Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 border border-[#c0c0c0] bg-white hover:bg-gray-50 text-sm"
                  onClick={() => setShowFileDialog(false)}
                >
                  Avbryt
                </button>
                <button
                  className="px-4 py-2 bg-[#0078d4] text-white hover:bg-[#106ebe] text-sm"
                  onClick={() => {
                    // Send file and proceed to final message
                    addMessage('Max', '📎 PersonalAkt_Officer_001.pdf');
                    setShowFileDialog(false);
                    setCurrentStep(prev => prev + 1);
                  }}
                >
                  Bifoga
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
