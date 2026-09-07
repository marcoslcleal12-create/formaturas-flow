import { Lottie } from "lottie-react";

/**
 * Animacao Lottie da marca — usada em login (/auth) e landing (/).
 * Renderiza responsivo (100% do container). Container pai controla
 * o tamanho e a razao de aspecto.
 */
export function BrandLottie() {
  return <Lottie src="/lottie/camera.json" autoplay loop className="size-full" />;
}
