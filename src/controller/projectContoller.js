

import { Project } from "../models/projectModel.js";
import { sendError, successResponse } from "../utils/response.js";

export const createProject = async (req, res) => {
  try {
    const client_id = req.user.id;

    const {
      title,
      category,
      management_type,
      project_type,
      duration,
      experience,
      language,
      location,
      project_des,
      hourly_rate,
      fixed_price,
      skills,
      project_doc,
      visibility
    } = req.body;

    // Validation: if Hourly project, hourly_rate is required
    if (project_type === "Hourly" && (!hourly_rate || hourly_rate.min == null || hourly_rate.max == null)) {
      return sendError(res, "Hourly rate range is required for Hourly projects", 400);
    }

    // Validation: if Fixed project, fixed_price is required
    if (project_type === "Fixed" && (fixed_price == null || fixed_price === "")) {
      return sendError(res, "Fixed price is required for Fixed projects", 400);
    }

    const newProject = new Project({
      client_id,
      title,
      category,
      management_type,
      project_type,
      duration,
      experience,
      language,
      location,
      project_des,
      hourly_rate: project_type === "Hourly" ? hourly_rate : undefined,
      fixed_price: project_type === "Fixed" ? fixed_price : undefined,
      skills,
      project_doc,
      visibility
    });

    await newProject.save();

    return successResponse(res, "Project created successfully", { newProject }, 201);
  } catch (error) {
    return sendError(res, error.message || "Something went wrong", 500);
  }
};


export const getAllClientProjects = async (req, res) => {
  try {
    const user = req.user;

    if (!user || user.role !== 'client') {
      return sendError(res, "Only clients can view their projects", 403);
    }

    const projects = await Project.find({ client_id: user.id });

    return successResponse(res, "Client projects fetched successfully", { projects, total: projects.length }, 200)

  } catch (error) {
    return sendError(res, error.message, 500);
  }
};


export const getSingleProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id)
    // .populate('client_id', 'username email');

    if (!project) {
      return sendError(res, "Project not found", 404);
    }

    return successResponse(res, "Project fetched successfully", { project }, 200);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};


export const updateClientProject = async (req, res) => {
  try {
    const { id } = req.params;
    const clientId = req.user.id;

    // Fetch the project by ID
    const project = await Project.findById(id);
    if (!project) {
      return sendError(res, "Project not found", 404);
    }

    // Ensure that only the project owner (client) can update it
    if (project.client_id.toString() !== clientId.toString()) {
      return sendError(res, "Unauthorized to update this project", 403);
    }

    // Fields allowed to update
    const updatableFields = [
      "title",
      "category",
      "management_type",
      "project_type",
      "duration",
      "experience",
      "language",
      "location",
      "project_des",
      "hourly_rate",
      "fixed_price",
      "skills",
      "project_doc",
      "visibility",
      "status"
    ];

    // Loop through fields and update only those provided
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save();

    return successResponse(res, "Project updated successfully", { project }, 200);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};


export const deleteClientProject = async (req, res) => {
  try {
    const { id } = req.params;
    const clientId = req.user.id;

    const project = await Project.findById(id);

    if (!project) {
      return sendError(res, "Project not found", 404);
    }

    if (project.client_id.toString() !== clientId.toString()) {
      return sendError(res, "Unauthorized to delete this project", 403);
    }

    await Project.findByIdAndDelete(id);

    return successResponse(res, "Project deleted successfully", null, 200);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};


export const updateProjectVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { visibility } = req.body;
    const clientId = req.user.id;

    if (!["Private", "Public"].includes(visibility)) {
      return sendError(res, "Invalid visibility value", 400);
    }

    const project = await Project.findById(id);
    if (!project) {
      return sendError(res, "Project not found", 404);
    }

    if (project.client_id.toString() !== clientId.toString()) {
      return sendError(res, "Unauthorized to update this project", 403);
    }

    project.visibility = visibility;
    await project.save();

    return successResponse(res, "Project visibility updated", { visibility: project.visibility }, 200);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};


export const updateProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const clientId = req.user.id;

    const allowedStatuses = ['Draft', 'Published', 'In_progress', 'Completed', 'Cancelled'];
    if (!allowedStatuses.includes(status)) {
      return sendError(res, "Invalid status value", 400);
    }

    const project = await Project.findById(id);
    if (!project) {
      return sendError(res, "Project not found", 404);
    }

    if (project.client_id.toString() !== clientId.toString()) {
      return sendError(res, "Unauthorized to update this project", 403);
    }

    project.status = status;
    await project.save();

    return successResponse(res, "Project status updated", { status: project.status }, 200);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};


export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
    // .populate('client_id', 'username email');

    return successResponse(res, "All projects fetched successfully", { projects, total: projects.length }, 200);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};



export default {
  createProject,
  getAllClientProjects,
  getSingleProject,
  updateClientProject,
  deleteClientProject,
  updateProjectVisibility,
  updateProjectStatus,
  getAllProjects
};