import { Review } from '../../models/reviewModel.js';
import { Project } from '../../models/projectModel.js';
import { UserModel } from '../../models/userSchema.js';
import { successResponse, sendError } from '../../utils/response.js';

export const createReview = async (req, res) => {
  try {
    const { project_id, client_id, freelancer_id, rating, review_text } = req.body;

    if (!project_id || !client_id || !freelancer_id || !rating || !review_text) {
      return sendError(res, 'All fields are required', 400);
    }

    if (rating < 1 || rating > 5) {
      return sendError(res, 'Rating must be between 1 and 5', 400);
    }

    const project = await Project.findById(project_id);
    if (!project) {
      return sendError(res, 'Project not found', 404);
    }

    const client = await UserModel.findById(client_id);
    if (!client || !client.role === 'client') {
      return sendError(res, 'Invalid client', 404);
    }

    const freelancer = await UserModel.findById(freelancer_id);
    if (!freelancer || !freelancer.role === 'freelancer') {
      return sendError(res, 'Invalid freelancer', 404);
    }

    const existingReview = await Review.findOne({
      project_id,
      freelancer_id,
      client_id
    });

    if (existingReview) {
      return sendError(res, 'You have already submitted a review for this freelancer on this project', 409);
    }

    const review = await Review.create({
      project_id,
      client_id,
      freelancer_id,
      rating,
      review_text
    });

    return successResponse(res, 'Review created successfully', {review}, 201);

  } catch (error) {
    console.error('Error creating review:', error);
    return sendError(res, 'Server error: ' + error.message, 500);
  }
};

export const getReviews = async (req, res) => {
  try {
    const { freelancer_id, project_id, client_id } = req.query;

    const filter = {};
    if (freelancer_id) filter.freelancer_id = freelancer_id;
    if (project_id) filter.project_id = project_id;
    if (client_id) filter.client_id = client_id;

    if (Object.keys(filter).length === 0) {
      return sendError(res, 'Please provide at least one filter (freelancer_id, project_id, or client_id)', 400);
    }

    const reviews = await Review.find(filter)
      .populate('freelancer_id', 'username'); 

    if (!reviews || reviews.length === 0) {
      return sendError(res, 'No reviews found', 404);
    }

    return successResponse(res, 'Reviews fetched successfully', reviews, 200);

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return sendError(res, 'Server error: ' + error.message, 500);
  }
};


export const updateReview = async (req, res) => {
  try {
    const { review_id } = req.params;
    const { rating, review_text } = req.body;
    const client_id = req.user.id

    if (!rating && !review_text) {
      return sendError(res, 'At least one field (rating or review_text) is required', 400);
    }

    if (rating && (rating < 1 || rating > 5)) {
      return sendError(res, 'Rating must be between 1 and 5', 400);
    }

    const review = await Review.findById(review_id);
    if (!review) {
      return sendError(res, 'Review not found', 404);
    }

    if (review.client_id.toString() !== client_id.toString()) {
      return sendError(res, 'Unauthorized: You can only update your own reviews', 403);
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (review.createdAt < oneHourAgo) {
      return sendError(res, 'You can only update a review within 1 hour of posting', 403);
    }

    if (rating) review.rating = rating;
    if (review_text) review.review_text = review_text;

    await review.save();

    return successResponse(res, 'Review updated successfully', review, 200);

  } catch (error) {
    console.error('Error updating review:', error);
    return sendError(res, 'Server error: ' + error.message, 500);
  }
};


export const deleteReview = async (req, res) => {
  try {
    const { review_id } = req.params;
    const client_id = req.user.id

    const review = await Review.findById(review_id);
    if (!review) {
      return sendError(res, 'Review not found', 404);
    }

    if (review.client_id.toString() !== client_id.toString()) {
      return sendError(res, 'Unauthorized: You can only delete your own reviews', 403);
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (review.createdAt < oneHourAgo) {
      return sendError(res, 'You can only delete a review within 1 hour of posting', 403);
    }

    await Review.findByIdAndDelete(review_id);

    return successResponse(res, 'Review deleted successfully', null, 200);

  } catch (error) {
    console.error('Error deleting review:', error);
    return sendError(res, 'Server error: ' + error.message, 500);
  }
};


export const getFreelancerReviews = async (req, res) => {
  try {
    const { freelancer_id } = req.params;

    console.log('Fetching reviews for freelancer:', freelancer_id);
    if (!freelancer_id) {
      return sendError(res, 'Freelancer ID is required', 400);
    }

    const freelancer = await UserModel.findById(freelancer_id);
    if (!freelancer || !freelancer.role === 'freelancer') {
      return sendError(res, 'Freelancer not found', 404);
    }

    const reviews = await Review.find({ freelancer_id })
      .populate('client_id', 'username ') 
      .populate('project_id', 'title') 
      .sort({ createdAt: -1 }); 

    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0;

    return successResponse(res, 'Freelancer reviews retrieved successfully', {
      averageRating: averageRating.toFixed(1),
      totalReviews: reviews.length,
      reviews
    }, 200);

  } catch (error) {
    console.error('Error getting freelancer reviews:', error);
    return sendError(res, 'Internal server error', 500);
  }
};

export default {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
  getFreelancerReviews
};