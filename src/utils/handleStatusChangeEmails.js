import proposalModel from "../models/proposalModel.js";
import { SendStatusEmail } from "./SendStatusEmail.js";

export const handleStatusChangeEmails = async (project, oldStatus, newStatus) => {
    try {
        // First find the accepted proposal for this project
        const acceptedProposal = await proposalModel.findOne({
            project_id: project._id,
            status: 'accepted'
        }).populate('freelancer_id', 'email username');

        const freelancer = acceptedProposal?.freelancer_id;
        const client = project.client_id;

        // Validate we have client email
        if (!client?.email) {
            throw new Error("Client email not available");
        }

        switch (newStatus) {
            case 'in_progress':
                if (freelancer?.email) {
                    await SendStatusEmail(
                        freelancer.email,
                        `Project "${project.title}" Started`,
                        `You can now begin working on "${project.title}".`,
                        freelancer.username || 'Freelancer'
                    );
                }
                break;

            case 'completed':
                // Notify freelancer if exists
                if (freelancer?.email) {
                    await SendStatusEmail(
                        freelancer.email,
                        `Project "${project.title}" Completed`,
                        `Congratulations! "${project.title}" has been completed.`,
                        freelancer.username || 'Freelancer'
                    );
                }
                // Notify client
                await SendStatusEmail(
                    client.email,
                    `Project "${project.title}" Completed`,
                    `Your project "${project.title}" has been completed.`,
                    client.username || 'Client'
                );
                break;

            case 'cancelled':
                // Notify freelancer if exists
                if (freelancer?.email) {
                    await SendStatusEmail(
                        freelancer.email,
                        `Project "${project.title}" Cancelled`,
                        `The project "${project.title}" has been cancelled.`,
                        freelancer.username || 'Freelancer'
                    );
                }
                // Notify client
                await SendStatusEmail(
                    client.email,
                    `Project "${project.title}" Cancelled`,
                    `You have cancelled "${project.title}".`,
                    client.username || 'Client'
                );
                break;

            default:
                console.log(`No email template for status: ${newStatus}`);
        }
    } catch (emailError) {
        console.error("Status change email failed:", emailError.message);
        // Don't rethrow to avoid blocking the status update
    }
};