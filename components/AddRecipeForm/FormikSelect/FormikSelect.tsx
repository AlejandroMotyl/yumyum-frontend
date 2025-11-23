import React from 'react';
import { useField } from 'formik';
import Select, {
  components,
  DropdownIndicatorProps,
  GroupBase,
  StylesConfig,
} from 'react-select';
import { FormikSelectProps, SelectOption } from '@/types/formik';
import css from '../AddRecipeForm.module.css';

const DropdownIndicator = (
  props: DropdownIndicatorProps<SelectOption, false, GroupBase<SelectOption>>,
) => {
  const isMenuOpen = props.selectProps.menuIsOpen;

  const rotationStyle: React.CSSProperties = {
    transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  };

  return components.DropdownIndicator ? (
    <components.DropdownIndicator {...props}>
      <svg
        className={css.arrowIcon}
        style={rotationStyle}
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
      >
        <use href={'/sprite.svg#icon-Controlschevron-down'}></use>
      </svg>
    </components.DropdownIndicator>
  ) : null;
};

const getCustomStyles = (): StylesConfig<SelectOption, false> => ({
  control: (provided, state) => ({
    ...provided,
    height: '48px',
    minHeight: '48px',
    borderRadius: '8px',
    backgroundColor: 'var(--white)',
    borderColor: state.isFocused ? 'var(--black)' : 'var(--light-gray)',
    borderWidth: '1px',
    boxShadow: 'none',
    padding: '0 8px',
    cursor: 'pointer',
    fontSize: 'var(--body-lg-regular)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '&:hover': {
      backgroundColor: 'var(--white)',
      borderColor: 'var(--black)',
    },
  }),

  menu: (provided) => ({
    ...provided,
    borderRadius: '8px',
    marginTop: '4px',
    backgroundColor: 'var(--white)',
    boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.15)',
    zIndex: 100,
  }),

  menuList: (provided) => ({
    ...provided,
    maxHeight: '180px',
    overflowY: 'auto',
    padding: '0',
    '::-webkit-scrollbar': {
      width: '8px',
    },
    '::-webkit-scrollbar-thumb': {
      backgroundColor: 'var(--light-gray)',
      borderRadius: '4px',
    },
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? 'var(--light-gray-2)' : 'var(--white)',
    color: 'var(--black)',
    cursor: 'pointer',
    padding: '8px 16px',
    fontSize: 'var(--body-md-regular)',
    ...(state.isSelected && {
      backgroundColor: 'var(--white)',
      color: 'var(--black)',
    }),
  }),

  valueContainer: (provided) => ({
    ...provided,
    padding: '0 8px',
  }),

  dropdownIndicator: (provided) => ({
    ...provided,
    color: 'var(--gray)',
    padding: '0 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),

  indicatorSeparator: () => ({ display: 'none' }),
});

export const FormikSelect: React.FC<
  FormikSelectProps & {
    onChange?: (option: SelectOption | null) => void;
  }
> = ({ label, options, placeholder, onChange: externalOnChange, ...props }) => {
  const [field, meta, helpers] = useField(props);
  const selectStyles = React.useMemo(() => getCustomStyles(), []);

  const handleChange = (option: SelectOption | null) => {
    helpers.setValue(option ? option.value : '');
    if (externalOnChange) {
      externalOnChange(option);
    }
  };

  const selectedOption = options.find((option) => option.value === field.value);

  const hasError = meta.touched && meta.error;

  return (
    <label className={css.addRecipeFormBlockSubtitle}>
      {label}
      <Select
        {...field}
        {...props}
        options={options}
        value={selectedOption || null}
        onChange={handleChange}
        onBlur={() => helpers.setTouched(true)}
        isClearable={false}
        placeholder={placeholder}
        styles={selectStyles}
        classNamePrefix="react-select"
        components={{ DropdownIndicator }}
        className={hasError ? css['is-invalid'] : ''}
      />
      {hasError && <div className={css.errorMessage}>{meta.error}</div>}
    </label>
  );
};
