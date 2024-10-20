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
        <Text style={styles.buttonText}>Return to First page</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#28a745',
    paddingVertical: 8,
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