import { successResponse, sendError } from "../../utils/response.js";
import { UserModel as User } from "../../models/userSchema.js";
import bcrypt from "bcrypt";


export const createUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            whatsapp_no,
            gender,
            country,
            state,
            user_doc,
            hourly_rate,
            profile_des,
            social_links,
            awards,
            skills,
            faqs,
            profile_image
        } = req.body;

        const user = await User.findById(userId);

        if (!user) return sendError(res, "User not found", 404)

        // Update profile fields
        user.whatsapp_no = whatsapp_no;
        user.gender = gender;
        user.country = country;
        user.state = state;
        user.awards = awards;
        user.skills = skills;
        user.faqs = faqs;
        user.profile_image = profile_image,
            user.user_doc =
            typeof user_doc === "object" && user_doc?.url
                ? user_doc.url
                : typeof user_doc === "string"
                    ? user_doc
                    : null;
        user.hourly_rate = hourly_rate;
        user.profile_des = profile_des;
        user.social_links = social_links;
        user.profile_status = "Completed";

        await user.save();

        return successResponse(res, "Profile completed successfully", { user })
    } catch (error) {
        console.log("Error creating user profile:", error);
        return sendError(res, error.message, 500);
    }
};


export const verifyUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            contact_no,
            address,
            cnic_no,
            passport_no,
            verification_document
        } = req.body;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return sendError(res, "User not found", 404)
        }

        // Update fields
        user.contact_no = contact_no;
        user.address = address;
        user.cnic_no = cnic_no;
        user.passport_no = passport_no;
        user.verification_document = verification_document || null;
        user.profile_verified = true; 

        await user.save();

        return successResponse(res, "User verified successfully", { user })
    } catch (error) {
        console.log("Error verifing user profile:", error);
        return sendError(res, error.message, 500);
    }
};

export const getMyProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return sendError(res, "User not found", 404);
        }
        return successResponse(
            res,
            "User data retrieved successfully",
            { user: user },
            200
        );
    } catch (error) {
        return sendError(res, error.message, 500);
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params

        const user = await User.findById(id);

        if (!user) {
            return sendError(res, "User not found", 404);
        }

        return successResponse(
            res,
            "User data retrieved successfully",
            { user },
            200
        );
    } catch (error) {
        return sendError(res, error.message, 500);
    }
};



export const logoutUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return sendError(res, "User not found", 404);
        }

        user.tokenVersion = (user.tokenVersion || 0) + 1;
        await user.save();

        return successResponse(res, "Logout successful", null, 200);
    } catch (error) {
        console.error("Logout error:", error);
        return sendError(res, "Failed to logout", 500);
    }
};


export const deleteUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { password } = req.body;

        if (!password) {
            return sendError(res, "Password is required to delete the profile", 400);
        }

        const user = await User.findById(userId);
        if (!user) {
            return sendError(res, "User not found", 404);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendError(res, "Incorrect password", 401);
        }

        // Soft delete: set profile_status to 'deleted'
        // user.profile_status = "deleted";
        // await user.save();
        await User.findByIdAndDelete(userId);

        return successResponse("User profile deleted successfully", 200);
    } catch (error) {
        return sendError(res, error.message, 500);
    }
};


export const getAllFreelancers = async (req, res) => {
    try {
        const freelancers = await User.find({ role: 'freelancer', profile_status: 'Completed' });

        if (!freelancers || freelancers.length === 0) {
            return sendError(res, "No freelancers found", 404);
        }

        return successResponse(
            res,
            "Freelancers data retrieved successfully",
            { freelancers },
            200
        );
    } catch (error) {
        return sendError(res, error.message, 500);
    }
};





export default {
    createUserProfile,
    verifyUserProfile,
    getMyProfile,
    getUserProfile,
    logoutUser,
    deleteUserProfile,
    getAllFreelancers
};