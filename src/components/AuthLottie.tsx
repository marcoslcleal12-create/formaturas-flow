import { Lottie } from "lottie-react";

/**
 * Lottie da tela de login. Baixa /lottie/camera.json e renderiza responsivo (100%
 * do container). O container pai controla o tamanho e a razao de aspecto.
 */
export function AuthLottie() {
  return <Lottie src="/lottie/camera.json" autoplay loop className="size-full" />;
}
