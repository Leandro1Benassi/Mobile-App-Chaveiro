import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Bell,
  Database,
  KeyRound,
  Lock,
  Palette,
  Save,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';


interface SettingsState {
  notificacoes: boolean;
  alertasEstoque: boolean;
  confirmacaoRetirada: boolean;
  tema: 'claro' | 'escuro' | 'sistema';
  bloqueioAutomatico: string;
}

const DEFAULT_SETTINGS: SettingsState = {
  notificacoes: true,
  alertasEstoque: true,
  confirmacaoRetirada: true,
  tema: 'claro',
  bloqueioAutomatico: '15',
};

function ToggleRow({
  icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-gray-800">{title}</p>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-12 h-7 rounded-full p-1 transition-colors flex-shrink-0 ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}
        aria-pressed={checked}
      >
        <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

export function Configuracoes() {
  const { setCurrentScreen, currentUser } = useApp();
  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem('appSettings');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    if (savedMessage) setSavedMessage('');
  };

  const saveSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    setSavedMessage('Configurações salvas com sucesso.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentScreen('dashboard')} className="p-2 hover:bg-blue-700 rounded-lg">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1>Configurações</h1>
            <p className="text-blue-100 mt-1">Preferências do aplicativo</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-lg p-4 shadow flex items-center gap-4">
          <Logo size="small" variant="dark" />
          <div>
            <p className="text-gray-800">Chaves Alves</p>
            <p className="text-gray-500 text-sm">{currentUser?.email}</p>
          </div>
        </div>

        <section className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-gray-800 mb-2">Operação</h2>
          <ToggleRow
            icon={<Bell className="w-5 h-5" />}
            title="Notificações"
            description="Receber avisos importantes do sistema."
            checked={settings.notificacoes}
            onChange={(checked) => updateSetting('notificacoes', checked)}
          />
          <ToggleRow
            icon={<Database className="w-5 h-5" />}
            title="Alertas de estoque"
            description="Destacar produtos abaixo do estoque mínimo."
            checked={settings.alertasEstoque}
            onChange={(checked) => updateSetting('alertasEstoque', checked)}
          />
          <ToggleRow
            icon={<ShieldCheck className="w-5 h-5" />}
            title="Confirmar retirada"
            description="Exigir confirmação antes de finalizar pedidos."
            checked={settings.confirmacaoRetirada}
            onChange={(checked) => updateSetting('confirmacaoRetirada', checked)}
          />
        </section>

        <section className="bg-white rounded-lg p-4 shadow space-y-4">
          <h2 className="text-gray-800">Aparência e segurança</h2>

          <label className="block text-gray-700">
            <span className="flex items-center gap-2 mb-2">
              <Palette className="w-5 h-5 text-blue-600" />
              Tema
            </span>
            <select
              value={settings.tema}
              onChange={(e) => updateSetting('tema', e.target.value as SettingsState['tema'])}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="claro">Claro</option>
              <option value="escuro">Escuro</option>
              <option value="sistema">Padrão do sistema</option>
            </select>
          </label>

          <label className="block text-gray-700">
            <span className="flex items-center gap-2 mb-2">
              <Lock className="w-5 h-5 text-blue-600" />
              Bloqueio automático
            </span>
            <select
              value={settings.bloqueioAutomatico}
              onChange={(e) => updateSetting('bloqueioAutomatico', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="5">Após 5 minutos</option>
              <option value="15">Após 15 minutos</option>
              <option value="30">Após 30 minutos</option>
              <option value="0">Nunca</option>
            </select>
          </label>
        </section>

        <section className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-gray-800 mb-3">Acesso</h2>
          <button
            type="button"
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <KeyRound className="w-5 h-5" />
            Alterar senha
          </button>
        </section>

        {savedMessage && (
          <div className="bg-green-50 text-green-700 border border-green-200 rounded-lg px-4 py-3">
            {savedMessage}
          </div>
        )}

        <button
          type="button"
          onClick={saveSettings}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Salvar Configurações
        </button>
      </div>
    </div>
  );
}
