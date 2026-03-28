import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import type { Quote } from '@/types/entities';
import { Ionicons } from '@/lib/nativewind/components';
import { toast } from 'sonner-native';

interface CopyButtonProps {
  data: Quote;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ data }) => {
  const handleCopy = useCallback(async () => {
    await Clipboard.setStringAsync(data.body);
    toast.success('Citação copiada!');
  }, [data.body]);

  return (
    <TouchableOpacity
      testID="copy-button"
      onPress={handleCopy}
      accessibilityLabel="Copiar citação"
      accessibilityRole="button"
    >
      <Ionicons name="copy-outline" size={20} className="text-muted-foreground" />
    </TouchableOpacity>
  );
};
