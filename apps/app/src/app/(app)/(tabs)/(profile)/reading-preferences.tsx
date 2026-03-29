import React from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import { Text as RNText } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';
import { haptics } from '@/shared/utils/haptics';
import {
  useReadingPreferencesStore,
  quoteFontConfig,
  lineHeightLabels,
  SIZE_OPTIONS,
  type QuoteFont,
  type LineHeightOption,
} from '@/lib/zustand/stores/reading-preferences.store';
import { useReadingStyle } from '@/shared/hooks/use-reading-style';
import { DecorativeQuoteMark } from '@/shared/components/ui/decorative-quote-mark';

const SAMPLE_QUOTE = 'The only way to do great work is to love what you do.';
const SAMPLE_AUTHOR = 'STEVE JOBS';

const fonts: QuoteFont[] = ['playfair', 'lora', 'merriweather', 'crimson'];
const LINE_HEIGHT_OPTIONS: LineHeightOption[] = ['auto', 'compact', 'normal', 'relaxed'];

const FontCard: React.FC<{
  fontKey: QuoteFont;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ fontKey, isSelected, onSelect }) => {
  const config = quoteFontConfig[fontKey];
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle} className="flex-1">
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.95, { duration: 100 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { duration: 200 });
        }}
        onPress={onSelect}
        className={`items-center rounded-xl border p-3 ${
          isSelected ? 'bg-primary/10 border-primary' : 'border-border bg-card'
        }`}
      >
        <RNText
          style={{
            fontFamily: config.italicFamily,
            fontSize: 18,
            color: isSelected ? colors.primary : colors.foreground,
          }}
          numberOfLines={1}
        >
          Aa
        </RNText>
        <Text
          variant="paragraphCaptionSmall"
          className={`mt-1 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}
        >
          {config.label.split(' ')[0]}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export default function ReadingPreferencesScreen() {
  const { colors } = useTheme();
  const { quoteStyle } = useReadingStyle();
  const font = useReadingPreferencesStore((s) => s.font);
  const fontSize = useReadingPreferencesStore((s) => s.fontSize);
  const lineHeight = useReadingPreferencesStore((s) => s.lineHeight);
  const setFont = useReadingPreferencesStore((s) => s.setFont);
  const setFontSize = useReadingPreferencesStore((s) => s.setFontSize);
  const setLineHeight = useReadingPreferencesStore((s) => s.setLineHeight);

  const config = quoteFontConfig[font];

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="pb-8">
      <View className="mx-4 mt-4 items-center rounded-2xl border border-border bg-card p-6">
        <DecorativeQuoteMark size={40} />
        <RNText style={[quoteStyle, { color: colors.foreground, textAlign: 'center', marginTop: 8 }]}>
          {SAMPLE_QUOTE}
        </RNText>
        <View style={{ width: 40, height: 1.5, backgroundColor: colors.primary, marginVertical: 16 }} />
        <RNText
          style={{
            fontFamily: 'DMSans-SemiBold',
            fontSize: 10,
            color: colors.secondary,
            letterSpacing: 2,
          }}
        >
          {SAMPLE_AUTHOR}
        </RNText>
      </View>

      <View className="mt-6 px-4">
        <Text variant="paragraphSmall" semiBold className="mb-3 text-foreground">
          Fonte
        </Text>
        <View className="flex-row gap-2">
          {fonts.map((f) => (
            <FontCard
              key={f}
              fontKey={f}
              isSelected={font === f}
              onSelect={() => {
                haptics.light();
                setFont(f);
              }}
            />
          ))}
        </View>
      </View>

      <View className="mt-6 px-4">
        <Text variant="paragraphSmall" semiBold className="mb-3 text-foreground">
          Tamanho
        </Text>
        <View className="flex-row gap-2">
          {SIZE_OPTIONS.map((size) => (
            <Pressable
              key={size}
              onPress={() => {
                haptics.light();
                setFontSize(size);
              }}
              className={`flex-1 items-center rounded-xl border py-3 ${
                Math.round(fontSize) === size ? 'bg-primary/10 border-primary' : 'border-border bg-card'
              }`}
            >
              <RNText
                style={{
                  fontFamily: config.italicFamily,
                  fontSize: size * 0.7,
                  color: Math.round(fontSize) === size ? colors.primary : colors.mutedForeground,
                }}
              >
                Aa
              </RNText>
              <Text
                variant="paragraphCaptionSmall"
                className={`mt-1 ${Math.round(fontSize) === size ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {size}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View className="mt-6 px-4">
        <Text variant="paragraphSmall" semiBold className="mb-3 text-foreground">
          Espacamento entre linhas
        </Text>
        <View className="flex-row gap-2">
          {LINE_HEIGHT_OPTIONS.map((option) => (
            <Pressable
              key={option}
              onPress={() => {
                haptics.light();
                setLineHeight(option);
              }}
              className={`flex-1 items-center rounded-xl border py-3 ${
                lineHeight === option ? 'bg-primary/10 border-primary' : 'border-border bg-card'
              }`}
            >
              <Text
                variant="paragraphCaptionSmall"
                className={lineHeight === option ? 'text-primary' : 'text-muted-foreground'}
                semiBold={lineHeight === option}
              >
                {lineHeightLabels[option]}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
