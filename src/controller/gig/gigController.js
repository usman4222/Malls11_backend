import { GigModel } from "../../models/gigModel.js";
import { UserModel as User } from "../../models/userSchema.js";
import { sendError, successResponse } from "../../utils/response.js";

export const createGig = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      response_time,
      min_hourly_rate,
      max_hourly_rate,
      packages,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      // !response_time ||
      !min_hourly_rate ||
      !max_hourly_rate ||
      !packages ||
      !Array.isArray(packages) ||
      packages.length === 0
    ) {
      return sendError(res, "All fields are required", 400);
    }

    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user || !user.role.includes("freelancer")) {
      return sendError(res, { message: "Only freelancers can create gigs." }, 403);
    }

    // Check gig count limit
    const gigCount = await GigModel.countDocuments({ userId });
    if (gigCount >= 10) {
      return sendError(res, { message: "You can only create up to 10 gigs." }, 400);
    }

    const newGig = await GigModel.create({
      ...req.body,
      userId
    });

    return successResponse(
      res,
      'Gig created successfully',
      {
        gig: newGig
      },
      201
    );
  } catch (error) {
    console.error('Error creating project:', error);
    return sendError(res, "Error creating project: " + error.message, 500);
  }
};


export const getMyGigs = async (req, res) => {
  try {
    const userId = req.user.id;
    const gigs = await GigModel.find({ userId });

    return successResponse(res, 'Gigs fetched successfully', { gigs });
  } catch (error) {
    console.error('Error fetching gigs:', error);
    return sendError(res, "Error fetching gigs: " + error.message, 500);
  }
};

export const getUserGigs = async (req, res) => {
  try {
    const { userId } = req.params;

    // Only fetch gigs with status "Active"
    const gigs = await GigModel.find({ userId, status: "Active" });

    return successResponse(res, 'User Gigs fetched successfully', { gigs });
  } catch (error) {
    console.error('Error fetching gigs:', error);
    return sendError(res, "Error fetching gigs: " + error.message, 500);
  }
};




export const getAllGigs = async (req, res) => {
  try {
    const gigs = await GigModel.find().populate("userId", "fullname username email profilePicture")

    return successResponse(res, "All gigs fetched successfully", { gigs, totalGig: gigs.length })
  } catch (error) {
    console.error("Error fetching all gigs:", error)
    return sendError(res, "Error fetching all gigs: " + error.message, 500)
  }
};



export const getSingleGig = async (req, res) => {
  try {
    const { id } = req.params
    const gig = await GigModel.findById(id);

    if (!gig) return sendError(res, "Gig not found", 404);

    return successResponse(res, 'Gig fetched successfully', { gig });
  } catch (error) {
    console.error('Error fetching gig:', error);
    return sendError(res, "Error fetching gig: " + error.message, 500);
  }
};


export const updateGig = async (req, res) => {
  try {
    const { gigId } = req.params
    const userId = req.user.id;

    const gig = await GigModel.findOne({ _id: gigId, userId });
    if (!gig) return sendError(res, "Gig not found or unauthorized", 404);

    Object.assign(gig, req.body); // Update only fields provided in body
    await gig.save();

    return successResponse(res, "Gig updated successfully", { gig });
  } catch (error) {
    console.error("Error updating gig:", error);
    return sendError(res, "Error updating gig: " + error.message, 500);
  }
};



export const changeGigStatus = async (req, res) => {
  try {
    const freelancerId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Draft", "Active", "Paused"];
    if (!validStatuses.includes(status)) {
      return sendError(res, "Invalid status. Allowed: Draft, Active, Paused", 400);
    }

    const gig = await GigModel.findById(id);
    if (!gig) {
      return sendError(res, "Gig not found", 404);
    }

    if (!gig.userId || gig.userId.toString() !== freelancerId.toString()) {
      return sendError(res, "You are not authorized to update this gig", 403);
    }

    gig.status = status;
    await gig.save();

    return successResponse(res, `Gig status updated to ${status}`, { gig }, 200);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};




export const deleteGig = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const gig = await GigModel.findOneAndDelete({ _id: id, userId });
    if (!gig) return sendError(res, "Gig not found or unauthorized", 404);

    return successResponse(res, "Gig deleted successfully", null);
  } catch (error) {
    console.error("Error deleting gig:", error);
    return sendError(res, "Error deleting gig: " + error.message, 500);
  }
};



export default {
  createGig,
  getMyGigs,
  getUserGigs,
  getSingleGig,
  updateGig,
  changeGigStatus,
  deleteGig,
  getAllGigs
};