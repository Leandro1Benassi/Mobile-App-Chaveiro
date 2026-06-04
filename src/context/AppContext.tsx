import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { login as loginApi } from "../services/authService";
import clienteService from "../services/clientesService";
import servicosService from "../services/servicosService";
import osService from "../services/osService";
import produtosService from "../services/produtoService";

export type Screen =
  | "login"
  | "recuperarSenha"
  | "cadastro"
  | "dashboard"
  | "clientes"
  | "produtos"
  | "servicos"
  | "copiaChave"
  | "vendaDireta"
  | "retirada"
  | "perfil"
  | "configuracoes";

export type UserRole = "admin" | "operador" | "user";

export interface User {
  id: string;
  nome: string;
  email: string;
  nivel: UserRole;
  role?: UserRole;
  documento?: string;
  telefone?: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  fotoPerfil?: string;
}

export interface Cliente {
  id: number;
  name?: string;
  nome?: string;
  tel?: string;
  telefone?: string;
  cpf?: string;
  email?: string;
  endereco?: string;
  cep?: string;
}

export interface Produto {
  id: string;
  nome: string;
  codigo: string;
  estoque: number;
  estoque_min: number;
  quantidadeEstoque: number;
  estoqueMinimo: number;
  logo_url?: string;
  imagemUrl?: string;
}

export interface Servico {
  id: string;
  nome: string;
  valor?: number;
  precoBase?: number;
  duracaoEstimada: string;
}

//export type StatusOrdem = "pendente" | "em_producao" | "pronto" | "retirado";
export interface OrdemServico {
  id: string;
  id_cliente: number;
  id_empresa: number;
  observacao?: string;
  data_entrada?: string;
  data_entrega?: string;
  status_ordem: "ABERTA" | "EM_ANDAMENTO" | "PRONTO" | "ENTREGUE" | "PENDENTE";
  valor_total: number;
  vendida?: boolean;
}
export interface OrdemServicoItem {
  id?: string;
  id_os?: number;

  id_produto?: string;
  id_servico?: number;

  descricao: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
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
  cadastro: (
    newUser: Omit<User, "id" | "nivel" | "role">,
    senha: string,
  ) => boolean;
  updateCurrentUser: (user: Partial<User>) => void;
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
  addOrdem: (ordem: Omit<OrdemServico, "id">) => void;
  updateOrdem: (id: string, ordem: Partial<OrdemServico>) => Promise<void>;

  deleteOrdem: (id: string) => Promise<void>;
  addOrdemItem: (item: Omit<OrdemServicoItem, "id">) => void;

  //updateOrdem: (id: number, ordem: Partial<OrdemServico>) => void;
  addVenda: (venda: Omit<Venda, "id" | "data">) => void;
  getClienteById: (id: string) => Cliente | undefined;
  getProdutoById: (id: string) => Produto | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const normalizeRole = (role?: string): UserRole => {
  if (role === "admin" || role === "operador" || role === "user") {
    return role;
  }

  return "operador";
};

const normalizeUser = (data: any): User => {
  const nivel = normalizeRole(data?.nivel || data?.role);

  return {
    id: String(data?.id || Date.now()),
    nome: data?.nome || data?.name || "",
    email: data?.email || "",
    nivel,
    role: nivel,
    documento: data?.documento || data?.cpf || data?.cnpj || "",
    telefone: data?.telefone || data?.tel || "",
    cep: data?.cep || "",
    endereco: data?.endereco || "",
    numero: data?.numero || "",
    complemento: data?.complemento || "",
    bairro: data?.bairro || "",
    cidade: data?.cidade || "",
    estado: data?.estado || data?.uf || "",
    fotoPerfil: data?.fotoPerfil || data?.foto_perfil || "",
  };
};

const normalizeProduto = (produto: Produto): Produto => ({
  ...produto,
  quantidadeEstoque: produto.quantidadeEstoque ?? produto.estoque ?? 0,
  estoqueMinimo: produto.estoqueMinimo ?? produto.estoque_min ?? 0,
  imagemUrl: produto.imagemUrl ?? produto.logo_url,
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);

  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.nivel === "admin";
  const isOperador = currentUser?.nivel === "operador";

  const hasPermission = (niveis: UserRole[]) => {
    if (!currentUser) return false;
    return niveis.includes(currentUser.nivel);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
      setCurrentUser(normalizeUser(JSON.parse(savedUser)));
      setCurrentScreen("dashboard");
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    async function carregarClientes() {
      try {
        const data = await clienteService.listarClientes();
        setClientes(data.data || []);
      } catch (error) {
        console.log("Erro ao carregar clientes", error);
      }
    }

    carregarClientes();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    async function carregarServicos() {
      try {
        const data = await servicosService.listarServicos();
        setServicos(data.data || []);
      } catch (error) {
        console.log("Erro ao carregar serviços", error);
      }
    }

    carregarServicos();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    async function carregarProdutos() {
      try {
        const data = await produtosService.listarProdutos();

        const produtosFormatados: Produto[] = data.data.map((p: any) => ({
          id: String(p.id),
          nome: p.nome || "",
          codigo: p.codigo || "",
          estoque: Number(p.estoque) || 0,
          estoque_min: Number(p.estoque_min) || 0,
          logo_url: p.logo_url || "",
        }));

        setProdutos(produtosFormatados);
      } catch (error) {
        console.log("Erro ao carregar produtos", error);
      }
    }

    carregarProdutos();
  }, [isAuthenticated]);
  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      const data = await loginApi(email, senha);
      await new Promise((r) => setTimeout(r, 150));
      console.log("Login  resposta da API", data);
      if (!data.user) {
        console.log("Login sem usuário na resposta da API", data);
        return false;
      }

