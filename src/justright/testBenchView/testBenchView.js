import { Map } from "coreutil_v1";
import { CanvasStyles, TemplateComponentFactory } from "justright_core_v1";
import { InjectionPoint } from "mindi_v1";
import { TestClassState, TestTrigger } from "testbench_v1";
import { LineEntry } from "./lineEntry/lineEntry.js";
import { TestEntry } from "./testEntry/testEntry.js"

export class TestBenchView {

	static get TEMPLATE_URL() { return "/assets/justrightjs-test/testBenchView.html"; }
    static get STYLES_URL() { return "/assets/justrightjs-test/testBenchView.css"; }
    
    /** 
     * @param {TestTrigger} testTrigger 
     */
	constructor(testTrigger) {

		/** @type {TemplateComponentFactory} */
        this.componentFactory = InjectionPoint.instance(TemplateComponentFactory);
        
        /** @type {TestTrigger} */
        this.testTrigger = testTrigger;

        /** @type {Map<TestEntry>} */
        this.testEntryMap = new Map();
    }

	postConfig() {
		this.component = this.componentFactory.create(TestBenchView);
        CanvasStyles.enableStyle(TestBenchView.name);

		this.component.get("clearButton").listenTo("click", this.clearClicked, this);
		this.component.get("runAllButton").listenTo("click", this.runAllClicked, this);
        this.component.get("resetButton").listenTo("click", this.resetClicked, this);
    }

    /**
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