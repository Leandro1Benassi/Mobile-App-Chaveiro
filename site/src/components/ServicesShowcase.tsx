/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Key, ShieldCheck, Car, HelpCircle, Lock, Timer, Sparkles, Star } from 'lucide-react';

interface ServiceDetail {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  detail: string;
  averageTime: string;
  guarantee: string;
  icon: React.ReactNode;
  tags: string[];
}

export default function ServicesShowcase() {
  const [activeTab, setActiveTab] = useState<string>('blanks');

  const services: Record<string, ServiceDetail> = {
    blanks: {
      id: 'blanks',
      title: 'Chaves Blanks / Residenciais',
      subtitle: 'Precisão Centesimal para sua Casa',
      description: 'Cópias rápidas e precisas de chaves Yale comuns, Tetra e Multiponto. Utilizamos blanks importados de altíssima liga de latão.',
      detail: 'Nossas fresadoras eletrônicas escaneiam o perfil de sua chave original e realizam o corte micrométrico, reduzindo as chances de emperrar na fechadura a zero.',
      averageTime: '3 a 5 minutos',
      guarantee: '1 ano contra defeitos de fabricação',
      icon: <Key className="text-amber-500 w-8 h-8" />,
      tags: ['Yale', 'Tetra', 'Multiponto', 'Cadeados']
    },
    automotivas: {
      id: 'automotivas',
      title: 'Chaves Automotivas',
      subtitle: 'Cópia & Codificação Ágil',
      description: 'Cópia de chaves pantográficas e comuns para carros e motos de todas as marcas com materiais resistentes de padrão de montadora.',
      detail: 'Equipamentos modernos que geram o talhado perfeito da lâmina pantográfica, garantindo acionamento suave na ignição e nas portas do veículo.',
      averageTime: '15 a 20 minutos',
      guarantee: '6 meses contra desgaste natural',
      icon: <Car className="text-sky-500 w-8 h-8" />,
      tags: ['Pantográfica', 'Motos', 'Nacionais', 'Importados']
    },
    codificadas: {
      id: 'codificadas',
      title: 'Automotivas Codificadas',
      subtitle: 'Tecnologia Transponder de Ponta',
      description: 'Chaves canivete completas com telecomando integrado, programação de chip transponder e telecomandos presencias (Keyless).',
      detail: 'Realizamos o diagnóstico do imobilizador direto na central do carro via porta OBD, gerando o novo código criptografado com total segurança para seu veículo.',
      averageTime: '30 a 45 minutos',
      guarantee: '1 ano de garantia eletrônica',
      icon: <Sparkles className="text-emerald-500 w-8 h-8" />,
      tags: ['Canivete', 'Keyless', 'Presença', 'OBD Programação']
    },
    inteligentes: {
      id: 'inteligentes',
      title: 'Fechaduras Inteligentes',
      subtitle: 'Segurança Residencial Eletrônica',
      description: 'Fechaduras eletrônicas digitais com biometria facial/digital, teclado numérico por senha, tag NFC e integração de Smart Home.',
      detail: 'Consultoria completa para escolher o modelo adequado para o seu tipo de porta (madeira, vidro ou alumínio). Instalação limpa e configuração intuitiva.',
      averageTime: '1 a 2 horas',
      guarantee: '2 anos de garantia com assistência técnica',
      icon: <Lock className="text-orange-500 w-8 h-8" />,
      tags: ['Biometria', 'Senha', 'Smart Home', 'Instalação']
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16 bg-white rounded-3xl shadow-xs border border-slate-100">
      <div className="text-center mb-12">
        <span className="text-orange-600 font-extrabold text-xs uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">
          NOSSOS SERVIÇOS E PRODUTOS PROFISSIONAIS
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 mt-3 tracking-tight">
          Do atendimento de emergência à venda de produtos de alta segurança.
        </h2>
        <p className="text-slate-500 text-sm mt-2 max-w-2xl mx-auto">
          Clique nas categorias para explorar as especificações técnicas, garantias, tempos de entrega e diferenciais de nossa linha profissional de atendimento.
        </p>
      </div>

      {/* Symmetric Layout with Sidelinks and Central Interactive Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Services Navigation Cards */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {Object.values(services).map((srv) => {
              const isSelected = activeTab === srv.id;
              return (
                <button
                  key={srv.id}
                  onClick={() => setActiveTab(srv.id)}
                  type="button"
                  id={`service-nav-${srv.id}`}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 flex items-start gap-4 cursor-pointer hover:shadow-md ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-lg scale-[1.01]'
                      : 'bg-slate-50/60 border-slate-100 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-white/15 text-white' : 'bg-white shadow-2xs border border-slate-100'}`}>
                    {srv.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className={`text-sm font-extrabold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                      {srv.title}
                    </h3>
                    <p className={`text-xs mt-0.5 truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {srv.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {srv.tags.slice(0, 2).map((tg) => (
                        <span
                          key={tg}
                          className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${
                            isSelected ? 'bg-white/10 text-white' : 'bg-slate-200/60 text-slate-600'
                          }`}
                        >
                          {tg}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick info banner */}
          <div className="bg-orange-50/70 border border-orange-100 p-4 rounded-2xl flex items-center gap-3">
            <ShieldCheck className="text-orange-500 w-10 h-10 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-orange-800">Compromisso ChaveiroPro</h4>
              <p className="text-[11px] text-orange-700 leading-relaxed mt-0.5">
                Todas as cópias são testadas em cilindros calibrados antes da entrega para garantir funcionamento suave e sem travamentos.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Workbench Card (Beautiful visual representation) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl text-white p-6 md:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
          {/* Subtle geometric background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full filter blur-3xl opacity-30 -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-950 rounded-full filter blur-3xl opacity-20 -ml-10 -mb-10"></div>

          <div className="relative z-10">
            {/* Active service badge */}
            <div className="flex justify-between items-start border-b border-white/10 pb-5 mb-5">
              <div>
                <span className="text-emerald-400 text-xs font-bold font-mono tracking-widest uppercase">
                  ESPECIFICAÇÕES TÉCNICAS
                </span>
                <h3 className="text-2xl font-black mt-1 text-white">
                  {services[activeTab].title}
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  {services[activeTab].subtitle}
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl text-emerald-400 border border-white/10">
                {services[activeTab].icon}
              </div>
            </div>

            {/* Spec breakdown */}
            <div className="space-y-4">
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {services[activeTab].description}
              </p>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mt-2">
                <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider mb-1">Diferencial Operacional</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {services[activeTab].detail}
                </p>
              </div>

              {/* Timing & Guarantee Grid */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-800/50 border border-white/5 rounded-xl p-3 flex items-center gap-2.5">
                  <Timer className="text-amber-500 shrink-0" size={18} />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Tempo de Execução</span>
                    <span className="text-xs font-bold text-white">{services[activeTab].averageTime}</span>
                  </div>
                </div>
                <div className="bg-slate-800/50 border border-white/5 rounded-xl p-3 flex items-center gap-2.5">
                  <ShieldCheck className="text-emerald-400 shrink-0" size={18} />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Garantia Certificada</span>
                    <span className="text-xs font-bold text-white">{services[activeTab].guarantee}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Workbench visual mimicry (Virtual Keys Display) */}
          <div className="relative z-10 mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">MODELOS E PERFIS SUPORTADOS</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {services[activeTab].tags.map((tag) => (
                  <span key={tag} className="bg-emerald-500/10 text-emerald-300 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-500/20">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-1 shrink-0 text-amber-400">
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
              <span className="text-xs font-bold text-white ml-1">4.9 (240+ cópias)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
