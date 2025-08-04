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
  // State to control the main window's minimized status
  const [isMainWindowMinimized, setIsMainWindowMinimized] = useState(false);

  // Function to toggle the main window's visibility
  const toggleMainWindowVisibility = () => {
    setIsMainWindowMinimized(prev => !prev);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Pass state and setter to Index page */}
            <Route path="/" element={<Index isMainWindowMinimized={isMainWindowMinimized} setIsMainWindowMinimized={setIsMainWindowMinimized} />} />
            <Route path="/incident" element={<Incidentrapportering />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* Pass toggle function to Startbar */}
          <WindowsStartbar onToggleMainWindow={toggleMainWindowVisibility} />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
