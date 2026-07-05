/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Smartphone, Gift, MapPin, Calendar, ArrowRight, Download, CheckCircle2, Ticket, Sparkles, MessageSquare } from 'lucide-react';

export default function AppDownloadBanner() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [isCouponClaimed, setIsCouponClaimed] = useState(false);

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setPhoneNumber('');
        alert('LINK ENVIADO! Verifique seu celular para fazer o download e aproveitar os benefícios.');
      }, 1500);
    }
  };

  const handleGenerateCoupon = () => {
    const codes = ['PROKEY15', 'CHAVE20OFF', 'SOCORRO10', 'BIOMETRIA25'];
    const randomCode = codes[Math.floor(Math.random() * codes.length)];
    setCouponCode(randomCode);
    setIsCouponClaimed(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Title & Concept Header */}
      <div className="text-center mb-12">
        <span className="bg-orange-100 text-orange-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
          ChaveiroPro Mobile App
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mt-3 font-sans tracking-tight">
          BAIXE NOSSO APLICATIVO EXCLUSIVO
        </h2>
        <p className="text-slate-500 mt-2 max-w-2xl mx-auto text-sm md:text-base">
          Acompanhe seu atendimento em tempo real, agende serviços programados e garanta cupons de descontos imperdíveis na palma da sua mão.
        </p>
      </div>

      {/* Main Promo Banner Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden border border-slate-700/30">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full filter blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full filter blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          
          {/* Left Column: Core Value Propositions */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            <div>
              <span className="text-emerald-400 text-xs font-bold font-mono tracking-widest uppercase block mb-2">
                ⚡ TUDO EM UM ÚNICO LUGAR
              </span>
              <h3 className="text-2xl md:text-3.5xl font-black leading-tight">
                Mais segurança, praticidade e economia para você e sua família.
              </h3>
            </div>

            {/* Features Row Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Feature 1 */}
              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 shrink-0">
                  <Gift size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Cupons de Descontos</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Ative cupons exclusivos de até 25% OFF para cópias de chaves, trocas de segredos ou novas fechaduras digitais.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Rastreamento em Tempo Real</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Acompanhe o trajeto do chaveiro parceiro pelo mapa GPS no app e saiba exatamente o horário de chegada do profissional.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Agenda de Serviços</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Marque visitas técnicas para horários convenientes de forma rápida, sem filas e com confirmação imediata.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Histórico & Garantias</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Consulte os recibos digitais emitidos, ordem de serviço e os prazos de garantia de todas as cópias de chaves realizadas.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Section: Link Dispatcher */}
            <div className="bg-white/5 border border-white/15 rounded-2xl p-5 md:p-6 space-y-4 max-w-xl">
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Receba o link de download direto no celular
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Enviaremos gratuitamente um SMS ou WhatsApp com o link seguro para download nas lojas de aplicativo.
                </p>
              </div>

              <form onSubmit={handleSendLink} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Ex: (11) 99999-9999"
                  id="app-link-phone"
                  className="bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 flex-1"
                />
                <button
                  type="submit"
                  id="send-link-btn"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                >
                  {isSubmitted ? 'Enviando...' : 'Enviar Link'}
                  <ArrowRight size={13} />
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Visual Interface Mimic & Interactive Coupon */}
          <div className="lg:col-span-5 flex flex-col gap-6 items-center">
            
            {/* Visual Screen Mimic Card: Live App Status */}
            <div className="w-full max-w-sm bg-slate-900 border border-slate-700/50 rounded-2xl p-4 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-mono tracking-wider text-slate-400">STATUS DO ATENDIMENTO</span>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                  Em Andamento
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-xs font-bold text-white">Chaveiro: Marcos Silva</h5>
                    <p className="text-[10px] text-slate-400">Cód. Técnico: #CP-8742</p>
                  </div>
                  <span className="text-xs font-extrabold text-orange-400">ETA: 8 min</span>
                </div>

                {/* Progress Visual Tracker */}
                <div className="space-y-1.5 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>Chamado Aceito</span>
                    <span className="text-emerald-400 font-bold">Deslocamento</span>
                    <span>No Local</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-2/3 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Tracking Details Info block */}
                <div className="flex gap-2.5 items-center text-[10px] text-slate-300">
                  <MapPin size={12} className="text-emerald-400 shrink-0" />
                  <span className="truncate">Rua Pamplona, 1024 - Jardim Paulista</span>
                </div>
              </div>
            </div>

            {/* Interactive Coupon Generator Card */}
            <div className="w-full max-w-sm bg-gradient-to-tr from-amber-500/15 via-orange-500/5 to-transparent border-2 border-dashed border-orange-500/30 rounded-2xl p-4 text-center space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-1 bg-orange-500 text-white rounded-bl-xl font-bold text-[8px] tracking-widest uppercase">
                EXCLUSIVO APP
              </div>
              
              <div className="w-10 h-10 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center mx-auto">
                <Ticket size={20} />
              </div>

              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Cupom de Desconto Inicial
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Clique no botão abaixo para gerar seu cupom de 15% OFF de boas-vindas.
                </p>
              </div>

              {isCouponClaimed ? (
                <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl animate-scale-up">
                  <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold block mb-1">
                    CÓDIGO GERADO COM SUCESSO!
                  </span>
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-sm font-mono font-black text-white tracking-widest bg-slate-900 border border-slate-700 px-3 py-1 rounded">
                      {couponCode}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(couponCode);
                        alert('Código do cupom copiado para a área de transferência! Use-o no momento de solicitar o atendimento.');
                      }}
                      type="button"
                      id="copy-coupon-btn"
                      className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-[9px] px-2 py-1.5 rounded uppercase cursor-pointer"
                    >
                      Copiar
                    </button>
                  </div>
                  <span className="text-[8px] text-slate-500 block mt-1.5">
                    Válido por 30 dias para qualquer serviço de chaveiro.
                  </span>
                </div>
              ) : (
                <button
                  onClick={handleGenerateCoupon}
                  type="button"
                  id="generate-coupon-btn"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1"
                >
                  <Sparkles size={12} />
                  Garantir Cupom de 15%
                </button>
              )}
            </div>

            {/* Platform Badges Row */}
            <div className="flex items-center gap-4 pt-2">
              {/* Play Store Badge Simulation */}
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 transition-all rounded-xl px-4 py-2.5 cursor-pointer max-w-44">
                <Download size={16} className="text-emerald-400 shrink-0" />
                <div className="text-left">
                  <span className="text-[9px] text-slate-400 block -mb-0.5 leading-none">DISPONÍVEL NO</span>
                  <span className="text-xs font-bold text-white">Google Play</span>
                </div>
              </div>

              {/* App Store Badge Simulation */}
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 transition-all rounded-xl px-4 py-2.5 cursor-pointer max-w-44">
                <Smartphone size={16} className="text-orange-400 shrink-0" />
                <div className="text-left">
                  <span className="text-[9px] text-slate-400 block -mb-0.5 leading-none">BAIXAR NA</span>
                  <span className="text-xs font-bold text-white">App Store</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
