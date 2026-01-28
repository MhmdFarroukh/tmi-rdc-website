import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const STATS = [
    { label: "HANGARS", value: 75 },
    { label: "REMORQUES", value: 93 },
    { label: "RESERVOIRS", value: 42 },
    { label: "DEPOTS", value: 83 },
    { label: "BENNES", value: 52 },
    { label: "CITERNES", value: 77 },
];

const ProgressBar: React.FC<{ label: string; value: number }> = ({ label, value }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    return (
        <div ref={ref} className="group mb-12">
            <div className="flex justify-between items-end mb-4">
                <span className="text-lg md:text-xl font-display font-bold uppercase tracking-wider text-white group-hover:text-safety-orange transition-colors duration-300">{label}</span>
                <span className="text-sm font-mono text-gray-400">{value}%</span>
            </div>
            <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${value}%` } : { width: 0 }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                    className="absolute top-0 left-0 h-full bg-safety-orange"
                />
            </div>
        </div>
    )
}

export const ProductionStats: React.FC = () => {
    return (
        <section className="bg-forge-dark text-white py-32 md:py-48 border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start mb-24">
                    <div className="max-w-2xl">
                         <h2 className="text-[8vw] md:text-6xl font-display font-bold uppercase leading-none tracking-tighter mb-8">
                            Production <br/> <span className="text-stroke-white text-transparent">En Cours</span>
                        </h2>
                        <p className="text-gray-400 text-lg font-light">
                            Suivi en temps réel de nos lignes de production. La transparence industrielle au service de votre planification.
                        </p>
                    </div>
                    
                    <div className="hidden md:block text-right pt-4">
                       <div className="inline-block border border-white/20 px-6 py-2 rounded-full">
                           <div className="flex items-center gap-2">
                               <span className="relative flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-safety-orange opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-safety-orange"></span>
                                </span>
                               <span className="font-mono text-xs uppercase tracking-widest">Système Actif</span>
                           </div>
                       </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-8">
                     {STATS.map((stat, i) => (
                         <ProgressBar key={i} label={stat.label} value={stat.value} />
                     ))}
                </div>
            </div>
        </section>
    );
};