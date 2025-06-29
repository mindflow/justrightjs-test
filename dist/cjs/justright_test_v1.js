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

		/** @type {ComponentFactory} */
        this.componentFactory = mindi_v1.InjectionPoint.instance(justright_core_v1.ComponentFactory);

        /** @type {String} */
        this.line = line;

        this.color = color;
    }

	postConfig() {
		this.component = this.componentFactory.create(LineEntry.COMPONENT_NAME);
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

		/** @type {ComponentFactory} */
        this.componentFactory = mindi_v1.InjectionPoint.instance(justright_core_v1.ComponentFactory);

        /** @type {Object} */
        this.testClass = testClass;

        /** @type {Function} */
        this.testFunction = testFunction;

        /** @type {TestTrigger} */
        this.testTrigger = testTrigger;
    }

	postConfig() {
		this.component = this.componentFactory.create(TestEntryFunction.COMPONENT_NAME);
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

		/** @type {ComponentFactory} */
        this.componentFactory = mindi_v1.InjectionPoint.instance(justright_core_v1.ComponentFactory);
        
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
		this.component = this.componentFactory.create(TestEntry.COMPONENT_NAME);
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

		/** @type {ComponentFactory} */
        this.componentFactory = mindi_v1.InjectionPoint.instance(justright_core_v1.ComponentFactory);
        
        /** @type {TestTrigger} */
        this.testTrigger = testTrigger;

        /** @type {Map<TestEntry>} */
        this.testEntryMap = new coreutil_v1.Map();
    }

	postConfig() {
		this.component = this.componentFactory.create(TestBenchView.COMPONENT_NAME);
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

		/** @type {ComponentFactory} */
        this.componentFactory = mindi_v1.InjectionPoint.instance(justright_core_v1.ComponentFactory);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianVzdHJpZ2h0X3Rlc3RfdjEuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9qdXN0cmlnaHQvdGVzdEJlbmNoVmlldy9saW5lRW50cnkvbGluZUVudHJ5LmpzIiwiLi4vLi4vc3JjL2p1c3RyaWdodC90ZXN0QmVuY2hWaWV3L3Rlc3RFbnRyeUZ1bmN0aW9uL3Rlc3RFbnRyeUZ1bmN0aW9uLmpzIiwiLi4vLi4vc3JjL2p1c3RyaWdodC90ZXN0QmVuY2hWaWV3L3Rlc3RFbnRyeS90ZXN0RW50cnkuanMiLCIuLi8uLi9zcmMvanVzdHJpZ2h0L3Rlc3RCZW5jaFZpZXcvdGVzdEJlbmNoVmlldy5qcyIsIi4uLy4uL3NyYy9qdXN0cmlnaHQvdGVzdEJlbmNoVmlldy90ZXN0QmVuY2hUZXN0VHJpZ2dlci5qcyIsIi4uLy4uL3NyYy9qdXN0cmlnaHQvdGVzdEJlbmNoVmlldy9kaU9iamVjdFByb3ZpZGVyLmpzIiwiLi4vLi4vc3JjL2p1c3RyaWdodC90ZXN0QmVuY2hVaS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDYW52YXNTdHlsZXMsIENvbXBvbmVudEZhY3RvcnksIFN0eWxlIH0gZnJvbSBcImp1c3RyaWdodF9jb3JlX3YxXCI7XG5pbXBvcnQgeyBJbmplY3Rpb25Qb2ludCB9IGZyb20gXCJtaW5kaV92MVwiO1xuXG5leHBvcnQgY2xhc3MgTGluZUVudHJ5IHtcblxuICAgIHN0YXRpYyBnZXQgQ09NUE9ORU5UX05BTUUoKSB7IHJldHVybiBcIkxpbmVFbnRyeVwiOyB9XG5cdHN0YXRpYyBnZXQgVEVNUExBVEVfVVJMKCkgeyByZXR1cm4gXCIvYXNzZXRzL2p1c3RyaWdodGpzLXRlc3QvbGluZUVudHJ5Lmh0bWxcIjsgfVxuICAgIHN0YXRpYyBnZXQgU1RZTEVTX1VSTCgpIHsgcmV0dXJuIFwiL2Fzc2V0cy9qdXN0cmlnaHRqcy10ZXN0L2xpbmVFbnRyeS5jc3NcIjsgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBsaW5lIFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjb2xvciBcbiAgICAgKi9cblx0Y29uc3RydWN0b3IobGluZSwgY29sb3IgPSBudWxsKSB7XG5cblx0XHQvKiogQHR5cGUge0NvbXBvbmVudEZhY3Rvcnl9ICovXG4gICAgICAgIHRoaXMuY29tcG9uZW50RmFjdG9yeSA9IEluamVjdGlvblBvaW50Lmluc3RhbmNlKENvbXBvbmVudEZhY3RvcnkpO1xuXG4gICAgICAgIC8qKiBAdHlwZSB7U3RyaW5nfSAqL1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuXG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgICB9XG5cblx0cG9zdENvbmZpZygpIHtcblx0XHR0aGlzLmNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50RmFjdG9yeS5jcmVhdGUoTGluZUVudHJ5LkNPTVBPTkVOVF9OQU1FKTtcbiAgICAgICAgQ2FudmFzU3R5bGVzLmVuYWJsZVN0eWxlKExpbmVFbnRyeS5DT01QT05FTlRfTkFNRSk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50LnNldENoaWxkKFwibGluZUVudHJ5XCIsIHRoaXMubGluZSk7XG4gICAgICAgIGlmICh0aGlzLmNvbG9yKSB7XG4gICAgICAgICAgICBTdHlsZS5mcm9tKHRoaXMuY29tcG9uZW50LmdldChcImxpbmVFbnRyeVwiKSlcbiAgICAgICAgICAgICAgICAuc2V0KFwiY29sb3JcIiwgdGhpcy5jb2xvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiY29yZXV0aWxfdjFcIjtcbmltcG9ydCB7IENhbnZhc1N0eWxlcywgQ29tcG9uZW50RmFjdG9yeSwgU3R5bGUgfSBmcm9tIFwianVzdHJpZ2h0X2NvcmVfdjFcIjtcbmltcG9ydCB7IEluamVjdGlvblBvaW50IH0gZnJvbSBcIm1pbmRpX3YxXCI7XG5pbXBvcnQgeyBUZXN0Q2xhc3NTdGF0ZSwgVGVzdFRyaWdnZXIgfSBmcm9tIFwidGVzdGJlbmNoX3YxXCI7XG5cbmV4cG9ydCBjbGFzcyBUZXN0RW50cnlGdW5jdGlvbiB7XG5cbiAgICBzdGF0aWMgZ2V0IENPTVBPTkVOVF9OQU1FKCkgeyByZXR1cm4gXCJUZXN0RW50cnlGdW5jdGlvblwiOyB9XG5cdHN0YXRpYyBnZXQgVEVNUExBVEVfVVJMKCkgeyByZXR1cm4gXCIvYXNzZXRzL2p1c3RyaWdodGpzLXRlc3QvdGVzdEVudHJ5RnVuY3Rpb24uaHRtbFwiOyB9XG4gICAgc3RhdGljIGdldCBTVFlMRVNfVVJMKCkgeyByZXR1cm4gXCIvYXNzZXRzL2p1c3RyaWdodGpzLXRlc3QvdGVzdEVudHJ5RnVuY3Rpb24uY3NzXCI7IH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdGVzdENsYXNzXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gdGVzdEZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtUZXN0VHJpZ2dlcn0gdGVzdFRyaWdnZXIgXG4gICAgICovXG5cdGNvbnN0cnVjdG9yKHRlc3RDbGFzcywgdGVzdEZ1bmN0aW9uLCB0ZXN0VHJpZ2dlcikge1xuXG5cdFx0LyoqIEB0eXBlIHtDb21wb25lbnRGYWN0b3J5fSAqL1xuICAgICAgICB0aGlzLmNvbXBvbmVudEZhY3RvcnkgPSBJbmplY3Rpb25Qb2ludC5pbnN0YW5jZShDb21wb25lbnRGYWN0b3J5KTtcblxuICAgICAgICAvKiogQHR5cGUge09iamVjdH0gKi9cbiAgICAgICAgdGhpcy50ZXN0Q2xhc3MgPSB0ZXN0Q2xhc3M7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtGdW5jdGlvbn0gKi9cbiAgICAgICAgdGhpcy50ZXN0RnVuY3Rpb24gPSB0ZXN0RnVuY3Rpb247XG5cbiAgICAgICAgLyoqIEB0eXBlIHtUZXN0VHJpZ2dlcn0gKi9cbiAgICAgICAgdGhpcy50ZXN0VHJpZ2dlciA9IHRlc3RUcmlnZ2VyO1xuICAgIH1cblxuXHRwb3N0Q29uZmlnKCkge1xuXHRcdHRoaXMuY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRGYWN0b3J5LmNyZWF0ZShUZXN0RW50cnlGdW5jdGlvbi5DT01QT05FTlRfTkFNRSk7XG4gICAgICAgIENhbnZhc1N0eWxlcy5lbmFibGVTdHlsZShUZXN0RW50cnlGdW5jdGlvbi5DT01QT05FTlRfTkFNRSk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50LnNldENoaWxkKFwidGVzdEVudHJ5RnVuY3Rpb25OYW1lXCIsIHRoaXMudGVzdEZ1bmN0aW9uLm5hbWUpO1xuXG4gICAgICAgIHRoaXMuY29tcG9uZW50LmdldChcInJ1bkJ1dHRvblwiKS5saXN0ZW5UbyhcImNsaWNrXCIsIG5ldyBNZXRob2QodGhpcyx0aGlzLnJ1bkNsaWNrZWQpKTtcbiAgICB9XG5cbiAgICBydW5DbGlja2VkKCkge1xuICAgICAgICB0aGlzLnRlc3RUcmlnZ2VyLnJ1bkZ1bmN0aW9uKHRoaXMudGVzdENsYXNzLm5hbWUsIHRoaXMudGVzdEZ1bmN0aW9uLm5hbWUpO1xuICAgIH1cblxuICAgIHJlc3VsdCh0ZXN0Q2xhc3NTdGF0ZSkge1xuICAgICAgICBpZiAoVGVzdENsYXNzU3RhdGUuUlVOTklORyA9PT0gdGVzdENsYXNzU3RhdGUuc3RhdGUpIHtcbiAgICAgICAgICAgIHRoaXMucnVubmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChUZXN0Q2xhc3NTdGF0ZS5TVUNDRVNTID09PSB0ZXN0Q2xhc3NTdGF0ZS5zdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5zdWNjZWVkKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFRlc3RDbGFzc1N0YXRlLkZBSUwgPT09IHRlc3RDbGFzc1N0YXRlLnN0YXRlKSB7XG4gICAgICAgICAgICB0aGlzLmZhaWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZhaWwoKSB7XG4gICAgICAgIFN0eWxlLmZyb20odGhpcy5jb21wb25lbnQuZ2V0KFwidGVzdEVudHJ5RnVuY3Rpb25OYW1lXCIpKVxuICAgICAgICAgICAgLnNldChcImZvbnQtd2VpZ2h0XCIsIFwiYm9sZFwiKVxuICAgICAgICAgICAgLnNldChcImNvbG9yXCIsIFwicmVkXCIpO1xuICAgIH1cblxuICAgIHN1Y2NlZWQoKSB7XG4gICAgICAgIFN0eWxlLmZyb20odGhpcy5jb21wb25lbnQuZ2V0KFwidGVzdEVudHJ5RnVuY3Rpb25OYW1lXCIpKVxuICAgICAgICAgICAgLnNldChcImZvbnQtd2VpZ2h0XCIsIFwiYm9sZFwiKVxuICAgICAgICAgICAgLnNldChcImNvbG9yXCIsIFwiZ3JlZW5cIik7XG4gICAgfVxuXG4gICAgcnVubmluZygpIHtcbiAgICAgICAgU3R5bGUuZnJvbSh0aGlzLmNvbXBvbmVudC5nZXQoXCJ0ZXN0RW50cnlGdW5jdGlvbk5hbWVcIikpXG4gICAgICAgICAgICAuc2V0KFwiZm9udC13ZWlnaHRcIiwgXCJib2xkXCIpXG4gICAgICAgICAgICAuc2V0KFwiY29sb3JcIiwgXCJibGFja1wiKTtcbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgU3R5bGUuZnJvbSh0aGlzLmNvbXBvbmVudC5nZXQoXCJ0ZXN0RW50cnlGdW5jdGlvbk5hbWVcIikpLmNsZWFyKCk7XG4gICAgfVxufSIsImltcG9ydCB7IExpc3QsIE1ldGhvZCB9IGZyb20gXCJjb3JldXRpbF92MVwiO1xuaW1wb3J0IHsgQ2FudmFzU3R5bGVzLCBDb21wb25lbnRGYWN0b3J5LCBTdHlsZSB9IGZyb20gXCJqdXN0cmlnaHRfY29yZV92MVwiO1xuaW1wb3J0IHsgSW5qZWN0aW9uUG9pbnQsIFByb3ZpZGVyIH0gZnJvbSBcIm1pbmRpX3YxXCI7XG5pbXBvcnQgeyBUZXN0Q2xhc3NTdGF0ZSwgVGVzdFRyaWdnZXIgfSBmcm9tIFwidGVzdGJlbmNoX3YxXCI7XG5pbXBvcnQgeyBUZXN0RW50cnlGdW5jdGlvbiB9IGZyb20gXCIuLi90ZXN0RW50cnlGdW5jdGlvbi90ZXN0RW50cnlGdW5jdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgVGVzdEVudHJ5IHtcblxuICAgIHN0YXRpYyBnZXQgQ09NUE9ORU5UX05BTUUoKSB7IHJldHVybiBcIlRlc3RFbnRyeVwiOyB9XG5cdHN0YXRpYyBnZXQgVEVNUExBVEVfVVJMKCkgeyByZXR1cm4gXCIvYXNzZXRzL2p1c3RyaWdodGpzLXRlc3QvdGVzdEVudHJ5Lmh0bWxcIjsgfVxuICAgIHN0YXRpYyBnZXQgU1RZTEVTX1VSTCgpIHsgcmV0dXJuIFwiL2Fzc2V0cy9qdXN0cmlnaHRqcy10ZXN0L3Rlc3RFbnRyeS5jc3NcIjsgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0ZXN0Q2xhc3NcbiAgICAgKiBAcGFyYW0ge1Rlc3RUcmlnZ2VyfSB0ZXN0VHJpZ2dlciBcbiAgICAgKi9cblx0Y29uc3RydWN0b3IodGVzdENsYXNzLCB0ZXN0VHJpZ2dlcikge1xuXG5cdFx0LyoqIEB0eXBlIHtDb21wb25lbnRGYWN0b3J5fSAqL1xuICAgICAgICB0aGlzLmNvbXBvbmVudEZhY3RvcnkgPSBJbmplY3Rpb25Qb2ludC5pbnN0YW5jZShDb21wb25lbnRGYWN0b3J5KTtcbiAgICAgICAgXG4gICAgICAgIC8qKiBAdHlwZSB7UHJvdmlkZXI8VGVzdEVudHJ5RnVuY3Rpb24+fSAqL1xuICAgICAgICB0aGlzLnRlc3RFbnRyeUZ1bmN0aW9uUHJvdmlkZXIgPSBJbmplY3Rpb25Qb2ludC5wcm92aWRlcihUZXN0RW50cnlGdW5jdGlvbilcblxuICAgICAgICAvKiogQHR5cGUge09iamVjdH0gKi9cbiAgICAgICAgdGhpcy50ZXN0Q2xhc3MgPSB0ZXN0Q2xhc3M7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtUZXN0VHJpZ2dlcn0gKi9cbiAgICAgICAgdGhpcy50ZXN0VHJpZ2dlciA9IHRlc3RUcmlnZ2VyO1xuXG4gICAgICAgIC8qKiBAdHlwZSB7TGlzdDxUZXN0RW50cnlGdW5jdGlvbj59ICovXG4gICAgICAgIHRoaXMudGVzdEVudHJ5RnVuY3Rpb25MaXN0ID0gbmV3IExpc3QoKTtcblxuICAgICAgICB0aGlzLmZhaWxlZCA9IGZhbHNlO1xuICAgIH1cblxuXHRwb3N0Q29uZmlnKCkge1xuXHRcdHRoaXMuY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRGYWN0b3J5LmNyZWF0ZShUZXN0RW50cnkuQ09NUE9ORU5UX05BTUUpO1xuICAgICAgICBDYW52YXNTdHlsZXMuZW5hYmxlU3R5bGUoVGVzdEVudHJ5LkNPTVBPTkVOVF9OQU1FKTtcbiAgICAgICAgdGhpcy5jb21wb25lbnQuc2V0Q2hpbGQoXCJ0ZXN0RW50cnlOYW1lXCIsIHRoaXMudGVzdENsYXNzLm5hbWUpO1xuXG4gICAgICAgIHRoaXMuY29tcG9uZW50LmdldChcInJ1bkJ1dHRvblwiKS5saXN0ZW5UbyhcImNsaWNrXCIsIG5ldyBNZXRob2QodGhpcyx0aGlzLnJ1bkNsaWNrZWQpKTtcblxuICAgICAgICAvKiogQHR5cGUge0xpc3Q8VGVzdEVudHJ5RnVuY3Rpb24+fSAqL1xuICAgICAgICBjb25zdCB0ZXN0RnVuY3Rpb25zID0gdGhpcy50ZXN0Q2xhc3MudGVzdEZ1bmN0aW9ucygpO1xuICAgICAgICB0ZXN0RnVuY3Rpb25zLmZvckVhY2goKHRlc3RGdW5jdGlvbiwgcGFyZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRlc3RFbnRyeUZ1bmN0aW9uUHJvdmlkZXIuZ2V0KFt0aGlzLnRlc3RDbGFzcywgdGVzdEZ1bmN0aW9uLCB0aGlzLnRlc3RUcmlnZ2VyXSkudGhlbigodGVzdEVudHJ5RnVuY3Rpb24pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnRlc3RFbnRyeUZ1bmN0aW9uTGlzdC5hZGQodGVzdEVudHJ5RnVuY3Rpb24pO1xuICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50LmdldChcInRlc3RFbnRyeUZ1bmN0aW9uc1wiKS5hZGRDaGlsZCh0ZXN0RW50cnlGdW5jdGlvbi5jb21wb25lbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSx0aGlzKTtcbiAgICB9XG5cbiAgICBydW5DbGlja2VkKCkge1xuICAgICAgICB0aGlzLmZhaWxlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnRlc3RUcmlnZ2VyLnJ1bkNsYXNzKHRoaXMudGVzdENsYXNzLm5hbWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7VGVzdENsYXNzU3RhdGV9IHRlc3RDbGFzc1N0YXRlIFxuICAgICAqL1xuICAgIHJlc3VsdCh0ZXN0Q2xhc3NTdGF0ZSkge1xuICAgICAgICB0aGlzLnRlc3RFbnRyeUZ1bmN0aW9uTGlzdC5mb3JFYWNoKCh0ZXN0RW50cnlGdW5jdGlvbiwgcGFyZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAodGVzdEVudHJ5RnVuY3Rpb24udGVzdEZ1bmN0aW9uLm5hbWUgPT09IHRlc3RDbGFzc1N0YXRlLmZ1bmN0aW9uTmFtZSkge1xuICAgICAgICAgICAgICAgIHRlc3RFbnRyeUZ1bmN0aW9uLnJlc3VsdCh0ZXN0Q2xhc3NTdGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSx0aGlzKTtcbiAgICAgICAgaWYgKCF0aGlzLmZhaWxlZCAmJiBUZXN0Q2xhc3NTdGF0ZS5SVU5OSU5HID09PSB0ZXN0Q2xhc3NTdGF0ZS5zdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5ydW5uaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmZhaWxlZCAmJiBUZXN0Q2xhc3NTdGF0ZS5TVUNDRVNTID09PSB0ZXN0Q2xhc3NTdGF0ZS5zdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5zdWNjZWVkKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFRlc3RDbGFzc1N0YXRlLkZBSUwgPT09IHRlc3RDbGFzc1N0YXRlLnN0YXRlKSB7XG4gICAgICAgICAgICB0aGlzLmZhaWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZhaWwoKSB7XG4gICAgICAgIHRoaXMuZmFpbGVkID0gdHJ1ZTtcbiAgICAgICAgU3R5bGUuZnJvbSh0aGlzLmNvbXBvbmVudC5nZXQoXCJ0ZXN0RW50cnlOYW1lXCIpKVxuICAgICAgICAgICAgLnNldChcImZvbnQtd2VpZ2h0XCIsIFwiYm9sZFwiKVxuICAgICAgICAgICAgLnNldChcImNvbG9yXCIsIFwicmVkXCIpO1xuICAgIH1cblxuICAgIHN1Y2NlZWQoKSB7XG4gICAgICAgIFN0eWxlLmZyb20odGhpcy5jb21wb25lbnQuZ2V0KFwidGVzdEVudHJ5TmFtZVwiKSlcbiAgICAgICAgICAgIC5zZXQoXCJmb250LXdlaWdodFwiLCBcImJvbGRcIilcbiAgICAgICAgICAgIC5zZXQoXCJjb2xvclwiLCBcImdyZWVuXCIpO1xuICAgIH1cblxuICAgIHJ1bm5pbmcoKSB7XG4gICAgICAgIFN0eWxlLmZyb20odGhpcy5jb21wb25lbnQuZ2V0KFwidGVzdEVudHJ5TmFtZVwiKSlcbiAgICAgICAgICAgIC5zZXQoXCJmb250LXdlaWdodFwiLCBcImJvbGRcIilcbiAgICAgICAgICAgIC5zZXQoXCJjb2xvclwiLCBcImJsYWNrXCIpO1xuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgICB0aGlzLmZhaWxlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnRlc3RFbnRyeUZ1bmN0aW9uTGlzdC5mb3JFYWNoKCh0ZXN0RW50cnlGdW5jdGlvbiwgcGFyZW50KSA9PiB7XG4gICAgICAgICAgICB0ZXN0RW50cnlGdW5jdGlvbi5yZXNldCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sdGhpcyk7XG4gICAgICAgIFN0eWxlLmZyb20odGhpcy5jb21wb25lbnQuZ2V0KFwidGVzdEVudHJ5TmFtZVwiKSkuY2xlYXIoKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgTWFwLCBNZXRob2QgfSBmcm9tIFwiY29yZXV0aWxfdjFcIjtcbmltcG9ydCB7IENhbnZhc1N0eWxlcywgQ29tcG9uZW50RmFjdG9yeSB9IGZyb20gXCJqdXN0cmlnaHRfY29yZV92MVwiO1xuaW1wb3J0IHsgSW5qZWN0aW9uUG9pbnQgfSBmcm9tIFwibWluZGlfdjFcIjtcbmltcG9ydCB7IFRlc3RDbGFzc1N0YXRlLCBUZXN0VHJpZ2dlciB9IGZyb20gXCJ0ZXN0YmVuY2hfdjFcIjtcbmltcG9ydCB7IExpbmVFbnRyeSB9IGZyb20gXCIuL2xpbmVFbnRyeS9saW5lRW50cnkuanNcIjtcbmltcG9ydCB7IFRlc3RFbnRyeSB9IGZyb20gXCIuL3Rlc3RFbnRyeS90ZXN0RW50cnkuanNcIlxuXG5leHBvcnQgY2xhc3MgVGVzdEJlbmNoVmlldyB7XG5cbiAgICBzdGF0aWMgZ2V0IENPTVBPTkVOVF9OQU1FKCkgeyByZXR1cm4gXCJUZXN0QmVuY2hWaWV3XCI7IH1cblx0c3RhdGljIGdldCBURU1QTEFURV9VUkwoKSB7IHJldHVybiBcIi9hc3NldHMvanVzdHJpZ2h0anMtdGVzdC90ZXN0QmVuY2hWaWV3Lmh0bWxcIjsgfVxuICAgIHN0YXRpYyBnZXQgU1RZTEVTX1VSTCgpIHsgcmV0dXJuIFwiL2Fzc2V0cy9qdXN0cmlnaHRqcy10ZXN0L3Rlc3RCZW5jaFZpZXcuY3NzXCI7IH1cbiAgICBcbiAgICAvKiogXG4gICAgICogQHBhcmFtIHtUZXN0VHJpZ2dlcn0gdGVzdFRyaWdnZXIgXG4gICAgICovXG5cdGNvbnN0cnVjdG9yKHRlc3RUcmlnZ2VyKSB7XG5cblx0XHQvKiogQHR5cGUge0NvbXBvbmVudEZhY3Rvcnl9ICovXG4gICAgICAgIHRoaXMuY29tcG9uZW50RmFjdG9yeSA9IEluamVjdGlvblBvaW50Lmluc3RhbmNlKENvbXBvbmVudEZhY3RvcnkpO1xuICAgICAgICBcbiAgICAgICAgLyoqIEB0eXBlIHtUZXN0VHJpZ2dlcn0gKi9cbiAgICAgICAgdGhpcy50ZXN0VHJpZ2dlciA9IHRlc3RUcmlnZ2VyO1xuXG4gICAgICAgIC8qKiBAdHlwZSB7TWFwPFRlc3RFbnRyeT59ICovXG4gICAgICAgIHRoaXMudGVzdEVudHJ5TWFwID0gbmV3IE1hcCgpO1xuICAgIH1cblxuXHRwb3N0Q29uZmlnKCkge1xuXHRcdHRoaXMuY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRGYWN0b3J5LmNyZWF0ZShUZXN0QmVuY2hWaWV3LkNPTVBPTkVOVF9OQU1FKTtcbiAgICAgICAgQ2FudmFzU3R5bGVzLmVuYWJsZVN0eWxlKFRlc3RCZW5jaFZpZXcuQ09NUE9ORU5UX05BTUUpO1xuXG5cdFx0dGhpcy5jb21wb25lbnQuZ2V0KFwiY2xlYXJCdXR0b25cIikubGlzdGVuVG8oXCJjbGlja1wiLCBuZXcgTWV0aG9kKHRoaXMsdGhpcy5jbGVhckNsaWNrZWQpKTtcblx0XHR0aGlzLmNvbXBvbmVudC5nZXQoXCJydW5BbGxCdXR0b25cIikubGlzdGVuVG8oXCJjbGlja1wiLCBuZXcgTWV0aG9kKHRoaXMsdGhpcy5ydW5BbGxDbGlja2VkKSk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50LmdldChcInJlc2V0QnV0dG9uXCIpLmxpc3RlblRvKFwiY2xpY2tcIiwgbmV3IE1ldGhvZCh0aGlzLHRoaXMucmVzZXRDbGlja2VkKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtUZXN0RW50cnl9IHRlc3RFbnRyeSBcbiAgICAgKi9cbiAgICBhZGRUZXN0RW50cnkodGVzdEVudHJ5KSB7XG4gICAgICAgIHRoaXMudGVzdEVudHJ5TWFwLnNldCh0ZXN0RW50cnkudGVzdENsYXNzLm5hbWUsIHRlc3RFbnRyeSk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50LmFkZENoaWxkKFwidGVzdExpc3RcIiwgdGVzdEVudHJ5LmNvbXBvbmVudCk7XG4gICAgfVxuXG4gICAgcnVuQWxsQ2xpY2tlZCgpIHtcbiAgICAgICAgdGhpcy50ZXN0VHJpZ2dlci5ydW5BbGwoKTtcbiAgICB9XG5cbiAgICBjbGVhckNsaWNrZWQoKSB7XG4gICAgICAgIHRoaXMuY29tcG9uZW50LmNsZWFyQ2hpbGRyZW4oXCJ0ZXN0UmVzdWx0XCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7TGluZUVudHJ5fSBsaW5lIFxuICAgICAqL1xuICAgIGFkZExpbmUobGluZSkge1xuICAgICAgICB0aGlzLmNvbXBvbmVudC5hZGRDaGlsZChcInRlc3RSZXN1bHRcIiwgbGluZS5jb21wb25lbnQpO1xuICAgIH1cblxuICAgIHJlc2V0Q2xpY2tlZCgpIHtcbiAgICAgICAgdGhpcy50ZXN0RW50cnlNYXAuZm9yRWFjaCgoa2V5LCB2YWx1ZSwgcGFyZW50KSA9PiB7XG4gICAgICAgICAgICAvKiogQHR5cGUge1Rlc3RFbnRyeX0gKi9cbiAgICAgICAgICAgIGNvbnN0IHRlc3RFbnRyeSA9IHZhbHVlO1xuICAgICAgICAgICAgdGVzdEVudHJ5LnJlc2V0KCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSx0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1Rlc3RDbGFzc1N0YXRlfSB0ZXN0Q2xhc3NTdGF0ZSBcbiAgICAgKi9cbiAgICByZXN1bHQodGVzdENsYXNzU3RhdGUpIHtcbiAgICAgICAgaWYgKHRoaXMudGVzdEVudHJ5TWFwLmNvbnRhaW5zKHRlc3RDbGFzc1N0YXRlLmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgIC8qKiBAdHlwZSB7VGVzdEVudHJ5fSAqL1xuICAgICAgICAgICAgY29uc3QgdGVzdEVudHJ5ID0gdGhpcy50ZXN0RW50cnlNYXAuZ2V0KHRlc3RDbGFzc1N0YXRlLmNsYXNzTmFtZSk7XG4gICAgICAgICAgICB0ZXN0RW50cnkucmVzdWx0KHRlc3RDbGFzc1N0YXRlKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBUZXN0QmVuY2gsIFRlc3RUcmlnZ2VyIH0gZnJvbSBcInRlc3RiZW5jaF92MVwiO1xuXG5leHBvcnQgY2xhc3MgVGVzdEJlbmNoVGVzdFRyaWdnZXIgZXh0ZW5kcyBUZXN0VHJpZ2dlciB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7VGVzdEJlbmNofVxuICAgICAqL1xuICAgIHNldCB0ZXN0QmVuY2godGVzdEJlbmNoKSB7XG4gICAgICAgIC8qKiBAdHlwZSB7VGVzdEJlbmNofSAqL1xuICAgICAgICB0aGlzLnRoZVRlc3RCZW5jaCA9IHRlc3RCZW5jaDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSdW4gdGVzdCBieSBjbGFzcyBuYW1lXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZSBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZnVuY3Rpb25OYW1lXG4gICAgICovXG4gICAgcnVuRnVuY3Rpb24oY2xhc3NOYW1lLCBmdW5jdGlvbk5hbWUpIHtcbiAgICAgICAgdGhpcy50aGVUZXN0QmVuY2gucnVuRnVuY3Rpb24oY2xhc3NOYW1lLCBmdW5jdGlvbk5hbWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJ1biB0ZXN0IGJ5IGNsYXNzIG5hbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIFxuICAgICAqL1xuICAgIHJ1bkNsYXNzKGNsYXNzTmFtZSkge1xuICAgICAgICB0aGlzLnRoZVRlc3RCZW5jaC5ydW5DbGFzcyhjbGFzc05hbWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJ1biBhbGwgdGVzdCBjbGFzc2VzXG4gICAgICovXG4gICAgcnVuQWxsKCkge1xuICAgICAgICB0aGlzLnRoZVRlc3RCZW5jaC5ydW5BbGwoKTtcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBJbnN0YW5jZVBvc3RDb25maWdUcmlnZ2VyLCBNaW5kaUNvbmZpZywgTWluZGlJbmplY3RvciB9IGZyb20gXCJtaW5kaV92MVwiO1xuaW1wb3J0IHsgT2JqZWN0UHJvdmlkZXIgfSBmcm9tIFwidGVzdGJlbmNoX3YxXCI7XG5cbmV4cG9ydCBjbGFzcyBEaU9iamVjdFByb3ZpZGVyIGV4dGVuZHMgT2JqZWN0UHJvdmlkZXIge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgYXN5bmMgcHJvdmlkZSh0aGVDbGFzcywgYXJncyA9IFtdKSB7XG4gICAgICAgIGNvbnN0IG9iamVjdCA9IG5ldyB0aGVDbGFzcyguLi5hcmdzKTtcbiAgICAgICAgY29uc3QgY29uZmlnID0gbmV3IE1pbmRpQ29uZmlnKCk7XG4gICAgICAgIGNvbmZpZy5hZGRBbGxJbnN0YW5jZVByb2Nlc3NvcihbSW5zdGFuY2VQb3N0Q29uZmlnVHJpZ2dlcl0pO1xuICAgICAgICBpZiAob2JqZWN0LnR5cGVDb25maWdMaXN0KSB7XG4gICAgICAgICAgICBjb25maWcuYWRkQWxsVHlwZUNvbmZpZyhvYmplY3QudHlwZUNvbmZpZ0xpc3QpO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IGNvbmZpZy5maW5hbGl6ZSgpO1xuICAgICAgICBhd2FpdCBNaW5kaUluamVjdG9yLmdldEluc3RhbmNlKCkuaW5qZWN0VGFyZ2V0KG9iamVjdCwgY29uZmlnKTtcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBMb2dnZXIsIE1ldGhvZCB9IGZyb20gXCJjb3JldXRpbF92MVwiO1xuaW1wb3J0IHsgQ29tcG9uZW50RmFjdG9yeSB9IGZyb20gXCJqdXN0cmlnaHRfY29yZV92MVwiO1xuaW1wb3J0IHsgSW5qZWN0aW9uUG9pbnQsIFByb3ZpZGVyIH0gZnJvbSBcIm1pbmRpX3YxXCI7XG5pbXBvcnQgeyBUZXN0QmVuY2gsIFRlc3RDbGFzc1Jlc3VsdCB9IGZyb20gXCJ0ZXN0YmVuY2hfdjFcIjtcbmltcG9ydCB7IFRlc3RCZW5jaFZpZXcgfSBmcm9tIFwiLi90ZXN0QmVuY2hWaWV3L3Rlc3RCZW5jaFZpZXcuanNcIjtcbmltcG9ydCB7IFRlc3RFbnRyeSB9IGZyb20gXCIuL3Rlc3RCZW5jaFZpZXcvdGVzdEVudHJ5L3Rlc3RFbnRyeS5qc1wiO1xuaW1wb3J0IHsgTGluZUVudHJ5IH0gZnJvbSBcIi4vdGVzdEJlbmNoVmlldy9saW5lRW50cnkvbGluZUVudHJ5LmpzXCI7XG5pbXBvcnQgeyBUZXN0QmVuY2hUZXN0VHJpZ2dlciB9IGZyb20gXCIuL3Rlc3RCZW5jaFZpZXcvdGVzdEJlbmNoVGVzdFRyaWdnZXIuanNcIlxuaW1wb3J0IHsgRGlPYmplY3RQcm92aWRlciB9IGZyb20gXCIuL3Rlc3RCZW5jaFZpZXcvZGlPYmplY3RQcm92aWRlci5qc1wiO1xuXG5leHBvcnQgY2xhc3MgVGVzdEJlbmNoVWkge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtUZXN0QmVuY2hUZXN0VHJpZ2dlcn0gKi9cbiAgICAgICAgdGhpcy50ZXN0VHJpZ2dlciA9IG5ldyBUZXN0QmVuY2hUZXN0VHJpZ2dlcigpO1xuXG5cdFx0LyoqIEB0eXBlIHtDb21wb25lbnRGYWN0b3J5fSAqL1xuICAgICAgICB0aGlzLmNvbXBvbmVudEZhY3RvcnkgPSBJbmplY3Rpb25Qb2ludC5pbnN0YW5jZShDb21wb25lbnRGYWN0b3J5KTtcblxuICAgICAgICAvKiogQHR5cGUge1Rlc3RCZW5jaFZpZXd9ICovXG4gICAgICAgIHRoaXMudGVzdEJlbmNoVmlldyA9IEluamVjdGlvblBvaW50Lmluc3RhbmNlKFRlc3RCZW5jaFZpZXcsIFt0aGlzLnRlc3RUcmlnZ2VyXSk7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtQcm92aWRlcn0gKi9cbiAgICAgICAgdGhpcy50ZXN0RW50cnlQcm92aWRlciA9IEluamVjdGlvblBvaW50LnByb3ZpZGVyKFRlc3RFbnRyeSk7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtQcm92aWRlcn0gKi9cbiAgICAgICAgdGhpcy5saW5lRW50cnlQcm92aWRlciA9IEluamVjdGlvblBvaW50LnByb3ZpZGVyKExpbmVFbnRyeSk7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtUZXN0QmVuY2h9ICovXG4gICAgICAgIHRoaXMudGVzdEJlbmNoID0gbnVsbDtcblxuICAgICAgICB0aGlzLnRlc3RFbnRyeUxvYWRlZFByb21pc2VBcnJheSA9IFtdO1xuXG4gICAgfVxuXG4gICAgcG9zdENvbmZpZygpIHtcbiAgICAgICAgLyoqIEB0eXBlIHtUZXN0QmVuY2h9ICovXG4gICAgICAgIHRoaXMudGVzdEJlbmNoID0gbmV3IFRlc3RCZW5jaChcbiAgICAgICAgICAgIG5ldyBNZXRob2QodGhpcywgdGhpcy5sb2cpLFxuICAgICAgICAgICAgbmV3IE1ldGhvZCh0aGlzLCB0aGlzLnJlc3VsdCksXG4gICAgICAgICAgICBuZXcgRGlPYmplY3RQcm92aWRlcigpKTtcblxuICAgICAgICB0aGlzLnRlc3RUcmlnZ2VyLnRlc3RCZW5jaCA9IHRoaXMudGVzdEJlbmNoO1xuICAgIH1cblxuICAgIGFkZFRlc3QodGVzdENsYXNzKSB7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzO1xuICAgICAgICBpZighdGhpcy50ZXN0QmVuY2guY29udGFpbnModGVzdENsYXNzKSkge1xuICAgICAgICAgICAgdGhpcy50ZXN0QmVuY2guYWRkVGVzdCh0ZXN0Q2xhc3MpO1xuICAgICAgICAgICAgY29uc3QgdGVzdEVudHJ5TG9hZGVkUHJvbWlzZSA9IHRoaXMudGVzdEVudHJ5UHJvdmlkZXIuZ2V0KFt0ZXN0Q2xhc3MsIHRoaXMudGVzdEJlbmNoXSkudGhlbigodGVzdEVudHJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgY29udGV4dC50ZXN0QmVuY2hWaWV3LmFkZFRlc3RFbnRyeSh0ZXN0RW50cnkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnRlc3RFbnRyeUxvYWRlZFByb21pc2VBcnJheS5wdXNoKHRlc3RFbnRyeUxvYWRlZFByb21pc2UpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7VGVzdENsYXNzUmVzdWx0fSB0ZXN0Q2xhc3NSZXN1bHQgXG4gICAgICovXG4gICAgcmVzdWx0KHRlc3RDbGFzc1Jlc3VsdCkge1xuICAgICAgICB0aGlzLnRlc3RCZW5jaFZpZXcucmVzdWx0KHRlc3RDbGFzc1Jlc3VsdCk7XG4gICAgfVxuXG4gICAgYXN5bmMgbG9nKGxpbmUsIGxldmVsKSB7XG4gICAgICAgIGNvbnN0IGNvbG9yID0gdGhpcy5hc0NvbG9yKGxldmVsKTtcbiAgICAgICAgY29uc3QgY29udGV4dCA9IHRoaXM7XG4gICAgICAgIGNvbnN0IGxpbmVFbnRyeSA9IGF3YWl0IHRoaXMubGluZUVudHJ5UHJvdmlkZXIuZ2V0KFtsaW5lLCBjb2xvcl0pO1xuICAgICAgICBjb250ZXh0LnRlc3RCZW5jaFZpZXcuYWRkTGluZShsaW5lRW50cnkpO1xuICAgICAgICByZXR1cm4gbGluZUVudHJ5O1xuICAgIH1cbiAgICBcbiAgICBhc0NvbG9yKGxldmVsKSB7XG4gICAgICAgIGlmIChMb2dnZXIuRVJST1IgPT09IGxldmVsKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJyZWRcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoTG9nZ2VyLkZBVEFMID09PSBsZXZlbCkge1xuICAgICAgICAgICAgcmV0dXJuIFwicmVkXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZ2V0IGNvbXBvbmVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGVzdEJlbmNoVmlldy5jb21wb25lbnQ7XG4gICAgfVxuXG59Il0sIm5hbWVzIjpbIkluamVjdGlvblBvaW50IiwiQ29tcG9uZW50RmFjdG9yeSIsIkNhbnZhc1N0eWxlcyIsIlN0eWxlIiwiTWV0aG9kIiwiVGVzdENsYXNzU3RhdGUiLCJMaXN0IiwiTWFwIiwiVGVzdFRyaWdnZXIiLCJPYmplY3RQcm92aWRlciIsIk1pbmRpQ29uZmlnIiwiSW5zdGFuY2VQb3N0Q29uZmlnVHJpZ2dlciIsIk1pbmRpSW5qZWN0b3IiLCJUZXN0QmVuY2giLCJMb2dnZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUdPLE1BQU0sU0FBUyxDQUFDO0FBQ3ZCO0FBQ0EsSUFBSSxXQUFXLGNBQWMsR0FBRyxFQUFFLE9BQU8sV0FBVyxDQUFDLEVBQUU7QUFDdkQsQ0FBQyxXQUFXLFlBQVksR0FBRyxFQUFFLE9BQU8seUNBQXlDLENBQUMs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
