import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useGetAuthors } from '@/features/author/hooks/use-get-authors';
import { Text } from '@/shared/components/ui/text';
import { AvatarInitials } from '@/shared/components/ui/avatar-initials';

export const FeaturedAuthors: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { authors } = useGetAuthors({});

  if (!authors.length) return null;

  const featured = authors.slice(0, 10);

  return (
    <View className="py-3">
      <Text variant="paragraphSmall" semiBold className="mb-2 px-4 text-foreground">
        {t('explore.featuredAuthors')}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-4 gap-4">
        {featured.map((author) => (
          <TouchableOpacity
            key={author.uuid}
            onPress={() =>
              router.push({
                pathname: '/(app)/(tabs)/(explore)/author/[authorUuid]',
                params: { authorUuid: author.uuid },
              })
            }
            className="items-center"
            activeOpacity={0.7}
          >
            <AvatarInitials name={author.name} size="sm" />
            <Text variant="paragraphCaptionSmall" className="mt-1 w-16 text-center text-foreground" numberOfLines={1}>
              {author.name.split(' ')[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
