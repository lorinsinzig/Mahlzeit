import React from 'react';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'; // Import Material Icons
import { Tabs } from 'expo-router';
import { StatusBar } from 'react-native';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

function MaterialCommunityIcon(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color: string;
}) {
  return <MaterialCommunityIcons size={36} style={{ marginBottom: -3 }} {...props} />;
}

function MaterialIcon(props: {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
}) {
  return <MaterialIcons size={36} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  // Calculate the header height as 20 pixels higher than the status bar height
  const headerHeight = StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 60;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'orange',
        tabBarStyle: {
          height: 80,
          backgroundColor: 'white',
          marginRight: 10,
          marginLeft: 10,
          borderRadius: 15,
        },
        headerShown: useClientOnlyValue(false, true),
        headerStyle: {
          height: headerHeight,
        },
        headerTitleStyle: { 
          display: 'none'
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialCommunityIcon name="home-variant" color={color} />, // Use Material Icons name
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Erstellen',
          tabBarIcon: ({ color }) => <MaterialIcon name="add" color={color} />, // Use Material Icons name
        }}
      />
    </Tabs>
  );
}
