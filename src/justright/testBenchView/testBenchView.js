import { Map, Method } from "coreutil_v1";
import { CanvasStyles, ComponentFactory, BaseElementEventRegistry } from "justright_core_v1";
import { InjectionPoint } from "mindi_v1";
import { TestClassState, TestTrigger } from "testbench_v1";
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

		/** @type {BaseElementEventRegistry} */
        this.baseElementEventRegistry = InjectionPoint.instance(BaseElementEventRegistry);
        
        /** @type {TestTrigger} */
        this.testTrigger = testTrigger;

        /** @type {Map<TestEntry>} */
        this.testEntryMap = new Map();
    }

	postConfig() {
		this.component = this.componentFactory.create(TestBenchView.COMPONENT_NAME);
        CanvasStyles.enableStyle(TestBenchView.COMPONENT_NAME);

        this.baseElementEventRegistry.attach(this.component.get("clearButton"), "onclick", "//event:clearClicked", this.component.componentIndex);
        this.baseElementEventRegistry.listen("//event:clearClicked", new Method(this, this.clearClicked), this.component.componentIndex);

        this.baseElementEventRegistry.attach(this.component.get("runAllButton"), "onclick", "//event:runAllClicked", this.component.componentIndex);
        this.baseElementEventRegistry.listen("//event:runAllClicked", new Method(this, this.runAllClicked), this.component.componentIndex);

        this.baseElementEventRegistry.attach(this.component.get("resetButton"), "onclick", "//event:resetClicked", this.component.componentIndex);
        this.baseElementEventRegistry.listen("//event:resetClicked", new Method(this, this.resetClicked), this.component.componentIndex);
    }

    /**
     * 
     * @param {TestEntry} testEntry 
     */
    addTestEntry(testEntry) {
        this.testEntryMap.set(testEntry.testClass.name, testEntry);
        this.component.addChild("testList", testEntry.component);
    }

    runAllClicked() {
        this.testTrigger.runAll();
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

    resetClicked() {
        this.testEntryMap.forEach((key, value, parent) => {
            /** @type {TestEntry} */
            const testEntry = value;
            testEntry.reset();
            return true;
        },this);
    }

    /**
     * 
     * @param {TestClassState} testClassState 
     */
    result(testClassState) {
        if (this.testEntryMap.contains(testClassState.className)) {
            /** @type {TestEntry} */
            const testEntry = this.testEntryMap.get(testClassState.className);
            testEntry.result(testClassState);
        }
    }
}