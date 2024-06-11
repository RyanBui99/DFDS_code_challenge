import React, { FunctionComponent } from "react";
import { Input } from "../ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useFormContext } from "react-hook-form";

interface FormTextFieldProps {
  name: string;
  label: string;
  id?: string;
}

const FormTextField: FunctionComponent<FormTextFieldProps> = ({
  name,
  label,
}) => {
  return (
    <FormField
      control={useFormContext().control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormTextField;
