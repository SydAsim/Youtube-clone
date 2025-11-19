/*
 * COMMENT SECTION COMPONENT - LEARNING NOTES
 * ===========================================
 * 
 * Concepts demonstrated:
 * 1. COMPONENT COMPOSITION: Breaking UI into smaller components
 * 2. STATE MANAGEMENT: Managing comment input and list
 * 3. API INTEGRATION: CRUD operations for comments
 * 4. CONDITIONAL RENDERING: Show/hide edit form
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment
} from '../services/commentService';
import { toggleCommentLike } from '../services/likeService';
import { ThumbsUp, Trash2, Edit2 } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

/**
 * Single Comment Component
 */
const Comment = ({ comment, onUpdate, onDelete, onLike }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleUpdate = async () => {
    await onUpdate(comment._id, editContent);
    setIsEditing(false);
  };

  const isOwner = user?._id === comment.owner?._id;

  return (
    <div className="flex gap-3 py-4">
      <img
        src={comment.owner?.avatar}
        alt={comment.owner?.username}
        className="w-10 h-10 rounded-full"
      />

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{comment.owner?.username}</span>
          <span className="text-sm text-gray-400">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>

        {isEditing ? (
          <div className="mt-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-dark border border-gray-700 rounded p-2 focus:outline-none focus:border-blue-500"
              rows="2"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleUpdate}
                className="px-4 py-1 bg-blue-500 rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-1 border border-gray-700 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="mt-1 text-gray-200">{comment.content}</p>

            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={() => onLike(comment._id)}
                className={`flex items-center gap-1 ${comment.isLiked ? 'text-blue-500' : 'hover:text-blue-500'}`}
              >
                <ThumbsUp className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm">{comment.likesCount || 0}</span>
              </button>

              {isOwner && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 text-gray-400 hover:text-white"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="text-sm">Edit</span>
                  </button>

                  <button
                    onClick={() => onDelete(comment._id)}
                    className="flex items-center gap-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm">Delete</span>
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/**
 * Comment Section Component
 */
const CommentSection = ({ videoId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch comments when component mounts
  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const fetchComments = async () => {
    try {
      const response = await getVideoComments(videoId);

      // Ensure comments is always an array
      const commentsData = Array.isArray(response.data)
        ? response.data
        : (response.data?.comments || []);

      setComments(commentsData);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      setComments([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await addComment(videoId, newComment);
      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleUpdateComment = async (commentId, content) => {
    try {
      await updateComment(commentId, content);
      setComments(comments.map(c =>
        c._id === commentId ? { ...c, content } : c
      ));
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Delete this comment?')) return;

    try {
      await deleteComment(commentId);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      await toggleCommentLike(commentId);
      // Refresh comments to get updated like count
      fetchComments();
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">
        {comments.length} Comments
      </h3>

      {/* Add comment form */}
      {isAuthenticated ? (
        <form onSubmit={handleAddComment} className="flex gap-3 mb-6">
          <img
            src={user?.avatar}
            alt={user?.username}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-transparent border-b border-gray-700 pb-2 focus:outline-none focus:border-white resize-none"
              rows="2"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setNewComment('')}
                className="px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Comment
              </button>
            </div>
          </div>
        </form>
      ) : (
        <p className="text-gray-400 mb-6">Please login to comment</p>
      )}

      {/* Comments list */}
      <div className="divide-y divide-gray-700">
        {comments.map(comment => (
          <Comment
            key={comment._id}
            comment={comment}
            onUpdate={handleUpdateComment}
            onDelete={handleDeleteComment}
            onLike={handleLikeComment}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
