import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { login as loginApi } from "../services/authService";

// =========================
// TIPOS
// =========================

export type Screen =
  | "login"
  | "cadastro"
  | "dashboard"
  | "clientes"
  | "produtos"
  | "servicos"
  | "copiaChave"
  | "vendaDireta"
  | "retirada";

export type UserRole = "admin" | "operador" | "user";

export interface User {
  id: string;
  nome: string;
  email: string;
  nivel: UserRole;
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

export type StatusOrdem = "pendente" | "em_producao" | "pronto" | "retirado";

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

// =========================
// CONTEXT TYPE
// =========================

interface AppContextType {
  currentUser: User | null;

  currentScreen: Screen;

  isAuthenticated: boolean;

  isAdmin: boolean;

  isOperador: boolean;

  hasPermission: (niveis: UserRole[]) => boolean;

  clientes: Cliente[];

  produtos: Produto[];

  servicos: Servico[];

  ordens: OrdemServico[];

  vendas: Venda[];

  login: (email: string, senha: string) => Promise<boolean>;

  logout: () => void;

  setCurrentScreen: (screen: Screen) => void;

  addCliente: (cliente: Omit<Cliente, "id">) => void;

  updateCliente: (id: string, cliente: Partial<Cliente>) => void;

  deleteCliente: (id: string) => void;

  addProduto: (produto: Omit<Produto, "id">) => void;

  updateProduto: (id: string, produto: Partial<Produto>) => void;

  deleteProduto: (id: string) => void;

  addServico: (servico: Omit<Servico, "id">) => void;

  updateServico: (id: string, servico: Partial<Servico>) => void;

  deleteServico: (id: string) => void;

  addOrdem: (
    ordem: Omit<OrdemServico, "id" | "dataCriacao" | "dataAtualizacao">,
  ) => void;

  updateOrdem: (id: string, ordem: Partial<OrdemServico>) => void;

  addVenda: (venda: Omit<Venda, "id" | "data">) => void;

  getClienteById: (id: string) => Cliente | undefined;

  getProdutoById: (id: string) => Produto | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// =========================
// PROVIDER
// =========================

export function AppProvider({ children }: { children: ReactNode }) {
  // =========================
  // STATES
  // =========================

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [currentScreen, setCurrentScreen] = useState<Screen>("login");

  const [clientes, setClientes] = useState<Cliente[]>([]);

  const [produtos, setProdutos] = useState<Produto[]>([]);

  const [servicos, setServicos] = useState<Servico[]>([]);

  const [ordens, setOrdens] = useState<OrdemServico[]>([]);

  const [vendas, setVendas] = useState<Venda[]>([]);

  // =========================
  // AUTH HELPERS
  // =========================

  const isAuthenticated = !!currentUser;

  const isAdmin = currentUser?.nivel === "admin";

  const isOperador = currentUser?.nivel === "operador";

  const hasPermission = (niveis: UserRole[]) => {
    if (!currentUser) {
      return false;
    }

    return niveis.includes(currentUser.nivel);
  };

  // =========================
  // AUTO LOGIN
  // =========================

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    const token = localStorage.getItem("token");

    if (savedUser && token) {
      setCurrentUser(JSON.parse(savedUser));

      setCurrentScreen("dashboard");
    }
  }, []);

  // =========================
  // LOGIN API
  // =========================

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      const data = await loginApi(email, senha);

      const user: User = {
        id: String(data.user.id),

        nome: data.user.name,

        email: data.user.email,

        nivel: data.user.nivel,
      };

      setCurrentUser(user);

      setCurrentScreen("dashboard");

      return true;
    } catch (error) {
      console.log(error);

      return false;
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setCurrentUser(null);

    setCurrentScreen("login");
  };

  // =========================
  // CLIENTES
  // =========================

  const addCliente = (cliente: Omit<Cliente, "id">) => {
    const newCliente = {
      ...cliente,
      id: Date.now().toString(),
    };

    setClientes([...clientes, newCliente]);
  };

  const updateCliente = (id: string, cliente: Partial<Cliente>) => {
    setClientes(
      clientes.map((c) =>
        c.id === id
          ? {
              ...c,
              ...cliente,
            }
          : c,
      ),
    );
  };

  const deleteCliente = (id: string) => {
    setClientes(clientes.filter((c) => c.id !== id));
  };

  // =========================
  // PRODUTOS
  // =========================

  const addProduto = (produto: Omit<Produto, "id">) => {
    const newProduto = {
      ...produto,

      id: Date.now().toString(),
    };

    setProdutos([...produtos, newProduto]);
  };

  const updateProduto = (id: string, produto: Partial<Produto>) => {
    setProdutos(
      produtos.map((p) =>
        p.id === id
          ? {
              ...p,
              ...produto,
            }
          : p,
      ),
    );
  };

  const deleteProduto = (id: string) => {
    setProdutos(produtos.filter((p) => p.id !== id));
  };

  // =========================
  // SERVIÇOS
  // =========================

  const addServico = (servico: Omit<Servico, "id">) => {
    const newServico = {
      ...servico,

      id: Date.now().toString(),
    };

    setServicos([...servicos, newServico]);
  };

  const updateServico = (id: string, servico: Partial<Servico>) => {
    setServicos(
      servicos.map((s) =>
        s.id === id
          ? {
              ...s,
              ...servico,
            }
          : s,
      ),
    );
  };

  const deleteServico = (id: string) => {
    setServicos(servicos.filter((s) => s.id !== id));
  };

  // =========================
  // ORDENS
  // =========================

  const addOrdem = (
    ordem: Omit<OrdemServico, "id" | "dataCriacao" | "dataAtualizacao">,
  ) => {
    const newOrdem: OrdemServico = {
      ...ordem,

      id: Date.now().toString(),

      dataCriacao: new Date().toISOString(),

      dataAtualizacao: new Date().toISOString(),
    };

    setOrdens([...ordens, newOrdem]);
  };

  const updateOrdem = (id: string, ordem: Partial<OrdemServico>) => {
    setOrdens(
      ordens.map((o) =>
        o.id === id
          ? {
              ...o,
              ...ordem,

              dataAtualizacao: new Date().toISOString(),
            }
          : o,
      ),
    );
  };

  // =========================
  // VENDAS
  // =========================

  const addVenda = (venda: Omit<Venda, "id" | "data">) => {
    const newVenda: Venda = {
      ...venda,

      id: Date.now().toString(),

      data: new Date().toISOString(),
    };

    setVendas([...vendas, newVenda]);
  };

  // =========================
  // HELPERS
  // =========================

  const getClienteById = (id: string) => clientes.find((c) => c.id === id);

  const getProdutoById = (id: string) => produtos.find((p) => p.id === id);

  // =========================
  // PROVIDER
  // =========================

  return (
    <AppContext.Provider
      value={{
        currentUser,

        currentScreen,

        isAuthenticated,

        isAdmin,

        isOperador,

        hasPermission,

        clientes,

        produtos,

        servicos,

        ordens,

        vendas,

        login,

        logout,

        setCurrentScreen,

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

// =========================
// HOOK
// =========================

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }

  return context;
}
