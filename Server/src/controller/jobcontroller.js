import prisma from '../utils/prisma.js';
import { createJobSchema, updateJobSchema, toggleStatusSchema } from '../validations/jobvalidation.js';

export const getAllJobs = async (req, res) => {
  try {
    const { search, location, department, status, page = 1, limit = 10 } = req.query;

    const filters = {
      status: status || 'ACTIVE',
      title: search ? { contains: search, mode: 'insensitive' } : undefined,
      location: location ? { contains: location, mode: 'insensitive' } : undefined,
      department: department ? { contains: department, mode: 'insensitive' } : undefined,
    };

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where: filters,
        include: { questions: true },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.job.count({ where: filters }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      jobs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs', details: err.message });
  }
};


export const getJobById = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await prisma.job.findUnique({ where: { id }, include: { questions: true } });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch job', details: err.message });
  }
};

export const createJob = async (req, res) => {
  const validation = createJobSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.flatten() });
  }

  const { title, department, location, salary, status, questions } = validation.data;

  try {
    const job = await prisma.job.create({
      data: {
        title,
        department,
        location,
        salary,
        status: status || 'ACTIVE',
        questions: {
          create: questions.map((q) => ({ question: q })),
        },
      },
      include: { questions: true },
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create job', details: err.message });
  }
};

export const updateJob = async (req, res) => {
  const { id } = req.params;
  const validation = updateJobSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.flatten() });
  }
  const { title, department, location, salary, status, questions } = validation.data;

  try {
    await prisma.jobQuestion.deleteMany({ where: { jobId: id } });

    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        title,
        department,
        location,
        salary,
        status,
        questions: {
          create: questions.map((q) => ({ question: q })),
        },
      },
      include: { questions: true },
    });

    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update job', details: err.message });
  }
};

export const deleteJob = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.$transaction([
      prisma.question.deleteMany({ where: { jobId: id } }),
      prisma.job.delete({ where: { id } }),
    ]);
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete job', details: err.message });
  }
};


export const toggleJobStatus = async (req, res) => {
  const { id } = req.params;
  const validation = toggleStatusSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.flatten() });
  }

  try {
    const updatedJob = await prisma.job.update({
      where: { id },
      data: { status: validation.data.status },
    });
    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle status', details: err.message });
  }
};
