import React from 'react';
import { View, Text as RNText, StyleSheet } from 'react-native';
import type { Quote } from '@/types/entities';

interface ShareImageTemplateProps {
  data: Quote;
}

export const ShareImageTemplate = React.forwardRef<View, ShareImageTemplateProps>(({ data }, ref) => {
  return (
    <View ref={ref} style={styles.container} collapsable={false}>
      {/* Decorative quote mark */}
      <RNText style={styles.quoteMark}>{'\u201C'}</RNText>

      {/* Quote body */}
      <RNText style={styles.quoteBody}>{data.body}</RNText>

      {/* Terracotta separator */}
      <View style={styles.separator} />

      {/* Author name */}
      <RNText style={styles.authorName}>
        {data.author?.name?.toUpperCase() ?? 'AUTOR DESCONHECIDO'}
      </RNText>

      {/* Branding */}
      <RNText style={styles.branding}>ECHOES</RNText>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: 1080,
    height: 1920,
    backgroundColor: '#F8F6F0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 120,
  },
  quoteMark: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 120,
    lineHeight: 120,
    color: '#B5845A',
    opacity: 0.5,
    marginBottom: 20,
  },
  quoteBody: {
    fontFamily: 'PlayfairDisplay-Italic',
    fontSize: 56,
    lineHeight: 84,
    color: '#2D2D28',
    textAlign: 'center',
  },
  separator: {
    width: 100,
    height: 4,
    backgroundColor: '#B5845A',
    marginTop: 48,
    marginBottom: 32,
    borderRadius: 2,
  },
  authorName: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 28,
    color: '#7A8B6F',
    letterSpacing: 6,
    textAlign: 'center',
  },
  branding: {
    fontFamily: 'DMSans-Medium',
    fontSize: 20,
    color: '#9B8E7E',
    letterSpacing: 4,
    position: 'absolute',
    bottom: 80,
  },
});
