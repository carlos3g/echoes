import { Ionicons as ExpoIonicons } from '@expo/vector-icons';
import type { BottomSheetBackdropProps, BottomSheetFooterProps } from '@gorhom/bottom-sheet';
import RNBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetFooter as RNBottomSheetFooter,
} from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import type { ListRenderItem, FlashListProps } from '@shopify/flash-list';
import { FlashList as RNFlashList } from '@shopify/flash-list';
import { cssInterop } from 'nativewind';
import React, { useCallback, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import type { PressableProps } from 'react-native';
import { Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { Portal } from 'react-native-portalize';
import type { AnimatedProps } from 'react-native-reanimated';
import Animated, {
  interpolate,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import type { z } from 'zod';
import type { Tag } from '@/types/entities';
import { useAppSafeArea } from '@/shared/hooks/use-app-safe-area';
import { Text } from '@/shared/components/ui/text';
import { Button } from '@/shared/components/ui/button';
import { ControlledTextInput } from '@/shared/components/form/controlled-text-input';
import { createTagFormSchema } from '@/features/tag/validations';
import { TagCard, TagCardSkeleton } from '@/features/tag/components/tag-card';
import { useTags } from '@/features/tag/hooks/use-tags';
import { useCreateTag } from '@/features/tag/hooks/use-create-tag';
import { useRefreshOnFocus } from '@/lib/react-query';

// Type assertion needed due to cssInterop incompatibility
const FlashList = RNFlashList as unknown as <T>(
  props: FlashListProps<T> & { estimatedItemSize: number }
) => React.ReactElement;

const Ionicons = cssInterop(ExpoIonicons, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      color: 'color',
    },
  },
});

const BottomSheet = cssInterop(RNBottomSheet, {
  className: {
    target: 'style',
  },
  handleClassName: {
    target: 'handleStyle',
  },
  containerClassName: {
    target: 'containerStyle',
  },
  backgroundClassName: {
    target: 'backgroundStyle',
  },
  handleIndicatorClassName: {
    target: 'handleIndicatorStyle',
  },
});

const BottomSheetFooter = cssInterop(RNBottomSheetFooter, {
  className: {
    target: 'style',
  },
});

const AnimatedPressable = Animated.createAnimatedComponent(
  React.forwardRef((props: PressableProps, ref: React.LegacyRef<View>) => <Pressable ref={ref} {...props} />)
);

interface FabProps extends Omit<AnimatedProps<PressableProps>, 'onPress'> {
  onPress?: PressableProps['onPress'];
  testID?: string;
}

const Fab: React.FC<FabProps> = (props) => {
  const { onPress, testID = 'fab-button', ...rest } = props;

  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(progress.value, [0, 1], [1, 1.1]) }],
  }));

  return (
    <AnimatedPressable
      testID={testID}
      onPress={(e) => {
        progress.value = withSequence(withSpring(1, { duration: 300 }), withSpring(0, { duration: 200 }));
        onPress?.(e);
      }}
      entering={SlideInDown.delay(200).duration(1000)}
      className="absolute bottom-8 right-6"
      {...rest}
      style={animatedStyle}
    >
      <View className="flex h-14 w-14 items-center justify-center rounded-full bg-primary">
        <Ionicons name="add-sharp" className="text-primary-contrast" size={24} />
      </View>
    </AnimatedPressable>
  );
};

type CreateTagFormData = z.infer<typeof createTagFormSchema>;

const CreateTagBottomSheet = React.forwardRef<RNBottomSheet>((props, ref) => {
  const { bottom } = useAppSafeArea();

  const form = useForm<CreateTagFormData>({
    resolver: zodResolver(createTagFormSchema),
  });

  const { mutate, isPending } = useCreateTag({
    onSuccess: () => {
      form.reset();
    },
  });

  const onSubmit = form.handleSubmit((data: CreateTagFormData) => {
    mutate(data);
  });

  const renderBackdrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => <BottomSheetBackdrop {...backdropProps} />,
    []
  );

  const renderFooter = useCallback(
    (footerProps: BottomSheetFooterProps) => (
      <BottomSheetFooter {...footerProps} bottomInset={bottom + 16} className="px-4">
        <Button
          loading={isPending}
          disabled={!form.formState.isValid}
          onPress={onSubmit}
          title="Criar"
          testID="create-tag-button"
        />
      </BottomSheetFooter>
    ),
    [bottom, isPending, onSubmit, form.formState.isValid]
  );

  return (
    <Portal>
      {/* @ts-expect-error BottomSheet types incompatible with cssInterop */}
      <BottomSheet
        ref={ref}
        index={-1}
        footerComponent={renderFooter}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        snapPoints={['50%']}
      >
        <BottomSheetView className="px-4">
          <ControlledTextInput
            control={form.control}
            autoFocus
            name="title"
            label="Título"
            placeholder="Digite o título da tag"
            testID="tag-title-input"
          />
        </BottomSheetView>
      </BottomSheet>
    </Portal>
  );
});

const RenderItem: React.FC<{ item: Tag }> = ({ item }) => {
  const router = useRouter();

  const onPress = () => {
    router.push({
      pathname: '/(app)/(tabs)/(quotes)',
      params: { tagUuid: item.uuid, tagTitle: item.title },
    });
  };

  return <TagCard data={item} onPress={onPress} key={item.uuid} />;
};

const renderItem: ListRenderItem<Tag> = ({ item }) => <RenderItem item={item} />;

const renderItemSkeleton: ListRenderItem<Tag> = () => <TagCardSkeleton />;

const ItemSeparatorComponent = () => <View className="bg-[#D6D6D6]" style={{ height: StyleSheet.hairlineWidth }} />;

const ListEmptyComponent = () => (
  <View className="items-center py-4">
    <Text>Nenhuma tag cadastrada</Text>
  </View>
);

export default function ManageTagsScreen() {
  const bottomSheetRef = useRef<RNBottomSheet>(null);

  const { isRefetching, refetch, fetchNextPage, tags, isLoading } = useTags();

  useRefreshOnFocus(refetch);

  const refreshControl = useMemo(
    () => <RefreshControl refreshing={isRefetching} onRefresh={refetch} />,
    [isRefetching, refetch]
  );

  return (
    <View className="flex-1 bg-background">
      <FlashList
        estimatedItemSize={56}
        data={isLoading ? Array(10).fill(null) : tags}
        renderItem={isLoading ? renderItemSkeleton : renderItem}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.5}
        refreshControl={refreshControl}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListEmptyComponent={ListEmptyComponent}
      />

      <CreateTagBottomSheet ref={bottomSheetRef} />

      <Fab testID="tags-fab" onPress={() => bottomSheetRef.current?.expand()} />
    </View>
  );
}
