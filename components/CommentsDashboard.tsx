// CommentsDashboard.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Ensure you have @expo/vector-icons installed

interface CommentsDashboardProps {
  onAddComment: () => void;
  onRefresh: () => void;
  paginationKey: string | null;
  sortOrder: 'ASC' | 'DESC';
  currentPageCount: number;
  hasItems: boolean; // New prop to determine if items are present
}

const CommentsDashboard: React.FC<CommentsDashboardProps> = ({
  onAddComment,
  onRefresh,
  paginationKey,
  sortOrder,
  currentPageCount,
  hasItems,
}) => {
  // Determine the direction based on sortOrder
  const direction = sortOrder === 'ASC' ? 'After' : 'Before';

  return (
    <View style={styles.container}>
      {/* Buttons Container */}
      <View style={styles.buttonsContainer}>
        {/* Add Comment Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={onAddComment}
          accessibilityLabel="Add a new comment"
        >
          <MaterialIcons name="add-comment" size={20} color="#fff" />
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>

        {/* Refresh Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={onRefresh}
          accessibilityLabel="Next"
        >
          <MaterialIcons name="arrow-forward" size={20} color="#fff" />
          <Text style={styles.buttonText}>Next Page</Text>
        </TouchableOpacity>
        
      </View>

      {/* Pagination Information */}
      <View style={styles.infoContainer}>
        {paginationKey ? (
          <Text style={styles.infoText}>
            Pagination Key: {paginationKey} ({direction})
          </Text>
        ) : (
          <Text style={styles.infoText}>Pagination Key: None</Text>
        )}
        <Text style={styles.infoText}>Items on this page: {currentPageCount}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#007BFF', // Bootstrap Primary Color for consistency
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  infoContainer: {
    marginTop: 5,
    paddingHorizontal: 5,
  },
  infoText: {
    fontSize: 12,
    color: '#555',
  },
  returnButton: {
    flexDirection: 'row',
    backgroundColor: '#28a745', // Bootstrap Success Color
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  returnButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CommentsDashboard;