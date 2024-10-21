import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface CommentsDashboardProps {
  onAddComment: () => void;
  onRefresh: () => void;
  onBack: () => void;
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
  parentId,
  paginationKey,
  sortOrder,
  currentPageCount,
  hasItems,
}) => {
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
          <Text style={styles.buttonText}>Add Comment</Text>
        </TouchableOpacity>

        {/* Refresh Button */}
        {/* <TouchableOpacity
          style={styles.button}
          onPress={onRefresh}
          accessibilityLabel="Refresh Comments"
        >
          <MaterialIcons name="refresh" size={20} color="#ffffff" />
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity> */}

        {parentId && (
          <TouchableOpacity
            style={styles.button}
            onPress={onBack}
            accessibilityLabel="Back to all comments"
          >
            <MaterialIcons name="arrow-back" size={20} color="#ffffff" />
            <Text style={styles.buttonText}>Back to main thread</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Pagination Information */}
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
    backgroundColor: '#ffffff', // Use white for a clean look
    borderRadius: 10, // Slightly rounded corners
    elevation: 3, // Shadow effect for depth
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.1, // Shadow opacity for iOS
    shadowRadius: 4, // Shadow radius for iOS
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
    borderRadius: 20, // More rounded edges for a modern look
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 1, // Shadow for Android
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