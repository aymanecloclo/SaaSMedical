import { useState, useRef } from "react";
import axios from "axios";
import { getImageUrl } from "../../lib/getImageUrl";
export default function ImageUpload({ onUploadSuccess, photoActuelle }) {
const [preview, setPreview] =
  (useState < string) | (null > (getImageUrl(photoActuelle) || null));
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);
  const inputRef = useRef(null);

  // Quand l'utilisateur sélectionne un fichier
  const handleFichierChange = async (e) => {
    const fichier = e.target.files[0];
    if (!fichier) return;

    // 1. Afficher le preview immédiatement (avant même l'upload)
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(fichier);

    // 2. Envoyer au backend
    await uploaderImage(fichier);
  };

  const uploaderImage = async (fichier) => {
    setChargement(true);
    setErreur(null);

    try {
      // FormData — obligatoire pour envoyer un fichier
      const formData = new FormData();
      formData.append("fichier", fichier);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5047/api/upload/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // 3. Appeler le callback avec l'URL retournée par le backend
      onUploadSuccess(response.data.url);
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors de l'upload");
      setPreview(photoActuelle || null);
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Zone de preview / placeholder */}
      <div
        onClick={() => inputRef.current.click()}
        className="relative w-32 h-32 rounded-full border-2 border-dashed border-blue-300 
                   cursor-pointer hover:border-blue-500 transition-all overflow-hidden
                   bg-blue-50 flex items-center justify-center"
      >
        {preview ? (
          <img
            src={preview}
            alt="Photo praticien"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center text-blue-400 p-2">
            <div className="text-3xl mb-1">📷</div>
            <div className="text-xs">Cliquer pour ajouter une photo</div>
          </div>
        )}

        {/* Overlay de chargement */}
        {chargement && (
          <div
            className="absolute inset-0 bg-black bg-opacity-50 
                          flex items-center justify-center"
          >
            <div
              className="w-6 h-6 border-2 border-white border-t-transparent 
                            rounded-full animate-spin"
            />
          </div>
        )}
      </div>

      {/* Bouton changer photo */}
      {preview && !chargement && (
        <button
          type="button"
          onClick={() => inputRef.current.click()}
          className="text-xs text-blue-600 hover:underline"
        >
          Changer la photo
        </button>
      )}

      {/* Message d'erreur */}
      {erreur && <p className="text-xs text-red-500 text-center">{erreur}</p>}

      {/* Input fichier caché */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFichierChange}
        className="hidden"
      />

      <p className="text-xs text-gray-400">JPG, PNG ou WEBP · Max 5MB</p>
    </div>
  );
}
