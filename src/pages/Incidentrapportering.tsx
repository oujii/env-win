
import { useState } from "react";
import { IncidentReportWindow } from "../components/IncidentReportWindow";

const Incidentrapportering = () => {
  const [showIncidentWindow, setShowIncidentWindow] = useState(true);
  
  const handleClose = () => {
    setShowIncidentWindow(false);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0078d7]">
      <div className="relative flex-1 bg-[#b9b9b9] no-select" style={{ width: '100%', height: '100vh' }}>
        {showIncidentWindow && <IncidentReportWindow onClose={handleClose} />}
      </div>
    </div>
  );
};

export default Incidentrapportering;
