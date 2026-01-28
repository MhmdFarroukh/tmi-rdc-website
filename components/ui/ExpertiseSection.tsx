import React from 'react';
import { motion } from 'framer-motion';
import { Reveal } from './Reveal';
import { ParallaxImage } from './ParallaxImage';
import { ArrowUpRight } from 'lucide-react';

export const ExpertiseSection: React.FC = () => {
  return (
    <section className="py-32 md:py-48 bg-forge-light text-black overflow-hidden relative">
        <div className="container mx-auto px-6">
            {/* Header */}
            <div className="mb-24">
                <Reveal effect="text-reveal">
                    <span className="text-safety-orange font-mono text-xs uppercase tracking-widest mb-4 block">
                        Bureau d'Études
                    </span>
                </Reveal>
                <Reveal effect="mask">
                    <h2 className="text-[8vw] leading-[0.9] font-display font-bold uppercase tracking-tighter">
                        Expertise & <br/> Ingénierie
                    </h2>
                </Reveal>
            </div>

            {/* Split Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
                
                {/* Text Column */}
                <div className="relative">
                    <Reveal effect="fade-up">
                        <div className="border-l-2 border-black/10 pl-8 mb-12">
                            <p className="text-2xl md:text-3xl font-display font-light leading-snug">
                                "La précision commence bien avant la soudure. Notre bureau d'études conçoit les solutions de demain."
                            </p>
                        </div>
                    </Reveal>
                    
                    <div className="space-y-8">
                        <Reveal effect="fade-up" delay={0.2}>
                            <div>
                                <h3 className="text-xl font-bold uppercase mb-2 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-safety-orange rounded-full"/>
                                    Calcul de Structure
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                    Utilisation des logiciels de pointe pour la simulation des charges et la résistance des matériaux, garantissant sécurité et optimisation des coûts.
                                </p>
                            </div>
                        </Reveal>
                        
                        <Reveal effect="fade-up" delay={0.3}>
                            <div>
                                <h3 className="text-xl font-bold uppercase mb-2 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-black rounded-full"/>
                                    Modélisation 3D
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                    Visualisation complète des projets (BIM) permettant une préfabrication précise et un assemblage rapide sur site.
                                </p>
                            </div>
                        </Reveal>

                        <Reveal effect="fade-up" delay={0.4}>
                            <a href="#contact" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-safety-orange hover:border-safety-orange transition-colors mt-8">
                                Consulter nos experts <ArrowUpRight size={16} />
                            </a>
                        </Reveal>
                    </div>
                </div>

                {/* Image Column */}
                <div className="relative">
                     {/* Decorative background grid */}
                     <div className="absolute -inset-4 border border-black/5 z-0" />
                     <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-black/20" />
                     <div className="absolute bottom-0 left-0 w-24 h-24 border-b border-l border-black/20" />
                     
                     <ParallaxImage 
                        src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop" 
                        alt="Ingénierie TMI" 
                        aspectRatio="aspect-[4/5]"
                        className="w-full grayscale contrast-125 z-10 shadow-2xl"
                     />
                     
                     {/* Floating Badge */}
                     <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="absolute bottom-8 right-[-2rem] bg-black text-white p-6 shadow-xl z-20 hidden md:block"
                     >
                         <div className="text-4xl font-display font-bold text-safety-orange">15+</div>
                         <div className="text-xs font-mono uppercase tracking-widest mt-1">Ingénieurs Qualifiés</div>
                     </motion.div>
                </div>
            </div>
        </div>
    </section>
  );
};