import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
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
};

interface CommentProps {
  comment: CommentWithChildren;
  onCommentAdded: (comment: CommentType) => void;
  level?: number;
  onMoreReplies?: (selectedComment: CommentType) => void;
}

const MAX_LEVEL = 2;
const INDENT_PER_LEVEL = 20; // Increased indentation for better visibility

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

      console.log('Fetching child comments with params:', params);

      const fetchedChildComments = await fetchComments(params);

      if (fetchedChildComments.length > 0) {
        const uniqueChildren = fetchedChildComments.filter(
          (newComment) => !children.some((child) => child.id === newComment.id)
        );

        setChildren((prev) => [...prev, ...uniqueChildren]);

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

  // Handler for "More Replies" button
  const handleMoreReplies = (selectedComment: CommentType) => {
    // Reset pagination and children when switching to new replies
    setPaginationKey(null); // Reset pagination key
    setChildren([]); // Clear previous child comments
    setAllChildrenLoaded(false); // Reset "all loaded" flag

    if (onMoreReplies) {
      onMoreReplies(selectedComment); // Pass the selected comment to the parent
    }
  };

  const effectiveLevel = Math.min(level, MAX_LEVEL);
  const indentation = effectiveLevel * INDENT_PER_LEVEL;
  const isBeyondMaxLevel = level > MAX_LEVEL;

  return (
    <View style={{ marginLeft: indentation, marginTop: 10 }}>
      <Card style={styles.card}>
        <Card.Content>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.label}>Author:</Text>
              <Text style={styles.authorText}>{comment.author}</Text>
            </View>
            <Text style={styles.dateText}>{new Date(comment.createdAt).toLocaleString()}</Text>
          </View>

          <Divider style={styles.divider} />

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
                    color={loadingChildren ? 'gray' : '#6200ee'}
                  />
                </TouchableOpacity>
              )
            )}
          </View>

          {/* Loading Indicator */}
          {loadingChildren && <ActivityIndicator size="small" color="#6200ee" style={{ marginTop: 10 }} />}

          {/* Render child comments */}
          {children.map((childComment) => (
            <Comment
              key={childComment.id}
              comment={childComment}
              onCommentAdded={onCommentAdded}
              level={level + 1}
              onMoreReplies={onMoreReplies}
            />
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
    padding: 16,
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
  label: {
    fontWeight: '600',
    marginRight: 4,
    color: '#333333',
  },
  authorText: {
    fontSize: 14,
    color: '#333333',
  },
  dateText: {
    fontSize: 12,
    color: '#666666',
  },
  divider: {
    marginVertical: 8,
    backgroundColor: '#e0e0e0',
  },
  contentSection: {
    marginBottom: 8,
  },
  contentText: {
    fontSize: 14,
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
  moreRepliesButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginLeft: 8,
  },
  moreRepliesText: {
    color: '#6200ee',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Comment;