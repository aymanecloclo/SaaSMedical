import { useState, useRef } from "react";
import { Camera } from "lucide-react";
import api from "../../lib/api";

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  photoActuelle?: string;
}

export function ImageUpload({ onUploadSuccess, photoActuelle }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(photoActuelle || null);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFichierChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fichier = e.target.files?.[0];
    if (!fichier) return;

    // Preview immédiat avant upload
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(fichier);

    // Upload vers le backend
    setChargement(true);
    setErreur(null);

    try {
      const formData = new FormData();
      formData.append("fichier", fichier);

      const response = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onUploadSuccess(response.data.url);
    } catch (err: any) {
      setErreur(err.response?.data?.message || "Erreur upload");
      setPreview(photoActuelle || null);
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        onClick={() => inputRef.current?.click()}
        className="relative w-24 h-24 rounded-full border-2 border-dashed 
                   border-primary/40 cursor-pointer hover:border-primary 
                   transition-all overflow-hidden bg-primary/5 
                   flex items-center justify-center group"
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Photo profil"
              className="w-full h-full object-cover"
            />
            {/* Overlay hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 
                            group-hover:opacity-100 transition-opacity 
                            flex items-center justify-center">
              <Camera size={20} className="text-white" />
            </div>
          </>
        ) : (
          <div className="text-center text-primary/60 p-2">
            <Camera size={24} className="mx-auto mb-1" />
            <span className="text-xs">Photo</span>
          </div>
        )}

        {/* Spinner chargement */}
        {chargement && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent 
                            rounded-full animate-spin" />
          </div>
        )}
      </div>

      <span className="text-xs text-gray-400">
        {preview ? "Cliquer pour changer" : "Photo de profil (optionnel)"}
      </span>

      {erreur && <p className="text-xs text-red-500">{erreur}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFichierChange}
        className="hidden"
      />
    </div>
  );
}