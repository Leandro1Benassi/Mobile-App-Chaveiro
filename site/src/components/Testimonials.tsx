/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star, CheckCircle, ShieldAlert } from 'lucide-react';
import { Testimonial } from '../types';

const CLIENT_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Leandro Benassi',
    role: 'Cliente Residencial (Pinheiros)',
    rating: 5,
    text: 'Fiquei trancado para fora do meu apartamento às 2h da manhã de um domingo. Chamei o ChaveiroPro pelo botão de emergência e eles chegaram em menos de 15 minutos! O técnico abriu a porta rapidamente, sem danificar a fechadura, e com um preço muito justo. Recomendo de olhos fechados!',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
    date: 'Ontem'
  },
  {
    id: '2',
    name: 'Bárbara Camargo',
    role: 'Proprietária de Chevrolet Onix',
    rating: 5,
    text: 'Precisei de uma cópia da chave canivete do meu Onix porque perdi a reserva. Na concessionária me cobraram uma fortuna e pediram 10 dias. O ChaveiroPro fez na hora, codificou o chip transponder e me entregou a chave testada e funcionando perfeitamente em 25 minutos. Atendimento excepcional!',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    date: 'Há 3 dias'
  },
  {
    id: '3',
    name: 'Estevão Bezerra',
    role: 'Síndico do Condomínio Harmonia',
    rating: 5,
    text: 'Contratamos para a instalação de fechaduras eletrônicas biométricas na academia e nas áreas comuns do condomínio. O trabalho foi executado com maestria, pontualidade e organização. Eles nos deram treinamento completo e suporte para cadastrar as digitais dos moradores. Nota 10.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    date: 'Há 1 semana'
  },
  {
    id: '4',
    name: 'Priscila Vasconcelos',
    role: 'Empresária (Zona Sul)',
    rating: 5,
    text: 'A fechadura tetra da minha loja travou no final do expediente. O atendimento foi super prestativo por telefone, enviaram um chaveiro imediatamente que resolveu o problema e ainda trocou o miolo por um de alta segurança. Profissionais extremamente confiáveis e educados.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80',
    date: 'Há 2 semanas'
  }
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? CLIENT_TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === CLIENT_TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const active = CLIENT_TESTIMONIALS[activeIndex];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-16">
      {/* Title block */}
      <div className="text-center mb-10">
        <span className="text-xs font-bold text-slate-400 font-mono tracking-widest uppercase block mb-1">
          AVALIAÇÕES DE QUEM CONFIA
        </span>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
          O QUE NOSSOS CLIENTES DIZEM
        </h2>
        <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto">
          Confira o relato de clientes reais que precisaram de cópias urgentes ou serviços de chaveiro programados.
        </p>
      </div>

      {/* Main slider card container */}
      <div className="relative bg-gradient-to-br from-slate-50 to-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-xl overflow-hidden">
        {/* Decorative Quote Icon on background */}
        <Quote className="absolute right-6 top-6 w-32 h-32 text-slate-100/75 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
          {/* Avatar Area */}
          <div className="flex flex-col items-center shrink-0">
            <div className="relative">
              <img
                src={active.avatarUrl}
                alt={active.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-xs">
                <CheckCircle size={12} fill="currentColor" className="text-white" />
              </div>
            </div>
            <div className="flex items-center gap-0.5 mt-3">
              {[...Array(active.rating)].map((_, i) => (
                <Star key={i} size={14} fill="#F59E0B" className="text-amber-500" />
              ))}
            </div>
            <span className="text-[10px] text-slate-400 font-medium font-mono mt-1.5 uppercase">
              Cliente Verificado
            </span>
          </div>

          {/* Testimonial review text */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-slate-700 text-sm md:text-base leading-relaxed italic font-sans font-medium">
              "{active.text}"
            </p>
            <div className="mt-5">
              <h4 className="text-base font-extrabold text-slate-800">{active.name}</h4>
              <p className="text-xs text-slate-500 font-medium">{active.role}</p>
              <span className="text-[10px] text-slate-400 font-mono block mt-1">Avaliado: {active.date}</span>
            </div>
          </div>
        </div>

        {/* Carousel indicators & triggers */}
        <div className="flex items-center justify-between border-t border-slate-100 mt-8 pt-5">
          <div className="flex space-x-1.5">
            {CLIENT_TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                type="button"
                id={`carousel-dot-${idx}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeIndex ? 'w-6 bg-slate-800' : 'w-2 bg-slate-300/80 hover:bg-slate-400'
                }`}
                title={`Ver avaliação ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handlePrev}
              type="button"
              id="testimonial-prev-btn"
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors shadow-xs cursor-pointer hover:border-slate-300"
              title="Anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              type="button"
              id="testimonial-next-btn"
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors shadow-xs cursor-pointer hover:border-slate-300"
              title="Próximo"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Trust badge footer of the reviews section */}
      <div className="text-center mt-6 flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
        <CheckCircle size={14} className="text-emerald-500" />
        <span>Empresa cadastrada e certificada. Mais de 10 anos de mercado.</span>
      </div>
    </div>
  );
}
