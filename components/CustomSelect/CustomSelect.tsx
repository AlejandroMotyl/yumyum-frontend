import * as Select from '@radix-ui/react-select';
import type { Option } from '@/types/filter';
import type { CustomSelectProps } from '@/types/filter';
import css from './CustomSelect.module.css';

export function CustomSelect({
  placeholder,
  value,
  options,
  onChange,
  name,
}: CustomSelectProps) {
  const selectHasValue = Boolean(value);

  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger
        className={`${css.trigger} ${selectHasValue ? css.triggerSelected : ''}`}
        area-label={name}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon className={css.icon}>
          <svg width="16" height="16">
            <use href="/Sprite-new.svg#icon-chevron-down" />
          </svg>
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className={css.content} position="popper">
          <Select.Viewport className={css.viewport}>
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className={css.item}
              >
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
