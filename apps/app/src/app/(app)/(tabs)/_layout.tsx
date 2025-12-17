import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { colors } from '@/shared/theme/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.lightTheme.primary,
        tabBarInactiveTintColor: colors.lightTheme.gray4,
        headerTitleStyle: {
          color: colors.lightTheme.backgroundContrast,
        },
        headerStyle: {
          borderBottomColor: '#C2C2C2',
          borderBottomWidth: StyleSheet.hairlineWidth,
        },
        headerShadowVisible: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="(quotes)"
        options={{
          title: 'Echoes',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={24} />
          ),
          tabBarButtonTestID: 'feed-tab-button',
        }}
      />
      <Tabs.Screen
        name="tags"
        options={{
          title: 'Gerenciar tags',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'pricetags' : 'pricetags-outline'} color={color} size={24} />
          ),
          tabBarButtonTestID: 'manage-tags-tab-button',
        }}
      />
      <Tabs.Screen
        name="(settings)"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={24} />
          ),
          tabBarButtonTestID: 'settings-tab-button',
        }}
      />
    </Tabs>
  );
}
