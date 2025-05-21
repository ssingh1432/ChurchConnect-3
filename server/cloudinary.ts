import { v2 as cloudinary } from 'cloudinary';
import { Request, Response } from 'express';
import multer from 'multer';
import { storage as dbStorage } from './storage';
import { JwtPayload } from './auth';

// Configure cloudinary - these values would ideally come from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true
});

// Configure multer for memory storage (needed for Cloudinary upload)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Middleware for handling file uploads
export const uploadMiddleware = upload.single('file');

// Upload file to Cloudinary
export const uploadToCloudinary = async (req: Request & { user?: JwtPayload }, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    // Get file details from request
    const { originalname, buffer, mimetype } = req.file;
    const { title, type, tags } = req.body;

    // Convert buffer to base64
    const base64String = buffer.toString('base64');
    const base64File = `data:${mimetype};base64,${base64String}`;

    // Determine folder based on file type
    let folder = 'church/misc';
    if (mimetype.startsWith('image')) {
      folder = 'church/images';
    } else if (mimetype.startsWith('video')) {
      folder = 'church/videos';
    } else if (mimetype.startsWith('audio')) {
      folder = 'church/audio';
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64File, {
      folder,
      resource_type: 'auto',
      public_id: `${Date.now()}-${originalname.split('.')[0]}`,
    });

    // Save media asset to database
    const mediaAsset = await dbStorage.createMediaAsset({
      title: title || originalname,
      type: type || (mimetype.startsWith('image') ? 'image' : 
                    mimetype.startsWith('video') ? 'video' : 
                    mimetype.startsWith('audio') ? 'audio' : 'document'),
      url: result.secure_url,
      publicId: result.public_id,
      tags: tags ? tags.split(',') : [],
      uploadedBy: req.user.id
    });

    res.status(201).json({ mediaAsset, cloudinaryData: result });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ message: 'Error uploading file to Cloudinary' });
  }
};

// Delete file from Cloudinary
export const deleteFromCloudinary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Get the media asset from database
    const mediaAsset = await dbStorage.getMediaAsset(parseInt(id));
    if (!mediaAsset) {
      res.status(404).json({ message: 'Media asset not found' });
      return;
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(mediaAsset.publicId, {
      resource_type: mediaAsset.type === 'video' ? 'video' : 
                      mediaAsset.type === 'audio' ? 'video' : 'image',
    });

    // Delete from database
    await dbStorage.deleteMediaAsset(parseInt(id));

    res.status(200).json({ message: 'Media asset deleted successfully' });
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    res.status(500).json({ message: 'Error deleting file from Cloudinary' });
  }
};
