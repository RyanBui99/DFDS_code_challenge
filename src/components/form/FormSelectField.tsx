import { FunctionComponent } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";

export interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  isMulti?: boolean;
  description?: string;
}

const FormSelectField: FunctionComponent<FormSelectFieldProps> = ({
  name,
  label,
  options,
  placeholder,
  isMulti,
  description,
}) => {
  if (isMulti) {
    return (
      <FormField
        control={useFormContext().control}
        name={name}
        render={() => (
          <FormItem>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
            <div className="h-40 overflow-scroll">
              {options?.map((option) => (
                <FormField
                  key={option.value}
                  control={useFormContext().control}
                  name={name}
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={option.value}
                        className="my-4 flex flex-row space-x-3"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(option.value)}
                            onCheckedChange={(checked: boolean) => {
                              return checked
                                ? field.onChange([...field.value, option.value])
                                : field.onChange(
                                    field.value?.filter(
                                      (value: string) => value !== option.value,
                                    ),
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">{option.label}</FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <FormField
      control={useFormContext().control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <FormDescription>{description}</FormDescription>

          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormSelectField;
