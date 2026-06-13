import { useRef, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Camera,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  formatCpfCnpj,
  formatPhone,
  getCpfCnpjLabel,
  isValidEmail,
  isValidPhone,
  validateCpfCnpj,
} from "../utils/contactValidation";

type CepStatus = "idle" | "loading" | "success" | "error";

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export function PerfilUsuario() {
  const { currentUser, setCurrentScreen, updateCurrentUser } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    nome: currentUser?.nome || "",
    documento: formatCpfCnpj(currentUser?.documento || ""),
    telefone: formatPhone(currentUser?.telefone || ""),
    email: currentUser?.email || "",
    cep: currentUser?.cep || "",
    endereco: currentUser?.endereco || "",
    numero: currentUser?.numero || "",
    complemento: currentUser?.complemento || "",
    bairro: currentUser?.bairro || "",
    cidade: currentUser?.cidade || "",
    estado: currentUser?.estado || "",
  });
  const [cepStatus, setCepStatus] = useState<CepStatus>("idle");
  const [message, setMessage] = useState("");
  const [photoError, setPhotoError] = useState("");

  const updateField = (field: keyof typeof formData, value: string) => {
    const formattedValue =
      field === "documento"
        ? formatCpfCnpj(value)
        : field === "telefone"
          ? formatPhone(value)
          : value;

    setFormData((prev) => ({ ...prev, [field]: formattedValue }));
    if (message) setMessage("");
  };

  const buscarCep = async () => {
    const cleanCep = formData.cep.replace(/\D/g, "");

    if (cleanCep.length !== 8) {
      setCepStatus("error");
      setMessage("Digite um CEP com 8 números.");
      return;
    }

    setCepStatus("loading");
    setMessage("");

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`,
      );
      const data = (await response.json()) as ViaCepResponse;

      if (!response.ok || data.erro) {
        throw new Error("CEP não encontrado");
      }

      setFormData((prev) => ({
        ...prev,
        cep: data.cep,
        endereco: data.logradouro,
        complemento: prev.complemento || data.complemento,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf,
      }));
      setCepStatus("success");
      setMessage("Endereço preenchido pelo CEP.");
    } catch {
      setCepStatus("error");
      setMessage("Não foi possível buscar o CEP agora.");
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const documento = formData.documento.trim();
    const telefone = formData.telefone.trim();
    const email = formData.email.trim();

    if (documento && !validateCpfCnpj(documento)) {
      setCepStatus("error");
      setMessage(
        `${getCpfCnpjLabel(documento)} invalido. Verifique os numeros digitados.`,
      );
      return;
    }

    if (telefone && !isValidPhone(telefone)) {
      setCepStatus("error");
      setMessage("Telefone invalido. Use DDD + numero com 10 ou 11 digitos.");
      return;
    }

    if (!isValidEmail(email)) {
      setCepStatus("error");
      setMessage("Email invalido. Verifique o endereco digitado.");
      return;
    }

    updateCurrentUser(formData);
    setCepStatus("success");
    setMessage("Perfil atualizado com sucesso.");
  };

  const handleProfilePhotoUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Selecione um arquivo de imagem.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      updateCurrentUser({ fotoPerfil: String(reader.result) });
      setPhotoError("");
      setCepStatus("success");
      setMessage("Foto de perfil atualizada.");
      event.target.value = "";
    };

    reader.onerror = () => {
      setPhotoError("Não foi possível carregar a foto.");
      event.target.value = "";
    };

    reader.readAsDataURL(file);
  };

  const removeProfilePhoto = () => {
    updateCurrentUser({ fotoPerfil: "" });
    setPhotoError("");
    setCepStatus("success");
    setMessage("Foto de perfil removida.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentScreen("dashboard")}
            className="p-2 hover:bg-blue-700 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1>Perfil do Usuário</h1>
            <p className="text-blue-100 mt-1">Dados pessoais e endereço</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <section className="bg-white rounded-lg p-4 shadow space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={currentUser?.fotoPerfil || "/sem-foto.png"}
                alt="Foto de perfil"
                className="w-20 h-20 rounded-full object-cover border border-gray-200 bg-gray-100"
              />
              <div>
                <div className="flex items-center gap-2 text-gray-800">
                  <Camera className="w-5 h-5 text-blue-600" />
                  <h2>Foto de perfil</h2>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  {currentUser?.email}
                </p>
              </div>
            </div>

            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
              {currentUser?.nivel === "admin" ? "Administrador" : "Operador"}
            </span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleProfilePhotoUpload}
            className="hidden"
          />

          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <ImagePlus className="w-5 h-5" />
              Enviar foto
            </button>

            <button
              type="button"
              onClick={removeProfilePhoto}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Remover foto
            </button>
          </div>

          {photoError && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3">
              {photoError}
            </div>
          )}
        </section>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg p-4 shadow space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-gray-700">
              Nome completo
              <div className="relative mt-2">
                <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={formData.nome}
                  onChange={(e) => updateField("nome", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </label>

            <label className="block text-gray-700">
              CPF ou CNPJ
              <div className="relative mt-2">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={formData.documento}
                  onChange={(e) => updateField("documento", e.target.value)}
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  inputMode="numeric"
                  maxLength={18}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </label>

            <label className="block text-gray-700">
              Telefone
              <div className="relative mt-2">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => updateField("telefone", e.target.value)}
                  placeholder="(11) 98765-4321"
                  inputMode="tel"
                  maxLength={15}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </label>

            <label className="block text-gray-700">
              Email
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </label>
          </div>

          <div className="pt-2">
            <h2 className="text-gray-800 mb-3">Endereço</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block text-gray-700 sm:col-span-1">
                CEP
                <div className="flex gap-2 mt-2">
                  <input
                    value={formData.cep}
                    onChange={(e) => updateField("cep", e.target.value)}
                    placeholder="00000-000"
                    className="min-w-0 flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={buscarCep}
                    disabled={cepStatus === "loading"}
                    className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70"
                    title="Buscar CEP"
                  >
                    {cepStatus === "loading" ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </label>

              <label className="block text-gray-700 sm:col-span-2">
                Rua / Avenida
                <div className="relative mt-2">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    value={formData.endereco}
                    onChange={(e) => updateField("endereco", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </label>

              <label className="block text-gray-700">
                Número
                <input
                  value={formData.numero}
                  onChange={(e) => updateField("numero", e.target.value)}
                  className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="block text-gray-700">
                Bairro
                <input
                  value={formData.bairro}
                  onChange={(e) => updateField("bairro", e.target.value)}
                  className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="block text-gray-700">
                Complemento
                <input
                  value={formData.complemento}
                  onChange={(e) => updateField("complemento", e.target.value)}
                  className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="block text-gray-700 sm:col-span-2">
                Cidade
                <input
                  value={formData.cidade}
                  onChange={(e) => updateField("cidade", e.target.value)}
                  className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="block text-gray-700">
                Estado
                <input
                  value={formData.estado}
                  onChange={(e) =>
                    updateField("estado", e.target.value.toUpperCase())
                  }
                  maxLength={2}
                  className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          {message && (
            <div
              className={`rounded-lg px-4 py-3 flex items-center gap-2 ${
                cepStatus === "error"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {cepStatus !== "error" && <CheckCircle2 className="w-5 h-5" />}
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Salvar Perfil
          </button>
        </form>
      </div>
    </div>
  );
}
