
import React from "react";
import { Input } from "./input";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
}

const ColorPicker = React.forwardRef<HTMLInputElement, ColorPickerProps>(
  ({ value, onChange, disabled = false, label }, ref) => {
    return (
      <div className="flex items-center gap-2">
        <div 
          className="w-6 h-6 rounded-full border"
          style={{ backgroundColor: value }}
        />
        <Input 
          ref={ref}
          type="color" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-12 h-8 p-1"
          aria-label={label || "Color picker"}
        />
      </div>
    );
  }
);

ColorPicker.displayName = "ColorPicker";

export { ColorPicker };
