import { successResponse, sendError } from "../../utils/response.js";
import { UserModel as User } from "../../models/userSchema.js";



export const createUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; createUserProfile
        const {
            contact_no,
            whatsapp_no,
            dof,
            gender,
            country,
            state,
            cnic_no,
            passport_no,
            doc_pic,
            hourly_rate,
            profile_des,
            social_links,
            freelancer_gig,
        } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Update profile fields
        user.contact_no = contact_no;
        user.whatsapp_no = whatsapp_no;
        user.dof = dof;
        user.gender = gender;
        user.country = country;
        user.state = state;
        user.cnic_no = cnic_no;
        user.passport_no = passport_no;
        user.doc_pic = doc_pic;
        user.hourly_rate = hourly_rate;
        user.profile_des = profile_des;
        user.social_links = social_links;
        user.profile_status = "completed";

        // Only allow gig if user is a freelancer
        if (user.role === "freelancer" && Array.isArray(freelancer_gig)) {
            user.freelancer_gig = freelancer_gig;
        } else if (user.role !== "freelancer" && freelancer_gig?.length > 0) {
            return res.status(400).json({ error: "Only freelancers can create gigs" });
        }

        await user.save();

        return res
            .status(200)
            .json(
                successResponse("Profile completed successfully", { user })
            );
    } catch (error) {
        return sendError(res, error.message, 500);
    }
};


export const getUserProfile = async (req, res) => {
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

export default {
    createUserProfile,
    getUserProfile
};