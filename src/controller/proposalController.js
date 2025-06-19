import { Project } from '../models/projectModel.js';
import proposalModel from '../models/proposalModel.js';
import { UserModel } from '../models/userSchema.js';
import { sendError, successResponse } from '../utils/response.js';

export const createProposal = async (req, res) => {
  try {
    const freelancerId = req.user.id;
    const {
      project_id,
      cover_letter,
      hourly_rate,
      fixed_price,
      duration
    } = req.body;

    const user = await UserModel.findById(freelancerId);
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    if (user.role !== "freelancer") {
      return sendError(res, "Only freelancers can submit proposals", 403);
    }

    const project = await Project.findById(project_id);
    if (!project) {
      return sendError(res, "Project not found", 404);
    }

    const existingProposal = await proposalModel.findOne({
      project_id,
      freelancer_id: freelancerId
    });
    if (existingProposal) {
      return sendError(res, "You have already submitted a proposal for this project", 409);
    }

    const proposal = new proposalModel({
      project_id,
      freelancer_id: freelancerId,
      cover_letter,
      hourly_rate,
      fixed_price,
      duration
    });

    await proposal.save();

    return successResponse(res, "Proposal submitted successfully", { proposal }, 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};



export const getSingleProposal = async (req, res) => {
  try {
    const { id } = req.params;

    const proposal = await proposalModel.findById(id)
    // .populate('freelancer_id', 'fullName email') 
    // .populate('project_id', 'title category');    

    if (!proposal) {
      return sendError(res, 'Proposal not found', 404);
    }

    return successResponse(res, 'Proposal fetched successfully', { proposal }, 200);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};


export const getMyProposals = async (req, res) => {
  try {
    const freelancerId = req.user.id;

    const proposals = await proposalModel.find({ freelancer_id: freelancerId })
      // .populate('project_id', 'title category status') 
      .sort({ submitted_at: -1 });

    return successResponse(res, "Freelancer proposals fetched successfully", { proposals }, 200);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};


export const withDrawProposal = async (req, res) => {
  try {
    const freelancerId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    // Only allow these statuses
    const allowedStatuses = ['Withdrawn'];
    if (!allowedStatuses.includes(status)) {
      return sendError(res, "Invalid status update", 400);
    }

    const proposal = await proposalModel.findById(id);
    if (!proposal) {
      return sendError(res, "Proposal not found", 404);
    }

    // Ensure the logged-in freelancer is the proposal owner
    if (proposal.freelancer_id.toString() !== freelancerId.toString()) {
      return sendError(res, "Unauthorized to update this proposal", 403);
    }

    // Prevent updating if already withdrawn, accepted or rejected
    if (['Withdrawn', 'Accepted', 'Rejected'].includes(proposal.status)) {
      return sendError(res, `Proposal already ${proposal.status.toLowerCase()}, cannot update`, 400);
    }

    proposal.status = status;
    await proposal.save();

    return successResponse(res, "Proposal status updated successfully", { proposal }, 200);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};


export const editProposal = async (req, res) => {
  try {
    const freelancerId = req.user.id;
    const { id } = req.params;
    const {
      cover_letter,
      hourly_rate,
      fixed_price,
      duration
    } = req.body;

    const proposal = await proposalModel.findById(id);
    if (!proposal) {
      return sendError(res, "Proposal not found", 404);
    }

    if (proposal.freelancer_id.toString() !== freelancerId.toString()) {
      return sendError(res, "Unauthorized to edit this proposal", 403);
    }

    if (proposal.status !== 'Pending') {
      return sendError(res, "Only proposals with 'Pending' status can be edited", 400);
    }

    if (cover_letter !== undefined) proposal.cover_letter = cover_letter;

    if (hourly_rate !== undefined) {
      if (!proposal.hourly_rate || typeof proposal.hourly_rate === null) {
        return sendError(res, "Hourly rate not initially set. Cannot update.", 400);
      }
      proposal.hourly_rate = hourly_rate;
    }

    if (fixed_price !== undefined) {
      if (proposal.fixed_price === undefined || proposal.fixed_price === null) {
        return sendError(res, "Fixed price not initially set. Cannot update.", 400);
      }
      proposal.fixed_price = fixed_price;
    }

    if (duration !== undefined) proposal.duration = duration;

    await proposal.save();

    return successResponse(res, "Proposal updated successfully", { proposal }, 200);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export default {
  createProposal,
  getSingleProposal,
  getMyProposals,
  withDrawProposal,
  editProposal
};
