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

  // Window focus management
  const [activeWindow, setActiveWindow] = useState<'browser' | 'chat' | 'chat2' | null>(null);

  // Function to toggle the main window's visibility
  const toggleMainWindowVisibility = () => {
    if (isMainWindowClosed) {
      // If window is closed, reopen it and make it active
      setIsMainWindowClosed(false);
      setIsMainWindowMinimized(false);
      setActiveWindow('browser');
    } else {
      // If window is open, just toggle minimize
      setIsMainWindowMinimized(prev => !prev);
    }
  };

  // Function to toggle the chat window's visibility
  const toggleChatWindowVisibility = () => {
    if (isChatWindowClosed) {
      // If window is closed, reopen it and make it active
      setIsChatWindowClosed(false);
      setIsChatWindowMinimized(false);
      setActiveWindow('chat');
    } else {
      // If window is open, just toggle minimize
      setIsChatWindowMinimized(prev => !prev);
    }
  };

  // Function to toggle the chat window 2's visibility
  const toggleChatWindow2Visibility = () => {
    if (isChatWindow2Closed) {
      // If window is closed, reopen it and make it active
      setIsChatWindow2Closed(false);
      setIsChatWindow2Minimized(false);
      setActiveWindow('chat2');
    } else {
      // If window is open, just toggle minimize
      setIsChatWindow2Minimized(prev => !prev);
    }
  };

  // Function to handle window focus (bring to front)
  const handleWindowFocus = (windowType: 'browser' | 'chat' | 'chat2') => {
    setActiveWindow(windowType);
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
              activeWindow={activeWindow}
              onWindowFocus={handleWindowFocus}
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
            isMainWindowMinimized={isMainWindowMinimized}
            isMainWindowClosed={isMainWindowClosed}
            isChatWindowMinimized={isChatWindowMinimized}
            isChatWindowClosed={isChatWindowClosed}
            isChatWindow2Minimized={isChatWindow2Minimized}
            isChatWindow2Closed={isChatWindow2Closed}
          />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
