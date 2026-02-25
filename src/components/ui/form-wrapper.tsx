'use client';

import * as React from 'react';
import {
  Controller,
  FieldPath,
  FieldValues,
  FormProvider,
  UseFormReturn,
} from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface FormContextValue<TFieldValues extends FieldValues = FieldValues> {
  form: UseFormReturn<TFieldValues>;
}

const FormContext = React.createContext<FormContextValue | undefined>(undefined);

const useFormContext = () => {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within <Form>');
  }
  return context;
};

interface FormProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  form: UseFormReturn<TFieldValues>;
  onSubmit: (data: TFieldValues) => void | Promise<void>;
}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, form, onSubmit, children, ...props }, ref) => {
    return (
      <FormContext.Provider value={{ form }}>
        <FormProvider {...form}>
          <form
            ref={ref}
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn('space-y-6', className)}
            {...props}
          >
            {children}
          </form>
        </FormProvider>
      </FormContext.Provider>
    );
  }
);
Form.displayName = 'Form';

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  render: (props: {
    field: any;
    fieldState: any;
    formState: any;
  }) => React.ReactElement;
}

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  render,
}: FormFieldProps<TFieldValues, TName>) => {
  const { form } = useFormContext();
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState, formState }) =>
        render({ field, fieldState, formState })
      }
    />
  );
};

interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('space-y-2', className)}
      {...props}
    />
  )
);
FormItem.displayName = 'FormItem';

interface FormLabelProps extends React.ComponentPropsWithoutRef<typeof Label> {}

const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  FormLabelProps
>(({ className, ...props }, ref) => (
  <Label
    ref={ref}
    className={cn('text-sm font-medium', className)}
    {...props}
  />
));
FormLabel.displayName = 'FormLabel';

interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({ ...props }, ref) => <div ref={ref} {...props} />
);
FormControl.displayName = 'FormControl';

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  FormMessageProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm font-medium text-destructive', className)}
    {...props}
  />
));
FormMessage.displayName = 'FormMessage';

interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  FormDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
FormDescription.displayName = 'FormDescription';

export {
  useFormContext,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
  type FormProps,
  type FormFieldProps,
};
