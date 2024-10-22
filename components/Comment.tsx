import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { Card, IconButton, Divider } from 'react-native-paper';
import { fetchComments } from './api';
import { 
  Comment as CommentType, 
  SortOrder, 
  CommentSortColumn, 
  CommentFilterField, 
  GetPaginatedCommentsRequest 
} from '../proto/comments/comments';
import { MaterialIcons } from '@expo/vector-icons';

// Extend the Comment type to include children
type CommentWithChildren = CommentType & {
  children?: CommentWithChildren[];
  animatedValue?: Animated.Value; // Add animatedValue property
};

interface CommentProps {
  comment: CommentWithChildren;
  onCommentAdded: (comment: CommentType) => void;
  level?: number;
  onMoreReplies?: (selectedComment: CommentType) => void;
}



const Comment: React.FC<CommentProps> = ({
  comment,
  onCommentAdded,
  level = 0,
  onMoreReplies,
}) => {
  const [children, setChildren] = useState<CommentWithChildren[]>(comment.children ?? []);
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [allChildrenLoaded, setAllChildrenLoaded] = useState(false);
  const [paginationKey, setPaginationKey] = useState<string | null>(null);

  // Function to load more child comments
  const loadChildren = async (loadMore = false) => {
    if (loadingChildren || (loadMore && allChildrenLoaded)) return;

    setLoadingChildren(true);

    try {
      const formattedPaginationKey = paginationKey || undefined;

      const params: GetPaginatedCommentsRequest = {
        resourceId: comment.resourceId,
        limit: 10,
        order: SortOrder.DESC,
        column: CommentSortColumn.COMMENT_CREATED_AT,
        ...(formattedPaginationKey ? { string_key: formattedPaginationKey } : {}),
        filters: {
          filters: [{ field: CommentFilterField.FILTER_PARENT_ID, value: comment.id }],
        },
      };

      const fetchedChildComments = await fetchComments(params);

      if (fetchedChildComments.length > 0) {
        const uniqueChildren = fetchedChildComments.filter(
          (newComment) => !children.some((child) => child.id === newComment.id)
        );

        // Create an animated value for each new child comment
        const newChildrenWithAnimation = uniqueChildren.map(child => ({
          ...child,
          animatedValue: new Animated.Value(0), // Initialize animated value
        }));

        // Set new children with animation
        setChildren((prev) => [...prev, ...newChildrenWithAnimation]);

        // Trigger animations for each new comment
        newChildrenWithAnimation.forEach(child => {
          Animated.timing(child.animatedValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        });

        const lastComment = fetchedChildComments[fetchedChildComments.length - 1];
        setPaginationKey(lastComment.createdAt);

        if (fetchedChildComments.length < 10) {
          setAllChildrenLoaded(true);
        }
      } else {
        setAllChildrenLoaded(true);
      }
    } catch (error) {
      console.error('Error loading child comments:', error);
    } finally {
      setLoadingChildren(false);
    }
  };

  // Automatically load child comments for parent comments and level 1 comments only
  useEffect(() => {
    if (level <= 0 && children.length < 3) {
      loadChildren(); // Load children automatically when component mounts
    }
  }, [level, children.length]);

  // Handler for "More Replies" button
  const handleMoreReplies = (selectedComment: CommentType) => {
    setPaginationKey(null); // Reset pagination key
    setChildren([]); // Clear previous child comments
    setAllChildrenLoaded(false); // Reset "all loaded" flag

    if (onMoreReplies) {
      onMoreReplies(selectedComment); // Pass the selected comment to the parent
    }
  };
  const MAX_LEVEL = 0;
  const INDENT_PER_LEVEL = 10; // Reduced indentation for compactness
  const effectiveLevel = Math.min(level, MAX_LEVEL);
  const indentation = effectiveLevel * INDENT_PER_LEVEL;
  const isBeyondMaxLevel = level >= MAX_LEVEL;

  return (
    <View style={{ marginLeft: indentation, marginTop: 8 }}>
  
      <Card style={styles.card}>
        <Card.Content>
        <Text style={styles.dateText}>{new Date(comment.createdAt).toLocaleString()}</Text>
        {/* <Divider style={styles.divider} /> */}


          {/* Header Section */}
          <View style={styles.header}>
            
            <View style={styles.headerLeft}>
              <Image 
                source={{ uri: 'https://cdn.pixabay.com/photo/2021/02/27/16/25/woman-6055084_1280.jpg' }} // Default placeholder image
                style={styles.avatar}
              />
              <Text style={styles.label}>Author:</Text>
              <Text style={styles.authorText}>{comment.author}</Text>
            </View>



          </View>

          {/* <Divider style={styles.divider} /> */}

          {/* Content Section */}
          <View style={styles.contentSection}>
            <Text style={styles.label}>Comment:</Text>
            <Text style={styles.contentText}>{comment.content}</Text>
          </View>

          {/* Action Section */}
          <View style={styles.actionSection}>
            <IconButton
              icon="reply"
              size={20}
              style={styles.replyButton}
              onPress={() => handleMoreReplies(comment)}
              accessibilityLabel="Reply"
            />
            {!allChildrenLoaded && (
              isBeyondMaxLevel ? (
                <TouchableOpacity
                  onPress={() => handleMoreReplies(comment)}
                  style={styles.moreRepliesButton}
                  accessibilityLabel="More Replies"
                >
                  <Text style={styles.moreRepliesText}>More Replies</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => loadChildren(true)}
                  disabled={loadingChildren}
                  style={styles.loadMoreButton}
                  accessibilityLabel="Load More Replies"
                >
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={24}
                    color={'#6200ee'}
                  />
                </TouchableOpacity>
              )
            )}
          </View>

          {/* Loading Indicator */}
          {loadingChildren && <ActivityIndicator size="small" style={{ marginTop: 10 }} />}

          {/* Render child comments with animation */}
          {children.map((childComment) => (
            <Animated.View 
              key={childComment.id} 
              style={{ opacity: childComment.animatedValue }}
            >
              <Comment
                comment={childComment}
                onCommentAdded={onCommentAdded}
                level={level + 1}
                onMoreReplies={onMoreReplies}
              />
            </Animated.View>
          ))}
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 3, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // iOS shadow
    shadowOpacity: 0.1, // iOS shadow
    shadowRadius: 4, // iOS shadow
    maxWidth: 800,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20, // Circular avatar
    marginRight: 8,
  },
  label: {
    fontWeight: '600',
    marginRight: 4,
    color: '#333333',
  },
  authorText: {
    fontSize: 12,
    color: '#333333',
  },
  dateText: {
    fontSize: 10,
    color: '#666666',
    marginTop:5,
    marginBottom:12,
  },
  divider: {
    backgroundColor: '#e0e0e0',
    marginTop:2,
    marginBottom:2,
  },
  contentSection: {
    marginTop: 8,
  },
  contentText: {
    fontSize: 12,
    color: '#444444',
  },
  actionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  loadMoreButton: {
    padding: 8,
    marginLeft: 8,
  },
  replyButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
  },
  moreRepliesButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginLeft: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  moreRepliesText: {
    color: '#6200ee',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default Comment;