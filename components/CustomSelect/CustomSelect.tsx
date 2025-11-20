import * as Popover from '@radix-ui/react-popover';
import type { CustomSelectProps } from '@/types/filter';
import css from './CustomSelect.module.css';
// import { useLayoutEffect, useRef, useState } from 'react';

export function CustomSelect({
  placeholder,
  value,
  options,
  onChange,
  name,
}: CustomSelectProps) {
  const selectHasValue = Boolean(value);
  // const triggerRef = useRef<HTMLLIElement | null>(null);
  // const [triggerWidth, setTriggerWidth] = useState<number | null>(null);

  // useLayoutEffect(() => {
  //   if (triggerRef.current) {
  //     const width = triggerRef.current.offsetWidth;
  //     setTriggerWidth(width);
  //   }
  // }, [triggerRef.current, options, value]);

  return (
    <Popover.Root modal={false}>
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
            <use href="/Sprite-new.svg#icon-big-chevron-down-small" />
          </svg>
        </div>
      </Popover.Trigger>

      <Popover.Content
        className={css.content}
        // style={{
        //   width: triggerWidth ? `${triggerWidth}px` : 'auto',
        // }}
        // align="start"
      >
        <ul className={css.viewport}>
          {options.map((option) => (
            <li
              key={option.value}
              className={css.item}
              data-checked={option.value === value}
              onClick={() => {
                onChange(option.value);
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
