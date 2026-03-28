import React from 'react';
import { View, Text, TouchableOpacity, Appearance } from 'react-native';
import * as Sentry from '@sentry/react-native';

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, { extra: { componentStack: errorInfo.componentStack } });
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      const isDark = Appearance.getColorScheme() === 'dark';
      const bg = isDark ? '#000' : '#fff';
      const text = isDark ? '#fff' : '#000';
      const muted = isDark ? '#999' : '#666';
      const buttonBg = isDark ? '#fff' : '#000';
      const buttonText = isDark ? '#000' : '#fff';

      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: bg }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: text }}>Algo deu errado</Text>
          <Text style={{ fontSize: 14, color: muted, marginBottom: 24, textAlign: 'center' }}>
            Ocorreu um erro inesperado. Tente novamente.
          </Text>
          <TouchableOpacity
            onPress={this.handleReset}
            style={{ backgroundColor: buttonBg, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
          >
            <Text style={{ color: buttonText, fontWeight: '600' }}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
