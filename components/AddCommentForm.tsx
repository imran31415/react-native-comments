// AddCommentForm.tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { createComment } from './api';

import {Comment as CommentType} from '../proto/comments/comments'

interface AddCommentFormProps {
  resourceId: string;
  onCommentAdded: (newComment: CommentType) => void; // Expect newComment as an argument
  parentId?: string | null; // Optional parentId prop
  hideAddCommentForm: () => void; // Function to hide the form
}

const AddCommentForm: React.FC<AddCommentFormProps> = ({
  resourceId,
  onCommentAdded,
  parentId = null,
  hideAddCommentForm,
}) => {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmedAuthor = author.trim();
    const trimmedContent = content.trim();
  
    if (!trimmedAuthor || !trimmedContent) {
      Alert.alert('Validation Error', 'Please enter both author and content.');
      return;
    }
  
    setLoading(true);
    try {
      const newComment = await createComment({
        content: trimmedContent,
        author: trimmedAuthor,
        resourceId,
        parentId: parentId ?? "", // Use empty string if parentId is null or undefined
      });
  
      // Ensure the `createdAt` field is correctly formatted as a valid ISO string
      const createdAt = new Date().toISOString();
      const formattedComment = { ...newComment, createdAt };
  
      onCommentAdded(formattedComment); // Pass the formatted comment to parent
      setContent('');
      setAuthor('');
      hideAddCommentForm(); // Hide the form after submission
      Alert.alert('Success', 'Your comment has been added.');
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Submission Error', 'Failed to add your comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {parentId && (
        <Text style={styles.replyingText}>
          Replying to comment ID: {parentId}
        </Text>
      )}
      <TextInput
        value={author}
        onChangeText={setAuthor}
        placeholder="Author"
        style={styles.input}
        editable={!loading}
      />
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="Write a comment..."
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={4}
        editable={!loading}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Submit"
          onPress={handleSubmit}
          disabled={loading}
        />
        <View style={styles.buttonSpacer} />
        <Button
          title="Cancel"
          onPress={hideAddCommentForm}
          color="red"
          disabled={loading}
        />
      </View>
      {loading && (
        <ActivityIndicator
          size="small"
          color="#0000ff"
          style={styles.loadingIndicator}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  replyingText: {
    marginBottom: 10,
    fontStyle: 'italic',
    color: '#555',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buttonSpacer: {
    width: 10,
  },
  loadingIndicator: {
    marginTop: 10,
  },
});

export default AddCommentForm;