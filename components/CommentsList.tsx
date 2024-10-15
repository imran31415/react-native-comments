// CommentsList.tsx
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  ActivityIndicator,
  Button,
  StyleSheet,
  View,
  Text,
  Alert,
} from 'react-native';
import { fetchComments } from './api';


import { GetPaginatedCommentsRequest, Comment as CommentType, SortOrder, CommentSortColumn, CommentFilterField} from '../proto/comments/comments';

import Comment from './Comment';
import AddCommentForm from './AddCommentForm'; // Ensure correct import
import { Card } from 'react-native-paper';

interface CommentsListProps {
  resourceId: string;
}

type CommentWithChildren = CommentType & {
  children?: CommentWithChildren[]; // Optional nested comments
};


const CommentsList: React.FC<CommentsListProps> = ({ resourceId }) => {
  const [comments, setComments] = useState<CommentWithChildren[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const [paginationKey, setPaginationKey] = useState<string | null>(null);
  const [parentId, setParentId] = useState<string | null>(null); // State for tracking parent comment
  const [parentComment, setParentComment] = useState<CommentType | null>(null); // State for parent comment details
  const [showAddCommentForm, setShowAddCommentForm] = useState<boolean>(false); // Control form visibility
  const [currentParentId, setCurrentParentId] = useState<string | null>(null); // Track current parent ID for the form
  const limit = 5;

  useEffect(() => {
    // Reset comments and pagination when parentId changes
    setComments([]);
    setPaginationKey(null);
    setAllLoaded(false);
    loadComments();
  }, [parentId]); // Trigger loadComments whenever parentId changes

  // Function to load comments, optionally loading more (pagination)
  // Function to load comments, optionally loading more (pagination)
  const loadComments = async (loadMore = false) => {
    if (loadingMore || (loadMore && allLoaded)) return; // Avoid redundant calls
  
    loadMore ? setLoadingMore(true) : setLoading(true);
  
    try {
      const formattedPaginationKey = paginationKey || undefined;
  
      const params: GetPaginatedCommentsRequest = {
        resourceId,
        limit,
        order: SortOrder.DESC,
        column: CommentSortColumn.COMMENT_CREATED_AT,
        ...(formattedPaginationKey ? { string_key: formattedPaginationKey } : {}),
        filters: parentId
          ? { filters: [{ field: CommentFilterField.FILTER_PARENT_ID, value: parentId }] }
          : { filters: [] }, // Remove the unnecessary FILTER_NULL_PARENT_ID
      };
  
      console.log('Fetching comments with params:', params);
  
      const response: CommentWithChildren[] = await fetchComments(params);
  
      if (response.length > 0) {
        setComments((prev) => [...prev, ...response]);
  
        const lastComment = response[response.length - 1];
        setPaginationKey(lastComment.createdAt);
  
        if (response.length < limit) setAllLoaded(true);
      } else {
        setAllLoaded(true);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      Alert.alert('Error', 'Failed to fetch comments.');
    } finally {
      loadMore ? setLoadingMore(false) : setLoading(false);
    }
  };
  // Callback to handle "More Replies" action from Comment component
  const handleMoreReplies = (selectedComment: CommentType) => {
    setParentComment(selectedComment); // Set the clicked comment as the parent comment
    setParentId(selectedComment.id); // Set the parentId to load its replies
    setCurrentParentId(selectedComment.id); // Set the currentParentId for the form
    setPaginationKey(null); // reset pagination ket so all comments are shown
    setShowAddCommentForm(true); // Show the AddCommentForm
  };

  // Handler for adding a new comment
 // Handler for adding a new comment
// Handler for adding a new comment
const handleCommentAdded = (newComment: CommentType) => {
  if (newComment.parentId) {
    // If the new comment is a reply to an existing comment
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === newComment.parentId
          ? {
              ...comment,
              children: [...(comment.children || []), newComment], // Add to child comments
            }
          : comment
      )
    );
  } else {
    // If it's a top-level comment, add it to the top of the list
    setComments((prevComments) => [newComment, ...prevComments]);
  }

  // Hide the AddCommentForm
  setShowAddCommentForm(false);
  setCurrentParentId(null); // Reset parent ID tracking
  setPaginationKey(null);

  // Ensure the new comment is properly displayed by resetting parent ID if needed
  if (parentId) {
    setParentId(null); // Reset parent ID to return to main list if necessary
  }
};

  // Handler to go back to the main comments list
  const handleBack = () => {
    setParentId(null);
    setParentComment(null);
    setShowAddCommentForm(false); // Hide the form when navigating back
    setCurrentParentId(null); // Reset the parent ID
  };

  // Handler to show the AddCommentForm for top-level comments
  const handleShowAddCommentForm = () => {
    setParentId(null); // Ensure parentId is null for top-level comment
    setCurrentParentId(null); // Reset currentParentId
    setShowAddCommentForm(true); // Show the form
    setParentComment(null); // Clear any existing parent comment
  };

  // Handler to hide the AddCommentForm without submitting
  const hideAddCommentForm = () => {
    setShowAddCommentForm(false);
    setCurrentParentId(null);
  };

  // Show loading indicator only when initially loading and no comments are present
  if (loading && comments.length === 0) {
    return <ActivityIndicator size="large" style={styles.loadingIndicator} />;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Top-Level Add Comment Button */}
      {!showAddCommentForm && (
        <View style={styles.topAddCommentButton}>
          <Button title="Add Comment" onPress={handleShowAddCommentForm} />
        </View>
      )}

      {/* Conditionally Render AddCommentForm */}
      {showAddCommentForm && (
        <AddCommentForm
          resourceId={resourceId}
          onCommentAdded={handleCommentAdded}
          parentId={currentParentId} // Pass the current parentId (null for top-level)
          hideAddCommentForm={hideAddCommentForm} // Pass the hide function
        />
      )}

      {/* Display "Back" button when viewing child comments */}
      {parentId && (
        <View style={styles.backButtonContainer}>
          <Button title="← Back to all comments" onPress={handleBack} />
        </View>
      )}

      {/* Display Parent Comment Information when viewing child comments */}
      {parentComment && (
        <View style={styles.parentCommentContainer}>
          <Card style={styles.parentCard}>
            <Card.Content>
              <Text style={styles.parentAuthorText}>{`#${parentComment.id} ${parentComment.author}`}</Text>
              <Text style={styles.parentContentText}>{parentComment.content}</Text>
              <Text style={styles.parentDateText}>
                {new Date(parentComment.createdAt.replace(' ', 'T')).toLocaleString()}
              </Text>
            </Card.Content>
          </Card>
        </View>
      )}

      {/* Optional: Display a heading when viewing child comments */}
      {parentId && <Text style={styles.headingText}>Replies</Text>}

      {/* Render Comments */}
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          onCommentAdded={handleCommentAdded}
          level={0} // Start at level 0 for top-level comments
          onMoreReplies={handleMoreReplies} // Pass the callback to handle "More Replies"
        />
      ))}

      {/* Load More Button */}
      {!allLoaded && (
        <View style={styles.loadMoreContainer}>
          <Button
            title="Load more"
            onPress={() => loadComments(true)}
            disabled={loadingMore}
          />
        </View>
      )}

      {/* Show loading indicator when loading more comments */}
      {loadingMore && <ActivityIndicator style={styles.loadingMoreIndicator} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  topAddCommentButton: {
    marginBottom: 10,
    maxWidth: 200,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingMoreIndicator: {
    marginTop: 10,
  },
  backButtonContainer: {
    marginBottom: 10,
  },
  headingText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loadMoreContainer: {
    marginTop: 10,
    maxWidth:200,
  },
  parentCommentContainer: {
    marginBottom: 10,
  },
  parentCard: {
    backgroundColor: '#e0f7fa', // Different background to distinguish
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    elevation: 2,
  },
  parentAuthorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00796b',
  },
  parentContentText: {
    marginBottom: 5,
    fontSize: 14,
  },
  parentDateText: {
    color: 'gray',
    fontSize: 12,
  },
});

export default CommentsList;