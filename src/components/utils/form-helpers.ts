export type TFormData<T> = T & {
  // Not an input field, but it's needed for custom errors,
  formError: string;
};
