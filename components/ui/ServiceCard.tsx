import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { ServiceItem } from '../../types';

interface ServiceCardProps {
  service: ServiceItem;
  index: number;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative block h-[400px] w-full overflow-hidden bg-forge-gray"
    >
      {/* Image with zoom effect */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src={service.image} 
          alt={service.title} 
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 grayscale group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forge-dark/90 via-forge-dark/40 to-transparent" />
      </div>

      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-white/30 transition-colors group-hover:border-safety-orange" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-white/30 transition-colors group-hover:border-safety-orange" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-8 translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-safety-orange text-xs font-bold uppercase tracking-widest mb-2 block">Service 0{index + 1}</span>
            <h3 className="text-3xl font-display font-bold text-white mb-2 uppercase">{service.title}</h3>
            <p className="text-slate-300 text-sm max-w-xs line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
              {service.description}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-safety-orange group-hover:border-safety-orange transition-all duration-300">
            <ArrowUpRight size={20} className="transform group-hover:rotate-45 transition-transform duration-300" />
          </div>
        </div>
        
        {/* Animated Underline */}
        <div className="w-full h-0.5 bg-white/10 mt-6 overflow-hidden">
          <div className="w-full h-full bg-safety-orange -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />
        </div>
      </div>
    </motion.div>
  );
};