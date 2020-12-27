import { ObjectFunction } from "coreutil_v1";
import { CanvasStyles, ComponentFactory, EventRegistry } from "justright_core_v1";
import { InjectionPoint } from "mindi_v1";
import { LineEntry } from "./lineEntry/lineEntry.js";
import { TestEntry } from "./testEntry/testEntry.js"

export class TestBenchView {

    static get COMPONENT_NAME() { return "TestBenchView"; }
	static get TEMPLATE_URL() { return "/assets/justrightjs-test/testBenchView.html"; }
    static get STYLES_URL() { return "/assets/justrightjs-test/testBenchView.css"; }
    
	constructor() {

		/** @type {ComponentFactory} */
        this.componentFactory = InjectionPoint.instance(ComponentFactory);

		/** @type {EventRegistry} */
		this.eventRegistry = InjectionPoint.instance(EventRegistry);
    }

	postConfig() {
		this.component = this.componentFactory.create(TestBenchView.COMPONENT_NAME);
        CanvasStyles.enableStyle(TestBenchView.COMPONENT_NAME);

        this.eventRegistry.attach(this.component.get("clearButton"), "onclick", "//event:clearClicked", this.component.componentIndex);
        this.eventRegistry.listen("//event:clearClicked", new ObjectFunction(this, this.clearClicked), this.component.componentIndex);
    }

    /**
     * 
     * @param {TestEntry} testEntry 
     */
    addTestEntry(testEntry) {
        this.component.addChild("testList", testEntry.component);
    }

    clearClicked() {
        this.component.clearChildren("testResult");
    }

    /**
     * 
     * @param {LineEntry} line 
     */
    addLine(line) {
        this.component.addChild("testResult", line.component);
    }

}