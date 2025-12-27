'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var coreutil_v1 = require('coreutil_v1');
var justright_core_v1 = require('justright_core_v1');
var mindi_v1 = require('mindi_v1');
var testbench_v1 = require('testbench_v1');

class LineEntry {

	static get TEMPLATE_URL() { return "/assets/justrightjs-test/lineEntry.html"; }
    static get STYLES_URL() { return "/assets/justrightjs-test/lineEntry.css"; }
    
    /**
     * 
     * @param {String} line 
     * @param {String} color 
     */
	constructor(line, color = null) {

		/** @type {TemplateComponentFactory} */
        this.componentFactory = mindi_v1.InjectionPoint.instance(justright_core_v1.TemplateComponentFactory);

        /** @type {String} */
        this.line = line;

        this.color = color;
    }

	postConfig() {
		this.component = this.componentFactory.create(LineEntry);
        justright_core_v1.CanvasStyles.enableStyle(LineEntry.name);
        this.component.setChild("lineEntry", this.line);
        if (this.color) {
            justright_core_v1.StyleAccessor.from(this.component.get("lineEntry"))
                .set("color", this.color);
        }
    }

}

class TestEntryFunction {

	static get TEMPLATE_URL() { return "/assets/justrightjs-test/testEntryFunction.html"; }
    static get STYLES_URL() { return "/assets/justrightjs-test/testEntryFunction.css"; }
    
    /**
     * 
     * @param {Object} testClass
     * @param {Function} testFunction
     * @param {TestTrigger} testTrigger 
     */
	constructor(testClass, testFunction, testTrigger) {

		/** @type {TemplateComponentFactory} */
        this.componentFactory = mindi_v1.InjectionPoint.instance(justright_core_v1.TemplateComponentFactory);

        /** @type {Object} */
        this.testClass = testClass;

        /** @type {Function} */
        this.testFunction = testFunction;

        /** @type {TestTrigger} */
        this.testTrigger = testTrigger;
    }

	postConfig() {
		this.component = this.componentFactory.create(TestEntryFunction);
        justright_core_v1.CanvasStyles.enableStyle(TestEntryFunction.name);
        this.component.setChild("testEntryFunctionName", this.testFunction.name);

        this.component.get("runButton").listenTo("click", this.runClicked, this);
    }

    runClicked() {
        this.testTrigger.runFunction(this.testClass.name, this.testFunction.name);
    }

    result(testClassState) {
        if (testbench_v1.TestClassState.RUNNING === testClassState.state) {
            this.running();
        }
        if (testbench_v1.TestClassState.SUCCESS === testClassState.state) {
            this.succeed();
        }
        if (testbench_v1.TestClassState.FAIL === testClassState.state) {
            this.fail();
        }
    }

    fail() {
        justright_core_v1.StyleAccessor.from(this.component.get("testEntryFunctionName"))
            .set("font-weight", "bold")
            .set("color", "red");
    }

    succeed() {
        justright_core_v1.StyleAccessor.from(this.component.get("testEntryFunctionName"))
            .set("font-weight", "bold")
            .set("color", "green");
    }

    running() {
        justright_core_v1.StyleAccessor.from(this.component.get("testEntryFunctionName"))
            .set("font-weight", "bold")
            .set("color", "black");
    }

    reset() {
        justright_core_v1.StyleAccessor.from(this.component.get("testEntryFunctionName")).clear();
    }
}

class TestEntry {

	static get TEMPLATE_URL() { return "/assets/justrightjs-test/testEntry.html"; }
    static get STYLES_URL() { return "/assets/justrightjs-test/testEntry.css"; }
    
    /**
     * 
     * @param {Object} testClass
     * @param {TestTrigger} testTrigger 
     */
	constructor(testClass, testTrigger) {

		/** @type {TemplateComponentFactory} */
        this.componentFactory = mindi_v1.InjectionPoint.instance(justright_core_v1.TemplateComponentFactory);
        
        /** @type {Provider<TestEntryFunction>} */
        this.testEntryFunctionProvider = mindi_v1.InjectionPoint.provider(TestEntryFunction);

        /** @type {Object} */
        this.testClass = testClass;

        /** @type {TestTrigger} */
        this.testTrigger = testTrigger;

        /** @type {List<TestEntryFunction>} */
        this.testEntryFunctionList = new coreutil_v1.List();

        this.failed = false;
    }

	postConfig() {
		this.component = this.componentFactory.create(TestEntry);
        justright_core_v1.CanvasStyles.enableStyle(TestEntry.name);
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
        if (!this.failed && testbench_v1.TestClassState.RUNNING === testClassState.state) {
            this.running();
        }
        if (!this.failed && testbench_v1.TestClassState.SUCCESS === testClassState.state) {
            this.succeed();
        }
        if (testbench_v1.TestClassState.FAIL === testClassState.state) {
            this.fail();
        }
    }

    fail() {
        this.failed = true;
        justright_core_v1.StyleAccessor.from(this.component.get("testEntryName"))
            .set("font-weight", "bold")
            .set("color", "red");
    }

    succeed() {
        justright_core_v1.StyleAccessor.from(this.component.get("testEntryName"))
            .set("font-weight", "bold")
            .set("color", "green");
    }

    running() {
        justright_core_v1.StyleAccessor.from(this.component.get("testEntryName"))
            .set("font-weight", "bold")
            .set("color", "black");
    }

    reset() {
        this.failed = false;
        this.testEntryFunctionList.forEach((testEntryFunction, parent) => {
            testEntryFunction.reset();
            return true;
        },this);
        justright_core_v1.StyleAccessor.from(this.component.get("testEntryName")).clear();
    }
}

class TestBenchView {

	static get TEMPLATE_URL() { return "/assets/justrightjs-test/testBenchView.html"; }
    static get STYLES_URL() { return "/assets/justrightjs-test/testBenchView.css"; }
    
    /** 
     * @param {TestTrigger} testTrigger 
     */
	constructor(testTrigger) {

		/** @type {TemplateComponentFactory} */
        this.componentFactory = mindi_v1.InjectionPoint.instance(justright_core_v1.TemplateComponentFactory);
        
        /** @type {TestTrigger} */
        this.testTrigger = testTrigger;

        /** @type {Map<TestEntry>} */
        this.testEntryMap = new coreutil_v1.Map();
    }

