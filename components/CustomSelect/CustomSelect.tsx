'use client';
import * as Popover from '@radix-ui/react-popover';
import type { CustomSelectProps } from '@/types/filter';
import css from './CustomSelect.module.css';
import { useState } from 'react';

export function CustomSelect({
  placeholder,
  value,
  options,
  onChange,
  name,
}: CustomSelectProps) {
  const selectHasValue = Boolean(value);
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root modal={false} open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        className={`${css.trigger} ${selectHasValue ? css.triggerSelected : ''}`}
        aria-label={name}
      >
        <span className={selectHasValue ? css.valueText : css.placeholder}>
          {selectHasValue
            ? options.find((o) => o.value === value)?.label
            : placeholder}
        </span>

        <div className={css.icon}>
          <svg width="16" height="16">
            <use href="/sprite-new.svg#icon-big-chevron-down-small" />
          </svg>
        </div>
      </Popover.Trigger>

      <Popover.Content className={css.content}>
        <ul className={css.viewport}>
          {options.map((option) => (
            <li
              key={option.value}
              className={css.item}
              data-checked={option.value === value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </Popover.Content>
    </Popover.Root>
  );
}
