// Le backend renvoie des URLs relatives (ex: "/uploads/xxx.jpg").
// On les complète avec l'origine du backend pour qu'elles s'affichent
// correctement, que ce soit en dev local ou en Docker.

// On réutilise la même logique que lib/api.ts, mais SANS le suffixe "/api"
const API_ORIGIN =
  import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") ??
  "http://localhost:5047";

export function getImageUrl(
  url: string | null | undefined,
): string | undefined {
  if (!url) return undefined;

  // Si c'est déjà une URL complète (http://...), on ne touche à rien
  if (url.startsWith("http")) return url;

  // Sinon on préfixe avec l'origine du backend
  return `${API_ORIGIN}${url}`;
}
