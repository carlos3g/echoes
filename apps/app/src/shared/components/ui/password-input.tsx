import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { TextInputProps } from '@/shared/components/ui/text-input';
import { TextInput } from '@/shared/components/ui/text-input';

export type PasswordInputProps = Omit<TextInputProps, 'RightComponent'>;

export const PasswordInput: React.FC<PasswordInputProps> = (props) => {
  const { testID, ...rest } = props;
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(true);

  const toggleSecureTextEntry = () => {
    setIsSecureTextEntry((prev) => !prev);
  };

  return (
    <TextInput
      testID={testID}
      secureTextEntry={isSecureTextEntry}
      {...rest}
      RightComponent={
        <TouchableOpacity
          testID={testID ? `${testID}-toggle` : 'password-toggle-visibility'}
          onPress={toggleSecureTextEntry}
        >
          <Ionicons color="#71717a" size={24} name={isSecureTextEntry ? 'eye-outline' : 'eye-off-outline'} />
        </TouchableOpacity>
      }
    />
  );
};
