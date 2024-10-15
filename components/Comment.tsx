import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { fetchComments } from './api';
import { 
  Comment as CommentType, 
  SortOrder, 
  CommentSortColumn, 
  CommentFilterField, 
  GetPaginatedCommentsRequest 
} from '../proto/comments/comments';

// Extend the Comment type to include children
type CommentWithChildren = CommentType & {
  children?: CommentWithChildren[];
};

interface CommentProps {
  comment: CommentWithChildren;
  onCommentAdded: () => void;
  level?: number;
  onMoreReplies?: (selectedComment: CommentType) => void;
}

const MAX_LEVEL = 2;
const INDENT_PER_LEVEL = 10;

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
    <Card
      style={[
        styles.card,
        {
          marginLeft: indentation,
          opacity: isBeyondMaxLevel ? 0.9 : 1,
        },
      ]}
    >
      <Card.Content>
        <View style={styles.header}>
          <Text style={styles.authorText}>{`#${comment.id} ${comment.author}`}</Text>
          <IconButton
            icon="comment-outline"
            size={20}
            onPress={() => handleMoreReplies(comment)}
            accessibilityLabel="Reply"
          />
        </View>
        <Text style={styles.contentText}>{comment.content}</Text>
        <Text style={styles.dateText}>{new Date(comment.createdAt).toLocaleString()}</Text>

        {/* Render child comments */}
        {children.map((childComment) => (
          <View key={childComment.id}>
            <Comment
              comment={childComment}
              onCommentAdded={onCommentAdded}
              level={level + 1}
              onMoreReplies={onMoreReplies}
            />
          </View>
        ))}

        {!allChildrenLoaded && (
          isBeyondMaxLevel ? (
            <View style={styles.buttonContainer}>
            <Button title="More Replies" onPress={() => handleMoreReplies(comment)} />
            </View>
          ) : (
            <View style={styles.buttonContainer}>
            <Button 
              title="Load more children"
              onPress={() => loadChildren(true)}
              disabled={loadingChildren}
            />
                        </View>

          )
        )}

        {loadingChildren && <ActivityIndicator />}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 3,
    backgroundColor: '#f9f9f9',
    padding: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    elevation: 5,
  },
  authorText: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  contentText: {
    marginBottom: 5,
  },
  dateText: {
    color: 'gray',
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 10,
    alignSelf: 'center', // Center the button horizontally
    maxWidth: 200, // Limit button width
    width: '100%', // Allow it to take full width if smaller than maxWidth
  },
});

export default Comment;