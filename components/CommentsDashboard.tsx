import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface CommentsDashboardProps {
  onAddComment: () => void;
  onRefresh: () => void;
  onBack: () => void;
  paginationKey: string | null;
  sortOrder: 'ASC' | 'DESC';
  currentPageCount: number;
  parentId: string | null;  // New prop to track if viewing replies
  hasItems: boolean; // New prop to determine if items are present
}

const CommentsDashboard: React.FC<CommentsDashboardProps> = ({
  onAddComment,
  onRefresh,
  onBack,
  parentId,
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
          <MaterialIcons name="add-comment" size={20} color="#ffffff" />
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>

        {/* Refresh Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={onRefresh}
          accessibilityLabel="Refresh Comments"
        >
          <MaterialIcons name="refresh" size={20} color="#ffffff" />
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>

        {parentId && (
          <TouchableOpacity
            style={styles.button}
            onPress={onBack}
            accessibilityLabel="Back to all comments"
          >
            <MaterialIcons name="arrow-back" size={20} color="#ffffff" />
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        )}
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
    maxWidth: 600,
    padding: 10,
    backgroundColor: '#f9f9f9', // Light background for the dashboard
    borderRadius: 8,
    elevation: 2, // Shadow effect
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#007BFF', // Primary color
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 30, // More rounded edges for a modern look
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2, // For Android shadow
  },
  buttonText: {
    color: '#ffffff',
    marginLeft: 8,
    fontSize: 16, // Slightly larger text for better readability
    fontWeight: '600', // Bold text for emphasis
  },
  // Optional: Add a hover effect for web
  buttonHover: {
    backgroundColor: '#0056b3', // Darker shade for hover effect
  },
  infoContainer: {
    marginTop: 10,
    paddingHorizontal: 5,
  },
  infoText: {
    fontSize: 12,
    color: '#555',
  },
});

export default CommentsDashboard;