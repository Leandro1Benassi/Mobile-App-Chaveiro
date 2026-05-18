import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { login as loginApi } from "../services/authService";
import clienteService from "../services/clientesService";
import servicosService from "../services/servicosService";
import produtosService from "../services/produtoService";
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
  name: string;
  tel: string;
  cpf?: string;
  email?: string;
  endereco?: string;
}

export interface Produto {
  id: string;
  nome: string;
  codigo: string;
  estoque: number;
  estoque_min: number;
  logo_url?: string;
}

export interface Servico {
  id: string;
  nome: string;
  valor: number;
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

  useEffect(() => {
    async function carregarClientes() {
      try {
        const data = await clienteService.listarClientes();
        console.log("teste", data.data);
        setClientes(data.data);
      } catch (error) {
        console.log("Erro ao carregar clientes", error);
      }
    }

    carregarClientes();
  }, []);

  useEffect(() => {
    async function carregarServicos() {
      try {
        const data = await servicosService.listarServicos();
        console.log("servicos", data.data);
        setServicos(data.data);
      } catch (error) {
        console.log("Erro ao carregar serviços", error);
      }
    }

    carregarServicos();
  }, []);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const data = await produtosService.listarProdutos();

        console.log("produtos", data.data);

        setProdutos(data.data);
      } catch (error) {
        console.log("Erro ao carregar produtos", error);
      }
    }

    carregarProdutos();
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

  // =========================
  // PRODUTOS
  // =========================

  const addProduto = async (produto: Omit<Produto, "id">) => {
    try {
      await produtosService.criarProduto(produto);

      const data = await produtosService.listarProdutos();

      setProdutos(data.data);
    } catch (error) {
      console.log("Erro ao criar produto", error);
    }
  };

  const updateProduto = async (id: string, produto: Partial<Produto>) => {
    try {
      await produtosService.atualizarProduto(id, produto);

      const data = await produtosService.listarProdutos();

      setProdutos(data.data);
    } catch (error) {
      console.log("Erro ao atualizar produto", error);
    }
  };

  const deleteProduto = async (id: string) => {
    try {
      await produtosService.deletarProduto(id);

      setProdutos((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.log("Erro ao deletar produto", error);
    }
  };

  // =========================
  // SERVIÇOS
  // =========================
  const addServico = async (servico: Omit<Servico, "id">) => {
    try {
      const data = await servicosService.criarServicos(servico);

      console.log("CREATE", data);

      setServicos((prev) => [...prev, data.data]);
    } catch (error) {
      console.log("Erro ao criar serviço", error);
    }
  };

  const updateServico = async (id: string, servico: Partial<Servico>) => {
    try {
      const data = await servicosService.atualizarServicos(id, servico);

      setServicos((prev) => prev.map((s) => (s.id === id ? data.data : s)));
    } catch (error) {
      console.log("Erro ao atualizar serviço", error);
    }
  };

  const deleteServico = async (id: string) => {
    try {
      await servicosService.deletarServicos(id);

      setServicos((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.log("Erro ao deletar serviço", error);
    }
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
