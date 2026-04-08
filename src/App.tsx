// App.tsx
import { useApp } from './context/AppContext';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { CadastroUser } from './components/CadastroUser';
import { CadastroClientes } from './components/CadastroClientes';
import { CadastroProdutos } from './components/CadastroProdutos';
import { CadastroServicos } from './components/CadastroServicos';
import { CopiaChave } from './components/CopiaChave';
import { VendaDireta } from './components/VendaDireta';
import { Retirada } from './components/Retirada';

function AppContent() {
  const { currentUser, currentScreen } = useApp();

  // NOVO FLUXO: Se o usuário NÃO está logado, ele só pode ver o Login ou o Cadastro.
  if (!currentUser) {
    switch (currentScreen) {
      case 'cadastro': // <--- Permite acessar a tela de Cadastro antes do login
        return <CadastroUser />;
      default:
        return <Login />; // Qualquer outro estado, cai no Login
    }
  }

  // FLUXO PARA USUÁRIOS AUTENTICADOS (currentUser existe)
  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard />;
      case 'clientes':
        return <CadastroClientes />;
      case 'produtos':
        return <CadastroProdutos />;
      case 'servicos':
        return <CadastroServicos />;
      case 'copiaChave':
        return <CopiaChave />;
      case 'vendaDireta':
        return <VendaDireta />;
      case 'retirada':
        return <Retirada />;
      // Note que 'cadastro' não precisa estar aqui, pois é uma tela pré-autenticação.
      default:
        return <Dashboard />; // Tela padrão após login
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderScreen()}
    </div>
  );
}

export default AppContent;