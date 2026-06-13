import { useEffect, useState } from "react";
import { X, ShoppingCart, Wrench } from "lucide-react";
import { useApp, Produto } from "../context/AppContext";
import { listarServicos } from "../services/servicosService";

type Servico = {
    id: string;
    nome: string;
    valor: number;
    duracaoEstimada?: string;
};

interface ProdutosServicosModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ProdutosServicosModal({ isOpen, onClose }: ProdutosServicosModalProps) {
    const { produtos } = useApp();
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [activeTab, setActiveTab] = useState<"produtos" | "servicos">("produtos");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (isOpen) {
            fetchServicos();
        }
    }, [isOpen]);

    const fetchServicos = async () => {
        try {
            const res = await listarServicos();
            const servicosFormatados = res.data.map((s: any) => ({
                id: String(s.id),
                nome: s.nome,
                valor: Number(s.valor),
                duracaoEstimada: s.duracaoEstimada || "",
            }));
            setServicos(servicosFormatados);
        } catch (error) {
            console.error("Erro ao buscar serviços:", error);
        }
    };

    const filteredProdutos = produtos?.filter((p) =>
        p.nome.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const filteredServicos = servicos.filter((s) =>
        s.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
            <div className="bg-white w-full rounded-t-lg shadow-lg max-h-[90vh] flex flex-col">
                {/* HEADER */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {activeTab === "produtos" ? "Produtos" : "Serviços"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* TABS */}
                <div className="flex gap-0 border-b border-gray-200 px-4 pt-4">
                    <button
                        onClick={() => {
                            setActiveTab("produtos");
                            setSearchTerm("");
                        }}
                        className={`pb-3 px-4 font-medium transition-colors flex items-center gap-2 ${activeTab === "produtos"
                                ? "text-indigo-600 border-b-2 border-indigo-600"
                                : "text-gray-600 hover:text-gray-800"
                            }`}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Produtos ({filteredProdutos.length})
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab("servicos");
                            setSearchTerm("");
                        }}
                        className={`pb-3 px-4 font-medium transition-colors flex items-center gap-2 ${activeTab === "servicos"
                                ? "text-indigo-600 border-b-2 border-indigo-600"
                                : "text-gray-600 hover:text-gray-800"
                            }`}
                    >
                        <Wrench className="w-4 h-4" />
                        Serviços ({filteredServicos.length})
                    </button>
                </div>

                {/* SEARCH */}
                <div className="p-4 border-b border-gray-200">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={`Buscar ${activeTab === "produtos" ? "produto" : "serviço"}...`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* CONTENT */}
                <div className="overflow-y-auto flex-1">
                    {activeTab === "produtos" ? (
                        <div className="space-y-2 p-4">
                            {filteredProdutos.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    {searchTerm ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}
                                </div>
                            ) : (
                                filteredProdutos.map((produto: Produto) => (
                                    <div
                                        key={produto.id}
                                        className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-start gap-3">
                                            {produto.logo_url && (
                                                <img
                                                    src={produto.logo_url}
                                                    alt={produto.nome}
                                                    className="w-12 h-12 rounded object-cover flex-shrink-0"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800">{produto.nome}</p>
                                                <p className="text-sm text-gray-500">
                                                    Código: {produto.codigo}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Estoque: {produto.estoque}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="space-y-2 p-4">
                            {filteredServicos.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    {searchTerm ? "Nenhum serviço encontrado" : "Nenhum serviço cadastrado"}
                                </div>
                            ) : (
                                filteredServicos.map((servico) => (
                                    <div
                                        key={servico.id}
                                        className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800">{servico.nome}</p>
                                                <p className="text-sm text-green-600 mt-1">
                                                    R$ {servico.valor.toFixed(2)}
                                                </p>
                                                {servico.duracaoEstimada && (
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Duração: {servico.duracaoEstimada}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
