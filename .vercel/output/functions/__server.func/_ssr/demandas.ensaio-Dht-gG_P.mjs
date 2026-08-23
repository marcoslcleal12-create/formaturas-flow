import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { it as Camera } from "../_libs/lucide-react.mjs";
import { t as DemandaEventManager } from "./DemandaEventManager-ZrI-Lx2v.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/demandas.ensaio-Dht-gG_P.js
var import_jsx_runtime = require_jsx_runtime();
function EnsaioPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemandaEventManager, {
		tipo: "ensaio",
		titulo: "ENSAIO FOTOGRÁFICO",
		subtitulo: "Cadastre eventos de ensaios fotográficos, gerencie pacotes, gere links de adesão e acompanhe contratos e parcelas.",
		icon: Camera,
		themeColor: "blue"
	});
}
//#endregion
export { EnsaioPage as component };
