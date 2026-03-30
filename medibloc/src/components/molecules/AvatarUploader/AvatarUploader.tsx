import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiCamera, FiTrash2, FiLoader, FiUser, FiX, FiAlertCircle } from 'react-icons/fi';
import { FILE_BASE_URL } from '../../../utils/api/api';
import { useNotification } from '../../../hooks';
import { useUsers } from '../../../hooks/useUsers/useUsers';

interface AvatarUploaderProps {
  userId: number;
  currentAvatarUrl?: string;
  onAvatarUpdated: (newUrl: string) => void;
  onAvatarDeleted: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'h-12 w-12 text-xs',
  md: 'h-20 w-20 text-sm',
  lg: 'h-32 w-32 text-base',
  xl: 'h-40 w-40 text-lg',
};

const iconSizes = {
  sm: 14,
  md: 20,
  lg: 24,
  xl: 28,
};

/**
 * AvatarUploader - A component to display, upload, and delete user profile pictures.
 */
export function AvatarUploader({
  userId,
  currentAvatarUrl,
  onAvatarUpdated,
  onAvatarDeleted,
  size = 'md',
}: AvatarUploaderProps) {
  const { uploadAvatar, deleteAvatar, loading } = useUsers();
  const { addNotification } = useNotification();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getFullUrl = (url?: string) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${FILE_BASE_URL}${url}`;
  };

  const displayUrl = previewUrl || getFullUrl(currentAvatarUrl);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    if (file.size > 2 * 1024 * 1024) {
      addNotification('error', 'Le fichier est trop volumineux (max 2 Mo)');
      return;
    }

    if (!file.type.startsWith('image/')) {
      addNotification('error', 'Seules les images sont autorisées');
      return;
    }

    // Local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const res = await uploadAvatar(userId, file);
      if (res?.avatarUrl) {
        onAvatarUpdated(res.avatarUrl);
        addNotification('success', 'Photo de profil mise à jour');
      }
    } catch (err) {
      console.error(err);
      addNotification('error', "Échec de l'upload de l'image");
      setPreviewUrl(null); // Reset preview on error
    }
  };

  const handleDeleteClick = () => {
    if (!currentAvatarUrl && !previewUrl) return;
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteAvatar(userId);
      setPreviewUrl(null);
      onAvatarDeleted();
      addNotification('success', 'Photo de profil supprimée');
    } catch (err) {
      console.error(err);
      addNotification('error', 'Échec de la suppression');
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative group inline-block">
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700 flex items-center justify-center relative shadow-xl transition-all group-hover:border-blue-500/50`}
      >
        {displayUrl ? (
          <img src={displayUrl} alt="Avatar" className="h-full w-full object-cover" />
        ) : (
          <span className="font-bold text-slate-500 select-none"> <FiUser size={iconSizes[size]} /> </span>
        )}

        {loading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
            <FiLoader className="animate-spin text-white" size={iconSizes[size]} />
          </div>
        )}
      </div>

      <div className="absolute -bottom-1 -right-1 flex gap-1">
        <button
          onClick={triggerFileInput}
          disabled={loading}
          className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
          title="Modifier la photo"
        >
          <FiCamera size={14} />
        </button>
        {(currentAvatarUrl || previewUrl) && (
          <button
            onClick={handleDeleteClick}
            disabled={loading}
            className="p-1.5 bg-slate-700 hover:bg-red-600 text-white rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
            title="Supprimer la photo"
          >
            <FiTrash2 size={14} />
          </button>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="surface w-full max-w-xs p-6 space-y-6 shadow-2xl relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Accent Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-red-500 to-orange-500" />
            
            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              <div className="p-3 bg-red-500/10 rounded-full text-red-500">
                <FiAlertCircle size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Supprimer ?</h3>
                <p className="text-xs text-slate-400">Voulez-vous vraiment retirer votre photo de profil ?</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <FiX />
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-lg shadow-red-900/20"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
