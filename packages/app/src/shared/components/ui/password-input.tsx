import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import type { TextInputProps } from '@/shared/components/ui/text-input';
import { TextInput } from '@/shared/components/ui/text-input';

export type PasswordInputProps = Omit<TextInputProps, 'RightComponent'>;

export const PasswordInput = (props: PasswordInputProps) => {
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(true);

  const toggleSecureTextEntry = () => {
    setIsSecureTextEntry((prev) => !prev);
  };

  return (
    <TextInput
      secureTextEntry={isSecureTextEntry}
      {...props}
      RightComponent={
        <Ionicons
          onPress={toggleSecureTextEntry}
          color="gray2"
          size={24}
          name={isSecureTextEntry ? 'eye-outline' : 'eye-off-outline'}
        />
      }
    />
  );
};
