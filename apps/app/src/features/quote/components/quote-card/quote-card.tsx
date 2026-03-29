import type { PressableProps } from 'react-native';
import { Dimensions, Pressable, Text as RNText, TouchableOpacity, View } from 'react-native';
import ContentLoader, { Rect } from 'react-content-loader/native';
import React from 'react';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Quote } from '@/types/entities';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';
import { ShareButton } from './share-button';
import { FavoriteButton } from './favorite-button';
import { TagButton } from './tag-button';
import { CopyButton } from './copy-button';

const { width: wWidth } = Dimensions.get('window');
const SKELETON_HEIGHT = 220;

interface QuoteCardProps extends PressableProps {
  data: Quote;
  index?: number;
  testID?: string;
}

export const QuoteCard: React.FC<QuoteCardProps> = (props) => {
  const { data, index = 0, testID, ...rest } = props;
  const router = useRouter();

  const handleAuthorPress = () => {
    if (data.author?.uuid) {
      router.push({ pathname: '/(app)/(tabs)/(explore)/(authors)/[authorUuid]', params: { authorUuid: data.author.uuid } });
    }
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).duration(400).springify()}>
      <Pressable
        testID={testID ?? `quote-card-${data.uuid}`}
        key={data.uuid}
        className="mx-4 my-2 rounded-2xl border border-border bg-card p-6"
        style={{ shadowColor: '#2D2D28', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 4 }}
        {...rest}
      >
        {/* Decorative quote mark */}
        <RNText style={{ fontFamily: 'PlayfairDisplay-Regular', fontSize: 40, lineHeight: 40, color: '#B5845A', opacity: 0.5 }}>
          {'\u201C'}
        </RNText>

        {/* Quote body */}
        <Text
          testID={`quote-body-${data.uuid}`}
          variant="quoteMedium"
          className="mt-1"
        >
          {data.body}
        </Text>

        {/* Terracotta separator */}
        <View className="my-4 h-[1.5px] w-10 bg-primary" />

        {/* Author name */}
        {data.author?.name ? (
          <TouchableOpacity
            onPress={handleAuthorPress}
            accessibilityRole="link"
            accessibilityLabel={`Ver perfil de ${data.author.name}`}
          >
            <Text
              testID={`quote-author-${data.uuid}`}
              variant="paragraphCaption"
              semiBold
              className="uppercase tracking-widest text-secondary"
            >
              {data.author.name}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text
            testID={`quote-author-${data.uuid}`}
            variant="paragraphCaption"
            className="uppercase tracking-widest text-muted-foreground"
          >
            Autor desconhecido
          </Text>
        )}

        {/* Action buttons */}
        <View className="mt-5 flex-row justify-between">
          <View className="flex-row gap-5">
            <FavoriteButton data={data} />
            <TagButton data={data} />
          </View>
          <View className="flex-row gap-5">
            <CopyButton data={data} />
            <ShareButton data={data} />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export const QuoteCardSkeleton: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View className="mx-4 my-2 rounded-2xl border border-border bg-card p-6">
      <ContentLoader
        speed={2}
        width={wWidth - 80}
        height={SKELETON_HEIGHT}
        viewBox={`0 0 ${wWidth - 80} ${SKELETON_HEIGHT}`}
        backgroundColor={colors.muted}
        foregroundColor={colors.border}
      >
        {/* Quote mark */}
        <Rect x="0" y="0" rx="4" ry="4" width="24" height="30" />

        {/* Body lines */}
        <Rect x="0" y="48" rx="4" ry="4" width={wWidth - 120} height="14" />
        <Rect x="0" y="70" rx="4" ry="4" width={wWidth - 150} height="14" />
        <Rect x="0" y="92" rx="4" ry="4" width={wWidth - 180} height="14" />

        {/* Separator */}
        <Rect x="0" y="124" rx="1" ry="1" width="40" height="2" />

        {/* Author */}
        <Rect x="0" y="140" rx="4" ry="4" width={100} height="10" />

        {/* Action buttons */}
        <Rect x="0" y="176" rx="4" ry="4" width="50" height="20" />
        <Rect x="70" y="176" rx="4" ry="4" width="50" height="20" />
        <Rect x={wWidth - 116} y="176" rx="4" ry="4" width="20" height="20" />
      </ContentLoader>
    </View>
  );
};