	postConfig() {
		this.component = this.componentFactory.create(TestBenchView);
        justright_core_v1.CanvasStyles.enableStyle(TestBenchView.name);

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

class TestBenchTestTrigger extends testbench_v1.TestTrigger {

    constructor() {
        super();
    }

    /**
     * @type {TestBench}
     */
    set testBench(testBench) {
        /** @type {TestBench} */
        this.theTestBench = testBench;
    }

    /**
     * Run test by class name
     * @param {String} className 
     * @param {String} functionName
     */
    runFunction(className, functionName) {
        this.theTestBench.runFunction(className, functionName);
    }

    /**
     * Run test by class name
     * @param {string} className 
     */
    runClass(className) {
        this.theTestBench.runClass(className);
    }

    /**
     * Run all test classes
     */
    runAll() {
        this.theTestBench.runAll();
    }

}

class DiObjectProvider extends testbench_v1.ObjectProvider {

    constructor() {
        super();
    }

    async provide(theClass, args = []) {
        const object = new theClass(...args);
        const config = new mindi_v1.MindiConfig();
        config.addAllInstanceProcessor([mindi_v1.InstancePostConfigTrigger]);
        if (object.typeConfigList) {
            config.addAllTypeConfig(object.typeConfigList);
        }
        await config.finalize();
        await mindi_v1.MindiInjector.getInstance().injectTarget(object, config);
        return object;
    }

}

class TestBenchUi {

    constructor() {

        /** @type {TestBenchTestTrigger} */
        this.testTrigger = new TestBenchTestTrigger();

		/** @type {TemplateComponentFactory} */
        this.componentFactory = mindi_v1.InjectionPoint.instance(justright_core_v1.TemplateComponentFactory);

        /** @type {TestBenchView} */
        this.testBenchView = mindi_v1.InjectionPoint.instance(TestBenchView, [this.testTrigger]);

        /** @type {Provider} */
        this.testEntryProvider = mindi_v1.InjectionPoint.provider(TestEntry);

        /** @type {Provider} */
        this.lineEntryProvider = mindi_v1.InjectionPoint.provider(LineEntry);

        /** @type {TestBench} */
        this.testBench = null;

        this.testEntryLoadedPromiseArray = [];

    }

    postConfig() {
        /** @type {TestBench} */
        this.testBench = new testbench_v1.TestBench(
            new coreutil_v1.Method(this.log, this),
            new coreutil_v1.Method(this.result, this),
            new DiObjectProvider());

        this.testTrigger.testBench = this.testBench;
    }

    addTest(testClass) {
        const context = this;
        if(!this.testBench.contains(testClass)) {
            this.testBench.addTest(testClass);
            const testEntryLoadedPromise = this.testEntryProvider.get([testClass, this.testBench]).then((testEntry) => {
                context.testBenchView.addTestEntry(testEntry);
            });
            this.testEntryLoadedPromiseArray.push(testEntryLoadedPromise);
        }
        return this;
    }

    /**
     * 
     * @param {TestClassResult} testClassResult 
     */
    result(testClassResult) {
        this.testBenchView.result(testClassResult);
    }

    async log(line, level) {
        const color = this.asColor(level);
        const context = this;
        const lineEntry = await this.lineEntryProvider.get([line, color]);
        context.testBenchView.addLine(lineEntry);
        return lineEntry;
    }
    
    asColor(level) {
        if (coreutil_v1.Logger.ERROR === level) {
            return "red";
        }
        if (coreutil_v1.Logger.FATAL === level) {
            return "red";
        }
        return null;
    }

    get component() {
        return this.testBenchView.component;
    }

}

exports.DiObjectProvider = DiObjectProvider;
exports.LineEntry = LineEntry;
exports.TestBenchTestTrigger = TestBenchTestTrigger;
exports.TestBenchUi = TestBenchUi;
exports.TestBenchView = TestBenchView;
exports.TestEntry = TestEntry;
exports.TestEntryFunction = TestEntryFunction;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianVzdHJpZ2h0X3Rlc3RfdjEuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9qdXN0cmlnaHQvdGVzdEJlbmNoVmlldy9saW5lRW50cnkvbGluZUVudHJ5LmpzIiwiLi4vLi4vc3JjL2p1c3RyaWdodC90ZXN0QmVuY2hWaWV3L3Rlc3RFbnRyeUZ1bmN0aW9uL3Rlc3RFbnRyeUZ1bmN0aW9uLmpzIiwiLi4vLi4vc3JjL2p1c3RyaWdodC90ZXN0QmVuY2hWaWV3L3Rlc3RFbnRyeS90ZXN0RW50cnkuanMiLCIuLi8uLi9zcmMvanVzdHJpZ2h0L3Rlc3RCZW5jaFZpZXcvdGVzdEJlbmNoVmlldy5qcyIsIi4uLy4uL3NyYy9qdXN0cmlnaHQvdGVzdEJlbmNoVmlldy90ZXN0QmVuY2hUZXN0VHJpZ2dlci5qcyIsIi4uLy4uL3NyYy9qdXN0cmlnaHQvdGVzdEJlbmNoVmlldy9kaU9iamVjdFByb3ZpZGVyLmpzIiwiLi4vLi4vc3JjL2p1c3RyaWdodC90ZXN0QmVuY2hVaS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDYW52YXNTdHlsZXMsIFRlbXBsYXRlQ29tcG9uZW50RmFjdG9yeSwgU3R5bGUgfSBmcm9tIFwianVzdHJpZ2h0X2NvcmVfdjFcIjtcbmltcG9ydCB7IEluamVjdGlvblBvaW50IH0gZnJvbSBcIm1pbmRpX3YxXCI7XG5cbmV4cG9ydCBjbGFzcyBMaW5lRW50cnkge1xuXG5cdHN0YXRpYyBnZXQgVEVNUExBVEVfVVJMKCkgeyByZXR1cm4gXCIvYXNzZXRzL2p1c3RyaWdodGpzLXRlc3QvbGluZUVudHJ5Lmh0bWxcIjsgfVxuICAgIHN0YXRpYyBnZXQgU1RZTEVTX1VSTCgpIHsgcmV0dXJuIFwiL2Fzc2V0cy9qdXN0cmlnaHRqcy10ZXN0L2xpbmVFbnRyeS5jc3NcIjsgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBsaW5lIFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjb2xvciBcbiAgICAgKi9cblx0Y29uc3RydWN0b3IobGluZSwgY29sb3IgPSBudWxsKSB7XG5cblx0XHQvKiogQHR5cGUge1RlbXBsYXRlQ29tcG9uZW50RmFjdG9yeX0gKi9cbiAgICAgICAgdGhpcy5jb21wb25lbnRGYWN0b3J5ID0gSW5qZWN0aW9uUG9pbnQuaW5zdGFuY2UoVGVtcGxhdGVDb21wb25lbnRGYWN0b3J5KTtcblxuICAgICAgICAvKiogQHR5cGUge1N0cmluZ30gKi9cbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcblxuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgfVxuXG5cdHBvc3RDb25maWcoKSB7XG5cdFx0dGhpcy5jb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudEZhY3RvcnkuY3JlYXRlKExpbmVFbnRyeSk7XG4gICAgICAgIENhbnZhc1N0eWxlcy5lbmFibGVTdHlsZShMaW5lRW50cnkubmFtZSk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50LnNldENoaWxkKFwibGluZUVudHJ5XCIsIHRoaXMubGluZSk7XG4gICAgICAgIGlmICh0aGlzLmNvbG9yKSB7XG4gICAgICAgICAgICBTdHlsZS5mcm9tKHRoaXMuY29tcG9uZW50LmdldChcImxpbmVFbnRyeVwiKSlcbiAgICAgICAgICAgICAgICAuc2V0KFwiY29sb3JcIiwgdGhpcy5jb2xvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiY29yZXV0aWxfdjFcIjtcbmltcG9ydCB7IENhbnZhc1N0eWxlcywgVGVtcGxhdGVDb21wb25lbnRGYWN0b3J5LCBTdHlsZSB9IGZyb20gXCJqdXN0cmlnaHRfY29yZV92MVwiO1xuaW1wb3J0IHsgSW5qZWN0aW9uUG9pbnQgfSBmcm9tIFwibWluZGlfdjFcIjtcbmltcG9ydCB7IFRlc3RDbGFzc1N0YXRlLCBUZXN0VHJpZ2dlciB9IGZyb20gXCJ0ZXN0YmVuY2hfdjFcIjtcblxuZXhwb3J0IGNsYXNzIFRlc3RFbnRyeUZ1bmN0aW9uIHtcblxuXHRzdGF0aWMgZ2V0IFRFTVBMQVRFX1VSTCgpIHsgcmV0dXJuIFwiL2Fzc2V0cy9qdXN0cmlnaHRqcy10ZXN0L3Rlc3RFbnRyeUZ1bmN0aW9uLmh0bWxcIjsgfVxuICAgIHN0YXRpYyBnZXQgU1RZTEVTX1VSTCgpIHsgcmV0dXJuIFwiL2Fzc2V0cy9qdXN0cmlnaHRqcy10ZXN0L3Rlc3RFbnRyeUZ1bmN0aW9uLmNzc1wiOyB9XG4gICAgXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHRlc3RDbGFzc1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHRlc3RGdW5jdGlvblxuICAgICAqIEBwYXJhbSB7VGVzdFRyaWdnZXJ9IHRlc3RUcmlnZ2VyIFxuICAgICAqL1xuXHRjb25zdHJ1Y3Rvcih0ZXN0Q2xhc3MsIHRlc3RGdW5jdGlvbiwgdGVzdFRyaWdnZXIpIHtcblxuXHRcdC8qKiBAdHlwZSB7VGVtcGxhdGVDb21wb25lbnRGYWN0b3J5fSAqL1xuICAgICAgICB0aGlzLmNvbXBvbmVudEZhY3RvcnkgPSBJbmplY3Rpb25Qb2ludC5pbnN0YW5jZShUZW1wbGF0ZUNvbXBvbmVudEZhY3RvcnkpO1xuXG4gICAgICAgIC8qKiBAdHlwZSB7T2JqZWN0fSAqL1xuICAgICAgICB0aGlzLnRlc3RDbGFzcyA9IHRlc3RDbGFzcztcblxuICAgICAgICAvKiogQHR5cGUge0Z1bmN0aW9ufSAqL1xuICAgICAgICB0aGlzLnRlc3RGdW5jdGlvbiA9IHRlc3RGdW5jdGlvbjtcblxuICAgICAgICAvKiogQHR5cGUge1Rlc3RUcmlnZ2VyfSAqL1xuICAgICAgICB0aGlzLnRlc3RUcmlnZ2VyID0gdGVzdFRyaWdnZXI7XG4gICAgfVxuXG5cdHBvc3RDb25maWcoKSB7XG5cdFx0dGhpcy5jb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudEZhY3RvcnkuY3JlYXRlKFRlc3RFbnRyeUZ1bmN0aW9uKTtcbiAgICAgICAgQ2FudmFzU3R5bGVzLmVuYWJsZVN0eWxlKFRlc3RFbnRyeUZ1bmN0aW9uLm5hbWUpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudC5zZXRDaGlsZChcInRlc3RFbnRyeUZ1bmN0aW9uTmFtZVwiLCB0aGlzLnRlc3RGdW5jdGlvbi5uYW1lKTtcblxuICAgICAgICB0aGlzLmNvbXBvbmVudC5nZXQoXCJydW5CdXR0b25cIikubGlzdGVuVG8oXCJjbGlja1wiLCB0aGlzLnJ1bkNsaWNrZWQsIHRoaXMpO1xuICAgIH1cblxuICAgIHJ1bkNsaWNrZWQoKSB7XG4gICAgICAgIHRoaXMudGVzdFRyaWdnZXIucnVuRnVuY3Rpb24odGhpcy50ZXN0Q2xhc3MubmFtZSwgdGhpcy50ZXN0RnVuY3Rpb24ubmFtZSk7XG4gICAgfVxuXG4gICAgcmVzdWx0KHRlc3RDbGFzc1N0YXRlKSB7XG4gICAgICAgIGlmIChUZXN0Q2xhc3NTdGF0ZS5SVU5OSU5HID09PSB0ZXN0Q2xhc3NTdGF0ZS5zdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5ydW5uaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFRlc3RDbGFzc1N0YXRlLlNVQ0NFU1MgPT09IHRlc3RDbGFzc1N0YXRlLnN0YXRlKSB7XG4gICAgICAgICAgICB0aGlzLnN1Y2NlZWQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoVGVzdENsYXNzU3RhdGUuRkFJTCA9PT0gdGVzdENsYXNzU3RhdGUuc3RhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuZmFpbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmFpbCgpIHtcbiAgICAgICAgU3R5bGUuZnJvbSh0aGlzLmNvbXBvbmVudC5nZXQoXCJ0ZXN0RW50cnlGdW5jdGlvbk5hbWVcIikpXG4gICAgICAgICAgICAuc2V0KFwiZm9udC13ZWlnaHRcIiwgXCJib2xkXCIpXG4gICAgICAgICAgICAuc2V0KFwiY29sb3JcIiwgXCJyZWRcIik7XG4gICAgfVxuXG4gICAgc3VjY2VlZCgpIHtcbiAgICAgICAgU3R5bGUuZnJvbSh0aGlzLmNvbXBvbmVudC5nZXQoXCJ0ZXN0RW50cnlGdW5jdGlvbk5hbWVcIikpXG4gICAgICAgICAgICAuc2V0KFwiZm9udC13ZWlnaHRcIiwgXCJib2xkXCIpXG4gICAgICAgICAgICAuc2V0KFwiY29sb3JcIiwgXCJncmVlblwiKTtcbiAgICB9XG5cbiAgICBydW5uaW5nKCkge1xuICAgICAgICBTdHlsZS5mcm9tKHRoaXMuY29tcG9uZW50LmdldChcInRlc3RFbnRyeUZ1bmN0aW9uTmFtZVwiKSlcbiAgICAgICAgICAgIC5zZXQoXCJmb250LXdlaWdodFwiLCBcImJvbGRcIilcbiAgICAgICAgICAgIC5zZXQoXCJjb2xvclwiLCBcImJsYWNrXCIpO1xuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgICBTdHlsZS5mcm9tKHRoaXMuY29tcG9uZW50LmdldChcInRlc3RFbnRyeUZ1bmN0aW9uTmFtZVwiKSkuY2xlYXIoKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgTGlzdCwgTWV0aG9kIH0gZnJvbSBcImNvcmV1dGlsX3YxXCI7XG5pbXBvcnQgeyBDYW52YXNTdHlsZXMsIFRlbXBsYXRlQ29tcG9uZW50RmFjdG9yeSwgU3R5bGUgfSBmcm9tIFwianVzdHJpZ2h0X2NvcmVfdjFcIjtcbmltcG9ydCB7IEluamVjdGlvblBvaW50LCBQcm92aWRlciB9IGZyb20gXCJtaW5kaV92MVwiO1xuaW1wb3J0IHsgVGVzdENsYXNzU3RhdGUsIFRlc3RUcmlnZ2VyIH0gZnJvbSBcInRlc3RiZW5jaF92MVwiO1xuaW1wb3J0IHsgVGVzdEVudHJ5RnVuY3Rpb24gfSBmcm9tIFwiLi4vdGVzdEVudHJ5RnVuY3Rpb24vdGVzdEVudHJ5RnVuY3Rpb25cIjtcblxuZXhwb3J0IGNsYXNzIFRlc3RFbnRyeSB7XG5cblx0c3RhdGljIGdldCBURU1QTEFURV9VUkwoKSB7IHJldHVybiBcIi9hc3NldHMvanVzdHJpZ2h0anMtdGVzdC90ZXN0RW50cnkuaHRtbFwiOyB9XG4gICAgc3RhdGljIGdldCBTVFlMRVNfVVJMKCkgeyByZXR1cm4gXCIvYXNzZXRzL2p1c3RyaWdodGpzLXRlc3QvdGVzdEVudHJ5LmNzc1wiOyB9XG4gICAgXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHRlc3RDbGFzc1xuICAgICAqIEBwYXJhbSB7VGVzdFRyaWdnZXJ9IHRlc3RUcmlnZ2VyIFxuICAgICAqL1xuXHRjb25zdHJ1Y3Rvcih0ZXN0Q2xhc3MsIHRlc3RUcmlnZ2VyKSB7XG5cblx0XHQvKiogQHR5cGUge1RlbXBsYXRlQ29tcG9uZW50RmFjdG9yeX0gKi9cbiAgICAgICAgdGhpcy5jb21wb25lbnRGYWN0b3J5ID0gSW5qZWN0aW9uUG9pbnQuaW5zdGFuY2UoVGVtcGxhdGVDb21wb25lbnRGYWN0b3J5KTtcbiAgICAgICAgXG4gICAgICAgIC8qKiBAdHlwZSB7UHJvdmlkZXI8VGVzdEVudHJ5RnVuY3Rpb24+fSAqL1xuICAgICAgICB0aGlzLnRlc3RFbnRyeUZ1bmN0aW9uUHJvdmlkZXIgPSBJbmplY3Rpb25Qb2ludC5wcm92aWRlcihUZXN0RW50cnlGdW5jdGlvbilcblxuICAgICAgICAvKiogQHR5cGUge09iamVjdH0gKi9cbiAgICAgICAgdGhpcy50ZXN0Q2xhc3MgPSB0ZXN0Q2xhc3M7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtUZXN0VHJpZ2dlcn0gKi9cbiAgICAgICAgdGhpcy50ZXN0VHJpZ2dlciA9IHRlc3RUcmlnZ2VyO1xuXG4gICAgICAgIC8qKiBAdHlwZSB7TGlzdDxUZXN0RW50cnlGdW5jdGlvbj59ICovXG4gICAgICAgIHRoaXMudGVzdEVudHJ5RnVuY3Rpb25MaXN0ID0gbmV3IExpc3QoKTtcblxuICAgICAgICB0aGlzLmZhaWxlZCA9IGZhbHNlO1xuICAgIH1cblxuXHRwb3N0Q29uZmlnKCkge1xuXHRcdHRoaXMuY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRGYWN0b3J5LmNyZWF0ZShUZXN0RW50cnkpO1xuICAgICAgICBDYW52YXNTdHlsZXMuZW5hYmxlU3R5bGUoVGVzdEVudHJ5Lm5hbWUpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudC5zZXRDaGlsZChcInRlc3RFbnRyeU5hbWVcIiwgdGhpcy50ZXN0Q2xhc3MubmFtZSk7XG5cbiAgICAgICAgdGhpcy5jb21wb25lbnQuZ2V0KFwicnVuQnV0dG9uXCIpLmxpc3RlblRvKFwiY2xpY2tcIiwgdGhpcy5ydW5DbGlja2VkLCB0aGlzKTtcblxuICAgICAgICAvKiogQHR5cGUge0xpc3Q8VGVzdEVudHJ5RnVuY3Rpb24+fSAqL1xuICAgICAgICBjb25zdCB0ZXN0RnVuY3Rpb25zID0gdGhpcy50ZXN0Q2xhc3MudGVzdEZ1bmN0aW9ucygpO1xuICAgICAgICB0ZXN0RnVuY3Rpb25zLmZvckVhY2goKHRlc3RGdW5jdGlvbiwgcGFyZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRlc3RFbnRyeUZ1bmN0aW9uUHJvdmlkZXIuZ2V0KFt0aGlzLnRlc3RDbGFzcywgdGVzdEZ1bmN0aW9uLCB0aGlzLnRlc3RUcmlnZ2VyXSkudGhlbigodGVzdEVudHJ5RnVuY3Rpb24pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnRlc3RFbnRyeUZ1bmN0aW9uTGlzdC5hZGQodGVzdEVudHJ5RnVuY3Rpb24pO1xuICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50LmdldChcInRlc3RFbnRyeUZ1bmN0aW9uc1wiKS5hZGRDaGlsZCh0ZXN0RW50cnlGdW5jdGlvbi5jb21wb25lbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSx0aGlzKTtcbiAgICB9XG5cbiAgICBydW5DbGlja2VkKCkge1xuICAgICAgICB0aGlzLmZhaWxlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnRlc3RUcmlnZ2VyLnJ1bkNsYXNzKHRoaXMudGVzdENsYXNzLm5hbWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7VGVzdENsYXNzU3RhdGV9IHRlc3RDbGFzc1N0YXRlIFxuICAgICAqL1xuICAgIHJlc3VsdCh0ZXN0Q2xhc3NTdGF0ZSkge1xuICAgICAgICB0aGlzLnRlc3RFbnRyeUZ1bmN0aW9uTGlzdC5mb3JFYWNoKCh0ZXN0RW50cnlGdW5jdGlvbiwgcGFyZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAodGVzdEVudHJ5RnVuY3Rpb24udGVzdEZ1bmN0aW9uLm5hbWUgPT09IHRlc3RDbGFzc1N0YXRlLmZ1bmN0aW9uTmFtZSkge1xuICAgICAgICAgICAgICAgIHRlc3RFbnRyeUZ1bmN0aW9uLnJlc3VsdCh0ZXN0Q2xhc3NTdGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSx0aGlzKTtcbiAgICAgICAgaWYgKCF0aGlzLmZhaWxlZCAmJiBUZXN0Q2xhc3NTdGF0ZS5SVU5OSU5HID09PSB0ZXN0Q2xhc3NTdGF0ZS5zdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5ydW5uaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmZhaWxlZCAmJiBUZXN0Q2xhc3NTdGF0ZS5TVUNDRVNTID09PSB0ZXN0Q2xhc3NTdGF0ZS5zdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5zdWNjZWVkKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFRlc3RDbGFzc1N0YXRlLkZBSUwgPT09IHRlc3RDbGFzc1N0YXRlLnN0YXRlKSB7XG4gICAgICAgICAgICB0aGlzLmZhaWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZhaWwoKSB7XG4gICAgICAgIHRoaXMuZmFpbGVkID0gdHJ1ZTtcbiAgICAgICAgU3R5bGUuZnJvbSh0aGlzLmNvbXBvbmVudC5nZXQoXCJ0ZXN0RW50cnlOYW1lXCIpKVxuICAgICAgICAgICAgLnNldChcImZvbnQtd2VpZ2h0XCIsIFwiYm9sZFwiKVxuICAgICAgICAgICAgLnNldChcImNvbG9yXCIsIFwicmVkXCIpO1xuICAgIH1cblxuICAgIHN1Y2NlZWQoKSB7XG4gICAgICAgIFN0eWxlLmZyb20odGhpcy5jb21wb25lbnQuZ2V0KFwidGVzdEVudHJ5TmFtZVwiKSlcbiAgICAgICAgICAgIC5zZXQoXCJmb250LXdlaWdodFwiLCBcImJvbGRcIilcbiAgICAgICAgICAgIC5zZXQoXCJjb2xvclwiLCBcImdyZWVuXCIpO1xuICAgIH1cblxuICAgIHJ1bm5pbmcoKSB7XG4gICAgICAgIFN0eWxlLmZyb20odGhpcy5jb21wb25lbnQuZ2V0KFwidGVzdEVudHJ5TmFtZVwiKSlcbiAgICAgICAgICAgIC5zZXQoXCJmb250LXdlaWdodFwiLCBcImJvbGRcIilcbiAgICAgICAgICAgIC5zZXQoXCJjb2xvclwiLCBcImJsYWNrXCIpO1xuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgICB0aGlzLmZhaWxlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnRlc3RFbnRyeUZ1bmN0aW9uTGlzdC5mb3JFYWNoKCh0ZXN0RW50cnlGdW5jdGlvbiwgcGFyZW50KSA9PiB7XG4gICAgICAgICAgICB0ZXN0RW50cnlGdW5jdGlvbi5yZXNldCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sdGhpcyk7XG4gICAgICAgIFN0eWxlLmZyb20odGhpcy5jb21wb25lbnQuZ2V0KFwidGVzdEVudHJ5TmFtZVwiKSkuY2xlYXIoKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgTWFwLCBNZXRob2QgfSBmcm9tIFwiY29yZXV0aWxfdjFcIjtcbmltcG9ydCB7IENhbnZhc1N0eWxlcywgVGVtcGxhdGVDb21wb25lbnRGYWN0b3J5IH0gZnJvbSBcImp1c3RyaWdodF9jb3JlX3YxXCI7XG5pbXBvcnQgeyBJbmplY3Rpb25Qb2ludCB9IGZyb20gXCJtaW5kaV92MVwiO1xuaW1wb3J0IHsgVGVzdENsYXNzU3RhdGUsIFRlc3RUcmlnZ2VyIH0gZnJvbSBcInRlc3RiZW5jaF92MVwiO1xuaW1wb3J0IHsgTGluZUVudHJ5IH0gZnJvbSBcIi4vbGluZUVudHJ5L2xpbmVFbnRyeS5qc1wiO1xuaW1wb3J0IHsgVGVzdEVudHJ5IH0gZnJvbSBcIi4vdGVzdEVudHJ5L3Rlc3RFbnRyeS5qc1wiXG5cbmV4cG9ydCBjbGFzcyBUZXN0QmVuY2hWaWV3IHtcblxuXHRzdGF0aWMgZ2V0IFRFTVBMQVRFX1VSTCgpIHsgcmV0dXJuIFwiL2Fzc2V0cy9qdXN0cmlnaHRqcy10ZXN0L3Rlc3RCZW5jaFZpZXcuaHRtbFwiOyB9XG4gICAgc3RhdGljIGdldCBTVFlMRVNfVVJMKCkgeyByZXR1cm4gXCIvYXNzZXRzL2p1c3RyaWdodGpzLXRlc3QvdGVzdEJlbmNoVmlldy5jc3NcIjsgfVxuICAgIFxuICAgIC8qKiBcbiAgICAgKiBAcGFyYW0ge1Rlc3RUcmlnZ2VyfSB0ZXN0VHJpZ2dlciBcbiAgICAgKi9cblx0Y29uc3RydWN0b3IodGVzdFRyaWdnZXIpIHtcblxuXHRcdC8qKiBAdHlwZSB7VGVtcGxhdGVDb21wb25lbnRGYWN0b3J5fSAqL1xuICAgICAgICB0aGlzLmNvbXBvbmVudEZhY3RvcnkgPSBJbmplY3Rpb25Qb2ludC5pbnN0YW5jZShUZW1wbGF0ZUNvbXBvbmVudEZhY3RvcnkpO1xuICAgICAgICBcbiAgICAgICAgLyoqIEB0eXBlIHtUZXN0VHJpZ2dlcn0gKi9cbiAgICAgICAgdGhpcy50ZXN0VHJpZ2dlciA9IHRlc3RUcmlnZ2VyO1xuXG4gICAgICAgIC8qKiBAdHlwZSB7TWFwPFRlc3RFbnRyeT59ICovXG4gICAgICAgIHRoaXMudGVzdEVudHJ5TWFwID0gbmV3IE1hcCgpO1xuICAgIH1cblxuXHRwb3N0Q29uZmlnKCkge1xuXHRcdHRoaXMuY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRGYWN0b3J5LmNyZWF0ZShUZXN0QmVuY2hWaWV3KTtcbiAgICAgICAgQ2FudmFzU3R5bGVzLmVuYWJsZVN0eWxlKFRlc3RCZW5jaFZpZXcubmFtZSk7XG5cblx0XHR0aGlzLmNvbXBvbmVudC5nZXQoXCJjbGVhckJ1dHRvblwiKS5saXN0ZW5UbyhcImNsaWNrXCIsIHRoaXMuY2xlYXJDbGlja2VkLCB0aGlzKTtcblx0XHR0aGlzLmNvbXBvbmVudC5nZXQoXCJydW5BbGxCdXR0b25cIikubGlzdGVuVG8oXCJjbGlja1wiLCB0aGlzLnJ1bkFsbENsaWNrZWQsIHRoaXMpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudC5nZXQoXCJyZXNldEJ1dHRvblwiKS5saXN0ZW5UbyhcImNsaWNrXCIsIHRoaXMucmVzZXRDbGlja2VkLCB0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge1Rlc3RFbnRyeX0gdGVzdEVudHJ5IFxuICAgICAqL1xuICAgIGFkZFRlc3RFbnRyeSh0ZXN0RW50cnkpIHtcbiAgICAgICAgdGhpcy50ZXN0RW50cnlNYXAuc2V0KHRlc3RFbnRyeS50ZXN0Q2xhc3MubmFtZSwgdGVzdEVudHJ5KTtcbiAgICAgICAgdGhpcy5jb21wb25lbnQuYWRkQ2hpbGQoXCJ0ZXN0TGlzdFwiLCB0ZXN0RW50cnkuY29tcG9uZW50KTtcbiAgICB9XG5cbiAgICBydW5BbGxDbGlja2VkKCkge1xuICAgICAgICB0aGlzLnRlc3RUcmlnZ2VyLnJ1bkFsbCgpO1xuICAgIH1cblxuICAgIGNsZWFyQ2xpY2tlZCgpIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnQuY2xlYXJDaGlsZHJlbihcInRlc3RSZXN1bHRcIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtMaW5lRW50cnl9IGxpbmUgXG4gICAgICovXG4gICAgYWRkTGluZShsaW5lKSB7XG4gICAgICAgIHRoaXMuY29tcG9uZW50LmFkZENoaWxkKFwidGVzdFJlc3VsdFwiLCBsaW5lLmNvbXBvbmVudCk7XG4gICAgfVxuXG4gICAgcmVzZXRDbGlja2VkKCkge1xuICAgICAgICB0aGlzLnRlc3RFbnRyeU1hcC5mb3JFYWNoKChrZXksIHZhbHVlLCBwYXJlbnQpID0+IHtcbiAgICAgICAgICAgIC8qKiBAdHlwZSB7VGVzdEVudHJ5fSAqL1xuICAgICAgICAgICAgY29uc3QgdGVzdEVudHJ5ID0gdmFsdWU7XG4gICAgICAgICAgICB0ZXN0RW50cnkucmVzZXQoKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7VGVzdENsYXNzU3RhdGV9IHRlc3RDbGFzc1N0YXRlIFxuICAgICAqL1xuICAgIHJlc3VsdCh0ZXN0Q2xhc3NTdGF0ZSkge1xuICAgICAgICBpZiAodGhpcy50ZXN0RW50cnlNYXAuY29udGFpbnModGVzdENsYXNzU3RhdGUuY2xhc3NOYW1lKSkge1xuICAgICAgICAgICAgLyoqIEB0eXBlIHtUZXN0RW50cnl9ICovXG4gICAgICAgICAgICBjb25zdCB0ZXN0RW50cnkgPSB0aGlzLnRlc3RFbnRyeU1hcC5nZXQodGVzdENsYXNzU3RhdGUuY2xhc3NOYW1lKTtcbiAgICAgICAgICAgIHRlc3RFbnRyeS5yZXN1bHQodGVzdENsYXNzU3RhdGUpO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IFRlc3RCZW5jaCwgVGVzdFRyaWdnZXIgfSBmcm9tIFwidGVzdGJlbmNoX3YxXCI7XG5cbmV4cG9ydCBjbGFzcyBUZXN0QmVuY2hUZXN0VHJpZ2dlciBleHRlbmRzIFRlc3RUcmlnZ2VyIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtUZXN0QmVuY2h9XG4gICAgICovXG4gICAgc2V0IHRlc3RCZW5jaCh0ZXN0QmVuY2gpIHtcbiAgICAgICAgLyoqIEB0eXBlIHtUZXN0QmVuY2h9ICovXG4gICAgICAgIHRoaXMudGhlVGVzdEJlbmNoID0gdGVzdEJlbmNoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJ1biB0ZXN0IGJ5IGNsYXNzIG5hbWVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gY2xhc3NOYW1lIFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmdW5jdGlvbk5hbWVcbiAgICAgKi9cbiAgICBydW5GdW5jdGlvbihjbGFzc05hbWUsIGZ1bmN0aW9uTmFtZSkge1xuICAgICAgICB0aGlzLnRoZVRlc3RCZW5jaC5ydW5GdW5jdGlvbihjbGFzc05hbWUsIGZ1bmN0aW9uTmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUnVuIHRlc3QgYnkgY2xhc3MgbmFtZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWUgXG4gICAgICovXG4gICAgcnVuQ2xhc3MoY2xhc3NOYW1lKSB7XG4gICAgICAgIHRoaXMudGhlVGVzdEJlbmNoLnJ1bkNsYXNzKGNsYXNzTmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUnVuIGFsbCB0ZXN0IGNsYXNzZXNcbiAgICAgKi9cbiAgICBydW5BbGwoKSB7XG4gICAgICAgIHRoaXMudGhlVGVzdEJlbmNoLnJ1bkFsbCgpO1xuICAgIH1cblxufSIsImltcG9ydCB7IEluc3RhbmNlUG9zdENvbmZpZ1RyaWdnZXIsIE1pbmRpQ29uZmlnLCBNaW5kaUluamVjdG9yIH0gZnJvbSBcIm1pbmRpX3YxXCI7XG5pbXBvcnQgeyBPYmplY3RQcm92aWRlciB9IGZyb20gXCJ0ZXN0YmVuY2hfdjFcIjtcblxuZXhwb3J0IGNsYXNzIERpT2JqZWN0UHJvdmlkZXIgZXh0ZW5kcyBPYmplY3RQcm92aWRlciB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBhc3luYyBwcm92aWRlKHRoZUNsYXNzLCBhcmdzID0gW10pIHtcbiAgICAgICAgY29uc3Qgb2JqZWN0ID0gbmV3IHRoZUNsYXNzKC4uLmFyZ3MpO1xuICAgICAgICBjb25zdCBjb25maWcgPSBuZXcgTWluZGlDb25maWcoKTtcbiAgICAgICAgY29uZmlnLmFkZEFsbEluc3RhbmNlUHJvY2Vzc29yKFtJbnN0YW5jZVBvc3RDb25maWdUcmlnZ2VyXSk7XG4gICAgICAgIGlmIChvYmplY3QudHlwZUNvbmZpZ0xpc3QpIHtcbiAgICAgICAgICAgIGNvbmZpZy5hZGRBbGxUeXBlQ29uZmlnKG9iamVjdC50eXBlQ29uZmlnTGlzdCk7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgY29uZmlnLmZpbmFsaXplKCk7XG4gICAgICAgIGF3YWl0IE1pbmRpSW5qZWN0b3IuZ2V0SW5zdGFuY2UoKS5pbmplY3RUYXJnZXQob2JqZWN0LCBjb25maWcpO1xuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxufSIsImltcG9ydCB7IExvZ2dlciwgTWV0aG9kIH0gZnJvbSBcImNvcmV1dGlsX3YxXCI7XG5pbXBvcnQgeyBUZW1wbGF0ZUNvbXBvbmVudEZhY3RvcnkgfSBmcm9tIFwianVzdHJpZ2h0X2NvcmVfdjFcIjtcbmltcG9ydCB7IEluamVjdGlvblBvaW50LCBQcm92aWRlciB9IGZyb20gXCJtaW5kaV92MVwiO1xuaW1wb3J0IHsgVGVzdEJlbmNoLCBUZXN0Q2xhc3NSZXN1bHQgfSBmcm9tIFwidGVzdGJlbmNoX3YxXCI7XG5pbXBvcnQgeyBUZXN0QmVuY2hWaWV3IH0gZnJvbSBcIi4vdGVzdEJlbmNoVmlldy90ZXN0QmVuY2hWaWV3LmpzXCI7XG5pbXBvcnQgeyBUZXN0RW50cnkgfSBmcm9tIFwiLi90ZXN0QmVuY2hWaWV3L3Rlc3RFbnRyeS90ZXN0RW50cnkuanNcIjtcbmltcG9ydCB7IExpbmVFbnRyeSB9IGZyb20gXCIuL3Rlc3RCZW5jaFZpZXcvbGluZUVudHJ5L2xpbmVFbnRyeS5qc1wiO1xuaW1wb3J0IHsgVGVzdEJlbmNoVGVzdFRyaWdnZXIgfSBmcm9tIFwiLi90ZXN0QmVuY2hWaWV3L3Rlc3RCZW5jaFRlc3RUcmlnZ2VyLmpzXCJcbmltcG9ydCB7IERpT2JqZWN0UHJvdmlkZXIgfSBmcm9tIFwiLi90ZXN0QmVuY2hWaWV3L2RpT2JqZWN0UHJvdmlkZXIuanNcIjtcblxuZXhwb3J0IGNsYXNzIFRlc3RCZW5jaFVpIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIC8qKiBAdHlwZSB7VGVzdEJlbmNoVGVzdFRyaWdnZXJ9ICovXG4gICAgICAgIHRoaXMudGVzdFRyaWdnZXIgPSBuZXcgVGVzdEJlbmNoVGVzdFRyaWdnZXIoKTtcblxuXHRcdC8qKiBAdHlwZSB7VGVtcGxhdGVDb21wb25lbnRGYWN0b3J5fSAqL1xuICAgICAgICB0aGlzLmNvbXBvbmVudEZhY3RvcnkgPSBJbmplY3Rpb25Qb2ludC5pbnN0YW5jZShUZW1wbGF0ZUNvbXBvbmVudEZhY3RvcnkpO1xuXG4gICAgICAgIC8qKiBAdHlwZSB7VGVzdEJlbmNoVmlld30gKi9cbiAgICAgICAgdGhpcy50ZXN0QmVuY2hWaWV3ID0gSW5qZWN0aW9uUG9pbnQuaW5zdGFuY2UoVGVzdEJlbmNoVmlldywgW3RoaXMudGVzdFRyaWdnZXJdKTtcblxuICAgICAgICAvKiogQHR5cGUge1Byb3ZpZGVyfSAqL1xuICAgICAgICB0aGlzLnRlc3RFbnRyeVByb3ZpZGVyID0gSW5qZWN0aW9uUG9pbnQucHJvdmlkZXIoVGVzdEVudHJ5KTtcblxuICAgICAgICAvKiogQHR5cGUge1Byb3ZpZGVyfSAqL1xuICAgICAgICB0aGlzLmxpbmVFbnRyeVByb3ZpZGVyID0gSW5qZWN0aW9uUG9pbnQucHJvdmlkZXIoTGluZUVudHJ5KTtcblxuICAgICAgICAvKiogQHR5cGUge1Rlc3RCZW5jaH0gKi9cbiAgICAgICAgdGhpcy50ZXN0QmVuY2ggPSBudWxsO1xuXG4gICAgICAgIHRoaXMudGVzdEVudHJ5TG9hZGVkUHJvbWlzZUFycmF5ID0gW107XG5cbiAgICB9XG5cbiAgICBwb3N0Q29uZmlnKCkge1xuICAgICAgICAvKiogQHR5cGUge1Rlc3RCZW5jaH0gKi9cbiAgICAgICAgdGhpcy50ZXN0QmVuY2ggPSBuZXcgVGVzdEJlbmNoKFxuICAgICAgICAgICAgbmV3IE1ldGhvZCh0aGlzLmxvZywgdGhpcyksXG4gICAgICAgICAgICBuZXcgTWV0aG9kKHRoaXMucmVzdWx0LCB0aGlzKSxcbiAgICAgICAgICAgIG5ldyBEaU9iamVjdFByb3ZpZGVyKCkpO1xuXG4gICAgICAgIHRoaXMudGVzdFRyaWdnZXIudGVzdEJlbmNoID0gdGhpcy50ZXN0QmVuY2g7XG4gICAgfVxuXG4gICAgYWRkVGVzdCh0ZXN0Q2xhc3MpIHtcbiAgICAgICAgY29uc3QgY29udGV4dCA9IHRoaXM7XG4gICAgICAgIGlmKCF0aGlzLnRlc3RCZW5jaC5jb250YWlucyh0ZXN0Q2xhc3MpKSB7XG4gICAgICAgICAgICB0aGlzLnRlc3RCZW5jaC5hZGRUZXN0KHRlc3RDbGFzcyk7XG4gICAgICAgICAgICBjb25zdCB0ZXN0RW50cnlMb2FkZWRQcm9taXNlID0gdGhpcy50ZXN0RW50cnlQcm92aWRlci5nZXQoW3Rlc3RDbGFzcywgdGhpcy50ZXN0QmVuY2hdKS50aGVuKCh0ZXN0RW50cnkpID0+IHtcbiAgICAgICAgICAgICAgICBjb250ZXh0LnRlc3RCZW5jaFZpZXcuYWRkVGVzdEVudHJ5KHRlc3RFbnRyeSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudGVzdEVudHJ5TG9hZGVkUHJvbWlzZUFycmF5LnB1c2godGVzdEVudHJ5TG9hZGVkUHJvbWlzZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtUZXN0Q2xhc3NSZXN1bHR9IHRlc3RDbGFzc1Jlc3VsdCBcbiAgICAgKi9cbiAgICByZXN1bHQodGVzdENsYXNzUmVzdWx0KSB7XG4gICAgICAgIHRoaXMudGVzdEJlbmNoVmlldy5yZXN1bHQodGVzdENsYXNzUmVzdWx0KTtcbiAgICB9XG5cbiAgICBhc3luYyBsb2cobGluZSwgbGV2ZWwpIHtcbiAgICAgICAgY29uc3QgY29sb3IgPSB0aGlzLmFzQ29sb3IobGV2ZWwpO1xuICAgICAgICBjb25zdCBjb250ZXh0ID0gdGhpcztcbiAgICAgICAgY29uc3QgbGluZUVudHJ5ID0gYXdhaXQgdGhpcy5saW5lRW50cnlQcm92aWRlci5nZXQoW2xpbmUsIGNvbG9yXSk7XG4gICAgICAgIGNvbnRleHQudGVzdEJlbmNoVmlldy5hZGRMaW5lKGxpbmVFbnRyeSk7XG4gICAgICAgIHJldHVybiBsaW5lRW50cnk7XG4gICAgfVxuICAgIFxuICAgIGFzQ29sb3IobGV2ZWwpIHtcbiAgICAgICAgaWYgKExvZ2dlci5FUlJPUiA9PT0gbGV2ZWwpIHtcbiAgICAgICAgICAgIHJldHVybiBcInJlZFwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChMb2dnZXIuRkFUQUwgPT09IGxldmVsKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJyZWRcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBnZXQgY29tcG9uZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy50ZXN0QmVuY2hWaWV3LmNvbXBvbmVudDtcbiAgICB9XG5cbn0iXSwibmFtZXMiOlsiSW5qZWN0aW9uUG9pbnQiLCJUZW1wbGF0ZUNvbXBvbmVudEZhY3RvcnkiLCJDYW52YXNTdHlsZXMiLCJTdHlsZSIsIlRlc3RDbGFzc1N0YXRlIiwiTGlzdCIsIk1hcCIsIlRlc3RUcmlnZ2VyIiwiT2JqZWN0UHJvdmlkZXIiLCJNaW5kaUNvbmZpZyIsIkluc3RhbmNlUG9zdENvbmZpZ1RyaWdnZXIiLCJNaW5kaUluamVjdG9yIiwiVGVzdEJlbmNoIiwiTWV0aG9kIiwiTG9nZ2VyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFHTyxNQUFNLFNBQVMsQ0FBQztBQUN2QjtBQUNBLENBQUMsV0FBVyxZQUFZLEdBQUcsRUFBRSxPQUFPLHlDQUF5QyxDQUFDLEVBQUU7QUFDaEYsSUFBSSxXQUFXLFVBQVUsR0FBRyxFQUFFLE9BQU8sd0NBQXdDLENBQUMsRUFBRTtBQUNoRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxHQUFHLElBQUksRUFBRTtBQUNqQztBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsZ0JBQWdCLEdBQUdBLHVCQUFjLENBQUMsUUFBUSxDQUFDQywwQ0FBd0IsQ0FBQyxDQUFDO0FBQ2xGO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ3pCO0FBQ0EsUUFBUSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUMzQixLQUFLO0FBQ0w7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
