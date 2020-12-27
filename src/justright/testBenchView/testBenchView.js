import { ObjectFunction } from "coreutil_v1";
import { CanvasStyles, ComponentFactory, EventRegistry } from "justright_core_v1";
import { InjectionPoint } from "mindi_v1";
import { TestTrigger } from "testbench_v1";
import { LineEntry } from "./lineEntry/lineEntry.js";
import { TestEntry } from "./testEntry/testEntry.js"

export class TestBenchView {

    static get COMPONENT_NAME() { return "TestBenchView"; }
	static get TEMPLATE_URL() { return "/assets/justrightjs-test/testBenchView.html"; }
    static get STYLES_URL() { return "/assets/justrightjs-test/testBenchView.css"; }
    
    /** 
     * @param {TestTrigger} testTrigger 
     */
	constructor(testTrigger) {

		/** @type {ComponentFactory} */
        this.componentFactory = InjectionPoint.instance(ComponentFactory);

		/** @type {EventRegistry} */
        this.eventRegistry = InjectionPoint.instance(EventRegistry);
        
        /** @type {TestTrigger} */
        this.testTrigger = testTrigger;
    }

	postConfig() {
		this.component = this.componentFactory.create(TestBenchView.COMPONENT_NAME);
        CanvasStyles.enableStyle(TestBenchView.COMPONENT_NAME);

        this.eventRegistry.attach(this.component.get("clearButton"), "onclick", "//event:clearClicked", this.component.componentIndex);
        this.eventRegistry.listen("//event:clearClicked", new ObjectFunction(this, this.clearClicked), this.component.componentIndex);

        this.eventRegistry.attach(this.component.get("runAllButton"), "onclick", "//event:runAllClicked", this.component.componentIndex);
        this.eventRegistry.listen("//event:runAllClicked", new ObjectFunction(this, this.runAllClicked), this.component.componentIndex);
    }

    /**
     * 
     * @param {TestEntry} testEntry 
     */
    addTestEntry(testEntry) {
        this.component.addChild("testList", testEntry.component);
    }

    runAllClicked() {
        this.testTrigger.run();
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