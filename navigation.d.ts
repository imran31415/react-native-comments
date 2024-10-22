// src/navigation.d.ts
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Feed: undefined; // No parameters expected for Feed
  Events: undefined;
  Groups: undefined;
  Notifications: undefined;
  Comments: { resourceId: string }; // Example for passing resourceId to Comments
};

// Define the type for navigation prop
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;