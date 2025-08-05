import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateTimeSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  currentDateTime: Date;
  onSetDateTime: (newDateTime: Date) => void;
  triggerRef: React.RefObject<HTMLDivElement>; // Ref of the clock element
}

export const DateTimeSettingsPopup: React.FC<DateTimeSettingsPopupProps> = ({
  isOpen,
  onClose,
  currentDateTime,
  onSetDateTime,
  triggerRef
}) => {
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const popupRef = useRef<HTMLDivElement>(null);

  // Format Date to YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Format Time to HH:MM
  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    if (isOpen) {
      setDateInput(formatDate(currentDateTime));
      setTimeInput(formatTime(currentDateTime));

      // Calculate position near the trigger element
      if (triggerRef.current && popupRef.current) {
          const triggerRect = triggerRef.current.getBoundingClientRect();
          const popupRect = popupRef.current.getBoundingClientRect();
          // Position above and aligned to the right of the trigger
          let top = triggerRect.top - popupRect.height - 10; // 10px gap
          let left = triggerRect.right - popupRect.width;

          // Adjust if it goes off-screen (simple adjustment)
          if (top < 0) top = triggerRect.bottom + 10;
          if (left < 0) left = 0;

          setPosition({ top, left });
      }
    }
  }, [isOpen, currentDateTime, triggerRef]);


  const handleSet = () => {
    // Combine date and time inputs into a new Date object
    // Basic validation could be added here
    try {
        const [year, month, day] = dateInput.split('-').map(Number);
        const [hours, minutes] = timeInput.split(':').map(Number);

        if (!isNaN(year) && !isNaN(month) && !isNaN(day) && !isNaN(hours) && !isNaN(minutes)) {
            const newDate = new Date(currentDateTime); // Keep original seconds/ms if needed
            newDate.setFullYear(year, month - 1, day); // Month is 0-indexed
            newDate.setHours(hours, minutes);
            onSetDateTime(newDate);
            onClose();
        } else {
            console.error("Invalid date/time format");
            // Optionally show an error to the user
        }
    } catch (error) {
        console.error("Error parsing date/time:", error);
         // Optionally show an error to the user
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={popupRef}
      className="absolute z-50 w-64 bg-[#f0f0f0] border border-[#aaaaaa] shadow-lg p-3 flex flex-col gap-3 text-xs"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="font-semibold">Ställ in tid och datum</span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X size={14} />
        </Button>
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="date-input">Datum (YYYY-MM-DD):</Label>
        <Input
          id="date-input"
          type="date" // Use date type for better browser support if available, fallback styling handles it
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          className="h-7 text-xs"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="time-input">Tid (HH:MM):</Label>
        <Input
          id="time-input"
          type="time" // Use time type
          value={timeInput}
          onChange={(e) => setTimeInput(e.target.value)}
          className="h-7 text-xs"
          step="60" // Only allow hour and minute selection
          pattern="[0-9]{2}:[0-9]{2}" // Force 24-hour format
          style={{ colorScheme: 'dark' }} // Force 24-hour format in most browsers
        />
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <Button variant="outline" size="sm" onClick={onClose}>
          Avbryt
        </Button>
        <Button size="sm" onClick={handleSet}>
          Ställ in
        </Button>
      </div>
    </div>
  );
};
