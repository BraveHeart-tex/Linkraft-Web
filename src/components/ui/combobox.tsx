'use client';
import { Button } from '@/components/ui/Button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/Command';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/Drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Nullable } from '@/lib/common.types';
import type React from 'react';
import { useMemo, useState } from 'react';

type FieldValue = Nullable<string | number>;

interface ComboBoxProps {
  options: ComboboxOption[];

  value: FieldValue;
  onValueChange: (newValue: Nullable<string>) => void;
  ref?: React.Ref<Nullable<HTMLButtonElement>>;
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
            {selectedOption?.label || 'Select an option'}
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
          {selectedOption?.label || 'Select an option'}
        </Button>
      </DrawerTrigger>
      <DrawerTitle className="sr-only">Select an option</DrawerTitle>
      <DrawerDescription className="sr-only">
        Use the list of option below
      </DrawerDescription>
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
                onValueChange(
                  option.value === null ? null : option.value.toString()
                );
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
