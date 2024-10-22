// components/NavigationBar.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Define the navigation items directly in the component
const navItems = [
  { label: '🏠 Home', screen: 'Home' }, // Using Unicode for Home icon
  { label: '📰 Feed', screen: 'Feed' }, // Using Unicode for Feed icon
  { label: '📅 Events', screen: 'Events' }, // Using Unicode for Events icon
  { label: '👥 Groups', screen: 'Groups' }, // Using Unicode for Groups icon
  { label: '🔔 Notifications', screen: 'Notifications' }, // Using Unicode for Notifications icon
];

const NavigationBar = () => {
  const navigation = useNavigation(); // Get the navigation object
  const [isMenuOpen, setMenuOpen] = useState(false); // State to control menu visibility

  // Function to navigate to the selected screen
  const navigateTo = (screen: string) => {
    navigation.navigate(screen as never); // Use 'as never' to bypass type checking
    setMenuOpen(false); // Close menu after navigation
  };

  return (
    <View style={styles.navBar}>
      <TouchableOpacity style={styles.menuButton} onPress={() => setMenuOpen(!isMenuOpen)}>
        <Text style={styles.menuText}>Menu</Text>
      </TouchableOpacity>

      {isMenuOpen && (
        <View style={styles.dropdown}>
          {navItems.map((item) => (
            <TouchableOpacity 
              key={item.screen} 
              onPress={() => navigateTo(item.screen)} 
              style={styles.navItemContainer}
            >
              <Text style={styles.navItem}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    marginTop: 20,
    maxWidth: 700,
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 5,
    marginLeft: 10,
    borderColor: '#e0e0e0', // Subtle border for separation
    zIndex: 1000,
  },
  menuButton: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#6c757d', // Neutral color for buttons
  },
  menuText: {
    color: '#ffffff', // White text for contrast
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  dropdown: {
    width: '100%', // Ensure dropdown spans the full width
    backgroundColor: '#ffffff', // Background color for dropdown
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    marginTop: 5,
  },
  navItemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  navItem: {
    fontSize: 18,
    color: '#1976d2', // Primary color for text
    fontWeight: '500',
    textAlign: 'left', // Left align for readability
  },
});

export default NavigationBar;