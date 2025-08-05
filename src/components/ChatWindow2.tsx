import React, { useState, useRef, useEffect } from "react";
import { Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import WindowTitleBar from "./WindowTitleBar";

// Define props interface
interface ChatWindow2Props {
  isMinimized: boolean;
  setIsMinimized: React.Dispatch<React.SetStateAction<boolean>>;
  isClosed: boolean;
  setIsClosed: React.Dispatch<React.SetStateAction<boolean>>;
  isActive: boolean;
  onFocus: () => void;
}

export const ChatWindow2: React.FC<ChatWindow2Props> = ({ 
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
    
    // Position offset from browser window - different position for second chat
    const x = Math.floor(availableWidth * 0.1); // Start more to the left
    const y = Math.floor((availableHeight - height) / 2); // Start in middle
    
    return { x, y, width, height };
  };

  // Initialize window dimensions on first render
  useEffect(() => {
    if (windowSize.width === 0 && windowSize.height === 0) {
      const dimensions = calculateWindowedDimensions();
      setPosition({ x: dimensions.x, y: dimensions.y });
      setWindowSize({ width: dimensions.width, height: dimensions.height });
    }
  }, [windowSize.width, windowSize.height]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!isMaximized) {
        const dimensions = calculateWindowedDimensions();
        setWindowSize({ width: dimensions.width, height: dimensions.height });
        
        // Adjust position if window goes off screen
        setPosition(prev => ({
          x: Math.min(prev.x, window.innerWidth - dimensions.width),
          y: Math.min(prev.y, window.innerHeight - 48 - dimensions.height)
        }));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMaximized]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessage("");
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    setIsClosed(true);
  };

  // Mouse event handlers for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return; // Can't drag when maximized
    
    setIsDragging(true);
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Constrain to screen bounds
        const maxX = window.innerWidth - windowSize.width;
        const maxY = window.innerHeight - 48 - windowSize.height; // Account for taskbar
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
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
  }, [isDragging, dragOffset, windowSize, isMaximized]);

  if (isClosed) {
    return null;
  }

  const windowStyle = isMaximized 
    ? { 
        position: 'fixed' as const, 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: 'calc(100vh - 48px)' // Account for taskbar
      }
    : { 
        position: 'fixed' as const, 
        top: position.y, 
        left: position.x, 
        width: windowSize.width, 
        height: windowSize.height 
      };

  return (
    <div
      ref={windowRef}
      className={cn(
        "border border-[#c0c0c0] shadow-lg transition-all duration-300 flex flex-col overflow-hidden",
        isMinimized ? "scale-0 opacity-0" : "scale-100 opacity-100",
        isActive ? "z-50" : "z-40"
      )}
      style={{
        ...windowStyle,
        backgroundImage: "url('/chat.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      onClick={onFocus}
    >
      {/* Use WindowTitleBar for standard window controls */}
      <WindowTitleBar
        title="Chat | Polismyndigheten" // Chat window title
        isMainWindow={true} // Use same style as browser window
        isChatWindow={true} // Use clean chat variant without tabs
        isFullscreen={isMaximized}
        isActive={isActive}
        onMinimize={handleMinimize}
        onMaximize={handleMaximize}
        onClose={handleClose}
        onMouseDown={handleMouseDown}
      />

      {/* Main Content Area - Transparent overlay */}
      <div className="flex-1 bg-black bg-opacity-10 backdrop-blur-sm">
        {/* Transparent content area to show background image */}
      </div>


    </div>
  );
};
