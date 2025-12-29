import React from 'react';
import { useRouter } from 'expo-router';
import type { Tag } from '@/types/entities';
import { TagCard } from '@/features/tag/components/tag-card';

interface TagListItemProps {
  item: Tag;
}

export const TagListItem: React.FC<TagListItemProps> = ({ item }) => {
  const router = useRouter();

  const onPress = () => {
    router.push({
      pathname: '/(app)/(tabs)/(quotes)',
      params: { tagUuid: item.uuid, tagTitle: item.title },
    });
  };

  return <TagCard data={item} onPress={onPress} key={item.uuid} />;
};
