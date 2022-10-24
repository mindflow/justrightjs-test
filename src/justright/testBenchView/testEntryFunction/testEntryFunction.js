import { Method } from "coreutil_v1";
import { CanvasStyles, ComponentFactory, Style } from "justright_core_v1";
import { InjectionPoint } from "mindi_v1";
import { TestClassState, TestTrigger } from "testbench_v1";

export class TestEntryFunction {

    static get COMPONENT_NAME() { return "TestEntryFunction"; }
	static get TEMPLATE_URL() { return "/assets/justrightjs-test/testEntryFunction.html"; }
    static get STYLES_URL() { return "/assets/justrightjs-test/testEntryFunction.css"; }
    
    /**
     * 
     * @param {Object} testClass
     * @param {Function} testFunction
     * @param {TestTrigger} testTrigger 
     */
	constructor(testClass, testFunction, testTrigger) {

		/** @type {ComponentFactory} */
        this.componentFactory = InjectionPoint.instance(ComponentFactory);

        /** @type {Object} */
        this.testClass = testClass;

        /** @type {Function} */
        this.testFunction = testFunction;

        /** @type {TestTrigger} */
        this.testTrigger = testTrigger;
    }

	postConfig() {
		this.component = this.componentFactory.create(TestEntryFunction.COMPONENT_NAME);
        CanvasStyles.enableStyle(TestEntryFunction.COMPONENT_NAME);
        this.component.setChild("testEntryFunctionName", this.testFunction.name);

        this.component.get("runButton").listenTo("click", new Method(this,this.runClicked));
    }

    runClicked() {
        this.testTrigger.runFunction(this.testClass.name, this.testFunction.name);
    }

    result(testClassState) {
        if (TestClassState.RUNNING === testClassState.state) {
            this.running();
        }
        if (TestClassState.SUCCESS === testClassState.state) {
            this.succeed();
        }
        if (TestClassState.FAIL === testClassState.state) {
            this.fail();
        }
    }

    fail() {
        Style.from(this.component.get("testEntryFunctionName"))
            .set("font-weight", "bold")
            .set("color", "red");
    }

    succeed() {
        Style.from(this.component.get("testEntryFunctionName"))
            .set("font-weight", "bold")
            .set("color", "green");
    }

    running() {
        Style.from(this.component.get("testEntryFunctionName"))
            .set("font-weight", "bold")
            .set("color", "black");
    }

    reset() {
        Style.from(this.component.get("testEntryFunctionName")).cleaz();
    }
}