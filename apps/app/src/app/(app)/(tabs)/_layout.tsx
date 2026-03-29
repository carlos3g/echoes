import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/lib/nativewind/theme.context';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerTitleStyle: {
          color: colors.foreground,
          fontFamily: 'DMSans-SemiBold',
        },
        headerStyle: {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
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
        name="favorites"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'heart' : 'heart-outline'} color={color} size={24} />
          ),
          tabBarButtonTestID: 'favorites-tab-button',
        }}
      />
      <Tabs.Screen
        name="(authors)"
        options={{
          title: 'Autores',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={24} />
          ),
          tabBarButtonTestID: 'authors-tab-button',
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
