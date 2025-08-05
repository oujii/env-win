import { useState } from "react"; // Import useState
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Incidentrapportering from "./pages/Incidentrapportering";
import { WindowsStartbar } from "./components/WindowsStartbar";
// Removed WindowsDialog import

const queryClient = new QueryClient();

const App = () => {
  // Browser window state
  const [isMainWindowMinimized, setIsMainWindowMinimized] = useState(false);
  const [isMainWindowClosed, setIsMainWindowClosed] = useState(true);

  // Chat window state
  const [isChatWindowMinimized, setIsChatWindowMinimized] = useState(false);
  const [isChatWindowClosed, setIsChatWindowClosed] = useState(true);

  // Chat window 2 state
  const [isChatWindow2Minimized, setIsChatWindow2Minimized] = useState(false);
  const [isChatWindow2Closed, setIsChatWindow2Closed] = useState(true);

  // Mail window state
  const [isMailWindowMinimized, setIsMailWindowMinimized] = useState(false);
  const [isMailWindowClosed, setIsMailWindowClosed] = useState(true);

  // Window focus management
  const [activeWindow, setActiveWindow] = useState<'browser' | 'chat' | 'chat2' | 'mail' | null>(null);

  // State for scripted chat sequence
  const [isScriptedSequenceActive, setIsScriptedSequenceActive] = useState(false);

  // System time state (shared between startbar and chat)
  const [systemDateTime, setSystemDateTime] = useState(new Date());

  // Function to toggle the main window's visibility (Windows 10 behavior)
  const toggleMainWindowVisibility = () => {
    if (isMainWindowClosed) {
      // If window is closed, reopen it and make it active
      setIsMainWindowClosed(false);
      setIsMainWindowMinimized(false);
      setActiveWindow('browser');
    } else if (isMainWindowMinimized) {
      // If window is minimized, restore it and make it active
      setIsMainWindowMinimized(false);
      setActiveWindow('browser');
    } else if (activeWindow === 'browser') {
      // If window is already active, minimize it
      setIsMainWindowMinimized(true);
    } else {
      // If window is open but not active, bring it to front
      setActiveWindow('browser');
    }
  };

  // Function to toggle the chat window's visibility (Windows 10 behavior)
  const toggleChatWindowVisibility = () => {
    if (isChatWindowClosed) {
      // If window is closed, reopen it and make it active
      setIsChatWindowClosed(false);
      setIsChatWindowMinimized(false);
      setActiveWindow('chat');
    } else if (isChatWindowMinimized) {
      // If window is minimized, restore it and make it active
      setIsChatWindowMinimized(false);
      setActiveWindow('chat');
    } else if (activeWindow === 'chat') {
      // If window is already active, minimize it
      setIsChatWindowMinimized(true);
    } else {
      // If window is open but not active, bring it to front
      setActiveWindow('chat');
    }
  };

  // Function to toggle the chat window 2's visibility (Windows 10 behavior)
  const toggleChatWindow2Visibility = () => {
    if (isChatWindow2Closed) {
      // If window is closed, reopen it and make it active
      setIsChatWindow2Closed(false);
      setIsChatWindow2Minimized(false);
      setActiveWindow('chat2');
    } else if (isChatWindow2Minimized) {
      // If window is minimized, restore it and make it active
      setIsChatWindow2Minimized(false);
      setActiveWindow('chat2');
    } else if (activeWindow === 'chat2') {
      // If window is already active, minimize it
      setIsChatWindow2Minimized(true);
    } else {
      // If window is open but not active, bring it to front
      setActiveWindow('chat2');
    }
  };

  // Function to toggle the mail window's visibility
  const toggleMailWindowVisibility = () => {
    if (isMailWindowClosed) {
      // If window is closed, reopen it and make it active
      setIsMailWindowClosed(false);
      setIsMailWindowMinimized(false);
      setActiveWindow('mail');
    } else if (isMailWindowMinimized) {
      // If window is minimized, restore it and make it active
      setIsMailWindowMinimized(false);
      setActiveWindow('mail');
    } else {
      // If window is open and active, minimize it
      setIsMailWindowMinimized(true);
      setActiveWindow('mail');
    }
  };

  // Function to handle window focus (bring to front)
  const handleWindowFocus = (windowType: 'browser' | 'chat' | 'chat2' | 'mail') => {
    setActiveWindow(windowType);
  };

  // Function to start the scripted chat sequence
  const handleStartScriptedSequence = () => {
    // Reset first, then activate to trigger useEffect
    setIsScriptedSequenceActive(false);
    setTimeout(() => {
      setIsScriptedSequenceActive(true);
    }, 50);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Pass state and setter to Index page */}
            <Route path="/" element={<Index
              isMainWindowMinimized={isMainWindowMinimized}
              setIsMainWindowMinimized={setIsMainWindowMinimized}
              isMainWindowClosed={isMainWindowClosed}
              setIsMainWindowClosed={setIsMainWindowClosed}
              isChatWindowMinimized={isChatWindowMinimized}
              setIsChatWindowMinimized={setIsChatWindowMinimized}
              isChatWindowClosed={isChatWindowClosed}
              setIsChatWindowClosed={setIsChatWindowClosed}
              isChatWindow2Minimized={isChatWindow2Minimized}
              setIsChatWindow2Minimized={setIsChatWindow2Minimized}
              isChatWindow2Closed={isChatWindow2Closed}
              setIsChatWindow2Closed={setIsChatWindow2Closed}
              isMailWindowMinimized={isMailWindowMinimized}
              setIsMailWindowMinimized={setIsMailWindowMinimized}
              isMailWindowClosed={isMailWindowClosed}
              setIsMailWindowClosed={setIsMailWindowClosed}
              activeWindow={activeWindow}
              onWindowFocus={handleWindowFocus}
              isScriptedSequenceActive={isScriptedSequenceActive}
              setIsScriptedSequenceActive={setIsScriptedSequenceActive}
              systemDateTime={systemDateTime}
            />} />
            <Route path="/incident" element={<Incidentrapportering />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* Pass toggle function and window status to Startbar */}
          <WindowsStartbar
            onToggleMainWindow={toggleMainWindowVisibility}
            onToggleChatWindow={toggleChatWindowVisibility}
            onToggleChatWindow2={toggleChatWindow2Visibility}
            onToggleMailWindow={toggleMailWindowVisibility}
            isMainWindowMinimized={isMainWindowMinimized}
            isMainWindowClosed={isMainWindowClosed}
            isChatWindowMinimized={isChatWindowMinimized}
            isChatWindowClosed={isChatWindowClosed}
            isChatWindow2Minimized={isChatWindow2Minimized}
            isChatWindow2Closed={isChatWindow2Closed}
            isMailWindowMinimized={isMailWindowMinimized}
            isMailWindowClosed={isMailWindowClosed}
            onStartScriptedSequence={handleStartScriptedSequence}
            onFocusWindow={handleWindowFocus}
            systemDateTime={systemDateTime}
            onSetSystemDateTime={setSystemDateTime}
          />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
