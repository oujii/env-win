import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Volume2, Shield, ChevronUp, Search, Maximize } from 'lucide-react'; // Replaced BatteryFull with Shield
import { Link } from 'react-router-dom';
import { DateTimeSettingsPopup } from './DateTimeSettingsPopup'; // Import the popup

// Define props interface
interface WindowsStartbarProps {
  onToggleMainWindow?: () => void; // Optional prop to toggle main window
  onToggleChatWindow?: () => void; // Optional prop to toggle chat window
  onToggleChatWindow2?: () => void; // Optional prop to toggle chat window 2
  onToggleMailWindow?: () => void; // Optional prop to toggle mail window
  isMainWindowMinimized?: boolean; // Window minimized status
  isMainWindowClosed?: boolean; // Window closed status
  isChatWindowMinimized?: boolean; // Chat window minimized status
  isChatWindowClosed?: boolean; // Chat window closed status
  isChatWindow2Minimized?: boolean; // Chat window 2 minimized status
  isChatWindow2Closed?: boolean; // Chat window 2 closed status
  isMailWindowMinimized?: boolean; // Mail window minimized status
  isMailWindowClosed?: boolean; // Mail window closed status
  onStartScriptedSequence?: () => void; // New prop to start the scripted chat sequence
  onFocusWindow?: (windowType: 'browser' | 'chat' | 'chat2' | 'mail') => void; // Focus window function
  systemDateTime: Date; // System date and time
  onSetSystemDateTime: (newDateTime: Date) => void; // Function to update system time
}

