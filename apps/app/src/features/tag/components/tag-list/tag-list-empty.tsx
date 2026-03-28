import React from 'react';
import { EmptyState } from '@/shared/components/ui/empty-state';

export const TagListEmpty = React.memo(() => (
  <EmptyState
    icon="pricetags-outline"
    title="Nenhuma tag cadastrada"
    description="Crie sua primeira tag para organizar suas citações"
  />
));
