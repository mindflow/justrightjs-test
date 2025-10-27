import { CanvasStyles, TemplateComponentFactory, StyleAccessor } from "justright_core_v1";
import { InjectionPoint } from "mindi_v1";

export class LineEntry {

	static get TEMPLATE_URL() { return "/assets/justrightjs-test/lineEntry.html"; }
    static get STYLES_URL() { return "/assets/justrightjs-test/lineEntry.css"; }
    
    /**
     * 
     * @param {String} line 
     * @param {String} color 
     */
	constructor(line, color = null) {

		/** @type {TemplateComponentFactory} */
        this.componentFactory = InjectionPoint.instance(TemplateComponentFactory);

        /** @type {String} */
        this.line = line;

        this.color = color;
    }

	postConfig() {
		this.component = this.componentFactory.create(LineEntry);
        CanvasStyles.enableStyle(LineEntry.name);
        this.component.setChild("lineEntry", this.line);
        if (this.color) {
            StyleAccessor.from(this.component.get("lineEntry"))
                .set("color", this.color);
        }
    }

}