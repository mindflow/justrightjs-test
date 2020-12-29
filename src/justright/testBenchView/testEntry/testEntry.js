import { ObjectFunction } from "coreutil_v1";
import { CanvasStyles, ComponentFactory, EventRegistry } from "justright_core_v1";
import { InjectionPoint } from "mindi_v1";
import { TestTrigger } from "testbench_v1";

export class TestEntry {

    static get COMPONENT_NAME() { return "TestEntry"; }
	static get TEMPLATE_URL() { return "/assets/justrightjs-test/testEntry.html"; }
    static get STYLES_URL() { return "/assets/justrightjs-test/testEntry.css"; }
    
    /**
     * 
     * @param {className} string
     * @param {TestTrigger} testTrigger 
     */
	constructor(className, testTrigger) {

		/** @type {ComponentFactory} */
        this.componentFactory = InjectionPoint.instance(ComponentFactory);

		/** @type {EventRegistry} */
		this.eventRegistry = InjectionPoint.instance(EventRegistry);

        /** @type {String} */
        this.className = className;

        /** @type {TestTrigger} */
        this.testTrigger = testTrigger;
    }

	postConfig() {
		this.component = this.componentFactory.create(TestEntry.COMPONENT_NAME);
        CanvasStyles.enableStyle(TestEntry.COMPONENT_NAME);
        this.component.setChild("testName", this.className);

        this.eventRegistry.attach(this.component.get("runButton"), "onclick", "//event:runClicked", this.component.componentIndex);
        this.eventRegistry.listen("//event:runClicked", new ObjectFunction(this, this.runClicked), this.component.componentIndex);
    }

    runClicked() {
        this.testTrigger.runSingle(this.className);
    }

    fail() {
        this.component.get("testName").setAttributeValue("style", "font-weight:bold;color:red");
    }

    succeed() {
        this.component.get("testName").setAttributeValue("style", "font-weight:bold;color:green");
    }

    running() {
        this.component.get("testName").setAttributeValue("style", "font-weight:bold;color:black");
    }

    reset() {
        this.component.get("testName").removeAttribute("style");
    }
}