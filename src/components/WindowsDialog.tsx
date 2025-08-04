
import React, { useState, useRef, useEffect } from "react";
import { X, Minus, Square, RotateCcw, ArrowLeft, ArrowRight, Home, Lock, Star, UserCircle2, MoreVertical } from "lucide-react"; // Added Star, UserCircle2, MoreVertical
import { cn } from "@/lib/utils";
import WindowTitleBar from "./WindowTitleBar";

// Define props interface
interface WindowsDialogProps {
  isMinimized: boolean;
  setIsMinimized: React.Dispatch<React.SetStateAction<boolean>>;
}

export const WindowsDialog: React.FC<WindowsDialogProps> = ({ isMinimized, setIsMinimized }) => {
  const [isMaximized, setIsMaximized] = useState(true); // Start maximized
  const [currentUrl, setCurrentUrl] = useState("/googlefake/index.html"); // Default to googlefake index
  const [displayUrl, setDisplayUrl] = useState("https://www.google.com"); // Initial display URL
  const [title, setTitle] = useState("Google"); // Initial title
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    // Minimize the main window instead of closing
    setIsMinimized(true);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

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

        // Reset URL to base google.com if the loaded page is the initial index.html
        // The specific search URL will be set via postMessage listener
        try {
            const iframePathname = iframe.contentWindow?.location.pathname;
            if (iframePathname && iframePathname.endsWith('/index.html')) {
                setDisplayUrl("https://www.google.com");
                setTitle("Google - Google Chrome");
            } else if (iframeTitle) {
                 // Keep the title update for other pages if needed
                 setTitle(`${iframeTitle} - Google Chrome`);
            }
        } catch(e) {
             console.warn("Could not access iframe pathname:", e);
             // Fallback if access fails
             setDisplayUrl("https://www.google.com");
             setTitle("Google - Google Chrome");
        }

      }, 100); // Small delay might help
    } catch (error) {
      console.warn("Could not access iframe content:", error);
       // Fallback if access fails
       setTitle("Google - Google Chrome");
       setDisplayUrl("https://www.google.com"); // Reset URL on error
    }
  };

  // Effect to handle messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Basic security check: Ensure the message is from the iframe source we expect
      // In a real app, replace '*' with the actual origin of your iframe content
      // For local files, origin check might be tricky/null, so we rely on message structure.
      // if (event.origin !== 'expected-origin') return;

      if (event.data && event.data.type === 'searchResultLoaded' && event.data.query === 'Olle Bengtsson') {
        console.log("Received searchResultLoaded message from iframe");
        const specificSearchUrl = "https://www.google.se/search?q=Olle+Bengtsson&sca_esv=f6861048bb8aaca5&sxsrf=AHTn8zqO4e_sXmJTVfgKAokoGyvW_LveqA%3A1745943300525&source=hp&ei=BPsQaI7tHd-M7NYPipCfoAc&iflsig=ACkRmUkAAAAAaBEJFIkvCNOUyzR65l2C7na0RX8R_xk2&ved=0ahUKEwiO_-TR0f2MAxVfBtsEHQrIB3QQ4dUDCBc&uact=5&oq=Olle+Bengtsson&gs_lp=Egdnd3Mtd2l6Ig5PbGxlIEJlbmd0c3NvbjIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABDIGEAAYFhgeMgYQABgWGB4yBhAAGBYYHjIGEAAYFhgeSKwOUABYvg1wAHgAkAEAmAGSA6ABmhaqAQkwLjYuMy4yLjG4AQPIAQD4AQGYAgygArMWwgIKECMYgAQYJxiKBcICBBAjGCfCAgsQLhiABBjRAxjHAcICCxAuGIAEGMcBGK8BwgIFEC4YgATCAg4QLhiABBjHARjLARivAcICCBAAGIAEGMsBwgIIEC4YgAQY1ALCAgoQABiABBgKGMsBmAMAkgcJMC41LjQuMi4xoAeclQGyBwkwLjUuNC4yLjG4B7MW&sclient=gws-wiz";
        setDisplayUrl(specificSearchUrl);
        setTitle("Olle Bengtsson - Google Search - Google Chrome");
      }
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


  if (isMinimized) return null; // Don't render if minimized

  return (
    // Main container mimics a maximized window covering the area above the taskbar
    <div className={cn(
        "flex flex-col bg-[#dee1e6] shadow-xl border border-[#a0a0a0] rounded-t-lg", // Chrome-like background
        isMaximized ? "fixed inset-0 bottom-12 z-30" : "absolute w-[950px] h-[700px] z-30" // Adjust non-maximized style if needed
      )}
      style={!isMaximized ? { left: '50px', top: '50px' } : {}} // Example position if not maximized
    >
      {/* Use WindowTitleBar for standard window controls */}
      <WindowTitleBar
        title={title} // Use dynamic title
        isMainWindow={true} // Indicate this is the main window
        isFullscreen={isMaximized}
        onClose={handleClose} // Use handleClose which minimizes
        onMinimize={handleMinimize}
        onMaximize={toggleMaximize}
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
      <div className="flex-1 bg-white overflow-hidden">
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
