import { KeyRound } from "lucide-react";

interface LogoProps {
  size?: "small" | "medium" | "large";
  showText?: boolean;
  variant?: "light" | "dark";
  imageSrc?: string; // Mantido caso ainda queira passar uma foto de perfil dinâmica
}

export function Logo({
  size = "medium",
  showText = true,
  variant = "light",
  imageSrc,
}: LogoProps) {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16",
  };

  const textSizes = {
    small: "text-lg",
    medium: "text-2xl",
    large: "text-3xl",
  };

  const iconSizes = {
    small: "w-4 h-4",
    medium: "w-6 h-6",
    large: "w-8 h-8",
  };

  // Define qual imagem usar: a enviada por propriedade ou a sua logo padrão
  const finalImageSrc = imageSrc || "/LOGO.JPEG";

  return (
    <div className="flex items-center gap-3">
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg overflow-hidden`}
      >
        {/* Agora renderiza sempre a imagem (seja a logo-chave ou uma foto de perfil) */}
        <img
          src={finalImageSrc}
          alt="Logo Chaveiro Pro"
          className="w-full h-full object-cover"
        />
      </div>

      {showText && (
        <div>
          <h1
            className={`${textSizes[size]} ${variant === "light" ? "text-white" : "text-gray-800"} font-bold`}
          >
            Chaveiro Pro
          </h1>
          <p
            className={`text-xs ${variant === "light" ? "text-white/80" : "text-gray-600"}`}
          >
            O App do Chaveiro
          </p>
        </div>
      )}
    </div>
  );
}
