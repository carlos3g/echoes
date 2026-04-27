import React from 'react';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '@/shared/components/ui/empty-state';

export const TagListEmpty = React.memo(() => {
  const { t } = useTranslation();
  return <EmptyState icon="pricetags-outline" title={t('tag.emptyTitle')} description={t('tag.emptyDescription')} />;
});
