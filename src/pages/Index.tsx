import React from 'react'; // Import React for type definitions
import { WindowsDialog } from "../components/WindowsDialog";
import { ChatWindow } from "../components/ChatWindow";
import { ChatWindow2 } from "../components/ChatWindow2";

// Define the props interface
interface IndexProps {
  isMainWindowMinimized: boolean;
  setIsMainWindowMinimized: React.Dispatch<React.SetStateAction<boolean>>;
  isMainWindowClosed: boolean;
  setIsMainWindowClosed: React.Dispatch<React.SetStateAction<boolean>>;
  isChatWindowMinimized: boolean;
  setIsChatWindowMinimized: React.Dispatch<React.SetStateAction<boolean>>;
  isChatWindowClosed: boolean;
  setIsChatWindowClosed: React.Dispatch<React.SetStateAction<boolean>>;
  isChatWindow2Minimized: boolean;
  setIsChatWindow2Minimized: React.Dispatch<React.SetStateAction<boolean>>;
  isChatWindow2Closed: boolean;
  setIsChatWindow2Closed: React.Dispatch<React.SetStateAction<boolean>>;
  activeWindow: 'browser' | 'chat' | 'chat2' | null;
  onWindowFocus: (windowType: 'browser' | 'chat' | 'chat2') => void;
}

const Index: React.FC<IndexProps> = ({
  isMainWindowMinimized,
  setIsMainWindowMinimized,
  isMainWindowClosed,
  setIsMainWindowClosed,
  isChatWindowMinimized,
  setIsChatWindowMinimized,
  isChatWindowClosed,
  setIsChatWindowClosed,
  isChatWindow2Minimized,
  setIsChatWindow2Minimized,
  isChatWindow2Closed,
  setIsChatWindow2Closed,
  activeWindow,
  onWindowFocus
}) => {
  return (
    // Changed background from solid blue to image
    <div
      className="min-h-screen pb-10 bg-cover bg-center" // Added bg-cover, bg-center, removed bg-[#0078d7]
      style={{ backgroundImage: "url('/wallpaper-sos-alarm.png')" }} // Set background image URL
    >
      {/* Pass the props down to WindowsDialog */}
      <WindowsDialog
        isMinimized={isMainWindowMinimized}
        setIsMinimized={setIsMainWindowMinimized}
        isClosed={isMainWindowClosed}
        setIsClosed={setIsMainWindowClosed}
        isActive={activeWindow === 'browser'}
        onFocus={() => onWindowFocus('browser')}
      />

      {/* Chat Window */}
      <ChatWindow
        isMinimized={isChatWindowMinimized}
        setIsMinimized={setIsChatWindowMinimized}
        isClosed={isChatWindowClosed}
        setIsClosed={setIsChatWindowClosed}
        isActive={activeWindow === 'chat'}
        onFocus={() => onWindowFocus('chat')}
      />

      {/* Chat Window 2 */}
      <ChatWindow2
        isMinimized={isChatWindow2Minimized}
        setIsMinimized={setIsChatWindow2Minimized}
        isClosed={isChatWindow2Closed}
        setIsClosed={setIsChatWindow2Closed}
        isActive={activeWindow === 'chat2'}
        onFocus={() => onWindowFocus('chat2')}
      />
    </div>
  );
};

export default Index;
