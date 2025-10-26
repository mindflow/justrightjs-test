import { CanvasStyles, TemplateComponentFactory, Style } from "justright_core_v1";
import { InjectionPoint } from "mindi_v1";

export class LineEntry {

    static get COMPONENT_NAME() { return "LineEntry"; }
	static get TEMPLATE_URL() { return "/assets/justrightjs-test/lineEntry.html"; }
    static get STYLES_URL() { return "/assets/justrightjs-test/lineEntry.css"; }
    
    /**
     * 
     * @param {String} line 
     * @param {String} color 
     */
	constructor(line, color = null) {

		/** @type {TemplateComponentFactory} */
        this.templateComponentFactory = InjectionPoint.instance(TemplateComponentFactory);

        /** @type {String} */
        this.line = line;

        this.color = color;
    }

	postConfig() {
		this.component = this.templateComponentFactory.create(LineEntry.COMPONENT_NAME);
        CanvasStyles.enableStyle(LineEntry.COMPONENT_NAME);
        this.component.setChild("lineEntry", this.line);
        if (this.color) {
            Style.from(this.component.get("lineEntry"))
                .set("color", this.color);
        }
    }

}