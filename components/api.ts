import axios from 'axios';
import { 
  GetPaginatedCommentsRequest, 
  Comment, 
  CreateCommentRequest, 
  SortOrder, 
  CommentSortColumn, 
  CommentFilterField 
} from '../proto/comments/comments'

const API_BASE_URL = 'https://192.168.1.95:8443/v1'; // Adjust as needed

// Helper function to convert enums to string values for API compatibility
const sortOrderToString = (order: SortOrder): string => {
  switch (order) {
    case SortOrder.ASC:
      return 'ASC';
    case SortOrder.DESC:
      return 'DESC';
    default:
      throw new Error(`Unknown SortOrder value: ${order}`);
  }
};

const commentSortColumnToString = (column: CommentSortColumn): string => {
  switch (column) {
    case CommentSortColumn.COMMENT_CREATED_AT:
      return 'CREATED_AT';
    case CommentSortColumn.COMMENT_AUTHOR:
      return 'AUTHOR';
    default:
      throw new Error(`Unknown CommentSortColumn value: ${column}`);
  }
};

const commentFilterFieldToString = (field: CommentFilterField): string => {
  switch (field) {
    case CommentFilterField.FILTER_PARENT_ID:
      return 'FILTER_PARENT_ID';
    case CommentFilterField.FILTER_NULL_PARENT_ID:
      return 'FILTER_NULL_PARENT_ID';
    default:
      throw new Error(`Unknown CommentFilterField value: ${field}`);
  }
};

// Fetch comments with pagination and proper error handling
export const fetchComments = async (
  params: GetPaginatedCommentsRequest
): Promise<Comment[]> => {
  try {
    const formattedParams = {
      ...params,
      order: sortOrderToString(params.order), // Convert enum to string
      column: commentSortColumnToString(params.column), // Convert enum to string
      filters: {
        filters: params.filters?.filters.map((filter) => ({
          field: commentFilterFieldToString(filter.field), // Convert enum to string
          value: filter.value,
        })) || [], // Default to an empty array if no filters
      },
    };

    console.log('Fetching comments with params:', formattedParams); // Debugging

    const response = await axios.post(`${API_BASE_URL}/comments`, formattedParams);

    if (!response.data.comments) {
      console.warn('No comments returned from API');
      return [];
    }

    // Ensure children field is always an array to prevent runtime issues
    return response.data.comments.map((comment: any) => ({
      ...comment,
      children: comment.children ?? [], // Default children to an empty array
    }));
  } catch (error: any) {
    console.error('Error fetching comments:', error?.response?.data || error.message);
    throw new Error('Failed to fetch comments'); // Re-throw the error for handling
  }
};

// Create a new comment with error handling
export const createComment = async (
  data: CreateCommentRequest
): Promise<Comment> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create/comments`, data);
    return response.data.comment as Comment;
  } catch (error: any) {
    console.error('Error creating comment:', error?.response?.data || error.message);
    throw new Error('Failed to create comment'); // Re-throw the error for handling
  }
};