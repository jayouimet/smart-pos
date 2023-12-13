import type { ComponentPropsWithoutRef } from 'react';

interface SelectOptionProps extends ComponentPropsWithoutRef<'option'> {
  children?: string;
}

const SelectOption = ({ children, ...rest }: SelectOptionProps) => {
  return (
    <option
      style={{
        background: 'var(--chakra-colors-brand-primary-gray-400)',
      }}
      {...rest}
    >
      {children}
    </option>
  );
};

export default SelectOption;
