/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Phone,
  Key,
  Lock,
  Shield,
  MapPin,
  Clock,
  Menu,
  X,
  CheckCircle2,
  AlertTriangle,
  Instagram,
  Facebook,
  Youtube,
  Send,
  Star,
  ExternalLink,
  Smartphone,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import AppDownloadBanner from './components/AppDownloadBanner';
import ServicesShowcase from './components/ServicesShowcase';
import Testimonials from './components/Testimonials';

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyLocation, setEmergencyLocation] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [emergencySubmitted, setEmergencySubmitted] = useState(false);
  
  // Quote Form State
  const [quoteName, setQuoteName] = useState('');
  const [quotePhone, setQuotePhone] = useState('');
  const [quoteService, setQuoteService] = useState('Cópia de Chave Residencial');
  const [quoteLocation, setQuoteLocation] = useState('Zona Sul - SP');
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  // Auto close alerts/toasts
  useEffect(() => {
    if (quoteSubmitted) {
      const timer = setTimeout(() => setQuoteSubmitted(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [quoteSubmitted]);

  const handleEmergencySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmergencySubmitted(true);
    // Simulate dispatcher trigger
    setTimeout(() => {
      setIsEmergencyModalOpen(false);
      setEmergencySubmitted(false);
      alert('SOCORRO ENVIADO! Um chaveiro especializado foi acionado e está a caminho. Entraremos em contato em instantes.');
    }, 2500);
  };

  const handleShareLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocating(false);
          setEmergencyLocation(
            `Lat: ${position.coords.latitude.toFixed(4)}, Lon: ${position.coords.longitude.toFixed(4)} (Localização Precisa)`
          );
        },
        () => {
          setIsLocating(false);
          setEmergencyLocation('São Paulo - Centro (Localização via IP aproximada)');
        }
      );
    } else {
      setIsLocating(false);
      setEmergencyLocation('Geolocalização não suportada pelo navegador.');
    }
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitted(true);
    // Clear form
    setQuoteName('');
    setQuotePhone('');
  };

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* HEADER / NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand exactly like ChaveiroPro */}
          <div 
            onClick={() => scrollToSection('home')} 
            className="flex items-center gap-2 cursor-pointer group"
            id="brand-logo"
          >
            <div className="bg-gradient-to-tr from-orange-500 to-amber-500 text-white p-2 rounded-xl shadow-md shadow-orange-500/10 transition-transform group-hover:scale-105">
              <Key size={22} className="rotate-45" />
            </div>
            <div>
              <span className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-1 uppercase">
                CHAVEIRO<span className="text-orange-500">PRO</span>
                <span className="text-xs bg-amber-400 text-slate-900 font-extrabold px-1.5 py-0.5 rounded ml-0.5 shadow-2xs">24H</span>
              </span>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider -mt-1 font-bold">SEGURANÇA IMEDIATA</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              type="button"
              id="nav-link-home"
              className="text-sm font-extrabold text-slate-700 hover:text-orange-500 transition-colors cursor-pointer"
            >
              HOME
            </button>
            <button
              onClick={() => scrollToSection('servicos')}
              type="button"
              id="nav-link-servicos"
              className="text-sm font-extrabold text-slate-700 hover:text-orange-500 transition-colors cursor-pointer"
            >
              SERVIÇOS
            </button>
            <button
              onClick={() => scrollToSection('catalogo')}
              type="button"
              id="nav-link-catalogo"
              className="text-sm font-extrabold text-slate-700 hover:text-orange-500 transition-colors cursor-pointer"
            >
              BAIXAR APP
            </button>
            <button
              onClick={() => scrollToSection('sobre')}
              type="button"
              id="nav-link-sobre"
              className="text-sm font-extrabold text-slate-700 hover:text-orange-500 transition-colors cursor-pointer"
            >
              SOBRE NÓS
            </button>
            <button
              onClick={() => scrollToSection('contato')}
              type="button"
              id="nav-link-contato"
              className="text-sm font-extrabold text-slate-700 hover:text-orange-500 transition-colors cursor-pointer"
            >
              CONTATO
            </button>
          </nav>

          {/* Emergency SOS Trigger Button */}
          <div className="hidden lg:block">
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              type="button"
              id="header-emergency-btn"
              className="bg-orange-500 hover:bg-orange-600 text-white font-black text-xs tracking-wider px-5 py-3 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-600/30 transition-all uppercase flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Phone size={14} className="animate-bounce" />
              Chamada de Emergência
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            type="button"
            id="mobile-menu-toggle"
            className="md:hidden p-2 text-slate-700 hover:text-orange-500 transition-colors cursor-pointer"
            title="Abrir Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 bg-white border-b border-slate-200 z-40 p-4 shadow-xl animate-fade-in">
          <div className="flex flex-col space-y-3.5">
            <button
              onClick={() => scrollToSection('home')}
              type="button"
              id="mobile-nav-home"
              className="text-left font-extrabold text-slate-700 py-1.5 hover:text-orange-500 cursor-pointer"
            >
              HOME
            </button>
            <button
              onClick={() => scrollToSection('servicos')}
              type="button"
              id="mobile-nav-servicos"
              className="text-left font-extrabold text-slate-700 py-1.5 hover:text-orange-500 cursor-pointer"
            >
              SERVIÇOS
            </button>
            <button
              onClick={() => scrollToSection('catalogo')}
              type="button"
              id="mobile-nav-catalogo"
              className="text-left font-extrabold text-slate-700 py-1.5 hover:text-orange-500 cursor-pointer"
            >
              BAIXAR APP
            </button>
            <button
              onClick={() => scrollToSection('sobre')}
              type="button"
              id="mobile-nav-sobre"
              className="text-left font-extrabold text-slate-700 py-1.5 hover:text-orange-500 cursor-pointer"
            >
              SOBRE NÓS
            </button>
            <button
              onClick={() => scrollToSection('contato')}
              type="button"
              id="mobile-nav-contato"
              className="text-left font-extrabold text-slate-700 py-1.5 hover:text-orange-500 cursor-pointer"
            >
              CONTATO
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsEmergencyModalOpen(true);
              }}
              type="button"
              id="mobile-nav-emergency"
              className="w-full bg-orange-500 text-white font-extrabold text-center py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Phone size={14} />
              CHAMADA DE EMERGÊNCIA
            </button>
          </div>
        </div>
      )}

      {/* HERO SECTION - BLUE THEME EXACTLY LIKE THE DESIGN GRAPHIC */}
      <section 
        id="home" 
        className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-16 md:py-24 overflow-hidden"
      >
        {/* Abstract key overlay on background to match UI aesthetics */}
        <div className="absolute top-10 right-10 text-slate-700/10 pointer-events-none select-none transform rotate-12">
          <Key size={400} />
        </div>
        <div className="absolute bottom-10 left-5 text-emerald-800/10 pointer-events-none select-none transform -rotate-45">
          <Lock size={250} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <div className="inline-flex items-center gap-1.5 bg-orange-500/15 border border-orange-500/30 text-orange-400 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-6 animate-pulse">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
            Disponível Agora - São Paulo e Região
          </div>

          {/* High-impact header title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-white max-w-4xl mx-auto">
            ATENDIMENTO <span className="text-orange-400">24 HORAS:</span>
            <br />
            <span className="bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
              SEU CHAVEIRO DE CONFIANÇA.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base md:text-lg mt-4 max-w-2xl mx-auto font-medium">
            Rápido, Confiável e Sempre Disponível. Socorro Técnico de Urgência em Segundos para Residências, Comércios e Automóveis.
          </p>

          {/* Big highlighted phone number */}
          <div className="my-8 md:my-12">
            <a 
              href="tel:11993936536"
              id="hero-phone-number-link"
              className="inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 px-8 py-4 rounded-3xl border border-white/15 hover:border-orange-500/40 text-3xl sm:text-4xl md:text-5xl font-black text-orange-400 transition-all duration-300 group shadow-2xl"
            >
              <span className="text-white group-hover:scale-105 transition-transform font-bold">(11)</span>
              <span className="font-extrabold tracking-tight">99393-6536</span>
              <Phone className="text-white animate-bounce shrink-0" size={28} />
            </a>
          </div>

          {/* Dual Action CTAs from UI design */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            
            {/* Urgent SOS trigger */}
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              type="button"
              id="hero-sos-btn"
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-black text-sm px-7 py-4 rounded-2xl shadow-xl shadow-orange-500/35 hover:shadow-orange-600/40 transition-all duration-300 flex items-center justify-between sm:justify-center gap-4 cursor-pointer active:scale-98"
            >
              <div className="flex items-center gap-2">
                <Phone size={18} />
                <span className="tracking-wide">SOLICITAR ATENDIMENTO IMEDIATO</span>
              </div>
              <span className="bg-black/20 text-[10px] font-black px-2 py-0.5 rounded">SOS</span>
            </button>

            {/* Catalog direct scroll */}
            <button
              onClick={() => scrollToSection('catalogo')}
              type="button"
              id="hero-catalog-scroll-btn"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm px-7 py-4 rounded-2xl shadow-xl shadow-emerald-600/25 hover:shadow-emerald-700/35 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Smartphone size={16} />
              <span>BAIXAR NOSSO APLICATIVO</span>
            </button>

          </div>

          {/* Quick guarantee tags */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 md:gap-12 text-slate-400 text-xs font-semibold uppercase tracking-wider border-t border-white/10 pt-8 max-w-3xl mx-auto">
            <div className="flex items-center gap-1.5">
              <Shield className="text-orange-500" size={14} />
              <span>Atendimento 100% Seguro</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="text-emerald-500" size={14} />
              <span>Chegada em até 20 minutos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="text-amber-500" size={14} />
              <span>Orçamento gratuito sem compromisso</span>
            </div>
          </div>

        </div>
      </section>

      {/* "NOSSOS SERVIÇOS E PRODUTOS" SECTION */}
      <section id="servicos" className="py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ServicesShowcase />
        </div>
      </section>

      {/* "BAIXAR APLICATIVO EXCLUSIVO" PORTAL SECTION */}
      <section id="catalogo" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AppDownloadBanner />
        </div>
      </section>

      {/* "O QUE NOSSOS CLIENTES DIZEM" SECTION */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Testimonials />
        </div>
      </section>

      {/* ABOUT US SECTION */}
      <section id="sobre" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest block mb-2">SOBRE NÓS</span>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">CONHEÇA O CHAVEIROPRO</h2>
          <p className="text-slate-500 text-sm mt-3 max-w-2xl mx-auto leading-relaxed">
            Nascido em São Paulo com a missão de modernizar a profissão de chaveiro, o <strong>ChaveiroPro</strong> une atendimento técnico de excelência à inovação tecnológica. Não somos apenas socorristas de fechaduras; entregamos segurança digitalizada e confiabilidade incomparável.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 text-left">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-2xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                <Shield size={20} />
              </div>
              <h4 className="text-sm font-extrabold text-slate-800 uppercase">Segurança Total</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Profissionais rigorosamente selecionados, com antecedentes certificados, fardados e identificados para sua total segurança.
              </p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-2xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <Clock size={20} />
              </div>
              <h4 className="text-sm font-extrabold text-slate-800 uppercase">Agilidade Extrema</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Roteamento inteligente de técnicos mais próximos à sua geolocalização, minimizando o tempo de espera no frio ou no perigo.
              </p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-2xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4">
                <Key size={20} />
              </div>
              <h4 className="text-sm font-extrabold text-slate-800 uppercase">Tecnologia Digital</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Equipamentos de clonagem OBD de última geração e fechaduras inteligentes controladas diretamente pelo seu celular.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER & INTEGRATED QUOTE FORM - EXACTLY LIKE BOTTOM PANELS */}
      <footer id="contato" className="bg-slate-900 text-white pt-20 pb-10 relative overflow-hidden">
        
        {/* Absolute design accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full filter blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full filter blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left side: Logo & Info details matching Left footer */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-tr from-orange-500 to-amber-500 text-white p-2.5 rounded-xl">
                  <Key size={24} className="rotate-45" />
                </div>
                <div>
                  <span className="text-2xl font-black text-white tracking-tight flex items-center gap-1 uppercase">
                    CHAVEIRO<span className="text-orange-400">PRO</span>
                  </span>
                  <p className="text-[10px] text-slate-400 font-mono tracking-wider -mt-1 font-bold">SEGURANÇA IMEDIATA</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                <strong>Chaveiro Pro</strong> - Cópia de chaves, instalação de fechaduras eletrônicas, codificação automotiva e socorro emergencial 24h com faturamento digital imediato.
              </p>

              {/* Contacts info details from the mock UI text */}
              <div className="space-y-3.5 text-xs text-slate-400">
                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-bold">Localização Sede</p>
                    <p>Rua Estácio de Sá, 556 - Pinheiros, São Paulo - SP, CEP: 05424-010</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Phone size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-bold">Telefone Principal & WhatsApp</p>
                    <a href="tel:11993936536" className="hover:text-emerald-300 transition-colors">
                      +55 (11) 99393-6536
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-bold">Horário de Atendimento</p>
                    <p>Atendimento 24 horas por dia, 7 dias por semana (inclusive feriados).</p>
                  </div>
                </div>
              </div>

              {/* Social profiles row */}
              <div className="pt-2 flex items-center space-x-4">
                <a
                  href="https://instagram.com/chaveiropro"
                  target="_blank"
                  rel="noreferrer"
                  id="social-link-instagram"
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-orange-500 hover:text-white text-slate-300 transition-all flex items-center justify-center border border-slate-700/60"
                  title="Instagram"
                >
                  <Instagram size={16} />
                </a>
                <a
                  href="https://facebook.com/chaveiropro"
                  target="_blank"
                  rel="noreferrer"
                  id="social-link-facebook"
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-orange-500 hover:text-white text-slate-300 transition-all flex items-center justify-center border border-slate-700/60"
                  title="Facebook"
                >
                  <Facebook size={16} />
                </a>
                <a
                  href="https://youtube.com/chaveiropro"
                  target="_blank"
                  rel="noreferrer"
                  id="social-link-youtube"
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-orange-500 hover:text-white text-slate-300 transition-all flex items-center justify-center border border-slate-700/60"
                  title="YouTube"
                >
                  <Youtube size={16} />
                </a>
              </div>

            </div>

            {/* Right side: SOLICITE UM ORÇAMENTO OU ATENDIMENTO Form Panel exactly as displayed in UI */}
            <div className="lg:col-span-7 bg-slate-800/80 border border-slate-700/40 rounded-3xl p-6 md:p-8 shadow-xl">
              <span className="text-[10px] text-orange-400 font-extrabold uppercase tracking-widest font-mono">
                RAPIDEZ E EFICIÊNCIA
              </span>
              <h3 className="text-xl font-black text-white mt-1 uppercase tracking-tight">
                SOLICITE UM ORÇAMENTO OU ATENDIMENTO
              </h3>
              <p className="text-slate-400 text-xs mt-1 mb-6 leading-relaxed">
                Preencha os campos abaixo para receber uma estimativa imediata de valores para o seu serviço de chaveiro ou solicitar socorro emergencial.
              </p>

              {quoteSubmitted ? (
                /* Success notification */
                <div className="bg-emerald-500/10 border-2 border-emerald-500/20 text-emerald-300 p-6 rounded-2xl text-center space-y-3 animate-fade-in" id="quote-success-toast">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white">Solicitação Recebida com Sucesso!</h4>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1">
                      Nossa central já recebeu seu pedido de orçamento para <strong>{quoteService}</strong> na localização de <strong>{quoteLocation}</strong>. Um técnico especializado entrará em contato via ligação ou WhatsApp em até 5 minutos!
                    </p>
                  </div>
                  <button
                    onClick={() => setQuoteSubmitted(false)}
                    type="button"
                    id="new-quote-request-btn"
                    className="text-xs text-emerald-400 font-bold hover:underline cursor-pointer"
                  >
                    Fazer nova solicitação
                  </button>
                </div>
              ) : (
                /* Active Form matching visual fields */
                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name input */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300 block uppercase font-mono">Seu Nome:</label>
                      <input
                        type="text"
                        required
                        value={quoteName}
                        onChange={(e) => setQuoteName(e.target.value)}
                        placeholder="Nome completo"
                        id="footer-form-name"
                        className="w-full bg-slate-900/50 text-xs text-white px-3.5 py-3 rounded-xl border border-slate-700 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 placeholder-slate-500 transition-all"
                      />
                    </div>
                    {/* Phone input */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300 block uppercase font-mono">Telefone (DDD + Celular):</label>
                      <input
                        type="tel"
                        required
                        value={quotePhone}
                        onChange={(e) => setQuotePhone(e.target.value)}
                        placeholder="(11) 99999-9999"
                        id="footer-form-phone"
                        className="w-full bg-slate-900/50 text-xs text-white px-3.5 py-3 rounded-xl border border-slate-700 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 placeholder-slate-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Service selection */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300 block uppercase font-mono">Qual o Serviço?</label>
                      <select
                        value={quoteService}
                        onChange={(e) => setQuoteService(e.target.value)}
                        id="footer-form-service"
                        className="w-full bg-slate-900/50 text-xs text-white px-3 py-3 rounded-xl border border-slate-700 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all cursor-pointer"
                      >
                        <option value="Cópia de Chave Residencial" className="bg-slate-800 text-white">Cópia de Chave Residencial</option>
                        <option value="Cópia de Chave Tetra" className="bg-slate-800 text-white">Cópia de Chave Tetra</option>
                        <option value="Abertura de Porta Emergencial 24h" className="bg-slate-800 text-white">Abertura de Porta Emergencial (24h)</option>
                        <option value="Codificação de Chave Canivete Automotiva" className="bg-slate-800 text-white">Chave Canivete Automotiva</option>
                        <option value="Instalação de Fechadura Digital" className="bg-slate-800 text-white">Instalação de Fechadura Digital</option>
                        <option value="Abertura de Cofre" className="bg-slate-800 text-white">Abertura de Cofre / Gaveteiro</option>
                      </select>
                    </div>

                    {/* Location selection */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300 block uppercase font-mono">Sua Localização:</label>
                      <select
                        value={quoteLocation}
                        onChange={(e) => setQuoteLocation(e.target.value)}
                        id="footer-form-location"
                        className="w-full bg-slate-900/50 text-xs text-white px-3 py-3 rounded-xl border border-slate-700 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all cursor-pointer"
                      >
                        <option value="Zona Sul - SP" className="bg-slate-800 text-white">Zona Sul (Moema, Pinheiros, Itaim, etc)</option>
                        <option value="Zona Oeste - SP" className="bg-slate-800 text-white">Zona Oeste (Lapa, Perdizes, Pompeia, etc)</option>
                        <option value="Zona Central - SP" className="bg-slate-800 text-white">Zona Central (Bela Vista, Paulista, Centro)</option>
                        <option value="Zona Norte - SP" className="bg-slate-800 text-white">Zona Norte (Santana, Tucuruvi, etc)</option>
                        <option value="Zona Leste - SP" className="bg-slate-800 text-white">Zona Leste (Tatuapé, Mooca, Anália Franco)</option>
                        <option value="Outras Regiões / Grande SP" className="bg-slate-800 text-white">Outras Cidades (ABC, Alphaville, Guarulhos)</option>
                      </select>
                    </div>
                  </div>

                  {/* Submit budget request button (Orange in the mockup) */}
                  <button
                    type="submit"
                    id="submit-quote-btn"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-wider py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-orange-500/25 active:scale-98"
                  >
                    <Send size={12} />
                    ENVIAR SOLICITAÇÃO AGORA
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Subfooter bottom details */}
          <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500">
            <p className="text-center md:text-left">
              &copy; {new Date().getFullYear()} ChaveiroPro Limitada. CNPJ: 24.582.492/0001-92. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 font-medium">
              <a href="#termos" className="hover:text-slate-300 transition-colors">Termos de Uso</a>
              <a href="#privacidade" className="hover:text-slate-300 transition-colors">Política de Privacidade</a>
              <a href="#certificado" className="hover:text-slate-300 transition-colors flex items-center gap-1">
                <span>Certificado de Segurança</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>

        </div>
      </footer>

      {/* THE EMERGENCY 24H POPUP MODAL (HIGH FIDELITY ADDITION FOR THE URGENT BUTTONS) */}
      {isEmergencyModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in" id="emergency-modal">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 relative shadow-2xl border border-rose-100 overflow-hidden text-slate-800">
            {/* Danger background flashing stripe */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-orange-500 via-rose-500 to-orange-500 animate-pulse"></div>

            <button
              onClick={() => setIsEmergencyModalOpen(false)}
              type="button"
              id="close-emergency-modal-btn"
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer hover:bg-slate-100"
              title="Fechar"
            >
              <X size={20} />
            </button>

            <div className="flex items-start gap-4 mt-2">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="animate-bounce" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase">SOCORRO CHAVEIRO 24 HORAS</h3>
                <p className="text-slate-500 text-xs leading-relaxed mt-1">
                  Atendimento de emergência acionado prioritariamente. Despachamos um técnico de plantão equipado de imediato.
                </p>
              </div>
            </div>

            {emergencySubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto animate-spin">
                  <Key size={24} />
                </div>
                <h4 className="font-bold text-sm text-slate-700">Enviando socorro emergencial...</h4>
                <p className="text-xs text-slate-400">Roteando técnico disponível mais próximo do seu endereço.</p>
              </div>
            ) : (
              <form onSubmit={handleEmergencySubmit} className="mt-6 space-y-4">
                
                {/* Emergency phone */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase font-mono">Seu Celular / WhatsApp:</label>
                  <input
                    type="tel"
                    required
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    id="emergency-modal-phone"
                    className="w-full bg-slate-50 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 font-bold"
                  />
                </div>

                {/* Emergency Location (supports geosharing) */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-400 block uppercase font-mono">Endereço de Atendimento:</label>
                    <button
                      type="button"
                      onClick={handleShareLocation}
                      id="share-location-btn"
                      className="text-[10px] text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <MapPin size={10} />
                      {isLocating ? 'Obtendo GPS...' : 'Compartilhar GPS'}
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={emergencyLocation}
                    onChange={(e) => setEmergencyLocation(e.target.value)}
                    placeholder="Ex: Rua Pamplona, 1000 - Apto 42 - Jardim Paulista"
                    id="emergency-modal-location"
                    className="w-full bg-slate-50 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                {/* Dispatch Info */}
                <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl flex items-start gap-2.5 text-[11px] text-rose-800 leading-normal">
                  <Clock size={16} className="shrink-0 mt-0.5" />
                  <p>
                    <strong>Estimativa de Chegada:</strong> 15 a 25 minutos. Taxa de deslocamento e abertura residencial simples a partir de R$ 80,00 dependendo da fechadura.
                  </p>
                </div>

                {/* Submit button */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEmergencyModalOpen(false)}
                    id="cancel-emergency-btn"
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer text-center"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    id="confirm-emergency-btn"
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-3 rounded-xl text-xs transition-colors shadow-md shadow-rose-600/20 hover:shadow-rose-700/35 cursor-pointer text-center"
                  >
                    SOLICITAR AGORA
                  </button>
                </div>
              </form>
            )}

            {/* Quick direct phone link inside modal */}
            <div className="mt-5 pt-4 border-t border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 block font-mono">OU FAÇA LIGAÇÃO DIRETA DE VOZ</span>
              <a 
                href="tel:11993936536"
                id="modal-direct-phone-call"
                className="text-base font-black text-rose-600 hover:underline flex items-center justify-center gap-1.5 mt-1"
              >
                <Phone size={14} />
                Ligar para (11) 99393-6536
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
