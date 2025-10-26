'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var coreutil_v1 = require('coreutil_v1');
var justright_core_v1 = require('justright_core_v1');
var mindi_v1 = require('mindi_v1');
var testbench_v1 = require('testbench_v1');

class LineEntry {

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
        this.templateComponentFactory = mindi_v1.InjectionPoint.instance(justright_core_v1.TemplateComponentFactory);

        /** @type {String} */
        this.line = line;

        this.color = color;
    }

	postConfig() {
		this.component = this.templateComponentFactory.create(LineEntry.COMPONENT_NAME);
        justright_core_v1.CanvasStyles.enableStyle(LineEntry.COMPONENT_NAME);
        this.component.setChild("lineEntry", this.line);
        if (this.color) {
            justright_core_v1.Style.from(this.component.get("lineEntry"))
                .set("color", this.color);
        }
    }

}

class TestEntryFunction {

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

		/** @type {TemplateComponentFactory} */
        this.templateComponentFactory = mindi_v1.InjectionPoint.instance(justright_core_v1.TemplateComponentFactory);

        /** @type {Object} */
        this.testClass = testClass;

        /** @type {Function} */
        this.testFunction = testFunction;

        /** @type {TestTrigger} */
        this.testTrigger = testTrigger;
    }

	postConfig() {
		this.component = this.templateComponentFactory.create(TestEntryFunction.COMPONENT_NAME);
        justright_core_v1.CanvasStyles.enableStyle(TestEntryFunction.COMPONENT_NAME);
        this.component.setChild("testEntryFunctionName", this.testFunction.name);

        this.component.get("runButton").listenTo("click", new coreutil_v1.Method(this,this.runClicked));
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
        justright_core_v1.Style.from(this.component.get("testEntryFunctionName"))
            .set("font-weight", "bold")
            .set("color", "red");
    }

    succeed() {
        justright_core_v1.Style.from(this.component.get("testEntryFunctionName"))
            .set("font-weight", "bold")
            .set("color", "green");
    }

    running() {
        justright_core_v1.Style.from(this.component.get("testEntryFunctionName"))
            .set("font-weight", "bold")
            .set("color", "black");
    }

    reset() {
        justright_core_v1.Style.from(this.component.get("testEntryFunctionName")).clear();
    }
}

class TestEntry {

    static get COMPONENT_NAME() { return "TestEntry"; }
	static get TEMPLATE_URL() { return "/assets/justrightjs-test/testEntry.html"; }
    static get STYLES_URL() { return "/assets/justrightjs-test/testEntry.css"; }
    
    /**
     * 
     * @param {Object} testClass
     * @param {TestTrigger} testTrigger 
     */
	constructor(testClass, testTrigger) {

		/** @type {TemplateComponentFactory} */
        this.templateComponentFactory = mindi_v1.InjectionPoint.instance(justright_core_v1.TemplateComponentFactory);
        
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
		this.component = this.templateComponentFactory.create(TestEntry.COMPONENT_NAME);
        justright_core_v1.CanvasStyles.enableStyle(TestEntry.COMPONENT_NAME);
        this.component.setChild("testEntryName", this.testClass.name);

        this.component.get("runButton").listenTo("click", new coreutil_v1.Method(this,this.runClicked));

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
        justright_core_v1.Style.from(this.component.get("testEntryName"))
            .set("font-weight", "bold")
            .set("color", "red");
    }

    succeed() {
        justright_core_v1.Style.from(this.component.get("testEntryName"))
            .set("font-weight", "bold")
            .set("color", "green");
    }

    running() {
        justright_core_v1.Style.from(this.component.get("testEntryName"))
            .set("font-weight", "bold")
            .set("color", "black");
    }

    reset() {
        this.failed = false;
        this.testEntryFunctionList.forEach((testEntryFunction, parent) => {
            testEntryFunction.reset();
            return true;
        },this);
        justright_core_v1.Style.from(this.component.get("testEntryName")).clear();
    }
}

class TestBenchView {

    static get COMPONENT_NAME() { return "TestBenchView"; }
	static get TEMPLATE_URL() { return "/assets/justrightjs-test/testBenchView.html"; }
    static get STYLES_URL() { return "/assets/justrightjs-test/testBenchView.css"; }
    
    /** 
     * @param {TestTrigger} testTrigger 
     */
	constructor(testTrigger) {

		/** @type {TemplateComponentFactory} */
        this.templateComponentFactory = mindi_v1.InjectionPoint.instance(justright_core_v1.TemplateComponentFactory);
        
        /** @type {TestTrigger} */
        this.testTrigger = testTrigger;

        /** @type {Map<TestEntry>} */
        this.testEntryMap = new coreutil_v1.Map();
    }

