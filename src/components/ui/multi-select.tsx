'use client';

import * as React from 'react';
import AsyncSelect from 'react-select/async';
import CreatableSelect from 'react-select/creatable';
import AsyncCreatableSelect from 'react-select/async-creatable';
import type { ClassNamesConfig } from 'react-select';
import { cn } from '@/lib/utils';

export interface SelectOption {
  label: string;
  value: string;
}

export interface MultiSelectProps {
  options?: SelectOption[];
  defaultValue?: SelectOption[];
  value?: SelectOption[];
  onChange: (options: SelectOption[]) => void;
  loadOptions?: (inputValue: string) => Promise<SelectOption[]>;
  isCreatable?: boolean;
  isAsync?: boolean;
  placeholder?: string;
  className?: string;
  label?: string;
  id?: string;
  error?: string;
  isDisabled?: boolean;
  isClearable?: boolean;
  noOptionsMessage?: string;
}

export function MultiSelect({
  options = [],
  defaultValue,
  value,
  onChange,
  loadOptions,
  isCreatable = false,
  isAsync = false,
  placeholder = 'Select options...',
  className,
  id,
  error,
  isDisabled = false,
  isClearable = true,
  noOptionsMessage = 'No options available',
}: MultiSelectProps) {
  const selectClassNames: ClassNamesConfig = {
    control: ({ isFocused }) =>
      cn(
        'w-full min-h-10 rounded-md !border !border-input !bg-transparent dark:!bg-input/30 text-sm transition-colors',
        isFocused && '!border-ring !ring-ring/50 !ring-[3px]',
        error &&
          'border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        isDisabled && 'opacity-50 cursor-not-allowed',
        className
      ),
    menu: () =>
      '!bg-popover !border !border-border !rounded-md !mt-1 !shadow-md z-50',
    menuList: () => '!py-2 !px-1',
    option: ({ isFocused, isSelected }) =>
      cn(
        '!px-2 !py-1.5 !text-sm hover:!bg-accent rounded-md',
        isFocused && !isSelected && '!bg-accent !text-accent-foreground',
        isSelected && '!bg-primary !text-primary-foreground'
      ),
    multiValue: () =>
      '!bg-secondary !rounded-md !text-secondary-foreground !text-sm',
    multiValueLabel: () => '!px-1.5 !py-1 !text-secondary-foreground',
    multiValueRemove: () =>
      '!px-1 !py-1 !rounded-r-md hover:!bg-destructive hover:!text-white transition-colors',
    placeholder: () => '!text-muted-foreground',
    input: () => '!text-foreground',
    indicatorSeparator: () => '!bg-border',
    clearIndicator: () => '!text-muted-foreground hover:!text-foreground',
    dropdownIndicator: () => '!text-muted-foreground hover:!text-foreground',
    noOptionsMessage: () => '!text-muted-foreground !text-sm !py-1.5 !px-2',
  };

  const SelectComponent = React.useMemo(() => {
    if (isAsync && isCreatable) return AsyncCreatableSelect;
    if (isAsync) return AsyncSelect;
    if (isCreatable) return CreatableSelect;
    return AsyncSelect;
  }, [isAsync, isCreatable]);

  const selectId = React.useId();
  const inputId = id || selectId;

  return (
    <SelectComponent
      inputId={inputId}
      isMulti
      options={options}
      defaultValue={defaultValue}
      value={value}
      onChange={(selected) => onChange(selected as SelectOption[])}
      loadOptions={loadOptions}
      placeholder={placeholder}
      classNames={selectClassNames}
      isDisabled={isDisabled}
      isClearable={isClearable}
      noOptionsMessage={() => noOptionsMessage}
      {...(!isAsync && { options })}
    />
  );
}
