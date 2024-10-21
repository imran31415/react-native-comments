// NoItemsFound.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface NoItemsFoundProps {
  onReturnToRoot: () => void;
}

const NoItemsFound: React.FC<NoItemsFoundProps> = ({ onReturnToRoot }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No Items Found</Text>
      <TouchableOpacity style={styles.button} onPress={onReturnToRoot}>
        <MaterialIcons name="arrow-back" size={20} color="#fff" />
        <Text style={styles.buttonText}>Return to First Page</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f8f9fa', // Light background color for contrast
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
    maxWidth: 600,
  },
  text: {
    fontSize: 18,
    color: '#333', // Darker text for better readability
    marginBottom: 10,
    textAlign: 'center', // Center align text
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#007BFF', // Bootstrap Primary Color
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default NoItemsFound;