	postConfig() {
		this.component = this.templateComponentFactory.create(TestBenchView.COMPONENT_NAME);
        justright_core_v1.CanvasStyles.enableStyle(TestBenchView.COMPONENT_NAME);

		this.component.get("clearButton").listenTo("click", new coreutil_v1.Method(this,this.clearClicked));
		this.component.get("runAllButton").listenTo("click", new coreutil_v1.Method(this,this.runAllClicked));
        this.component.get("resetButton").listenTo("click", new coreutil_v1.Method(this,this.resetClicked));
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
        this.templateComponentFactory = mindi_v1.InjectionPoint.instance(justright_core_v1.TemplateComponentFactory);

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
            new coreutil_v1.Method(this, this.log),
            new coreutil_v1.Method(this, this.result),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianVzdHJpZ2h0X3Rlc3RfdjEuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9qdXN0cmlnaHQvdGVzdEJlbmNoVmlldy9saW5lRW50cnkvbGluZUVudHJ5LmpzIiwiLi4vLi4vc3JjL2p1c3RyaWdodC90ZXN0QmVuY2hWaWV3L3Rlc3RFbnRyeUZ1bmN0aW9uL3Rlc3RFbnRyeUZ1bmN0aW9uLmpzIiwiLi4vLi4vc3JjL2p1c3RyaWdodC90ZXN0QmVuY2hWaWV3L3Rlc3RFbnRyeS90ZXN0RW50cnkuanMiLCIuLi8uLi9zcmMvanVzdHJpZ2h0L3Rlc3RCZW5jaFZpZXcvdGVzdEJlbmNoVmlldy5qcyIsIi4uLy4uL3NyYy9qdXN0cmlnaHQvdGVzdEJlbmNoVmlldy90ZXN0QmVuY2hUZXN0VHJpZ2dlci5qcyIsIi4uLy4uL3NyYy9qdXN0cmlnaHQvdGVzdEJlbmNoVmlldy9kaU9iamVjdFByb3ZpZGVyLmpzIiwiLi4vLi4vc3JjL2p1c3RyaWdodC90ZXN0QmVuY2hVaS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDYW52YXNTdHlsZXMsIFRlbXBsYXRlQ29tcG9uZW50RmFjdG9yeSwgU3R5bGUgfSBmcm9tIFwianVzdHJpZ2h0X2NvcmVfdjFcIjtcbmltcG9ydCB7IEluamVjdGlvblBvaW50IH0gZnJvbSBcIm1pbmRpX3YxXCI7XG5cbmV4cG9ydCBjbGFzcyBMaW5lRW50cnkge1xuXG4gICAgc3RhdGljIGdldCBDT01QT05FTlRfTkFNRSgpIHsgcmV0dXJuIFwiTGluZUVudHJ5XCI7IH1cblx0c3RhdGljIGdldCBURU1QTEFURV9VUkwoKSB7IHJldHVybiBcIi9hc3NldHMvanVzdHJpZ2h0anMtdGVzdC9saW5lRW50cnkuaHRtbFwiOyB9XG4gICAgc3RhdGljIGdldCBTVFlMRVNfVVJMKCkgeyByZXR1cm4gXCIvYXNzZXRzL2p1c3RyaWdodGpzLXRlc3QvbGluZUVudHJ5LmNzc1wiOyB9XG4gICAgXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGxpbmUgXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGNvbG9yIFxuICAgICAqL1xuXHRjb25zdHJ1Y3RvcihsaW5lLCBjb2xvciA9IG51bGwpIHtcblxuXHRcdC8qKiBAdHlwZSB7VGVtcGxhdGVDb21wb25lbnRGYWN0b3J5fSAqL1xuICAgICAgICB0aGlzLnRlbXBsYXRlQ29tcG9uZW50RmFjdG9yeSA9IEluamVjdGlvblBvaW50Lmluc3RhbmNlKFRlbXBsYXRlQ29tcG9uZW50RmFjdG9yeSk7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtTdHJpbmd9ICovXG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG5cbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgIH1cblxuXHRwb3N0Q29uZmlnKCkge1xuXHRcdHRoaXMuY29tcG9uZW50ID0gdGhpcy50ZW1wbGF0ZUNvbXBvbmVudEZhY3RvcnkuY3JlYXRlKExpbmVFbnRyeS5DT01QT05FTlRfTkFNRSk7XG4gICAgICAgIENhbnZhc1N0eWxlcy5lbmFibGVTdHlsZShMaW5lRW50cnkuQ09NUE9ORU5UX05BTUUpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudC5zZXRDaGlsZChcImxpbmVFbnRyeVwiLCB0aGlzLmxpbmUpO1xuICAgICAgICBpZiAodGhpcy5jb2xvcikge1xuICAgICAgICAgICAgU3R5bGUuZnJvbSh0aGlzLmNvbXBvbmVudC5nZXQoXCJsaW5lRW50cnlcIikpXG4gICAgICAgICAgICAgICAgLnNldChcImNvbG9yXCIsIHRoaXMuY29sb3IpO1xuICAgICAgICB9XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcImNvcmV1dGlsX3YxXCI7XG5pbXBvcnQgeyBDYW52YXNTdHlsZXMsIFRlbXBsYXRlQ29tcG9uZW50RmFjdG9yeSwgU3R5bGUgfSBmcm9tIFwianVzdHJpZ2h0X2NvcmVfdjFcIjtcbmltcG9ydCB7IEluamVjdGlvblBvaW50IH0gZnJvbSBcIm1pbmRpX3YxXCI7XG5pbXBvcnQgeyBUZXN0Q2xhc3NTdGF0ZSwgVGVzdFRyaWdnZXIgfSBmcm9tIFwidGVzdGJlbmNoX3YxXCI7XG5cbmV4cG9ydCBjbGFzcyBUZXN0RW50cnlGdW5jdGlvbiB7XG5cbiAgICBzdGF0aWMgZ2V0IENPTVBPTkVOVF9OQU1FKCkgeyByZXR1cm4gXCJUZXN0RW50cnlGdW5jdGlvblwiOyB9XG5cdHN0YXRpYyBnZXQgVEVNUExBVEVfVVJMKCkgeyByZXR1cm4gXCIvYXNzZXRzL2p1c3RyaWdodGpzLXRlc3QvdGVzdEVudHJ5RnVuY3Rpb24uaHRtbFwiOyB9XG4gICAgc3RhdGljIGdldCBTVFlMRVNfVVJMKCkgeyByZXR1cm4gXCIvYXNzZXRzL2p1c3RyaWdodGpzLXRlc3QvdGVzdEVudHJ5RnVuY3Rpb24uY3NzXCI7IH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdGVzdENsYXNzXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gdGVzdEZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtUZXN0VHJpZ2dlcn0gdGVzdFRyaWdnZXIgXG4gICAgICovXG5cdGNvbnN0cnVjdG9yKHRlc3RDbGFzcywgdGVzdEZ1bmN0aW9uLCB0ZXN0VHJpZ2dlcikge1xuXG5cdFx0LyoqIEB0eXBlIHtUZW1wbGF0ZUNvbXBvbmVudEZhY3Rvcnl9ICovXG4gICAgICAgIHRoaXMudGVtcGxhdGVDb21wb25lbnRGYWN0b3J5ID0gSW5qZWN0aW9uUG9pbnQuaW5zdGFuY2UoVGVtcGxhdGVDb21wb25lbnRGYWN0b3J5KTtcblxuICAgICAgICAvKiogQHR5cGUge09iamVjdH0gKi9cbiAgICAgICAgdGhpcy50ZXN0Q2xhc3MgPSB0ZXN0Q2xhc3M7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtGdW5jdGlvbn0gKi9cbiAgICAgICAgdGhpcy50ZXN0RnVuY3Rpb24gPSB0ZXN0RnVuY3Rpb247XG5cbiAgICAgICAgLyoqIEB0eXBlIHtUZXN0VHJpZ2dlcn0gKi9cbiAgICAgICAgdGhpcy50ZXN0VHJpZ2dlciA9IHRlc3RUcmlnZ2VyO1xuICAgIH1cblxuXHRwb3N0Q29uZmlnKCkge1xuXHRcdHRoaXMuY29tcG9uZW50ID0gdGhpcy50ZW1wbGF0ZUNvbXBvbmVudEZhY3RvcnkuY3JlYXRlKFRlc3RFbnRyeUZ1bmN0aW9uLkNPTVBPTkVOVF9OQU1FKTtcbiAgICAgICAgQ2FudmFzU3R5bGVzLmVuYWJsZVN0eWxlKFRlc3RFbnRyeUZ1bmN0aW9uLkNPTVBPTkVOVF9OQU1FKTtcbiAgICAgICAgdGhpcy5jb21wb25lbnQuc2V0Q2hpbGQoXCJ0ZXN0RW50cnlGdW5jdGlvbk5hbWVcIiwgdGhpcy50ZXN0RnVuY3Rpb24ubmFtZSk7XG5cbiAgICAgICAgdGhpcy5jb21wb25lbnQuZ2V0KFwicnVuQnV0dG9uXCIpLmxpc3RlblRvKFwiY2xpY2tcIiwgbmV3IE1ldGhvZCh0aGlzLHRoaXMucnVuQ2xpY2tlZCkpO1xuICAgIH1cblxuICAgIHJ1bkNsaWNrZWQoKSB7XG4gICAgICAgIHRoaXMudGVzdFRyaWdnZXIucnVuRnVuY3Rpb24odGhpcy50ZXN0Q2xhc3MubmFtZSwgdGhpcy50ZXN0RnVuY3Rpb24ubmFtZSk7XG4gICAgfVxuXG4gICAgcmVzdWx0KHRlc3RDbGFzc1N0YXRlKSB7XG4gICAgICAgIGlmIChUZXN0Q2xhc3NTdGF0ZS5SVU5OSU5HID09PSB0ZXN0Q2xhc3NTdGF0ZS5zdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5ydW5uaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFRlc3RDbGFzc1N0YXRlLlNVQ0NFU1MgPT09IHRlc3RDbGFzc1N0YXRlLnN0YXRlKSB7XG4gICAgICAgICAgICB0aGlzLnN1Y2NlZWQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoVGVzdENsYXNzU3RhdGUuRkFJTCA9PT0gdGVzdENsYXNzU3RhdGUuc3RhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuZmFpbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmFpbCgpIHtcbiAgICAgICAgU3R5bGUuZnJvbSh0aGlzLmNvbXBvbmVudC5nZXQoXCJ0ZXN0RW50cnlGdW5jdGlvbk5hbWVcIikpXG4gICAgICAgICAgICAuc2V0KFwiZm9udC13ZWlnaHRcIiwgXCJib2xkXCIpXG4gICAgICAgICAgICAuc2V0KFwiY29sb3JcIiwgXCJyZWRcIik7XG4gICAgfVxuXG4gICAgc3VjY2VlZCgpIHtcbiAgICAgICAgU3R5bGUuZnJvbSh0aGlzLmNvbXBvbmVudC5nZXQoXCJ0ZXN0RW50cnlGdW5jdGlvbk5hbWVcIikpXG4gICAgICAgICAgICAuc2V0KFwiZm9udC13ZWlnaHRcIiwgXCJib2xkXCIpXG4gICAgICAgICAgICAuc2V0KFwiY29sb3JcIiwgXCJncmVlblwiKTtcbiAgICB9XG5cbiAgICBydW5uaW5nKCkge1xuICAgICAgICBTdHlsZS5mcm9tKHRoaXMuY29tcG9uZW50LmdldChcInRlc3RFbnRyeUZ1bmN0aW9uTmFtZVwiKSlcbiAgICAgICAgICAgIC5zZXQoXCJmb250LXdlaWdodFwiLCBcImJvbGRcIilcbiAgICAgICAgICAgIC5zZXQoXCJjb2xvclwiLCBcImJsYWNrXCIpO1xuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgICBTdHlsZS5mcm9tKHRoaXMuY29tcG9uZW50LmdldChcInRlc3RFbnRyeUZ1bmN0aW9uTmFtZVwiKSkuY2xlYXIoKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgTGlzdCwgTWV0aG9kIH0gZnJvbSBcImNvcmV1dGlsX3YxXCI7XG5pbXBvcnQgeyBDYW52YXNTdHlsZXMsIFRlbXBsYXRlQ29tcG9uZW50RmFjdG9yeSwgU3R5bGUgfSBmcm9tIFwianVzdHJpZ2h0X2NvcmVfdjFcIjtcbmltcG9ydCB7IEluamVjdGlvblBvaW50LCBQcm92aWRlciB9IGZyb20gXCJtaW5kaV92MVwiO1xuaW1wb3J0IHsgVGVzdENsYXNzU3RhdGUsIFRlc3RUcmlnZ2VyIH0gZnJvbSBcInRlc3RiZW5jaF92MVwiO1xuaW1wb3J0IHsgVGVzdEVudHJ5RnVuY3Rpb24gfSBmcm9tIFwiLi4vdGVzdEVudHJ5RnVuY3Rpb24vdGVzdEVudHJ5RnVuY3Rpb25cIjtcblxuZXhwb3J0IGNsYXNzIFRlc3RFbnRyeSB7XG5cbiAgICBzdGF0aWMgZ2V0IENPTVBPTkVOVF9OQU1FKCkgeyByZXR1cm4gXCJUZXN0RW50cnlcIjsgfVxuXHRzdGF0aWMgZ2V0IFRFTVBMQVRFX1VSTCgpIHsgcmV0dXJuIFwiL2Fzc2V0cy9qdXN0cmlnaHRqcy10ZXN0L3Rlc3RFbnRyeS5odG1sXCI7IH1cbiAgICBzdGF0aWMgZ2V0IFNUWUxFU19VUkwoKSB7IHJldHVybiBcIi9hc3NldHMvanVzdHJpZ2h0anMtdGVzdC90ZXN0RW50cnkuY3NzXCI7IH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdGVzdENsYXNzXG4gICAgICogQHBhcmFtIHtUZXN0VHJpZ2dlcn0gdGVzdFRyaWdnZXIgXG4gICAgICovXG5cdGNvbnN0cnVjdG9yKHRlc3RDbGFzcywgdGVzdFRyaWdnZXIpIHtcblxuXHRcdC8qKiBAdHlwZSB7VGVtcGxhdGVDb21wb25lbnRGYWN0b3J5fSAqL1xuICAgICAgICB0aGlzLnRlbXBsYXRlQ29tcG9uZW50RmFjdG9yeSA9IEluamVjdGlvblBvaW50Lmluc3RhbmNlKFRlbXBsYXRlQ29tcG9uZW50RmFjdG9yeSk7XG4gICAgICAgIFxuICAgICAgICAvKiogQHR5cGUge1Byb3ZpZGVyPFRlc3RFbnRyeUZ1bmN0aW9uPn0gKi9cbiAgICAgICAgdGhpcy50ZXN0RW50cnlGdW5jdGlvblByb3ZpZGVyID0gSW5qZWN0aW9uUG9pbnQucHJvdmlkZXIoVGVzdEVudHJ5RnVuY3Rpb24pXG5cbiAgICAgICAgLyoqIEB0eXBlIHtPYmplY3R9ICovXG4gICAgICAgIHRoaXMudGVzdENsYXNzID0gdGVzdENsYXNzO1xuXG4gICAgICAgIC8qKiBAdHlwZSB7VGVzdFRyaWdnZXJ9ICovXG4gICAgICAgIHRoaXMudGVzdFRyaWdnZXIgPSB0ZXN0VHJpZ2dlcjtcblxuICAgICAgICAvKiogQHR5cGUge0xpc3Q8VGVzdEVudHJ5RnVuY3Rpb24+fSAqL1xuICAgICAgICB0aGlzLnRlc3RFbnRyeUZ1bmN0aW9uTGlzdCA9IG5ldyBMaXN0KCk7XG5cbiAgICAgICAgdGhpcy5mYWlsZWQgPSBmYWxzZTtcbiAgICB9XG5cblx0cG9zdENvbmZpZygpIHtcblx0XHR0aGlzLmNvbXBvbmVudCA9IHRoaXMudGVtcGxhdGVDb21wb25lbnRGYWN0b3J5LmNyZWF0ZShUZXN0RW50cnkuQ09NUE9ORU5UX05BTUUpO1xuICAgICAgICBDYW52YXNTdHlsZXMuZW5hYmxlU3R5bGUoVGVzdEVudHJ5LkNPTVBPTkVOVF9OQU1FKTtcbiAgICAgICAgdGhpcy5jb21wb25lbnQuc2V0Q2hpbGQoXCJ0ZXN0RW50cnlOYW1lXCIsIHRoaXMudGVzdENsYXNzLm5hbWUpO1xuXG4gICAgICAgIHRoaXMuY29tcG9uZW50LmdldChcInJ1bkJ1dHRvblwiKS5saXN0ZW5UbyhcImNsaWNrXCIsIG5ldyBNZXRob2QodGhpcyx0aGlzLnJ1bkNsaWNrZWQpKTtcblxuICAgICAgICAvKiogQHR5cGUge0xpc3Q8VGVzdEVudHJ5RnVuY3Rpb24+fSAqL1xuICAgICAgICBjb25zdCB0ZXN0RnVuY3Rpb25zID0gdGhpcy50ZXN0Q2xhc3MudGVzdEZ1bmN0aW9ucygpO1xuICAgICAgICB0ZXN0RnVuY3Rpb25zLmZvckVhY2goKHRlc3RGdW5jdGlvbiwgcGFyZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRlc3RFbnRyeUZ1bmN0aW9uUHJvdmlkZXIuZ2V0KFt0aGlzLnRlc3RDbGFzcywgdGVzdEZ1bmN0aW9uLCB0aGlzLnRlc3RUcmlnZ2VyXSkudGhlbigodGVzdEVudHJ5RnVuY3Rpb24pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnRlc3RFbnRyeUZ1bmN0aW9uTGlzdC5hZGQodGVzdEVudHJ5RnVuY3Rpb24pO1xuICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50LmdldChcInRlc3RFbnRyeUZ1bmN0aW9uc1wiKS5hZGRDaGlsZCh0ZXN0RW50cnlGdW5jdGlvbi5jb21wb25lbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSx0aGlzKTtcbiAgICB9XG5cbiAgICBydW5DbGlja2VkKCkge1xuICAgICAgICB0aGlzLmZhaWxlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnRlc3RUcmlnZ2VyLnJ1bkNsYXNzKHRoaXMudGVzdENsYXNzLm5hbWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7VGVzdENsYXNzU3RhdGV9IHRlc3RDbGFzc1N0YXRlIFxuICAgICAqL1xuICAgIHJlc3VsdCh0ZXN0Q2xhc3NTdGF0ZSkge1xuICAgICAgICB0aGlzLnRlc3RFbnRyeUZ1bmN0aW9uTGlzdC5mb3JFYWNoKCh0ZXN0RW50cnlGdW5jdGlvbiwgcGFyZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAodGVzdEVudHJ5RnVuY3Rpb24udGVzdEZ1bmN0aW9uLm5hbWUgPT09IHRlc3RDbGFzc1N0YXRlLmZ1bmN0aW9uTmFtZSkge1xuICAgICAgICAgICAgICAgIHRlc3RFbnRyeUZ1bmN0aW9uLnJlc3VsdCh0ZXN0Q2xhc3NTdGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSx0aGlzKTtcbiAgICAgICAgaWYgKCF0aGlzLmZhaWxlZCAmJiBUZXN0Q2xhc3NTdGF0ZS5SVU5OSU5HID09PSB0ZXN0Q2xhc3NTdGF0ZS5zdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5ydW5uaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmZhaWxlZCAmJiBUZXN0Q2xhc3NTdGF0ZS5TVUNDRVNTID09PSB0ZXN0Q2xhc3NTdGF0ZS5zdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5zdWNjZWVkKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFRlc3RDbGFzc1N0YXRlLkZBSUwgPT09IHRlc3RDbGFzc1N0YXRlLnN0YXRlKSB7XG4gICAgICAgICAgICB0aGlzLmZhaWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZhaWwoKSB7XG4gICAgICAgIHRoaXMuZmFpbGVkID0gdHJ1ZTtcbiAgICAgICAgU3R5bGUuZnJvbSh0aGlzLmNvbXBvbmVudC5nZXQoXCJ0ZXN0RW50cnlOYW1lXCIpKVxuICAgICAgICAgICAgLnNldChcImZvbnQtd2VpZ2h0XCIsIFwiYm9sZFwiKVxuICAgICAgICAgICAgLnNldChcImNvbG9yXCIsIFwicmVkXCIpO1xuICAgIH1cblxuICAgIHN1Y2NlZWQoKSB7XG4gICAgICAgIFN0eWxlLmZyb20odGhpcy5jb21wb25lbnQuZ2V0KFwidGVzdEVudHJ5TmFtZVwiKSlcbiAgICAgICAgICAgIC5zZXQoXCJmb250LXdlaWdodFwiLCBcImJvbGRcIilcbiAgICAgICAgICAgIC5zZXQoXCJjb2xvclwiLCBcImdyZWVuXCIpO1xuICAgIH1cblxuICAgIHJ1bm5pbmcoKSB7XG4gICAgICAgIFN0eWxlLmZyb20odGhpcy5jb21wb25lbnQuZ2V0KFwidGVzdEVudHJ5TmFtZVwiKSlcbiAgICAgICAgICAgIC5zZXQoXCJmb250LXdlaWdodFwiLCBcImJvbGRcIilcbiAgICAgICAgICAgIC5zZXQoXCJjb2xvclwiLCBcImJsYWNrXCIpO1xuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgICB0aGlzLmZhaWxlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnRlc3RFbnRyeUZ1bmN0aW9uTGlzdC5mb3JFYWNoKCh0ZXN0RW50cnlGdW5jdGlvbiwgcGFyZW50KSA9PiB7XG4gICAgICAgICAgICB0ZXN0RW50cnlGdW5jdGlvbi5yZXNldCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sdGhpcyk7XG4gICAgICAgIFN0eWxlLmZyb20odGhpcy5jb21wb25lbnQuZ2V0KFwidGVzdEVudHJ5TmFtZVwiKSkuY2xlYXIoKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgTWFwLCBNZXRob2QgfSBmcm9tIFwiY29yZXV0aWxfdjFcIjtcbmltcG9ydCB7IENhbnZhc1N0eWxlcywgVGVtcGxhdGVDb21wb25lbnRGYWN0b3J5IH0gZnJvbSBcImp1c3RyaWdodF9jb3JlX3YxXCI7XG5pbXBvcnQgeyBJbmplY3Rpb25Qb2ludCB9IGZyb20gXCJtaW5kaV92MVwiO1xuaW1wb3J0IHsgVGVzdENsYXNzU3RhdGUsIFRlc3RUcmlnZ2VyIH0gZnJvbSBcInRlc3RiZW5jaF92MVwiO1xuaW1wb3J0IHsgTGluZUVudHJ5IH0gZnJvbSBcIi4vbGluZUVudHJ5L2xpbmVFbnRyeS5qc1wiO1xuaW1wb3J0IHsgVGVzdEVudHJ5IH0gZnJvbSBcIi4vdGVzdEVudHJ5L3Rlc3RFbnRyeS5qc1wiXG5cbmV4cG9ydCBjbGFzcyBUZXN0QmVuY2hWaWV3IHtcblxuICAgIHN0YXRpYyBnZXQgQ09NUE9ORU5UX05BTUUoKSB7IHJldHVybiBcIlRlc3RCZW5jaFZpZXdcIjsgfVxuXHRzdGF0aWMgZ2V0IFRFTVBMQVRFX1VSTCgpIHsgcmV0dXJuIFwiL2Fzc2V0cy9qdXN0cmlnaHRqcy10ZXN0L3Rlc3RCZW5jaFZpZXcuaHRtbFwiOyB9XG4gICAgc3RhdGljIGdldCBTVFlMRVNfVVJMKCkgeyByZXR1cm4gXCIvYXNzZXRzL2p1c3RyaWdodGpzLXRlc3QvdGVzdEJlbmNoVmlldy5jc3NcIjsgfVxuICAgIFxuICAgIC8qKiBcbiAgICAgKiBAcGFyYW0ge1Rlc3RUcmlnZ2VyfSB0ZXN0VHJpZ2dlciBcbiAgICAgKi9cblx0Y29uc3RydWN0b3IodGVzdFRyaWdnZXIpIHtcblxuXHRcdC8qKiBAdHlwZSB7VGVtcGxhdGVDb21wb25lbnRGYWN0b3J5fSAqL1xuICAgICAgICB0aGlzLnRlbXBsYXRlQ29tcG9uZW50RmFjdG9yeSA9IEluamVjdGlvblBvaW50Lmluc3RhbmNlKFRlbXBsYXRlQ29tcG9uZW50RmFjdG9yeSk7XG4gICAgICAgIFxuICAgICAgICAvKiogQHR5cGUge1Rlc3RUcmlnZ2VyfSAqL1xuICAgICAgICB0aGlzLnRlc3RUcmlnZ2VyID0gdGVzdFRyaWdnZXI7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtNYXA8VGVzdEVudHJ5Pn0gKi9cbiAgICAgICAgdGhpcy50ZXN0RW50cnlNYXAgPSBuZXcgTWFwKCk7XG4gICAgfVxuXG5cdHBvc3RDb25maWcoKSB7XG5cdFx0dGhpcy5jb21wb25lbnQgPSB0aGlzLnRlbXBsYXRlQ29tcG9uZW50RmFjdG9yeS5jcmVhdGUoVGVzdEJlbmNoVmlldy5DT01QT05FTlRfTkFNRSk7XG4gICAgICAgIENhbnZhc1N0eWxlcy5lbmFibGVTdHlsZShUZXN0QmVuY2hWaWV3LkNPTVBPTkVOVF9OQU1FKTtcblxuXHRcdHRoaXMuY29tcG9uZW50LmdldChcImNsZWFyQnV0dG9uXCIpLmxpc3RlblRvKFwiY2xpY2tcIiwgbmV3IE1ldGhvZCh0aGlzLHRoaXMuY2xlYXJDbGlja2VkKSk7XG5cdFx0dGhpcy5jb21wb25lbnQuZ2V0KFwicnVuQWxsQnV0dG9uXCIpLmxpc3RlblRvKFwiY2xpY2tcIiwgbmV3IE1ldGhvZCh0aGlzLHRoaXMucnVuQWxsQ2xpY2tlZCkpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudC5nZXQoXCJyZXNldEJ1dHRvblwiKS5saXN0ZW5UbyhcImNsaWNrXCIsIG5ldyBNZXRob2QodGhpcyx0aGlzLnJlc2V0Q2xpY2tlZCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7VGVzdEVudHJ5fSB0ZXN0RW50cnkgXG4gICAgICovXG4gICAgYWRkVGVzdEVudHJ5KHRlc3RFbnRyeSkge1xuICAgICAgICB0aGlzLnRlc3RFbnRyeU1hcC5zZXQodGVzdEVudHJ5LnRlc3RDbGFzcy5uYW1lLCB0ZXN0RW50cnkpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudC5hZGRDaGlsZChcInRlc3RMaXN0XCIsIHRlc3RFbnRyeS5jb21wb25lbnQpO1xuICAgIH1cblxuICAgIHJ1bkFsbENsaWNrZWQoKSB7XG4gICAgICAgIHRoaXMudGVzdFRyaWdnZXIucnVuQWxsKCk7XG4gICAgfVxuXG4gICAgY2xlYXJDbGlja2VkKCkge1xuICAgICAgICB0aGlzLmNvbXBvbmVudC5jbGVhckNoaWxkcmVuKFwidGVzdFJlc3VsdFwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0xpbmVFbnRyeX0gbGluZSBcbiAgICAgKi9cbiAgICBhZGRMaW5lKGxpbmUpIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnQuYWRkQ2hpbGQoXCJ0ZXN0UmVzdWx0XCIsIGxpbmUuY29tcG9uZW50KTtcbiAgICB9XG5cbiAgICByZXNldENsaWNrZWQoKSB7XG4gICAgICAgIHRoaXMudGVzdEVudHJ5TWFwLmZvckVhY2goKGtleSwgdmFsdWUsIHBhcmVudCkgPT4ge1xuICAgICAgICAgICAgLyoqIEB0eXBlIHtUZXN0RW50cnl9ICovXG4gICAgICAgICAgICBjb25zdCB0ZXN0RW50cnkgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRlc3RFbnRyeS5yZXNldCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sdGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtUZXN0Q2xhc3NTdGF0ZX0gdGVzdENsYXNzU3RhdGUgXG4gICAgICovXG4gICAgcmVzdWx0KHRlc3RDbGFzc1N0YXRlKSB7XG4gICAgICAgIGlmICh0aGlzLnRlc3RFbnRyeU1hcC5jb250YWlucyh0ZXN0Q2xhc3NTdGF0ZS5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgICAvKiogQHR5cGUge1Rlc3RFbnRyeX0gKi9cbiAgICAgICAgICAgIGNvbnN0IHRlc3RFbnRyeSA9IHRoaXMudGVzdEVudHJ5TWFwLmdldCh0ZXN0Q2xhc3NTdGF0ZS5jbGFzc05hbWUpO1xuICAgICAgICAgICAgdGVzdEVudHJ5LnJlc3VsdCh0ZXN0Q2xhc3NTdGF0ZSk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgVGVzdEJlbmNoLCBUZXN0VHJpZ2dlciB9IGZyb20gXCJ0ZXN0YmVuY2hfdjFcIjtcblxuZXhwb3J0IGNsYXNzIFRlc3RCZW5jaFRlc3RUcmlnZ2VyIGV4dGVuZHMgVGVzdFRyaWdnZXIge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHR5cGUge1Rlc3RCZW5jaH1cbiAgICAgKi9cbiAgICBzZXQgdGVzdEJlbmNoKHRlc3RCZW5jaCkge1xuICAgICAgICAvKiogQHR5cGUge1Rlc3RCZW5jaH0gKi9cbiAgICAgICAgdGhpcy50aGVUZXN0QmVuY2ggPSB0ZXN0QmVuY2g7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUnVuIHRlc3QgYnkgY2xhc3MgbmFtZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWUgXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZ1bmN0aW9uTmFtZVxuICAgICAqL1xuICAgIHJ1bkZ1bmN0aW9uKGNsYXNzTmFtZSwgZnVuY3Rpb25OYW1lKSB7XG4gICAgICAgIHRoaXMudGhlVGVzdEJlbmNoLnJ1bkZ1bmN0aW9uKGNsYXNzTmFtZSwgZnVuY3Rpb25OYW1lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSdW4gdGVzdCBieSBjbGFzcyBuYW1lXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZSBcbiAgICAgKi9cbiAgICBydW5DbGFzcyhjbGFzc05hbWUpIHtcbiAgICAgICAgdGhpcy50aGVUZXN0QmVuY2gucnVuQ2xhc3MoY2xhc3NOYW1lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSdW4gYWxsIHRlc3QgY2xhc3Nlc1xuICAgICAqL1xuICAgIHJ1bkFsbCgpIHtcbiAgICAgICAgdGhpcy50aGVUZXN0QmVuY2gucnVuQWxsKCk7XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgSW5zdGFuY2VQb3N0Q29uZmlnVHJpZ2dlciwgTWluZGlDb25maWcsIE1pbmRpSW5qZWN0b3IgfSBmcm9tIFwibWluZGlfdjFcIjtcbmltcG9ydCB7IE9iamVjdFByb3ZpZGVyIH0gZnJvbSBcInRlc3RiZW5jaF92MVwiO1xuXG5leHBvcnQgY2xhc3MgRGlPYmplY3RQcm92aWRlciBleHRlbmRzIE9iamVjdFByb3ZpZGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIGFzeW5jIHByb3ZpZGUodGhlQ2xhc3MsIGFyZ3MgPSBbXSkge1xuICAgICAgICBjb25zdCBvYmplY3QgPSBuZXcgdGhlQ2xhc3MoLi4uYXJncyk7XG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IG5ldyBNaW5kaUNvbmZpZygpO1xuICAgICAgICBjb25maWcuYWRkQWxsSW5zdGFuY2VQcm9jZXNzb3IoW0luc3RhbmNlUG9zdENvbmZpZ1RyaWdnZXJdKTtcbiAgICAgICAgaWYgKG9iamVjdC50eXBlQ29uZmlnTGlzdCkge1xuICAgICAgICAgICAgY29uZmlnLmFkZEFsbFR5cGVDb25maWcob2JqZWN0LnR5cGVDb25maWdMaXN0KTtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBjb25maWcuZmluYWxpemUoKTtcbiAgICAgICAgYXdhaXQgTWluZGlJbmplY3Rvci5nZXRJbnN0YW5jZSgpLmluamVjdFRhcmdldChvYmplY3QsIGNvbmZpZyk7XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgTG9nZ2VyLCBNZXRob2QgfSBmcm9tIFwiY29yZXV0aWxfdjFcIjtcbmltcG9ydCB7IFRlbXBsYXRlQ29tcG9uZW50RmFjdG9yeSB9IGZyb20gXCJqdXN0cmlnaHRfY29yZV92MVwiO1xuaW1wb3J0IHsgSW5qZWN0aW9uUG9pbnQsIFByb3ZpZGVyIH0gZnJvbSBcIm1pbmRpX3YxXCI7XG5pbXBvcnQgeyBUZXN0QmVuY2gsIFRlc3RDbGFzc1Jlc3VsdCB9IGZyb20gXCJ0ZXN0YmVuY2hfdjFcIjtcbmltcG9ydCB7IFRlc3RCZW5jaFZpZXcgfSBmcm9tIFwiLi90ZXN0QmVuY2hWaWV3L3Rlc3RCZW5jaFZpZXcuanNcIjtcbmltcG9ydCB7IFRlc3RFbnRyeSB9IGZyb20gXCIuL3Rlc3RCZW5jaFZpZXcvdGVzdEVudHJ5L3Rlc3RFbnRyeS5qc1wiO1xuaW1wb3J0IHsgTGluZUVudHJ5IH0gZnJvbSBcIi4vdGVzdEJlbmNoVmlldy9saW5lRW50cnkvbGluZUVudHJ5LmpzXCI7XG5pbXBvcnQgeyBUZXN0QmVuY2hUZXN0VHJpZ2dlciB9IGZyb20gXCIuL3Rlc3RCZW5jaFZpZXcvdGVzdEJlbmNoVGVzdFRyaWdnZXIuanNcIlxuaW1wb3J0IHsgRGlPYmplY3RQcm92aWRlciB9IGZyb20gXCIuL3Rlc3RCZW5jaFZpZXcvZGlPYmplY3RQcm92aWRlci5qc1wiO1xuXG5leHBvcnQgY2xhc3MgVGVzdEJlbmNoVWkge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtUZXN0QmVuY2hUZXN0VHJpZ2dlcn0gKi9cbiAgICAgICAgdGhpcy50ZXN0VHJpZ2dlciA9IG5ldyBUZXN0QmVuY2hUZXN0VHJpZ2dlcigpO1xuXG5cdFx0LyoqIEB0eXBlIHtUZW1wbGF0ZUNvbXBvbmVudEZhY3Rvcnl9ICovXG4gICAgICAgIHRoaXMudGVtcGxhdGVDb21wb25lbnRGYWN0b3J5ID0gSW5qZWN0aW9uUG9pbnQuaW5zdGFuY2UoVGVtcGxhdGVDb21wb25lbnRGYWN0b3J5KTtcblxuICAgICAgICAvKiogQHR5cGUge1Rlc3RCZW5jaFZpZXd9ICovXG4gICAgICAgIHRoaXMudGVzdEJlbmNoVmlldyA9IEluamVjdGlvblBvaW50Lmluc3RhbmNlKFRlc3RCZW5jaFZpZXcsIFt0aGlzLnRlc3RUcmlnZ2VyXSk7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtQcm92aWRlcn0gKi9cbiAgICAgICAgdGhpcy50ZXN0RW50cnlQcm92aWRlciA9IEluamVjdGlvblBvaW50LnByb3ZpZGVyKFRlc3RFbnRyeSk7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtQcm92aWRlcn0gKi9cbiAgICAgICAgdGhpcy5saW5lRW50cnlQcm92aWRlciA9IEluamVjdGlvblBvaW50LnByb3ZpZGVyKExpbmVFbnRyeSk7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtUZXN0QmVuY2h9ICovXG4gICAgICAgIHRoaXMudGVzdEJlbmNoID0gbnVsbDtcblxuICAgICAgICB0aGlzLnRlc3RFbnRyeUxvYWRlZFByb21pc2VBcnJheSA9IFtdO1xuXG4gICAgfVxuXG4gICAgcG9zdENvbmZpZygpIHtcbiAgICAgICAgLyoqIEB0eXBlIHtUZXN0QmVuY2h9ICovXG4gICAgICAgIHRoaXMudGVzdEJlbmNoID0gbmV3IFRlc3RCZW5jaChcbiAgICAgICAgICAgIG5ldyBNZXRob2QodGhpcywgdGhpcy5sb2cpLFxuICAgICAgICAgICAgbmV3IE1ldGhvZCh0aGlzLCB0aGlzLnJlc3VsdCksXG4gICAgICAgICAgICBuZXcgRGlPYmplY3RQcm92aWRlcigpKTtcblxuICAgICAgICB0aGlzLnRlc3RUcmlnZ2VyLnRlc3RCZW5jaCA9IHRoaXMudGVzdEJlbmNoO1xuICAgIH1cblxuICAgIGFkZFRlc3QodGVzdENsYXNzKSB7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzO1xuICAgICAgICBpZighdGhpcy50ZXN0QmVuY2guY29udGFpbnModGVzdENsYXNzKSkge1xuICAgICAgICAgICAgdGhpcy50ZXN0QmVuY2guYWRkVGVzdCh0ZXN0Q2xhc3MpO1xuICAgICAgICAgICAgY29uc3QgdGVzdEVudHJ5TG9hZGVkUHJvbWlzZSA9IHRoaXMudGVzdEVudHJ5UHJvdmlkZXIuZ2V0KFt0ZXN0Q2xhc3MsIHRoaXMudGVzdEJlbmNoXSkudGhlbigodGVzdEVudHJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgY29udGV4dC50ZXN0QmVuY2hWaWV3LmFkZFRlc3RFbnRyeSh0ZXN0RW50cnkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnRlc3RFbnRyeUxvYWRlZFByb21pc2VBcnJheS5wdXNoKHRlc3RFbnRyeUxvYWRlZFByb21pc2UpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7VGVzdENsYXNzUmVzdWx0fSB0ZXN0Q2xhc3NSZXN1bHQgXG4gICAgICovXG4gICAgcmVzdWx0KHRlc3RDbGFzc1Jlc3VsdCkge1xuICAgICAgICB0aGlzLnRlc3RCZW5jaFZpZXcucmVzdWx0KHRlc3RDbGFzc1Jlc3VsdCk7XG4gICAgfVxuXG4gICAgYXN5bmMgbG9nKGxpbmUsIGxldmVsKSB7XG4gICAgICAgIGNvbnN0IGNvbG9yID0gdGhpcy5hc0NvbG9yKGxldmVsKTtcbiAgICAgICAgY29uc3QgY29udGV4dCA9IHRoaXM7XG4gICAgICAgIGNvbnN0IGxpbmVFbnRyeSA9IGF3YWl0IHRoaXMubGluZUVudHJ5UHJvdmlkZXIuZ2V0KFtsaW5lLCBjb2xvcl0pO1xuICAgICAgICBjb250ZXh0LnRlc3RCZW5jaFZpZXcuYWRkTGluZShsaW5lRW50cnkpO1xuICAgICAgICByZXR1cm4gbGluZUVudHJ5O1xuICAgIH1cbiAgICBcbiAgICBhc0NvbG9yKGxldmVsKSB7XG4gICAgICAgIGlmIChMb2dnZXIuRVJST1IgPT09IGxldmVsKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJyZWRcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoTG9nZ2VyLkZBVEFMID09PSBsZXZlbCkge1xuICAgICAgICAgICAgcmV0dXJuIFwicmVkXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZ2V0IGNvbXBvbmVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGVzdEJlbmNoVmlldy5jb21wb25lbnQ7XG4gICAgfVxuXG59Il0sIm5hbWVzIjpbIkluamVjdGlvblBvaW50IiwiVGVtcGxhdGVDb21wb25lbnRGYWN0b3J5IiwiQ2FudmFzU3R5bGVzIiwiU3R5bGUiLCJNZXRob2QiLCJUZXN0Q2xhc3NTdGF0ZSIsIkxpc3QiLCJNYXAiLCJUZXN0VHJpZ2dlciIsIk9iamVjdFByb3ZpZGVyIiwiTWluZGlDb25maWciLCJJbnN0YW5jZVBv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
