// NoItemsFound.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface NoItemsFoundProps {
  onReturnToRoot: () => void;
  onReturnToMainRoot: () => void;
}

const NoItemsFound: React.FC<NoItemsFoundProps> = ({ onReturnToRoot, onReturnToMainRoot }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No Items Found</Text>
      <TouchableOpacity style={styles.button} onPress={onReturnToRoot}>
        <MaterialIcons name="arrow-back" size={20} color="#fff" />
        <Text style={styles.buttonText}>Return to First page</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onReturnToMainRoot}>
        <MaterialIcons name="arrow-back" size={20} color="#fff" />
        <Text style={styles.buttonText}>Return to Main page</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
    maxWidth:600,
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#6c757d', // Neutral color for buttons
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
    margin:5,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default NoItemsFound;