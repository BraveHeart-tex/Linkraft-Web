'use client';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useMemo, useState } from 'react';
import type React from 'react';

type FieldValue = string | number | null;

interface ComboBoxProps {
  options: ComboboxOption[];

  value: FieldValue;
  onValueChange: (newValue: string) => void;
  ref?: React.Ref<HTMLButtonElement | null>;
}

export interface ComboboxOption {
  label: string;
  value: FieldValue;
}

export const ComboBox = ({
  value,
  onValueChange,
  ref,
  options,
}: ComboBoxProps) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const selectedOption = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild ref={ref}>
          <Button variant="outline" className="justify-start">
            {selectedOption?.label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <OptionsList
            setOpen={setOpen}
            onValueChange={onValueChange}
            options={options}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild ref={ref}>
        <Button variant="outline" className="justify-start">
          {selectedOption?.label}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <OptionsList
            setOpen={setOpen}
            onValueChange={onValueChange}
            options={options}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

interface OptionsListProps {
  options: ComboboxOption[];
  setOpen: (open: boolean) => void;
  onValueChange: ComboBoxProps['onValueChange'];
}

const OptionsList = ({ options, setOpen, onValueChange }: OptionsListProps) => {
  return (
    <Command>
      <CommandInput placeholder="Filter options..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              key={option.value ?? option.label}
              value={option.value?.toString() ?? ''}
              onSelect={() => {
                onValueChange(option.value?.toString() || '');
                setOpen(false);
              }}
            >
              {option.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
