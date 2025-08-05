import { catchAsync, sendResponse } from "../lib/utils.js";
import { UnprocessableEntityError, NotFoundError, ConflictError } from "../lib/errors.lib.js";
import { ScholarshipApplication } from "../database/models/scholarship-application.model.js";
import { User } from "../database/models/user.model.js";
import { Track } from "../database/models/track.model.js";
import { createApplicationSchema, updateApplicationSchema, reviewApplicationSchema } from "./scholarship.schema.js";

export const getAllApplications = catchAsync(async (req, res) => {
  const applications = await ScholarshipApplication.findAll({
    include: [
      {
        model: User,
        as: 'applicant',
        attributes: ['id', 'name', 'email']
      },
      {
        model: Track,
        attributes: ['id', 'name', 'description']
      },
      {
        model: User,
        as: 'reviewer',
        attributes: ['id', 'name', 'email']
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  sendResponse(res, 200, "Applications fetched successfully", { applications });
});

export const getApplicationById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const application = await ScholarshipApplication.findByPk(id, {
    include: [
      {
        model: User,
        as: 'applicant',
        attributes: ['id', 'name', 'email']
      },
      {
        model: Track,
        attributes: ['id', 'name', 'description']
      },
      {
        model: User,
        as: 'reviewer',
        attributes: ['id', 'name', 'email']
      }
    ]
  });

  if (!application) {
    throw new NotFoundError("Application not found");
  }

  sendResponse(res, 200, "Application fetched successfully", { application });
});

export const getMyApplications = catchAsync(async (req, res) => {
  const applications = await ScholarshipApplication.findAll({
    where: { user_id: req.user.id },
    include: [
      {
        model: Track,
        attributes: ['id', 'name', 'description']
      },
      {
        model: User,
        as: 'reviewer',
        attributes: ['id', 'name', 'email']
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  sendResponse(res, 200, "Your applications fetched successfully", { applications });
});

export const createApplication = catchAsync(async (req, res) => {
  const results = createApplicationSchema.safeParse(req.body);
  
  if (results.error?.issues) {
    throw new UnprocessableEntityError(
      "The request failed with the following errors",
      results.error.issues
    );
  }

  // Check if user already has a pending application
  const existingApplication = await ScholarshipApplication.findOne({
    where: { 
      user_id: req.user.id,
      status: ['pending', 'under_review']
    }
  });

  if (existingApplication) {
    throw new ConflictError("You already have a pending application");
  }

  const application = await ScholarshipApplication.create({
    ...results.data,
    user_id: req.user.id
  });

  const createdApplication = await ScholarshipApplication.findByPk(application.id, {
    include: [
      {
        model: Track,
        attributes: ['id', 'name', 'description']
      }
    ]
  });

  sendResponse(res, 201, "Application submitted successfully", { application: createdApplication });
});

export const updateApplication = catchAsync(async (req, res) => {
  const { id } = req.params;
  const results = updateApplicationSchema.safeParse(req.body);
  
  if (results.error?.issues) {
    throw new UnprocessableEntityError(
      "The request failed with the following errors",
      results.error.issues
    );
  }

  const application = await ScholarshipApplication.findByPk(id);
  if (!application) {
    throw new NotFoundError("Application not found");
  }

  // Only allow updates if application is pending
  if (application.status !== 'pending') {
    throw new UnprocessableEntityError("Cannot update application that is not pending");
  }

  // Only allow users to update their own applications
  if (application.user_id !== req.user.id && !req.user.roles.includes('admin')) {
    throw new UnprocessableEntityError("You can only update your own applications");
  }

  await application.update(results.data);

  const updatedApplication = await ScholarshipApplication.findByPk(id, {
    include: [
      {
        model: Track,
        attributes: ['id', 'name', 'description']
      }
    ]
  });

  sendResponse(res, 200, "Application updated successfully", { application: updatedApplication });
});

export const reviewApplication = catchAsync(async (req, res) => {
  const { id } = req.params;
  const results = reviewApplicationSchema.safeParse(req.body);
  
  if (results.error?.issues) {
    throw new UnprocessableEntityError(
      "The request failed with the following errors",
      results.error.issues
    );
  }

  const application = await ScholarshipApplication.findByPk(id);
  if (!application) {
    throw new NotFoundError("Application not found");
  }

  await application.update({
    ...results.data,
    reviewed_by: req.user.id,
    reviewed_at: new Date()
  });

  const reviewedApplication = await ScholarshipApplication.findByPk(id, {
    include: [
      {
        model: User,
        as: 'applicant',
        attributes: ['id', 'name', 'email']
      },
      {
        model: Track,
        attributes: ['id', 'name', 'description']
      },
      {
        model: User,
        as: 'reviewer',
        attributes: ['id', 'name', 'email']
      }
    ]
  });

  sendResponse(res, 200, "Application reviewed successfully", { application: reviewedApplication });
});

export const deleteApplication = catchAsync(async (req, res) => {
  const { id } = req.params;

  const application = await ScholarshipApplication.findByPk(id);
  if (!application) {
    throw new NotFoundError("Application not found");
  }

  // Only allow users to delete their own pending applications
  if (application.user_id !== req.user.id && !req.user.roles.includes('admin')) {
    throw new UnprocessableEntityError("You can only delete your own applications");
  }

  if (application.status !== 'pending') {
    throw new UnprocessableEntityError("Cannot delete application that is not pending");
  }

  await application.destroy();

  sendResponse(res, 204, "Application deleted successfully");
});

export const getApplicationsByStatus = catchAsync(async (req, res) => {
  const { status } = req.params;

  const applications = await ScholarshipApplication.findAll({
    where: { status },
    include: [
      {
        model: User,
        as: 'applicant',
        attributes: ['id', 'name', 'email']
      },
      {
        model: Track,
        attributes: ['id', 'name', 'description']
      },
      {
        model: User,
        as: 'reviewer',
        attributes: ['id', 'name', 'email']
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  sendResponse(res, 200, `${status} applications fetched successfully`, { applications });
}); 