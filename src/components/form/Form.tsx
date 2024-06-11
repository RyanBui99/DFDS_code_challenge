import { zodResolver } from "@hookform/resolvers/zod";
import type { FormHTMLAttributes, ReactNode } from "react";
import type { UseFormProps } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import type { DeepPartial, UseFormReturn } from "react-hook-form/dist/types";
import type { SubmitHandler } from "react-hook-form/dist/types/form";

import type * as z from "zod";

import { TFormData } from "../utils/form-helpers";

export interface FormProps<T>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "children"> {
  form: UseFormProps<TFormData<T>>;
  children:
    | ((
        methods: UseFormReturn<TFormData<T>> & {
          onSubmit?: SubmitHandler<TFormData<T>>;
        },
      ) => ReactNode)
    | ReactNode;
  onSubmit?: (
    methods: UseFormReturn<TFormData<T>>,
  ) => SubmitHandler<TFormData<T>>;
  schema?: z.Schema<DeepPartial<T>>;
}
const Form = <T,>({ form, children, schema, onSubmit }: FormProps<T>) => {
  const methods = useForm<TFormData<T>>(
    schema
      ? {
          ...form,
          resolver: (values, context, options) => {
            /**
             * Removes all properties which has empty string as a value since RHK sets empty fields to empty strings.
             * If the empty strings are not deleted it will mess with zod's optional validation which in turn would
             * cause a validation error and show incorrect messages to the user and thus not sending the request.
             * This will also make the required error message be displayed correctly when there is an empty string as
             * the value of the input as an empty string would still be interpreted as an accepted value by zod.
             */
            Object.keys(values).forEach((key) => {
              // @ts-ignore In this case the check for an empty string is sufficient
              if (values[key] === "") {
                // @ts-ignore We already checked for the existence of the key in the check above
                delete values[key];
              }
            });
            return zodResolver(schema)(values, context, options);
          },
        }
      : form,
  );

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      {typeof children === "function"
        ? children({
            ...methods,
            onSubmit: onSubmit ? onSubmit(methods) : undefined,
          })
        : children}
    </FormProvider>
  );
};

export default Form;
