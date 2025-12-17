import { Stack } from 'expo-router';

export default function QuotesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Gerenciar citações',
        }}
      />
      <Stack.Screen
        name="[quoteUuid]"
        options={{
          title: 'Citação',
        }}
      />
    </Stack>
  );
}
