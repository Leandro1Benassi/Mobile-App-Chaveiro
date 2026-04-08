import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. Definição do tipo Screen
export type Screen = 'login' | 'cadastro' | 'dashboard' | 'clientes' | 'produtos' | 'servicos' | 'copiaChave' | 'vendaDireta' | 'retirada' | 'retirada'; // Incluído 'cadastro'

export type UserRole = 'admin' | 'operador';

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
}

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  cpf?: string;
  email?: string;
  endereco?: string;
}

export interface Produto {
  id: string;
  nome: string;
  codigo: string;
  quantidadeEstoque: number;
  estoqueMinimo: number;
  imagemUrl?: string;
}

export interface Servico {
  id: string;
  nome: string;
  precoBase: number;
  duracaoEstimada: string;
}

export type StatusOrdem = 'pendente' | 'em_producao' | 'pronto' | 'retirado';

export interface OrdemServico {
  id: string;
  clienteId: string;
  chaveOriginal: string;
  produtoId: string;
  status: StatusOrdem;
  dataCriacao: string;
  dataAtualizacao: string;
  valor?: number;
  formaPagamento?: string;
  assinatura?: string;
}

export interface Venda {
  id: string;
  clienteId?: string;
  descricao: string;
  valor: number;
  formaPagamento: string;
  data: string;
  assinatura?: string;
}

