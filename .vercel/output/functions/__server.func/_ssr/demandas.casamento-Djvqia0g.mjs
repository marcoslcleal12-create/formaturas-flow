import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { P as Heart } from "../_libs/lucide-react.mjs";
import { t as DemandaEventManager } from "./DemandaEventManager-ZrI-Lx2v.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/demandas.casamento-Djvqia0g.js
var import_jsx_runtime = require_jsx_runtime();
function CasamentosPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemandaEventManager, {
		tipo: "casamento",
		titulo: "CASAMENTO",
		subtitulo: "Cadastre eventos de casamento, gerencie pacotes, gere links de adesão e acompanhe contratos e parcelas.",
		icon: Heart,
		themeColor: "pink"
	});
}
//#endregion
export { CasamentosPage as component };
