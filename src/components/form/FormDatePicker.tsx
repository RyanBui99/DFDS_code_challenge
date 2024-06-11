import React, { FunctionComponent } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { DatePicker } from "../atoms";

type FormTextFieldProps = {
  name: string;
  label: string;
  id?: string;
};

const FormDatePicker: FunctionComponent<FormTextFieldProps> = ({
  name,
  label,
}) => {
  return (
    <FormField
      name={name}
      control={useFormContext().control}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <FormControl>
            <DatePicker setDate={field.onChange} date={field.value} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormDatePicker;
