import multer, { FileFilterCallback } from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import type { Request } from 'express';

// Créer le dossier de destination s'il n'existe pas
const avatarsDir = path.join(process.cwd(), 'uploads', 'avatars');
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    // Format : <userId>-<timestamp>.<ext>  – évite les collisions
    const userId = (req.params?.id ?? 'unknown');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${userId}-${Date.now()}${ext}`);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé. Formats acceptés : JPEG, PNG, WEBP, GIF'));
  }
};

export const uploadAvatarMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 Mo
  },
}).single('avatar');
