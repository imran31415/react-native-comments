// CommentsList.tsx
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  Alert,
  Button,
  Image
} from 'react-native';
import { fetchComments } from './api';

import {
  GetPaginatedCommentsRequest,
  Comment as CommentType,
  SortOrder,
  CommentSortColumn,
  CommentFilterField,
} from '../proto/comments/comments';

import Comment from './Comment';
import AddCommentForm from './AddCommentForm';
import { Card } from 'react-native-paper';
import CommentsDashboard from './CommentsDashboard'; // Import the updated component
import NoItemsFound from './NoItemsFound';
import ResourceInfo from './ResourceInfo'; // Adjust the path based on your project structure

import { Animated } from 'react-native'; // Ensure Animated is imported

interface CommentsListProps {
  resourceId: string;
}

type CommentWithChildren = CommentType & {
  children?: CommentWithChildren[];
};

// Recursive helper to add a new comment to the correct parent
const addCommentToComments = (
  comments: CommentWithChildren[],
  newComment: CommentType
): CommentWithChildren[] => {
  return comments.map((comment) => {
    if (comment.id === newComment.parentId) {
      return {
        ...comment,
        children: [...(comment.children || []), newComment],
      };
    }
    if (comment.children) {
      return {
        ...comment,
        children: addCommentToComments(comment.children, newComment),
      };
    }
    return comment;
  });
};



