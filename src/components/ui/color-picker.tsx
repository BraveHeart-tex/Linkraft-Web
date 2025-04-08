'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Pipette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

// Preset colors
const presetColors = [
  '#f44336', // Red
  '#e91e63', // Pink
  '#9c27b0', // Purple
  '#673ab7', // Deep Purple
  '#3f51b5', // Indigo
  '#2196f3', // Blue
  '#03a9f4', // Light Blue
  '#00bcd4', // Cyan
  '#009688', // Teal
  '#4caf50', // Green
  '#8bc34a', // Light Green
  '#cddc39', // Lime
  '#ffeb3b', // Yellow
  '#ffc107', // Amber
  '#ff9800', // Orange
  '#ff5722', // Deep Orange
  '#795548', // Brown
  '#607d8b', // Blue Grey
  '#9e9e9e', // Grey
  '#000000', // Black
  '#ffffff', // White
];

const ColorPicker = ({ color, onChange, className }: ColorPickerProps) => {
  const [hexValue, setHexValue] = useState(color);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setHexValue(color);
  }, [color]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHexValue(value);

    // Only update the parent if it's a valid hex color
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      onChange(value);
    }
  };

  const handleColorChange = (newColor: string) => {
    setHexValue(newColor);
    onChange(newColor);
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal h-12',
              !hexValue && 'text-muted-foreground'
            )}
          >
            <div className="flex items-center gap-2 w-full">
              <div
                className="h-6 w-6 rounded-md border border-input shadow-sm"
                style={{ backgroundColor: hexValue }}
              />
              <div className="flex-1 truncate">{hexValue}</div>
              <Pipette className="h-4 w-4 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="start">
          <div className="flex flex-col gap-4">
            <HexColorPicker color={hexValue} onChange={handleColorChange} />

            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="hex" className="w-10 sr-only">
                  Hex
                </Label>
                <div className="relative flex-1">
                  <Input
                    id="hex"
                    value={hexValue}
                    onChange={handleHexChange}
                    className="pr-8"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-1">
              {presetColors.map((presetColor) => (
                <TooltipProvider key={presetColor}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className={cn(
                          'h-6 w-6 rounded-md border border-input shadow-sm',
                          hexValue === presetColor &&
                            'ring-2 ring-ring ring-offset-1'
                        )}
                        style={{ backgroundColor: presetColor }}
                        onClick={() => handleColorChange(presetColor)}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{presetColor}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ColorPicker;
