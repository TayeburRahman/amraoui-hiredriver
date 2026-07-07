import React from "react";
import { Clock } from "lucide-react";

interface TimeInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  isRTL?: boolean;
}

export function TimeInput({ value, onChange, isRTL, className, ...props }: TimeInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    
    // Allow deleting the colon
    if (e.nativeEvent && (e.nativeEvent as InputEvent).inputType === 'deleteContentBackward') {
      onChange(val);
      return;
    }

    // Remove non-digits
    val = val.replace(/[^0-9]/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    
    if (val.length >= 3) {
      let hours = val.slice(0, 2);
      let mins = val.slice(2);
      if (parseInt(hours) > 23) hours = '23';
      if (parseInt(mins) > 59) mins = '59';
      val = `${hours}:${mins}`;
    } else if (val.length === 2) {
      if (parseInt(val) > 23) val = '23';
      val = `${val}:`;
    } else if (val.length === 1) {
      if (parseInt(val) > 2) val = `0${val}:`;
    }

    onChange(val);
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      maxLength={5}
      placeholder="HH:MM"
      className={className}
      {...props}
    />
  );
}