// Helper function to map SortOrder enum to string
const getSortOrderString = (order: SortOrder): 'ASC' | 'DESC' => {
  switch (order) {
    case SortOrder.ASC:
      return 'ASC';
    case SortOrder.DESC:
      return 'DESC';
    default:
      return 'DESC'; // Default to 'DESC' if undefined
  }
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
  const [currentPageCount, setCurrentPageCount] = useState<number>(0); // New state for page count
  const sortOrder = SortOrder.DESC; // Define current sort order
  const limit = 5;
  const fadeAnim = useState(new Animated.Value(0))[0]; // Initialize the animated value

  // Determine if there are any items to display
  const hasItems = comments.length > 0;

  const handleScroll = (event: any) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20; // 20 pixels from the bottom
    if (isCloseToBottom && !loadingMore && !allLoaded) {
      loadComments(true); // Load more comments when close to bottom
    }
  };

  useEffect(() => {
    // Reset comments and pagination when parentId changes
    setComments([]);
    setPaginationKey(null);
    setAllLoaded(false);
    loadComments();
  }, [parentId]); // Trigger loadComments whenever parentId changes

  // Function to load comments, optionally loading more (pagination)
  const loadComments = async (loadMore = false) => {
    if (loadingMore || (loadMore && allLoaded)) return; // Avoid redundant calls

    loadMore ? setLoadingMore(true) : setLoading(true);

    try {
      const formattedPaginationKey = paginationKey || undefined;

      const params: GetPaginatedCommentsRequest = {
        resourceId,
        limit,
        order: sortOrder,
        column: CommentSortColumn.COMMENT_CREATED_AT,
        ...(formattedPaginationKey ? { string_key: formattedPaginationKey } : {}),
        filters: parentId
          ? {
            filters: [
              {
                field: CommentFilterField.FILTER_PARENT_ID,
                value: parentId,
              },
            ],
          }
          : {
            filters: [
              {
                field: CommentFilterField.FILTER_NULL_PARENT_ID,
                value: '',
              },
            ],
          },
      };

      console.log('Fetching comments with params:', params);

      const response: CommentWithChildren[] = await fetchComments(params);

      console.log(`Fetched ${response.length} comments:`, response);

      // Update the current page count
      setCurrentPageCount(response.length);

      if (response.length > 0) {
        setComments((prev) => [...prev, ...response]);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();

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
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  // Callback to handle "More Replies" action from Comment component
  const handleMoreReplies = (selectedComment: CommentType) => {
    setParentComment(selectedComment); // Set the clicked comment as the parent comment
    setParentId(selectedComment.id); // Set the parentId to load its replies
    setCurrentParentId(selectedComment.id); // Set the currentParentId for the form
    setPaginationKey(null); // Reset pagination key to fetch from the beginning
    setShowAddCommentForm(false); // Hide the AddCommentForm
  };

  // Handler for adding a new comment
  const handleCommentAdded = (newComment: CommentType) => {
    console.log('Adding new comment:', newComment);
    if (newComment.parentId) {
      // If the new comment is a reply to an existing comment
      setComments((prevComments) =>
        addCommentToComments(prevComments, newComment)
      );
    } else {
      // If it's a top-level comment, add it to the top of the list
      setComments((prevComments) => [newComment, ...prevComments]);
    }

    // Hide the AddCommentForm
    setCurrentParentId(null); // Reset parent ID tracking
    setShowAddCommentForm(false);
  };

  // Handler to go back to the main comments list
  const handleBack = async () => {
    setParentId(null);
    setParentComment(null);
    setShowAddCommentForm(false);
    setComments([]);           // Reset comments
    // setPaginationKey(null);    // Reset paginationKey
    setAllLoaded(false);       // Reset allLoaded flag
    setCurrentParentId(null);

    try {
      await loadComments();
    } catch (error) {
      console.error('Error refreshing comments:', error);
      Alert.alert('Error', 'Failed to refresh comments.');
    }
  };

  const handleBackToFirstPage = () => {
    setComments([]);           // Reset comments
    setPaginationKey(null);    // Reset paginationKey
    setAllLoaded(false);       // Reset allLoaded flag
    loadComments();            // Explicitly call loadComments to fetch comments
  };

  // Handler to show the AddCommentForm for top-level comments
  const handleShowAddCommentForm = () => {
    setShowAddCommentForm(true); // Show the form
  };

  // Handler to hide the AddCommentForm without submitting
  const hideAddCommentForm = () => {
    setShowAddCommentForm(false);
  };

  // Handler to refresh comments
  const refreshComments = async () => { // Changed to async
    console.log('Refreshing comments...');
    setComments([]);
    setPaginationKey(null);
    setAllLoaded(false);
    try {
      await loadComments();
    } catch (error) {
      console.error('Error refreshing comments:', error);
      Alert.alert('Error', 'Failed to refresh comments.');
    }
  };

  // Show loading indicator only when initially loading and no comments are present
  if (loading && comments.length === 0) {
    return <ActivityIndicator size="large" style={styles.loadingIndicator} />;
  }

  return (

    <ScrollView
      style={styles.container}
      onScroll={handleScroll} // Add this line
      contentContainerStyle={{ paddingBottom: 20 }}
    >
          <Animated.View style={{ opacity: fadeAnim }}>
<ResourceInfo parentCommentId={parentId} />
       <CommentsDashboard
        onAddComment={handleShowAddCommentForm}
        onBack={handleBack}
        onRefresh={refreshComments}
        paginationKey={paginationKey}
        sortOrder={getSortOrderString(sortOrder)}
        currentPageCount={currentPageCount}
        hasItems={hasItems} // New prop to indicate if items are present
        parentId={parentId}
      />

      {/* Display Parent Comment Information when viewing child comments */}
      {parentComment && (
        <View style={styles.parentCommentContainer}>
          
          
          <Card style={styles.parentCard}>
            
            <Card.Content>
            <Text style={styles.replyLabelHeader}>Viewing Comments for:</Text>

            <View style={styles.parentHeader}>
            <Image 
                source={{ uri: 'https://cdn.pixabay.com/photo/2021/02/27/16/25/woman-6055084_1280.jpg' }} // Default placeholder image
                style={styles.parentAvatar}
              />
                <Text style={styles.parentAuthorText}>{`#${parentComment.id} ${parentComment.author}`}</Text>
                </View>
              
              <Text style={styles.parentContentText}>{parentComment.content}</Text>
              <Text style={styles.parentDateText}>
                {new Date(parentComment.createdAt.replace(' ', 'T')).toLocaleString()}
              </Text>
            </Card.Content>
          </Card>
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




      {/* Optional: Display a heading when viewing child comments */}
      {parentId && <Text style={styles.headingText}>Replies</Text>}
      {!hasItems && (
        <NoItemsFound onReturnToRoot={handleBackToFirstPage} 
        onReturnToMainRoot={handleBack}/>
      )}

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
      </Animated.View>
    </ScrollView>
      
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    maxWidth:600,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingMoreIndicator: {
    marginTop: 10,
  },
  headingText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loadMoreContainer: {
    marginTop: 10,
    maxWidth: 200,
  },
  parentCommentContainer: {
    marginBottom: 10,
  },
  parentCard: {
    backgroundColor: '#e0f7fa', // Subtle color
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
    maxWidth: 600,
  },
  parentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5, // Add margin for spacing
  },
  replyLabelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Add margin for spacing
  },
  parentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20, // Make it circular
    marginRight: 10,
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