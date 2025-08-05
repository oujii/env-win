
import React, { useState, useRef, useEffect } from "react";
import { RotateCcw, ArrowLeft, ArrowRight, Home, Lock, Star, UserCircle2, MoreVertical } from "lucide-react"; // Added Star, UserCircle2, MoreVertical
import { cn } from "@/lib/utils";
import WindowTitleBar from "./WindowTitleBar";

// Define props interface
interface WindowsDialogProps {
  isMinimized: boolean;
  setIsMinimized: React.Dispatch<React.SetStateAction<boolean>>;
  isClosed: boolean;
  setIsClosed: React.Dispatch<React.SetStateAction<boolean>>;
  isActive: boolean;
  onFocus: () => void;
}

export const WindowsDialog: React.FC<WindowsDialogProps> = ({
  isMinimized,
  setIsMinimized,
  isClosed,
  setIsClosed,
  isActive,
  onFocus
}) => {
  const [isMaximized, setIsMaximized] = useState(false); // Start windowed
  const [currentUrl, setCurrentUrl] = useState("/polisens-interna/index.html"); // Default to polisens-interna index
  const [displayUrl, setDisplayUrl] = useState("https://192.168.1.245"); // Initial display URL
  const [title, setTitle] = useState("Polismyndigheten | DurTvå"); // Initial title
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Windowed mode state
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Will be calculated on first render
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 }); // Will be calculated on first render
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Calculate default windowed size and position
  const calculateWindowedDimensions = () => {
    const taskbarHeight = 48; // Height of taskbar (h-12 = 48px)
    const availableWidth = window.innerWidth;
    const availableHeight = window.innerHeight - taskbarHeight;

    // Semi-large window size
    const width = Math.floor(availableWidth * 0.7); // 70% width
    const height = Math.floor(availableHeight * 0.75); // 75% height

    // Center the window
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
    // Actually close the window (not just minimize)
    setIsClosed(true);
    setIsMinimized(false); // Reset minimize state when closing
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleWindowClick = () => {
    onFocus(); // Bring this window to front
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

  // Update title and potentially reset URL when iframe loads a new page
  const handleIframeLoad = () => {
    try {
      // Use a timeout to ensure content is fully loaded before accessing
      setTimeout(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        // Update Title
        const iframeTitle = iframe.contentDocument?.title;
        if (iframeTitle) {
          setTitle(`${iframeTitle} - Google Chrome`);
        } else {
          setTitle("Google Chrome"); // Fallback title
        }

        // Reset URL to base polisen.se if the loaded page is the initial index.html
        try {
            const iframePathname = iframe.contentWindow?.location.pathname;
            if (iframePathname && iframePathname.endsWith('/index.html')) {
                setDisplayUrl("https://192.168.1.245");
                setTitle("Polismyndigheten | DurTvå");
            } else if (iframeTitle) {
                 // Keep the title update for other pages if needed
                 setTitle(`${iframeTitle}`);
            }
        } catch(e) {
             console.warn("Could not access iframe pathname:", e);
             // Fallback if access fails
             setDisplayUrl("https://192.168.1.245");
             setTitle("Polismyndigheten | DurTvå");
        }

      }, 100); // Small delay might help
    } catch (error) {
      console.warn("Could not access iframe content:", error);
       // Fallback if access fails
       setTitle("Polismyndigheten | DurTvå");
       setDisplayUrl("https://192.168.1.245"); // Reset URL on error
    }
  };

  // Effect to handle messages from the iframe (if needed for polisens-interna)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Handle any specific messages from polisens-interna if needed
      // Currently no special handling required
      console.log("Message from iframe:", event.data);
    };

    window.addEventListener('message', handleMessage);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []); // Empty dependency array ensures this runs only once on mount


  // Effect to handle iframe loading and title setting
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', handleIframeLoad);
      // Initial load check in case 'load' event already fired
      handleIframeLoad();
    }
    return () => {
      if (iframe) {
        iframe.removeEventListener('load', handleIframeLoad);
      }
    };
  }, [currentUrl]); // Re-run if the iframe src changes (though it's static for now)


  if (isMinimized || isClosed) return null; // Don't render if minimized or closed

  return (
    // Main container mimics a maximized window covering the area above the taskbar
    <div
      ref={windowRef}
      className={cn(
        "flex flex-col bg-[#dee1e6] shadow-xl border border-[#a0a0a0]", // Chrome-like background
        isMaximized ? "fixed inset-0 bottom-12" : "absolute" // Removed rounded corners and z-index classes
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
        minWidth: "400px", // Minimum window size
        minHeight: "300px",
        cursor: isDragging ? "grabbing" : "default",
        zIndex: isActive ? 40 : 30
      }}
      onClick={handleWindowClick}
    >
      {/* Use WindowTitleBar for standard window controls */}
      <WindowTitleBar
        title={title} // Use dynamic title
        isMainWindow={true} // Indicate this is the main window
        isFullscreen={isMaximized}
        isActive={isActive}
        onClose={handleClose} // Use handleClose which minimizes
        onMinimize={handleMinimize}
        onMaximize={toggleMaximize}
        onMouseDown={handleMouseDown} // Add dragging support
        // Custom styling to better match Chrome might be needed here or via props
        // Removed className prop as it's not accepted by WindowTitleBar
      />

      {/* Browser Toolbar */}
      <div className="h-11 p-6 bg-white flex items-center px-2 border-b border-[#d1d1d1]">
        <button className="p-1 rounded hover:bg-gray-100 mr-1" title="Back (disabled)"><ArrowLeft size={18} className="text-gray-400" /></button>
        <button className="p-1 rounded hover:bg-gray-100 mr-1" title="Forward (disabled)"><ArrowRight size={18} className="text-gray-400" /></button>
        <button className="p-1 rounded hover:bg-gray-100 mr-2" title="Reload"><RotateCcw size={16} className="text-gray-600" /></button>
        <button className="p-1 rounded hover:bg-gray-100 mr-2" title="Home"><Home size={16} className="text-gray-600" /></button>

        {/* Address Bar */}
       
       <div className="flex-1 mx-2 bg-[#fff] rounded-full h-8 flex items-center px-3 shadow-[0_0_3px_2px_rgba(0,123,255,0.2)]">   <Lock size={12} className="text-gray-500 mr-2.5" />
          <input
            type="text"
            readOnly // Make it read-only for the prop
            value={displayUrl} // Display the static URL
            className="flex-1 bg-transparent text-sm text-gray-800 outline-none border-none p-0" // Slightly larger text
          />
          <button className="p-1 rounded-full hover:bg-gray-200 ml-1" title="Bookmark this tab">
            <Star size={16} className="text-gray-600" />
          </button>
        </div>
        {/* Profile and Menu Icons */}
        <div className="flex items-center ml-2 space-x-1">
          <button className="p-1 rounded-full hover:bg-gray-100" title="Profile">
            <UserCircle2 size={22} className="text-gray-600" />
          </button>
          <button className="p-1 rounded-full hover:bg-gray-100" title="Menu">
            <MoreVertical size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content Area (Iframe) */}
      <div className={`flex-1 bg-white overflow-hidden ${!isMaximized ? 'pr-2 pb-2' : ''}`}>
        <iframe
          ref={iframeRef}
          src={currentUrl}
          title="Fake Browser Content"
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups" // Security settings
          // onLoad is handled by useEffect now
        ></iframe>
      </div>
      {/* Removed ResCueX status bar */}
    </div>
  );
};
