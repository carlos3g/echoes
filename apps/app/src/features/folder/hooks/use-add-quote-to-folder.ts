import { folderService } from '@/features/folder/services';
import { queryKeys } from '@/lib/react-query/query-keys';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

interface AddQuoteToFolderInput {
  folderUuid: string;
  quoteUuid: string;
}

export const useAddQuoteToFolder = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, HttpError<ApiResponseError>, AddQuoteToFolderInput>({
    mutationFn: async ({ folderUuid, quoteUuid }) => folderService.addQuote(folderUuid, { quoteUuid }),
    onSuccess: (_, { folderUuid }) => {
      toast.success(t('folder.addQuoteSuccess'));
      void queryClient.invalidateQueries({ queryKey: queryKeys.folders.quotes(folderUuid) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.folders.detail(folderUuid) });
    },
    onError: () => {
      toast.error(t('folder.addQuoteErrorTitle'));
    },
  });
};
