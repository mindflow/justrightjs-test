import { List } from "coreutil_v1";
import { CanvasStyles, TemplateComponentFactory, Style } from "justright_core_v1";
import { InjectionPoint, Provider } from "mindi_v1";
import { TestClassState, TestTrigger } from "testbench_v1";
import { TestEntryFunction } from "../testEntryFunction/testEntryFunction";

export class TestEntry {

	static get TEMPLATE_URL() { return "/assets/justrightjs-test/testEntry.html"; }
    static get STYLES_URL() { return "/assets/justrightjs-test/testEntry.css"; }
    
    /**
     * 
     * @param {Object} testClass
     * @param {TestTrigger} testTrigger 
     */
	constructor(testClass, testTrigger) {

		/** @type {TemplateComponentFactory} */
        this.componentFactory = InjectionPoint.instance(TemplateComponentFactory);
        
        /** @type {Provider<TestEntryFunction>} */
        this.testEntryFunctionProvider = InjectionPoint.provider(TestEntryFunction)

        /** @type {Object} */
        this.testClass = testClass;

        /** @type {TestTrigger} */
        this.testTrigger = testTrigger;

        /** @type {List<TestEntryFunction>} */
        this.testEntryFunctionList = new List();

        this.failed = false;
    }

	postConfig() {
		this.component = this.componentFactory.create(TestEntry);
        CanvasStyles.enableStyle(TestEntry.name);
        this.component.setChild("testEntryName", this.testClass.name);

        this.component.get("runButton").listenTo("click", this.runClicked, this);

        /** @type {List<TestEntryFunction>} */
        const testFunctions = this.testClass.testFunctions();
        testFunctions.forEach((testFunction, parent) => {
            this.testEntryFunctionProvider.get([this.testClass, testFunction, this.testTrigger]).then((testEntryFunction) => {
                this.testEntryFunctionList.add(testEntryFunction);
                this.component.get("testEntryFunctions").addChild(testEntryFunction.component);
            });
            return true;
        },this);
    }

    runClicked() {
        this.failed = false;
        this.testTrigger.runClass(this.testClass.name);
    }

    /**
     * 
     * @param {TestClassState} testClassState 
     */
    result(testClassState) {
        this.testEntryFunctionList.forEach((testEntryFunction, parent) => {
            if (testEntryFunction.testFunction.name === testClassState.functionName) {
                testEntryFunction.result(testClassState);
            }
            return true;
        },this);
        if (!this.failed && TestClassState.RUNNING === testClassState.state) {
            this.running();
        }
        if (!this.failed && TestClassState.SUCCESS === testClassState.state) {
            this.succeed();
        }
        if (TestClassState.FAIL === testClassState.state) {
            this.fail();
        }
    }

    fail() {
        this.failed = true;
        Style.from(this.component.get("testEntryName"))
            .set("font-weight", "bold")
            .set("color", "red");
    }

    succeed() {
        Style.from(this.component.get("testEntryName"))
            .set("font-weight", "bold")
            .set("color", "green");
    }

    running() {
        Style.from(this.component.get("testEntryName"))
            .set("font-weight", "bold")
            .set("color", "black");
    }

    reset() {
        this.failed = false;
        this.testEntryFunctionList.forEach((testEntryFunction, parent) => {
            testEntryFunction.reset();
            return true;
        },this);
        Style.from(this.component.get("testEntryName")).clear();
    }
}