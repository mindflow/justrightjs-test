import { CanvasStyles, ComponentFactory } from "justright_core_v1";
import { InjectionPoint } from "mindi_v1";

export class LineEntry {

    static get COMPONENT_NAME() { return "LineEntry"; }
	static get TEMPLATE_URL() { return "/assets/justrightjs-test/lineEntry.html"; }
    static get STYLES_URL() { return "/assets/justrightjs-test/lineEntry.css"; }
    
    /**
     * 
     * @param {String} line 
     */
	constructor(line) {

		/** @type {ComponentFactory} */
        this.componentFactory = InjectionPoint.instance(ComponentFactory);

        /** @type {String} */
        this.line = line;
    }

	postConfig() {
		this.component = this.componentFactory.create(LineEntry.COMPONENT_NAME);
        CanvasStyles.enableStyle(LineEntry.COMPONENT_NAME);
        this.component.setChild("lineEntry", this.line);
    }

}