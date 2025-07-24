import prisma from '../utils/prisma.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        applications: {
          include: { job: true },
        },
      },
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get profile', error: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { name },
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

export const uploadOnsiteResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const upload = await uploadToCloudinary(req.file.buffer); // using buffer from memory storage
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { onsiteResumeUrl: upload.secure_url },
    });

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Resume upload failed', error: err.message });
  }
};
