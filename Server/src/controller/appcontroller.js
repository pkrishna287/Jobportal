import prisma from '../utils/prisma.js';
import { createApplicationSchema } from '../validations/application.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const createApplication = async (req, res) => {
  const { jobId } = req.params;
  const userId = req.user.id;
  let resumeUrl = null;

  // ✅ STEP 1: Parse answers from stringified form-data
  let parsedAnswers;
  try {
    parsedAnswers = JSON.parse(req.body.answers);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid JSON in answers field' });
  }

  // ✅ STEP 2: Validate with Zod
  const validation = createApplicationSchema.safeParse({ answers: parsedAnswers });
  if (!validation.success) {
    return res.status(400).json({ error: 'Validation failed', issues: validation.error.flatten() });
  }

  try {
    // ✅ STEP 3: Check if already applied
    const exists = await prisma.application.findFirst({
      where: { jobId, userId },
    });
    if (exists) {
      return res.status(409).json({ error: 'Already applied to this job' });
    }

    // ✅ STEP 4: Upload resume if provided
    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer); // not .path
      resumeUrl = uploaded.secure_url;
    }

    // ✅ STEP 5: Create application
    const application = await prisma.application.create({
      data: {
        jobId,
        userId,
        resumeUrl,
        answers: {
          create: parsedAnswers.map((ans) => ({
            questionId: ans.questionId,
            answer: ans.answer,
          })),
        },
      },
    });

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (err) {
    res.status(500).json({ error: 'Failed to apply', details: err.message });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const apps = await prisma.application.findMany({
      include: { user: true, job: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications', details: err.message });
  }
};

export const getApplicationById = async (req, res) => {
  const { id } = req.params;
  try {
    const app = await prisma.application.findUnique({
      where: { id },
      include: {
        user: true,
        job: true,
        answers: { include: { question: true } },
      },
    });
    if (!app) return res.status(404).json({ error: 'Application not found' });
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get application', details: err.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const [updatedApplication, logEntry] = await prisma.$transaction([
      prisma.application.update({
        where: { id },
        data: {
          status,
          updatedAt: new Date(),
        },
      }),
      prisma.actionLog.create({
        data: {
          applicationId: id,
          action: status,
          adminId: req.user.id,
          timestamp: new Date(),
        },
      }),
    ]);

    res.json({ updatedApplication, logEntry });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status', details: err.message });
  }
};