export const WindowsStartbar: React.FC<WindowsStartbarProps> = ({
  onToggleMainWindow,
  onToggleChatWindow,
  onToggleChatWindow2,
  onToggleMailWindow,
  isMainWindowMinimized = false,
  isMainWindowClosed = false,
  isChatWindowMinimized = false,
  isChatWindowClosed = false,
  isChatWindow2Minimized = false,
  isChatWindow2Closed = false,
  isMailWindowMinimized = false,
  isMailWindowClosed = false,
  onStartScriptedSequence,
  onFocusWindow,
  systemDateTime,
  onSetSystemDateTime
}) => {
  // Use systemDateTime from props instead of local state
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isDateTimePopupOpen, setIsDateTimePopupOpen] = useState(false); // State for popup visibility
  const [showNotification, setShowNotification] = useState(false); // State for Thomas Berg notification
  const startMenuRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLDivElement>(null); // Ref for the clock element

  useEffect(() => {
    // Removed the interval that automatically updated the time every second.
    // Time will now only update when manually set via the popup,
    // or show the initial load time.

    // Handle clicks outside of start menu to close it
    const handleClickOutside = (event: MouseEvent) => {
      if (startMenuRef.current && !startMenuRef.current.contains(event.target as Node) &&
          !(event.target as Element).closest('.start-button')) {
        setIsStartMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // No interval to clear anymore
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // Function to toggle fullscreen mode
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
      setIsStartMenuOpen(false); // Close menu after action
    } catch (err) {
      console.error(`Error attempting to toggle fullscreen: ${err.message} (${err.name})`);
      alert("Fullscreen mode is not supported or was denied."); // Inform user
      setIsStartMenuOpen(false); // Close menu even on error
    }
  };

  // Handler for "Starta flöde" - starts the scripted sequence
  const handleStartaFlode = () => {
    setIsStartMenuOpen(false); // Close start menu

    // Reset any existing sequence first
    if (onStartScriptedSequence) {
      onStartScriptedSequence(); // This will reset the chat window
    }

    // Wait 5 seconds then show notification
    setTimeout(() => {
      setShowNotification(true);
    }, 5000);
  };

  // Handler for clicking the notification
  const handleNotificationClick = () => {
    setShowNotification(false);
    if (onStartScriptedSequence) {
      onStartScriptedSequence(); // Trigger the scripted chat sequence
    }
    if (onToggleChatWindow) {
      onToggleChatWindow(); // Open the chat window
    }
  };

  return (
    <>
      {/* Start Menu */}
      {isStartMenuOpen && (
        <div
          ref={startMenuRef}
          className="fixed bottom-10 left-0 w-80 max-h-[70vh] bg-white shadow-lg border border-[#e1e1e1] z-50 flex flex-col"
        >
          <div className="flex-1 p-2 windows-scrollbar overflow-y-auto">
            <div className="border-b border-[#e1e1e1] pb-2 mb-2">
              <div className="text-sm font-medium mb-2 pl-2">Most used</div>
              <div className="grid grid-cols-1 gap-1">
                <Link to="/" className="flex items-center px-2 py-1.5 rounded hover:bg-[#f2f2f2]">
                  <img src="/rescuex-icon.png" alt="ResCueX" className="w-4 h-4 mr-3" />
                  <span className="text-sm">ResCueX</span>
                </Link>
                <Link to="/incident" className="flex items-center px-2 py-1.5 rounded hover:bg-[#f2f2f2]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#606060" className="mr-3">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2"/>
                    <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2"/>
                  </svg>
                  <span className="text-sm">Incident Reporting</span>
                </Link>
                <button
                  onClick={handleStartaFlode}
                  className="flex items-center px-2 py-1.5 rounded hover:bg-[#f2f2f2] w-full text-left"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#606060" className="mr-3">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="2"/>
                  </svg>
                  <span className="text-sm">Starta flöde</span>
                </button>
              </div>
            </div>

            <div className="mb-2">
              <div className="text-sm font-medium mb-2 pl-2">Applications</div>
              <div className="grid grid-cols-4 gap-2">
                <Link to="/" className="flex flex-col items-center justify-center p-2 rounded hover:bg-[#f2f2f2] text-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#1976d2" className="mb-1">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeWidth="2"/>
                    <polyline points="9 22 9 12 15 12 15 22" strokeWidth="2"/>
                  </svg>
                  <span className="text-xs">Home</span>
                </Link>
                <Link to="/incident" className="flex flex-col items-center justify-center p-2 rounded hover:bg-[#f2f2f2] text-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#e53935" className="mb-1">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2"/>
                    <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2"/>
                  </svg>
                  <span className="text-xs">Incident</span>
                </Link>
                <div className="flex flex-col items-center justify-center p-2 rounded hover:bg-[#f2f2f2] text-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#43a047" className="mb-1">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                    <line x1="9" y1="3" x2="9" y2="21" strokeWidth="2"/>
                  </svg>
                  <span className="text-xs">Files</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 rounded hover:bg-[#f2f2f2] text-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#7e57c2" className="mb-1">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeWidth="2"/>
                  </svg>
                  <span className="text-xs">Health</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 rounded hover:bg-[#f2f2f2] text-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#039be5" className="mb-1">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <line x1="2" y1="12" x2="22" y2="12" strokeWidth="2"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeWidth="2"/>
                  </svg>
                  <span className="text-xs">Browser</span>
                </div>
                <div
                  className="flex flex-col items-center justify-center p-2 rounded hover:bg-[#f2f2f2] text-center cursor-pointer"
                  onClick={() => {
                    onToggleMailWindow?.();
                    onFocusWindow?.('mail');
                    setIsStartMenuOpen(false);
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fb8c00" className="mb-1">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeWidth="2"/>
                    <polyline points="22,6 12,13 2,6" strokeWidth="2"/>
                  </svg>
                  <span className="text-xs">Mail</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 rounded hover:bg-[#f2f2f2] text-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#757575" className="mb-1">
                    <circle cx="12" cy="12" r="3" strokeWidth="2"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" strokeWidth="2"/>
                  </svg>
                  <span className="text-xs">Settings</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 rounded hover:bg-[#f2f2f2] text-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#d32f2f" className="mb-1">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeWidth="2"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeWidth="2"/>
                  </svg>
                  <span className="text-xs">Alerts</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-2 border-t border-[#e1e1e1] bg-[#f9f9f9]">
            <div className="flex items-center hover:bg-[#f2f2f2] rounded p-2">
              <div className="w-8 h-8 rounded-full bg-[#0078d7] flex items-center justify-center text-white mr-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2"/>
                  <circle cx="12" cy="7" r="4" strokeWidth="2"/>
                </svg>
              </div>
              <span className="text-sm">User</span>
            </div>
            <div className="flex mt-2 justify-around"> {/* Use justify-around for better spacing */}
              <button className="flex items-center justify-center p-2 w-1/3 rounded hover:bg-[#f2f2f2]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#606060">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                  <line x1="8" y1="12" x2="16" y2="12" strokeWidth="2"/>
                </svg>
              </button>
              <button className="flex items-center justify-center p-2 w-1/3 rounded hover:bg-[#f2f2f2]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#606060">
                  <circle cx="12" cy="12" r="3" strokeWidth="2"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" strokeWidth="2"/>
                </svg>
              </button>
              {/* Fullscreen Button */}
              <button
                className="flex items-center justify-center p-2 w-1/3 rounded hover:bg-[#f2f2f2]"
                onClick={toggleFullscreen}
                title="Toggle Fullscreen"
              >
                <Maximize size={16} className="text-gray-700" />
              </button>
              <button className="flex items-center justify-center p-2 w-1/3 rounded hover:bg-[#f2f2f2]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#606060">
                  <path d="M18.36 6.64a9 9 0 1 1-12.73 0" strokeWidth="2"/>
                  <line x1="12" y1="2" x2="12" y2="12" strokeWidth="2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Taskbar - Updated with new styling */}
      <div className="fixed bottom-0 left-0 w-full h-12 bg-black flex items-center z-40 text-white">
        {/* Start button */}
        <button
          className={`start-button h-full w-12 flex items-center justify-center ${isStartMenuOpen ? 'bg-gray-800' : 'hover:bg-gray-800'} transition-colors`}
          onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path fill="#ffffff" d="M0 0h7.5v7.5H0zM8.5 0H16v7.5H8.5zM0 8.5h7.5V16H0zM8.5 8.5H16V16H8.5z"/>
          </svg>
        </button>

        {/* Search box */}
        <div className="h-full flex items-center ml-1">
          <div className="flex items-center bg-gray-900 h-full w-80 px-3">
            <Search size={14} className="text-gray-400 mr-2" />
            <span className="text-gray-400 text-sm">Sök i Windows</span>
          </div>
        </div>

        {/* Application Icons */}
        <div className="flex h-full ml-2">
          {/* Placeholder Icons */}
          <button
            className={`h-full mr-2 w-12 flex items-center justify-center hover:bg-gray-800 transition-colors relative ${
              (!isMailWindowClosed || !isMailWindowMinimized) ? 'after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-blue-400' : ''
            }`}
            title="Mail"
            onClick={() => {
              onToggleMailWindow?.();
              onFocusWindow?.('mail');
            }}
          >
              <img src="/mail.png" alt="Mail" className="w-8 h-8" />
           </button>
          <button
            className="h-full w-12 mr-2 flex items-center justify-center hover:bg-gray-800 transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 "
            title="File Explorer" // Update title for accessibility/tooltip
          >
            <img src="/file-explorer.png" alt="File Explorer" className="w-6 h-6" onError={e => {
              // Optional: Add a fallback SVG or different placeholder if chrome.jpg fails
              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ccircle cx='12' cy='12' r='4'/%3E%3Cline x1='21.17' y1='8' x2='12' y2='8'/%3E%3Cline x1='3.95' y1='6.06' x2='8.54' y2='14'/%3E%3Cline x1='10.88' y1='21.94' x2='15.46' y2='14'/%3E%3C/svg%3E"; // Example Chrome-like fallback
            }} />
          </button>
         
          


          {/* ResCueX Icon Button */}
          <button
            className={`h-full w-12 mr-2 flex items-center justify-center hover:bg-gray-800 transition-colors relative ${
              !isMainWindowClosed && !isMainWindowMinimized ? 'bg-gray-800' : ''
            } ${
              !isMainWindowClosed ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-blue-500" : ""
            }`}
            onClick={onToggleMainWindow} // Call the passed function
            title="Google Chrome" // Update title for accessibility/tooltip
          >
            <img src="/chrome.png" alt="Google Chrome" className="w-6 h-6" onError={e => {
              // Optional: Add a fallback SVG or different placeholder if chrome.jpg fails
              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ccircle cx='12' cy='12' r='4'/%3E%3Cline x1='21.17' y1='8' x2='12' y2='8'/%3E%3Cline x1='3.95' y1='6.06' x2='8.54' y2='14'/%3E%3Cline x1='10.88' y1='21.94' x2='15.46' y2='14'/%3E%3C/svg%3E"; // Example Chrome-like fallback
            }} />
          </button>

          {/* Chat Application Icon Button */}
          <button
            className={`h-full w-12 mr-2 flex items-center justify-center hover:bg-gray-800 transition-colors relative ${
              !isChatWindowClosed && !isChatWindowMinimized ? 'bg-gray-800' : ''
            } ${
              !isChatWindowClosed ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-blue-500" : ""
            }`}
            onClick={() => {
              if (onToggleChatWindow) onToggleChatWindow();
              if (onFocusWindow) onFocusWindow('chat');
            }}
            title="Messenger" // Update title for accessibility/tooltip
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </button>

          {/* Chat Application 2 Icon Button */}
          <button
            className={`h-full w-12 mr-2 flex items-center justify-center hover:bg-gray-800 transition-colors relative ${
              !isChatWindow2Closed && !isChatWindow2Minimized ? 'bg-gray-800' : ''
            } ${
              !isChatWindow2Closed ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-blue-500" : ""
            }`}
            onClick={onToggleChatWindow2} // Call the passed function
            title="Messenger" // Update title for accessibility/tooltip
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
          {/* Removed Incident Link */}
        </div>

        {/* System Tray */}
        <div className="ml-auto flex items-center h-full">
          <button className="w-8 h-8 flex items-center justify-center text-white hover:bg-gray-800 transition-colors rounded-sm ml-1">
            <ChevronUp size={14} className="text-white" />
          </button>
          <div className="flex items-center h-full px-2">
            <button className="w-8 h-8 flex items-center justify-center text-white hover:bg-gray-800 transition-colors rounded-sm ml-1">
              <Wifi size={16} className="text-white" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-white hover:bg-gray-800 transition-colors rounded-sm ml-1">
              <Volume2 size={16} className="text-white" />
            </button>
            {/* Replaced BatteryFull with Shield */}
            <button className="w-8 h-8 flex items-center justify-center text-white hover:bg-gray-800 transition-colors rounded-sm ml-1" title="System Security (Placeholder)">
              <Shield size={16} className="text-white" />
            </button>
          </div>
          {/* Clock Area - Made clickable */}
          <div
            ref={clockRef}
            className="flex flex-col items-center justify-center px-3 h-full hover:bg-gray-800 transition-colors cursor-pointer"
            title="Klicka för att ändra tid och datum"
            onClick={() => setIsDateTimePopupOpen(!isDateTimePopupOpen)}
          >
            <span className="text-white text-xs">
              {systemDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </span>
            <span className="text-white text-xs">
              {systemDateTime.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* Render DateTime Settings Popup */}
      <DateTimeSettingsPopup
        isOpen={isDateTimePopupOpen}
        onClose={() => setIsDateTimePopupOpen(false)}
        currentDateTime={systemDateTime}
        onSetDateTime={(newDateTime) => {
          onSetSystemDateTime(newDateTime); // Update the system time
          // Note: This only updates the frontend display.
          // A real implementation would need to sync with a backend or system time.
          console.log("New DateTime set (frontend only):", newDateTime);
        }}
        triggerRef={clockRef}
      />

      {/* Thomas Berg Notification */}
      {showNotification && (
        <div
          className="fixed bottom-16 right-4 w-80 bg-white border border-[#e1e1e1] shadow-lg rounded-lg p-4 z-50 cursor-pointer hover:shadow-xl transition-shadow"
          onClick={handleNotificationClick}
        >
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-[#8c8c8c] rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
              TB
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium text-black">Thomas Berg</div>
                <div className="text-xs text-gray-500">nu</div>
              </div>
              <div className="text-sm text-gray-700 mb-1">Jag behöver din hjälp</div>
              <div className="text-xs text-gray-500">Messenger</div>
            </div>
            <button
              className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              onClick={(e) => {
                e.stopPropagation();
                setShowNotification(false);
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};
