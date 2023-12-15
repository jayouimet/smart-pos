'use client';

import {
  Button,
  Checkbox,
  CheckboxGroup,
  CheckboxGroupProps,
  FormControl,
  FormControlProps,
  FormLabel,
  Input,
  InputProps,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  NumberInputProps,
  Select,
  SelectProps,
  Stack,
} from '@chakra-ui/react';
import {
  useEffect,
  useState,
} from 'react';
import { FormikValues, useFormik } from 'formik';
import SelectOption from '@components/base/SelectOption';
import { ChevronDownIcon } from '@chakra-ui/icons';

export enum ChakraInputEnum {
  Input,
  Select,
  NumberInput,
  MultiSelect,
}

interface SelectOptionProps {
  value: string;
  name: string;
  key: string;
}

interface UpsertModalField {
  name: string;
  defaultValue?: string | number;
  defaultValues?: Array<any>;
  placeHolder?: string;
  label: string;
  formControlProps?: FormControlProps;
  inputProps?: InputProps;
  numberInputProps?: NumberInputProps;
  selectProps?: SelectProps;
  checkboxGroupProps?: CheckboxGroupProps;
  type: ChakraInputEnum;
  selectOptions?: Array<SelectOptionProps>;
  format?: (data: number) => string;
}

interface UpsertModalProps {
  title: string,
  isModalOpen: boolean;
  onClose: () => void;
  onSubmitCallback: (result: Object) => void;
  fields: Array<UpsertModalField>;
  initialValues: FormikValues;
}

const UpsertModal = ({
  title,
  isModalOpen,
  onClose,
  onSubmitCallback,
  fields,
  initialValues
}: UpsertModalProps) => {
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async (values: Object, {setSubmitting}) => {
      onSubmitCallback(values);
    }
  })

  const [isMenuOpen, setIsMenuOpen] = useState<{}>({});

  useEffect(() => {
    let m = {};
    for (let i = 0; i < fields.length; i++) {
      m[fields[i].name] = false;
    }
    setIsMenuOpen({...m});
  }, [setIsMenuOpen])

  return (
    <Modal isOpen={isModalOpen} onClose={onClose} isCentered size={'3xl'}>
      <ModalOverlay />
      <ModalContent maxH={'90%'} overflowY={'auto'}>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <Stack>
              {
                fields && fields.map((field: UpsertModalField, index) => {
                  switch (field.type) {
                    case ChakraInputEnum.Input: 
                      return (
                        <FormControl key={index} {...field.formControlProps}>
                          <FormLabel>{field.label}</FormLabel>
                          <Input
                            {...field.inputProps}
                            name={field.name}
                            type={'text'}
                            placeholder={field.placeHolder}
                            value={formik.values[field.name]}
                            onChange={formik.handleChange}
                          ></Input>
                        </FormControl>
                      );
                    case ChakraInputEnum.NumberInput:
                      return (
                        <FormControl key={index} {...field.formControlProps}>
                          <FormLabel>{field.label}</FormLabel>
                          <NumberInput
                            {...field.numberInputProps}
                            name={field.name}
                            value={formik.values[field.name]}
                          >
                            <NumberInputField
                              name={field.name}
                              onChange={formik.handleChange}
                              />
                          </NumberInput>
                        </FormControl>
                      );
                    case ChakraInputEnum.Select: 
                      return (
                        <FormControl key={index} {...field.formControlProps}>
                          <FormLabel>{field.label}</FormLabel>
                          <Select
                            name={field.name}
                            value={formik.values[field.name]}
                            onChange={formik.handleChange}
                            {...field.selectProps}
                          >
                            {
                              field.selectOptions && field.selectOptions.map((option: SelectOptionProps) => {
                                return (
                                  <SelectOption key={option.key} value={option.value}>{option.name}</SelectOption>
                                );
                              })
                            }
                          </Select>
                        </FormControl>
                      );
                    case ChakraInputEnum.MultiSelect: 
                      return (
                        <FormControl key={index} {...field.formControlProps}>
                          <FormLabel>{field.label}</FormLabel>
                          <CheckboxGroup
                            {...field.checkboxGroupProps}
                            defaultValue={formik.values?.[field.name]}
                          >
                            <Menu isOpen={isMenuOpen[field.name]}>
                              <MenuButton 
                                onClick={() => {
                                  let op = {...isMenuOpen};
                                  op[field.name] = !op[field.name];
                                  setIsMenuOpen({...op});
                                }} 
                                as={Button} 
                                rightIcon={<ChevronDownIcon />}
                              >
                                Categories
                              </MenuButton>
                              <MenuList>
                                {
                                  field.selectOptions && field.selectOptions.map((option: SelectOptionProps) => {
                                    return (
                                      <MenuItem
                                        key={option.key} 
                                      >
                                        <Checkbox 
                                          onChange={formik.handleChange} 
                                          name={field.name} 
                                          value={option.value}
                                          isChecked={
                                            formik.values?.[field.name]?.includes(option.value)
                                          }
                                        >
                                          {option.name}
                                        </Checkbox>
                                      </MenuItem>
                                    );
                                  })
                                }
                              </MenuList>
                            </Menu>
                          </CheckboxGroup>
                        </FormControl>
                      );
                    default: 
                      return null;
                  }
                })
              }
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} type="submit">
              Submit
            </Button>
            <Button colorScheme="red" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default UpsertModal;