      const user = normalizeUser(data.user);

      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(user);
      setCurrentScreen("dashboard");

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  useEffect(() => {
    if (!isAuthenticated) return;

    async function carregarOs() {
      try {
        const data = await osService.listarOs();
        setOrdens(data.data || []);
      } catch (error) {
        console.log("Erro ao carregar OS", error);
      }
    }

    carregarOs();
  }, [isAuthenticated]);
  const cadastro = (
    newUser: Omit<User, "id" | "nivel" | "role">,
    senha: string,
  ) => {
    if (!newUser.email || !senha) return false;

    const registeredUser: User = {
      ...newUser,
      id: Date.now().toString(),
      nivel: "operador",
      role: "operador",
    };

    localStorage.setItem("user", JSON.stringify(registeredUser));
    localStorage.setItem("token", "local-prototype-token");
    setCurrentUser(registeredUser);
    setCurrentScreen("dashboard");

    return true;
  };

  const updateCurrentUser = (userData: Partial<User>) => {
    if (!currentUser) return;

    const nivel = normalizeRole(
      userData.nivel || userData.role || currentUser.nivel,
    );
    const updatedUser = {
      ...currentUser,
      ...userData,
      nivel,
      role: nivel,
    };

    setCurrentUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setCurrentScreen("login");
  };

  const addCliente = (cliente: Omit<Cliente, "id">) => {
    const newCliente = { ...cliente, id: Date.now().toString() };
    setClientes((prev) => [...prev, newCliente]);
  };

  const updateCliente = (id: string, cliente: Partial<Cliente>) => {
    setClientes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...cliente } : c)),
    );
  };

  const deleteCliente = (id: string) => {
    setClientes((prev) => prev.filter((c) => c.id !== id));
  };

  const addProduto = async (produto: Omit<Produto, "id">) => {
    try {
      await produtosService.criarProduto(produto);
      const data = await produtosService.listarProdutos();
      setProdutos((data.data || []).map(normalizeProduto));
    } catch (error) {
      console.log("Erro ao criar produto", error);
    }
  };

  const updateProduto = async (id: string, produto: Partial<Produto>) => {
    try {
      await produtosService.atualizarProduto(id, produto);
      const data = await produtosService.listarProdutos();
      setProdutos((data.data || []).map(normalizeProduto));
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

  const addServico = async (servico: Omit<Servico, "id">) => {
    try {
      const data = await servicosService.criarServicos(servico);
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

  const addOrdem = async (ordem: Omit<OrdemServico, "id">) => {
    try {
      const novaOs = await osService.criarOs(ordem);

      const lista = await osService.listarOs();

      setOrdens(lista.data || []);

      return novaOs.data;
    } catch (error) {
      console.log("Erro ao criar OS", error);
      throw error;
    }
  };

  const updateOrdem = async (id: string, ordem: Partial<OrdemServico>) => {
    try {
      await osService.atualizarOs(id, ordem);

      const lista = await osService.listarOs();

      setOrdens(lista.data || []);
    } catch (error) {
      console.log("Erro ao atualizar OS", error);
    }
  };
  const deleteOrdem = async (id: string) => {
    try {
      await osService.deletarOs(id);

      setOrdens((prev) => prev.filter((os) => String(os.id) !== id));
    } catch (error) {
      console.log("Erro ao excluir OS", error);
    }
  };
  const addVenda = (venda: Omit<Venda, "id" | "data">) => {
    const newVenda: Venda = {
      ...venda,
      id: Date.now().toString(),
      data: new Date().toISOString(),
    };

    setVendas((prev) => [...prev, newVenda]);
  };

  const getClienteById = (id: string) => clientes.find((c) => c.id === id);
  const getProdutoById = (id: string) => produtos.find((p) => p.id === id);

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
        cadastro,
        updateCurrentUser,
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
        deleteOrdem,

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
    throw new Error("useApp must be used within AppProvider");
  }

  return context;
}
