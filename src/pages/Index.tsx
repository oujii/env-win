import React from 'react'; // Import React for type definitions
import { WindowsDialog } from "../components/WindowsDialog";

// Define the props interface
interface IndexProps {
  isMainWindowMinimized: boolean;
  setIsMainWindowMinimized: React.Dispatch<React.SetStateAction<boolean>>;
}

const Index: React.FC<IndexProps> = ({ isMainWindowMinimized, setIsMainWindowMinimized }) => {
  return (
    // Changed background from solid blue to image
    <div
      className="min-h-screen pb-10 bg-cover bg-center" // Added bg-cover, bg-center, removed bg-[#0078d7]
      style={{ backgroundImage: "url('/wallpaper-sos-alarm.png')" }} // Set background image URL
    >
      {/* Pass the props down to WindowsDialog */}
      <WindowsDialog isMinimized={isMainWindowMinimized} setIsMinimized={setIsMainWindowMinimized} />
    </div>
  );
};

export default Index;
