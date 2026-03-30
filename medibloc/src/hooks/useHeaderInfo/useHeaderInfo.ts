import { useState, useEffect } from 'react';

export interface WeatherInfo {
  temp: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  description: string;
  city: string;
}

export interface NewsInfo {
  id: number | string;
  title: string;
  category: string;
}

// Données de secours (Fallback) - Réelles au 30 mars 2026
const FALLBACK_NEWS: NewsInfo[] = [
  { id: 'f1', title: 'Trésor public : Levée de 30 milliards FCFA prévue pour le 3 avril', category: 'Économie' },
  { id: 'f2', title: 'Robert Dussey : La stabilité régionale est indissociable de la sécurité de l\'AES', category: 'Diplomatie' },
  { id: 'f3', title: 'Rapport EBL 2026 : Le Togo consolide son cadre juridique sur l\'égalité économique', category: 'Société' },
  { id: 'f4', title: 'Lomé : Travaux de réhabilitation en cours à la Place de l\'Indépendance', category: 'Urbanisme' },
];

/**
 * Hook personnalisé pour gérer les infos du Header (Météo & Journal) via APIs Publiques
 */
export function useHeaderInfo() {
  const [weather, setWeather] = useState<WeatherInfo>({
    temp: 32,
    condition: 'cloudy',
    description: 'Nuageux',
    city: 'Lomé, Togo',
  });

  const [news, setNews] = useState<NewsInfo[]>(FALLBACK_NEWS);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Météo (wttr.in)
        const weatherPromise = fetch('https://wttr.in/Lome?format=j1')
          .then(res => res.json())
          .then(data => {
            const current = data.current_condition[0];
            const temp = parseInt(current.temp_C);
            const desc = current.lang_fr?.[0]?.value || current.weatherDesc[0].value;
            
            // Mapping des conditions vers nos icônes
            let condition: WeatherInfo['condition'] = 'cloudy';
            const descLower = desc.toLowerCase();
            if (descLower.includes('sun') || descLower.includes('soleil') || descLower.includes('clear') || descLower.includes('clair')) condition = 'sunny';
            else if (descLower.includes('rain') || descLower.includes('pluie') || descLower.includes('shower')) condition = 'rainy';
            else if (descLower.includes('storm') || descLower.includes('orage')) condition = 'stormy';

            setWeather({
              temp,
              condition,
              description: desc,
              city: 'Lomé, Togo'
            });
          })
          .catch(() => console.warn('Météo : Échec du fetch, utilisation du fallback.'));

        // 2. Fetch News (RSS de Savoir News via rss2json)
        const newsPromise = fetch('https://api.rss2json.com/v1/api.json?rss_url=https://savoirnews.net/feed')
          .then(res => res.json())
          .then(data => {
            if (data.status === 'ok' && data.items.length > 0) {
              const formattedNews = data.items.map((item: any, idx: number) => ({
                id: item.guid || idx,
                title: item.title,
                category: 'Info Togo'
              }));
              setNews(formattedNews);
            }
          })
          .catch(() => console.warn('News : Échec du fetch, utilisation du fallback.'));

        await Promise.allSettled([weatherPromise, newsPromise]);
      } catch (err) {
        console.error('Erreur globale HeaderInfo:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Rotation des news
  useEffect(() => {
    if (news.length === 0) return;
    
    const newsTimer = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % news.length);
    }, 6000);

    return () => clearInterval(newsTimer);
  }, [news.length]);

  return {
    weather,
    currentNews: news[currentNewsIndex] || FALLBACK_NEWS[0],
    loading,
  };
}
