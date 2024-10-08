import type { UseControllerProps, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { PasswordInputProps } from '@/shared/components/ui/password-input';
import { PasswordInput } from '@/shared/components/ui/password-input';

export const ControlledPasswordInput = <FormType extends FieldValues>({
  control,
  name,
  rules,
  ...passwordInputProps
}: PasswordInputProps & UseControllerProps<FormType>) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <PasswordInput
          value={field.value}
          onChangeText={field.onChange}
          errorMessage={fieldState.error?.message}
          {...passwordInputProps}
        />
      )}
    />
  );
};
