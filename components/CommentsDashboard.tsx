// components/CommentsDashboard.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface CommentsDashboardProps {
  onAddComment: () => void;
  onRefresh: () => void;
  onBack: () => void;
  setPaginationKey: (key: string) => void; // New prop to set pagination key
  paginationKey: string | null;
  sortOrder: 'ASC' | 'DESC';
  currentPageCount: number;
  parentId: string | null; // New prop to track if viewing replies
  hasItems: boolean; // New prop to determine if items are present
}

const CommentsDashboard: React.FC<CommentsDashboardProps> = ({
  onAddComment,
  onRefresh,
  onBack,
  setPaginationKey, // Destructure the new prop
  parentId,
  paginationKey,
  sortOrder,
  currentPageCount,
  hasItems,
}) => {
  const direction = sortOrder === 'ASC' ? 'After' : 'Before';

  // Function to handle refresh and set paginationKey to today's date
  const handleRefresh = () => {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    onRefresh(); // Call the onRefresh prop function
    setPaginationKey(today); // Set the pagination key to today's date
  };

  // Function to handle going back
  const handleBack = () => {
    setPaginationKey(new Date().toISOString().split('T')[0]); // Reset pagination key to today's date
    onBack(); // Call the original onBack function
  };

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
          <Text style={styles.buttonText}>Add Comment</Text>
        </TouchableOpacity>

        {/* Refresh Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleRefresh}
          accessibilityLabel="Refresh Comments"
        >
          <MaterialIcons name="refresh" size={20} color="#ffffff" />
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>

        {parentId && (
          <TouchableOpacity
            style={styles.button}
            onPress={handleBack} // Update to use handleBack
            accessibilityLabel="Back to all comments"
          >
            <MaterialIcons name="arrow-back" size={20} color="#ffffff" />
            <Text style={styles.buttonText}>Back to main</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Optional Pagination Information */}
      {/* <View style={styles.infoContainer}>
        {paginationKey ? (
          <Text style={styles.infoText}>
            Pagination Key: {paginationKey} ({direction})
          </Text>
        ) : (
          <Text style={styles.infoText}>Pagination Key: None</Text>
        )}
        <Text style={styles.infoText}>Items on this page: {currentPageCount}</Text>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    maxWidth: 600,
    padding: 15,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#6c757d', // Neutral color for buttons
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4, // More rounded edges for a modern look
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 1, // Shadow for Android
    maxWidth: 200,
  },
  buttonText: {
    color: '#ffffff',
    marginLeft: 8,
    fontSize: 14, // Increase font size for better readability
    fontWeight: '500', // Medium font weight for emphasis
  },
  infoContainer: {
    marginTop: 10,
    paddingHorizontal: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#333', // Darker text for contrast
  },
});

export default CommentsDashboard;