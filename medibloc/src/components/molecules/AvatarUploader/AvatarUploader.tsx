import React, { useState, useRef } from 'react';
import { FiCamera, FiTrash2, FiLoader } from 'react-icons/fi';
import { API_BASE_URL } from '../../../utils/api/api';
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

  const getFullUrl = (url?: string) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
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

  const handleDelete = async () => {
    if (!currentAvatarUrl && !previewUrl) return;
    
    if (confirm('Voulez-vous supprimer votre photo de profil ?')) {
      try {
        await deleteAvatar(userId);
        setPreviewUrl(null);
        onAvatarDeleted();
        addNotification('success', 'Photo de profil supprimée');
      } catch (err) {
        console.error(err);
        addNotification('error', 'Échec de la suppression');
      }
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
          <span className="font-bold text-slate-500 select-none">?</span>
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
            onClick={handleDelete}
            disabled={loading}
            className="p-1.5 bg-slate-700 hover:bg-red-600 text-white rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
            title="Supprimer la photo"
          >
            <FiTrash2 size={14} />
          </button>
        )}
      </div>

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
