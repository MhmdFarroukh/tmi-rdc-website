import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { Reveal } from '../components/ui/Reveal';

type VideoItem = {
  title: string;
  subtitle: string;
  video: string; // youtube embed url
  img: string;   // thumbnail
};

const videoIdFromEmbed = (embedUrl: string) => {
  // works for: https://www.youtube.com/embed/<ID>?...
  const m = embedUrl.match(/youtube\.com\/embed\/([^?]+)/i);
  return m?.[1] ?? '';
};

export const NewsPage: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // ✅ your real videos (same as your Home page)
  const VIDEO_NEWS: VideoItem[] = useMemo(() => {
    const embeds = [
      {
        title:
          "PROJET DE CONSTRUCTION USINES & DEPOTS. Boulevard Lumumba (16ème rue - Limete), Kinshasa - RD CONGO",
        subtitle: "Boulevard Lumumba (16ème rue - Limete), Kinshasa - RD CONGO",
        video: "https://www.youtube.com/embed/E8lpVGR6k1M?wmode=opaque",
      },
      {
        title: "AVANCEMENT PROJET CONSTRUCTION",
        subtitle: "USINES & DEPOTS - Suivi de chantier",
        video: "https://www.youtube.com/embed/4lO0RkZV2jk?wmode=opaque",
      },
      {
        title: "TMI PROJET DE CONSTRUCTION USINES & DEPOTS",
        subtitle: "Boulevard Lumumba (16ème rue - Limete), Kinshasa - RD CONGO",
        video: "https://www.youtube.com/embed/eflUFbEJ7Tg?wmode=opaque",
      },
      {
        title: "AVANCEMENT PROJET CONSTRUCTION",
        subtitle: "USINES & DEPOTS - Suivi de chantier",
        video: "https://www.youtube.com/embed/QQYS9ExmK7o?wmode=opaque",
      },
    ];

    return embeds.map((v) => {
      const id = videoIdFromEmbed(v.video);
      return {
        ...v,
        img: id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '',
      };
    });
  }, []);

  return (
    <div className="pt-32 min-h-screen pb-24 bg-white text-black">
      <div className="container mx-auto px-6">
        <Reveal effect="mask">
          <h1 className="text-[10vw] font-display font-bold uppercase leading-[0.85] mb-24 tracking-tighter">
            Actualités <br /> <span className="text-gray-300">& Vidéos</span>
          </h1>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {VIDEO_NEWS.map((item, idx) => (
            <motion.button
              key={idx}
              whileHover={{ y: -10 }}
              className="group text-left"
              onClick={() => setActiveVideo(item.video)}
              type="button"
            >
              <div className="relative aspect-video overflow-hidden bg-black mb-6 shadow-2xl">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 group-hover:bg-safety-orange group-hover:border-safety-orange transition-all duration-300">
                    <Play fill="currentColor" className="text-white ml-1 w-6 h-6 md:w-8 md:h-8" />
                  </div>
                </div>

                <div className="absolute top-4 left-4">
                  <div className="bg-white p-1 rounded-sm">
                    <span className="text-[10px] font-bold text-black tracking-tighter">TMI-RDC</span>
                  </div>
                </div>
              </div>

              <div className="border-l-2 border-gray-200 pl-6 group-hover:border-safety-orange transition-colors duration-300">
                <h3 className="text-xl md:text-2xl font-display font-bold uppercase leading-tight mb-2 group-hover:text-safety-orange transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm font-mono uppercase tracking-wide">{item.subtitle}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ✅ Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 10 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                onClick={() => setActiveVideo(null)}
                type="button"
                aria-label="Close video"
              >
                <X className="text-white" size={18} />
              </button>

              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src={activeVideo}
                  title="TMI Video"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
