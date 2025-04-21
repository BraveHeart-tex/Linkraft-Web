/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import * as React from 'react';
import AsyncSelect, { AsyncProps } from 'react-select/async';
import CreatableSelect, { CreatableProps } from 'react-select/creatable';
import AsyncCreatableSelect from 'react-select/async-creatable';
import Select from 'react-select';
import { cn } from '@/lib/utils';
import type { ClassNamesConfig, GroupBase } from 'react-select';

export interface SelectOption {
  label: string;
  value: string;
}

interface BaseMultiSelectProps {
  options?: SelectOption[];
  defaultValue?: SelectOption[];
  value?: SelectOption[];
  onChange?: (options: SelectOption[]) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  id?: string;
  error?: string;
  isDisabled?: boolean;
  isClearable?: boolean;
  noOptionsMessage?: string;

  ref?: React.Ref<any>;

  loadOptions?: AsyncProps<
    SelectOption,
    true,
    GroupBase<SelectOption>
  >['loadOptions'];
}

interface AsyncMultiSelectProps extends BaseMultiSelectProps {
  isAsync: true;
  isCreatable?: boolean;
  loadOptions: AsyncProps<
    SelectOption,
    true,
    GroupBase<SelectOption>
  >['loadOptions'];
}

interface CreatableMultiSelectProps extends BaseMultiSelectProps {
  isAsync?: false;
  isCreatable: true;
  onCreateOption?: CreatableProps<
    SelectOption,
    true,
    GroupBase<SelectOption>
  >['onCreateOption'];
}

interface StandardMultiSelectProps extends BaseMultiSelectProps {
  isAsync?: false;
  isCreatable?: false;
}

export type MultiSelectProps =
  | AsyncMultiSelectProps
  | CreatableMultiSelectProps
  | StandardMultiSelectProps;

export function MultiSelect({
  options = [],
  defaultValue,
  value,
  loadOptions,
  onChange,
  isCreatable = false,
  isAsync = false,
  placeholder = 'Select options...',
  className,
  id,
  error,
  isDisabled = false,
  isClearable = true,
  noOptionsMessage = 'No options available',
  ref,
  ...restProps
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

  const selectId = React.useId();
  const inputId = id || selectId;

  const commonProps = {
    inputId,
    isMulti: true,
    options,
    defaultValue,
    value,
    onChange: (selected: any) => onChange?.(selected as SelectOption[]),
    placeholder,
    classNames: selectClassNames,
    isDisabled,
    isClearable,
    noOptionsMessage: () => noOptionsMessage,
    ref,
    closeMenuOnSelect: false,
    ...restProps,
  };

  if (isAsync && isCreatable) {
    return (
      <AsyncCreatableSelect
        loadOptions={loadOptions}
        {...(commonProps as any)}
      />
    );
  }

  if (isAsync) {
    return <AsyncSelect loadOptions={loadOptions} {...(commonProps as any)} />;
  }

  if (isCreatable) {
    return <CreatableSelect options={options} {...(commonProps as any)} />;
  }

  return <Select options={options} {...(commonProps as any)} />;
}
