import { useCallback, useEffect, useRef, useState } from "react"
import { Eraser, PenLine } from "lucide-react"
import { Button } from "@/components/ui/button"

/*  Campo de assinatura: o formando desenha a rubrica com o dedo ou o mouse.

    Usa Pointer Events em vez de mouse+touch separados porque é o único
    caminho que trata caneta, dedo e mouse com o mesmo código — e porque o
    `setPointerCapture` mantém o traço mesmo quando o dedo escapa da área,
    que é o que acontece o tempo todo em tela de celular.  */
export function AssinaturaPad({
  onChange,
  disabled = false,
  altura = 180,
}: {
  onChange: (pngDataUrl: string | null) => void
  disabled?: boolean
  altura?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const desenhando = useRef(false)
  const temTraco = useRef(false)
  const [vazio, setVazio] = useState(true)

  /*  O canvas é redimensionado na densidade real da tela; sem isso a
      assinatura sai serrilhada no celular, que é onde ela é feita.  */
  const ajustarEscala = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    const largura = canvas.clientWidth

    /*  Redimensionar limpa o bitmap: só mexe se mudou de fato, senão um
        resize do teclado virtual apagaria a assinatura pronta.  */
    if (canvas.width === Math.floor(largura * dpr) && canvas.height === Math.floor(altura * dpr)) return

    canvas.width = Math.floor(largura * dpr)
    canvas.height = Math.floor(altura * dpr)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.scale(dpr, dpr)
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = "#111827"
  }, [altura])

  useEffect(() => {
    ajustarEscala()
    window.addEventListener("resize", ajustarEscala)
    return () => window.removeEventListener("resize", ajustarEscala)
  }, [ajustarEscala])

  const ponto = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  const iniciar = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled) return
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return

    e.currentTarget.setPointerCapture(e.pointerId)
    desenhando.current = true

    const { x, y } = ponto(e)
    ctx.beginPath()
    ctx.moveTo(x, y)

    /*  Um toque sem arrasto também é traço: sem isso, um ponto final ou um
        pingo de "i" não apareceria.  */
    ctx.lineTo(x + 0.01, y)
    ctx.stroke()

    temTraco.current = true
    setVazio(false)
  }

  const mover = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!desenhando.current || disabled) return
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return

    const { x, y } = ponto(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const encerrar = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!desenhando.current) return
    desenhando.current = false
    e.currentTarget.releasePointerCapture?.(e.pointerId)

    const canvas = canvasRef.current
    if (canvas && temTraco.current) onChange(canvas.toDataURL("image/png"))
  }

  const limpar = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    temTraco.current = false
    setVazio(true)
    onChange(null)
  }

  return (
    <div className="space-y-2">
      <div className="relative rounded-xl border-2 border-dashed border-primary/30 bg-background overflow-hidden">
        <canvas
          ref={canvasRef}
          style={{ height: altura, touchAction: "none" }}
          className="w-full block cursor-crosshair"
          onPointerDown={iniciar}
          onPointerMove={mover}
          onPointerUp={encerrar}
          onPointerCancel={encerrar}
          aria-label="Área de assinatura"
        />

        {vazio && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 text-muted-foreground">
            <PenLine className="size-5" />
            <span className="text-xs">Assine aqui com o dedo ou o mouse</span>
          </div>
        )}

        {/*  A linha de base dá ao campo a cara de onde se assina, e some
             junto com o placeholder para não sujar a imagem gerada.  */}
        {vazio && <div className="pointer-events-none absolute left-8 right-8 bottom-9 border-b border-muted-foreground/30" />}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {vazio ? "Nenhuma assinatura" : "Assinatura registrada"}
        </span>
        <Button type="button" variant="ghost" size="sm" onClick={limpar} disabled={disabled || vazio} className="gap-1.5 h-8">
          <Eraser className="size-3.5" /> Limpar
        </Button>
      </div>
    </div>
  )
}
