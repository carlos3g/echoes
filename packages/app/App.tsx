import "@/lib/i18n";
import "@/shared/services";
import "react-native-gesture-handler";

import { queryClient } from "@/lib/react-query";
import { RootNavigator } from "@/navigation";
import { QueryClientProvider } from "@tanstack/react-query";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigator />
    </QueryClientProvider>
  );
}
