/**
 * @file upload.middleware.ts
 * @description Configuration et instantiation du middleware Multer pour le televersement securise des avatars utilisateurs.
 * Applique le filtrage des types MIME d'images autorisees et la limitation stricte de taille a 2 Mo.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import multer, { FileFilterCallback } from "multer";
import path from "node:path";
import fs from "node:fs";
import type { Request } from "express";

const avatarsDir = path.join(process.cwd(), "uploads", "avatars");

const dirExists = fs.existsSync(avatarsDir);
const dirActionMap: Record<string, () => void> = {
  true: () => {},
  false: () => fs.mkdirSync(avatarsDir, { recursive: true }),
};
dirActionMap[String(dirExists)]();

const storage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    cb(null, avatarsDir);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const userId = req.params.id || "unknown";
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${userId}-${Date.now()}${ext}`);
  },
});

const allowedMimeTypes = new Set<string>([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  const isAllowed = allowedMimeTypes.has(file.mimetype);

  const filterActionMap: Record<string, () => void> = {
    true: () => cb(null, true),
    false: () =>
      cb(
        new Error(
          "Type de fichier non autorise. Formats acceptes : JPEG, PNG, WEBP, GIF",
        ),
      ),
  };

  filterActionMap[String(isAllowed)]();
};

export const uploadAvatarMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
}).single("avatar");

export default uploadAvatarMiddleware;
