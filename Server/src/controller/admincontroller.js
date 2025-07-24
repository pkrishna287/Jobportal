import prisma from '../utils/prisma.js';

export const getAdminStats = async (req, res) => {
  try {
    const totalJobs = await prisma.job.count();
    const activeJobs = await prisma.job.count({ where: { status: 'ACTIVE' } });
    const closedJobs = await prisma.job.count({ where: { status: 'CLOSED' } });

    const jobsWithApplications = await prisma.job.findMany({
      select: {
        id: true,
        title: true,
        _count: {
          select: { applications: true },
        },
      },
    });

    const applicationsPerJob = jobsWithApplications.map((job) => ({
      jobId: job.id,
      title: job.title,
      totalApplications: job._count.applications,
    }));

    res.status(200).json({
      totalJobs,
      activeJobs,
      closedJobs,
      applicationsPerJob,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin stats', details: err.message });
  }
};