interface AppContextType {
  currentUser: User | null;
  currentScreen: Screen; // Alterado para o tipo Screen
  clientes: Cliente[];
  produtos: Produto[];
  servicos: Servico[];
  ordens: OrdemServico[];
  vendas: Venda[];
  login: (email: string, senha: string) => boolean;
  cadastro: (newUser: Omit<User, 'id' | 'role'>, senha: string) => boolean; // <--- NOVO: Função para Cadastro
  logout: () => void;
  setCurrentScreen: (screen: Screen) => void; // Alterado para o tipo Screen
  addCliente: (cliente: Omit<Cliente, 'id'>) => void;
  updateCliente: (id: string, cliente: Partial<Cliente>) => void;
  deleteCliente: (id: string) => void;
  addProduto: (produto: Omit<Produto, 'id'>) => void;
  updateProduto: (id: string, produto: Partial<Produto>) => void;
  deleteProduto: (id: string) => void;
  addServico: (servico: Omit<Servico, 'id'>) => void;
  updateServico: (id: string, servico: Partial<Servico>) => void;
  deleteServico: (id: string) => void;
  addOrdem: (ordem: Omit<OrdemServico, 'id' | 'dataCriacao' | 'dataAtualizacao'>) => void;
  updateOrdem: (id: string, ordem: Partial<OrdemServico>) => void;
  addVenda: (venda: Omit<Venda, 'id' | 'data'>) => void;
  getClienteById: (id: string) => Cliente | undefined;
  getProdutoById: (id: string) => Produto | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Lista inicial de usuários (será gerenciada por estado)
const INITIAL_USERS: User[] = [
  { id: '1', nome: 'Administrador', email: 'admin@chavesalves.com', role: 'admin' },
  { id: '2', nome: 'Operador', email: 'operador@chavesalves.com', role: 'operador' },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [mockUsers, setMockUsers] = useState<User[]>(INITIAL_USERS); // Para permitir cadastros
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('login'); // Corrigido
  const [clientes, setClientes] = useState<Cliente[]>([]); // Corrigido para array
  const [produtos, setProdutos] = useState<Produto[]>([]); // Corrigido para array
  const [servicos, setServicos] = useState<Servico[]>([]); // Corrigido
  const [ordens, setOrdens] = useState<OrdemServico[]>([]); // Corrigido para array
  const [vendas, setVendas] = useState<Venda[]>([]); // Corrigido para array

  // Carregar dados do localStorage
  useEffect(() => {
    const savedClientes = localStorage.getItem('clientes');
    const savedProdutos = localStorage.getItem('produtos');
    const savedServicos = localStorage.getItem('servicos');
    const savedOrdens = localStorage.getItem('ordens');
    const savedVendas = localStorage.getItem('vendas');
    const savedMockUsers = localStorage.getItem('mockUsers');

    if (savedClientes) setClientes(JSON.parse(savedClientes));
    if (savedProdutos) setProdutos(JSON.parse(savedProdutos));
    if (savedServicos) setServicos(JSON.parse(savedServicos));
    if (savedOrdens) setOrdens(JSON.parse(savedOrdens));
    if (savedVendas) setVendas(JSON.parse(savedVendas));

    if (savedMockUsers) {
      setMockUsers(JSON.parse(savedMockUsers));
    } else {
      localStorage.setItem('mockUsers', JSON.stringify(INITIAL_USERS));
    }

    // Dados de exemplo se não houver dados salvos
    if (!savedClientes || JSON.parse(savedClientes).length === 0) {
      const exemploClientes: Cliente[] = [
        { id: '1', nome: 'João Silva', telefone: '(11) 99999-9999', cpf: '123.456.789-00' },
        { id: '2', nome: 'Maria Santos', telefone: '(11) 98888-8888', email: 'maria@email.com' },
        { id: '3', nome: 'Carlos Oliveira', telefone: '(11) 97777-7777', endereco: 'Rua das Flores, 123' },
      ];
      setClientes(exemploClientes);
      localStorage.setItem('clientes', JSON.stringify(exemploClientes));
    }

    if (!savedProdutos || JSON.parse(savedProdutos).length === 0) {
      const exemploProdutos: Produto[] = [
        { 
          id: '1', 
          nome: 'Chave de Carro Toyota', 
          codigo: 'CHV-001', 
          quantidadeEstoque: 10, 
          estoqueMinimo: 2 
        },
        { 
          id: '2', 
          nome: 'Chave de Porta Yale', 
          codigo: 'CHV-002', 
          quantidadeEstoque: 15, 
          estoqueMinimo: 5 
        },
      ];
      setProdutos(exemploProdutos);
      localStorage.setItem('produtos', JSON.stringify(exemploProdutos));
    }

    if (!savedServicos || JSON.parse(savedServicos).length === 0) {
      const exemploServicos: Servico[] = [
        { 
          id: '1', 
          nome: 'Cópia de Chave Simples', 
          precoBase: 25.00, 
          duracaoEstimada: '30 minutos' 
        },
        { 
          id: '2', 
          nome: 'Cópia de Chave Codificada', 
          precoBase: 150.00, 
          duracaoEstimada: '2 horas' 
        },
      ];
      setServicos(exemploServicos);
      localStorage.setItem('servicos', JSON.stringify(exemploServicos));
    }
  }, []);

  useEffect(() => {
    if (clientes.length > 0) localStorage.setItem('clientes', JSON.stringify(clientes));
  }, [clientes]);

  useEffect(() => {
    if (produtos.length > 0) localStorage.setItem('produtos', JSON.stringify(produtos));
  }, [produtos]);

  useEffect(() => {
    if (servicos.length > 0) localStorage.setItem('servicos', JSON.stringify(servicos));
  }, [servicos]);

  useEffect(() => {
    localStorage.setItem('ordens', JSON.stringify(ordens));
  }, [ordens]);

  useEffect(() => {
    localStorage.setItem('vendas', JSON.stringify(vendas));
  }, [vendas]);
  
  useEffect(() => {
    localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
  }, [mockUsers]);

  const login = (email: string, senha: string) => {
    // Usa mockUsers para login
    const user = mockUsers.find(u => u.email === email);
    if (user && senha === 'senha123') {
      setCurrentUser(user);
      setCurrentScreen('dashboard');
      return true;
    }
    return false;
  };

  // NOVO: Função para cadastro de novos usuários (apenas Operador para o protótipo)
  const cadastro = (newUser: Omit<User, 'id' | 'role'>, senha: string) => {
    if (mockUsers.some(u => u.email === newUser.email)) {
      return false; // Email já existe
    }

    // Regra: Novo usuário é sempre um Operador (pode ser ajustado pelo Admin depois)
    const newId = Date.now().toString();
    const registeredUser: User = {
      ...newUser,
      id: newId,
      role: 'operador' 
    };
    
    setMockUsers(prevUsers => [...prevUsers, registeredUser]);

    // Autentica o usuário automaticamente após o cadastro (para simplificar o fluxo)
    if (senha === 'senha123') { // Simulação, senhas reais seriam diferentes
      setCurrentUser(registeredUser);
      setCurrentScreen('dashboard');
      return true;
    }

    // Se a senha for diferente de 'senha123' na simulação (embora não devesse acontecer aqui)
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentScreen('login'); // Redireciona para o login após logout
  };

  const setCurrentScreenSafe = (screen: string) => {
    // Wrapper para garantir que o tipo Screen seja usado, embora o parâmetro seja string no TS
    setCurrentScreen(screen as Screen); 
  };

  const addCliente = (cliente: Omit<Cliente, 'id'>) => {
    const newCliente = {...cliente, id: Date.now().toString() };
    setClientes([...clientes, newCliente]);
  };

  const updateCliente = (id: string, cliente: Partial<Cliente>) => {
    setClientes(clientes.map(c => c.id === id ? { ...c, ...cliente } : c));
  };

  const deleteCliente = (id: string) => {
    setClientes(clientes.filter(c => c.id !== id));
  };

  const addProduto = (produto: Omit<Produto, 'id'>) => {
    const newProduto = {...produto, id: Date.now().toString() };
    setProdutos([...produtos, newProduto]);
  };

  const updateProduto = (id: string, produto: Partial<Produto>) => {
    setProdutos(produtos.map(p => p.id === id ? { ...p, ...produto } : p));
  };

  const deleteProduto = (id: string) => {
    setProdutos(produtos.filter(p => p.id !== id));
  };

  const addServico = (servico: Omit<Servico, 'id'>) => {
    const newServico = {...servico, id: Date.now().toString() };
    setServicos([...servicos, newServico]);
  };

  const updateServico = (id: string, servico: Partial<Servico>) => {
    setServicos(servicos.map(s => s.id === id ? { ...s, ...servico } : s));
  };

  const deleteServico = (id: string) => {
    setServicos(servicos.filter(s => s.id !== id));
  };

  const addOrdem = (ordem: Omit<OrdemServico, 'id' | 'dataCriacao' | 'dataAtualizacao'>) => {
    const newOrdem: OrdemServico = {
      ...ordem,
      id: Date.now().toString(),
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
    };
    setOrdens([...ordens, newOrdem]);

    const produto = produtos.find(p => p.id === ordem.produtoId);
    if (produto && produto.quantidadeEstoque > 0) {
      updateProduto(produto.id, { quantidadeEstoque: produto.quantidadeEstoque - 1 });
    }
  };

  const updateOrdem = (id: string, ordem: Partial<OrdemServico>) => {
    const updatedOrdem = {...ordem, dataAtualizacao: new Date().toISOString() };
    setOrdens(ordens.map(o => o.id === id ? {...o, ...updatedOrdem } : o));
  };

  const addVenda = (venda: Omit<Venda, 'id' | 'data'>) => {
    const newVenda: Venda = {
      ...venda,
      id: Date.now().toString(),
      data: new Date().toISOString(),
    };
    setVendas([...vendas, newVenda]);
  };

  const getClienteById = (id: string) => clientes.find(c => c.id === id);
  const getProdutoById = (id: string) => produtos.find(p => p.id === id);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentScreen,
        clientes,
        produtos,
        servicos,
        ordens,
        vendas,
        login,
        cadastro,
        logout,
        setCurrentScreen: setCurrentScreenSafe,
        addCliente,
        updateCliente,
        deleteCliente,
        addProduto,
        updateProduto,
        deleteProduto,
        addServico,
        updateServico,
        deleteServico,
        addOrdem,
        updateOrdem,
        addVenda,
        getClienteById,
        getProdutoById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}