import React from 'react'; // Import React for type definitions
import { WindowsDialog } from "../components/WindowsDialog";
import { ChatWindow } from "../components/ChatWindow";
import { ChatWindow2 } from "../components/ChatWindow2";
import { MailWindow } from "../components/MailWindow";

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
  isMailWindowMinimized: boolean;
  setIsMailWindowMinimized: React.Dispatch<React.SetStateAction<boolean>>;
  isMailWindowClosed: boolean;
  setIsMailWindowClosed: React.Dispatch<React.SetStateAction<boolean>>;
  activeWindow: 'browser' | 'chat' | 'chat2' | 'mail' | null;
  onWindowFocus: (windowType: 'browser' | 'chat' | 'chat2' | 'mail') => void;
  isScriptedSequenceActive: boolean;
  setIsScriptedSequenceActive: React.Dispatch<React.SetStateAction<boolean>>;
  systemDateTime: Date;
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
  isMailWindowMinimized,
  setIsMailWindowMinimized,
  isMailWindowClosed,
  setIsMailWindowClosed,
  activeWindow,
  onWindowFocus,
  isScriptedSequenceActive,
  setIsScriptedSequenceActive,
  systemDateTime
}) => {
  return (
    // Changed background from solid blue to image
    <div
      className="min-h-screen pb-12 bg-contain bg-center bg-no-repeat" // Changed to bg-contain to avoid cropping, added bg-no-repeat
      style={{
        backgroundImage: "url('/wallpaper-sos-alarm.png')",
        backgroundColor: "#2F4459" // Fallback color that matches the wallpaper theme
      }}
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
        isScriptedSequenceActive={isScriptedSequenceActive}
        setIsScriptedSequenceActive={setIsScriptedSequenceActive}
        systemDateTime={systemDateTime}
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

      {/* Mail Window */}
      <MailWindow
        isMinimized={isMailWindowMinimized}
        setIsMinimized={setIsMailWindowMinimized}
        isClosed={isMailWindowClosed}
        setIsClosed={setIsMailWindowClosed}
        isActive={activeWindow === 'mail'}
        onFocus={() => onWindowFocus('mail')}
      />
    </div>
  );
};

export default Index;
