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
            this.component.get("lineEntry").setAttributeValue("style","color:" + this.color);
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

		/** @type {BaseElementEventRegistry} */
		this.baseElementEventRegistry = mindi_v1.InjectionPoint.instance(justright_core_v1.BaseElementEventRegistry);

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

        this.baseElementEventRegistry.attach(this.component.get("runButton"), "onclick", "//event:runClicked", this.component.componentIndex);
        this.baseElementEventRegistry.listen("//event:runClicked", new coreutil_v1.Method(this, this.runClicked), this.component.componentIndex);
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
        this.component.get("testEntryFunctionName").setAttributeValue("style", "font-weight:bold;color:red");
    }

    succeed() {
        this.component.get("testEntryFunctionName").setAttributeValue("style", "font-weight:bold;color:green");
    }

    running() {
        this.component.get("testEntryFunctionName").setAttributeValue("style", "font-weight:bold;color:black");
    }

    reset() {
        this.component.get("testEntryFunctionName").removeAttribute("style");
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

		/** @type {BaseElementEventRegistry} */
        this.baseElementEventRegistry = mindi_v1.InjectionPoint.instance(justright_core_v1.BaseElementEventRegistry);
        
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

        this.baseElementEventRegistry.attach(this.component.get("runButton"), "onclick", "//event:runClicked", this.component.componentIndex);
        this.baseElementEventRegistry.listen("//event:runClicked", new coreutil_v1.Method(this, this.runClicked), this.component.componentIndex);

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
        this.component.get("testEntryName").setAttributeValue("style", "font-weight:bold;color:red");
    }

    succeed() {
        this.component.get("testEntryName").setAttributeValue("style", "font-weight:bold;color:green");
    }

    running() {
        this.component.get("testEntryName").setAttributeValue("style", "font-weight:bold;color:black");
    }

    reset() {
        this.failed = false;
        this.testEntryFunctionList.forEach((testEntryFunction, parent) => {
            testEntryFunction.reset();
            return true;
        },this);
        this.component.get("testEntryName").removeAttribute("style");
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

		/** @type {BaseElementEventRegistry} */
        this.baseElementEventRegistry = mindi_v1.InjectionPoint.instance(justright_core_v1.BaseElementEventRegistry);
        
        /** @type {TestTrigger} */
        this.testTrigger = testTrigger;

        /** @type {Map<TestEntry>} */
        this.testEntryMap = new coreutil_v1.Map();
    }

	postConfig() {
		this.component = this.componentFactory.create(TestBenchView.COMPONENT_NAME);
        justright_core_v1.CanvasStyles.enableStyle(TestBenchView.COMPONENT_NAME);

        this.baseElementEventRegistry.attach(this.component.get("clearButton"), "onclick", "//event:clearClicked", this.component.componentIndex);
        this.baseElementEventRegistry.listen("//event:clearClicked", new coreutil_v1.Method(this, this.clearClicked), this.component.componentIndex);

        this.baseElementEventRegistry.attach(this.component.get("runAllButton"), "onclick", "//event:runAllClicked", this.component.componentIndex);
        this.baseElementEventRegistry.listen("//event:runAllClicked", new coreutil_v1.Method(this, this.runAllClicked), this.component.componentIndex);

        this.baseElementEventRegistry.attach(this.component.get("resetButton"), "onclick", "//event:resetClicked", this.component.componentIndex);
        this.baseElementEventRegistry.listen("//event:resetClicked", new coreutil_v1.Method(this, this.resetClicked), this.component.componentIndex);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianVzdHJpZ2h0X3Rlc3RfdjEuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9qdXN0cmlnaHQvdGVzdEJlbmNoVmlldy9saW5lRW50cnkvbGluZUVudHJ5LmpzIiwiLi4vLi4vc3JjL2p1c3RyaWdodC90ZXN0QmVuY2hWaWV3L3Rlc3RFbnRyeUZ1bmN0aW9uL3Rlc3RFbnRyeUZ1bmN0aW9uLmpzIiwiLi4vLi4vc3JjL2p1c3RyaWdodC90ZXN0QmVuY2hWaWV3L3Rlc3RFbnRyeS90ZXN0RW50cnkuanMiLCIuLi8uLi9zcmMvanVzdHJpZ2h0L3Rlc3RCZW5jaFZpZXcvdGVzdEJlbmNoVmlldy5qcyIsIi4uLy4uL3NyYy9qdXN0cmlnaHQvdGVzdEJlbmNoVmlldy90ZXN0QmVuY2hUZXN0VHJpZ2dlci5qcyIsIi4uLy4uL3NyYy9qdXN0cmlnaHQvdGVzdEJlbmNoVmlldy9kaU9iamVjdFByb3ZpZGVyLmpzIiwiLi4vLi4vc3JjL2p1c3RyaWdodC90ZXN0QmVuY2hVaS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDYW52YXNTdHlsZXMsIENvbXBvbmVudEZhY3RvcnkgfSBmcm9tIFwianVzdHJpZ2h0X2NvcmVfdjFcIjtcbmltcG9ydCB7IEluamVjdGlvblBvaW50IH0gZnJvbSBcIm1pbmRpX3YxXCI7XG5cbmV4cG9ydCBjbGFzcyBMaW5lRW50cnkge1xuXG4gICAgc3RhdGljIGdldCBDT01QT05FTlRfTkFNRSgpIHsgcmV0dXJuIFwiTGluZUVudHJ5XCI7IH1cblx0c3RhdGljIGdldCBURU1QTEFURV9VUkwoKSB7IHJldHVybiBcIi9hc3NldHMvanVzdHJpZ2h0anMtdGVzdC9saW5lRW50cnkuaHRtbFwiOyB9XG4gICAgc3RhdGljIGdldCBTVFlMRVNfVVJMKCkgeyByZXR1cm4gXCIvYXNzZXRzL2p1c3RyaWdodGpzLXRlc3QvbGluZUVudHJ5LmNzc1wiOyB9XG4gICAgXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGxpbmUgXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGNvbG9yIFxuICAgICAqL1xuXHRjb25zdHJ1Y3RvcihsaW5lLCBjb2xvciA9IG51bGwpIHtcblxuXHRcdC8qKiBAdHlwZSB7Q29tcG9uZW50RmFjdG9yeX0gKi9cbiAgICAgICAgdGhpcy5jb21wb25lbnRGYWN0b3J5ID0gSW5qZWN0aW9uUG9pbnQuaW5zdGFuY2UoQ29tcG9uZW50RmFjdG9yeSk7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtTdHJpbmd9ICovXG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG5cbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgIH1cblxuXHRwb3N0Q29uZmlnKCkge1xuXHRcdHRoaXMuY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRGYWN0b3J5LmNyZWF0ZShMaW5lRW50cnkuQ09NUE9ORU5UX05BTUUpO1xuICAgICAgICBDYW52YXNTdHlsZXMuZW5hYmxlU3R5bGUoTGluZUVudHJ5LkNPTVBPTkVOVF9OQU1FKTtcbiAgICAgICAgdGhpcy5jb21wb25lbnQuc2V0Q2hpbGQoXCJsaW5lRW50cnlcIiwgdGhpcy5saW5lKTtcbiAgICAgICAgaWYgKHRoaXMuY29sb3IpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50LmdldChcImxpbmVFbnRyeVwiKS5zZXRBdHRyaWJ1dGVWYWx1ZShcInN0eWxlXCIsXCJjb2xvcjpcIiArIHRoaXMuY29sb3IpO1xuICAgICAgICB9XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcImNvcmV1dGlsX3YxXCI7XG5pbXBvcnQgeyBDYW52YXNTdHlsZXMsIENvbXBvbmVudEZhY3RvcnksIEJhc2VFbGVtZW50RXZlbnRSZWdpc3RyeSB9IGZyb20gXCJqdXN0cmlnaHRfY29yZV92MVwiO1xuaW1wb3J0IHsgSW5qZWN0aW9uUG9pbnQgfSBmcm9tIFwibWluZGlfdjFcIjtcbmltcG9ydCB7IFRlc3RDbGFzc1N0YXRlLCBUZXN0VHJpZ2dlciB9IGZyb20gXCJ0ZXN0YmVuY2hfdjFcIjtcblxuZXhwb3J0IGNsYXNzIFRlc3RFbnRyeUZ1bmN0aW9uIHtcblxuICAgIHN0YXRpYyBnZXQgQ09NUE9ORU5UX05BTUUoKSB7IHJldHVybiBcIlRlc3RFbnRyeUZ1bmN0aW9uXCI7IH1cblx0c3RhdGljIGdldCBURU1QTEFURV9VUkwoKSB7IHJldHVybiBcIi9hc3NldHMvanVzdHJpZ2h0anMtdGVzdC90ZXN0RW50cnlGdW5jdGlvbi5odG1sXCI7IH1cbiAgICBzdGF0aWMgZ2V0IFNUWUxFU19VUkwoKSB7IHJldHVybiBcIi9hc3NldHMvanVzdHJpZ2h0anMtdGVzdC90ZXN0RW50cnlGdW5jdGlvbi5jc3NcIjsgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0ZXN0Q2xhc3NcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSB0ZXN0RnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge1Rlc3RUcmlnZ2VyfSB0ZXN0VHJpZ2dlciBcbiAgICAgKi9cblx0Y29uc3RydWN0b3IodGVzdENsYXNzLCB0ZXN0RnVuY3Rpb24sIHRlc3RUcmlnZ2VyKSB7XG5cblx0XHQvKiogQHR5cGUge0NvbXBvbmVudEZhY3Rvcnl9ICovXG4gICAgICAgIHRoaXMuY29tcG9uZW50RmFjdG9yeSA9IEluamVjdGlvblBvaW50Lmluc3RhbmNlKENvbXBvbmVudEZhY3RvcnkpO1xuXG5cdFx0LyoqIEB0eXBlIHtCYXNlRWxlbWVudEV2ZW50UmVnaXN0cnl9ICovXG5cdFx0dGhpcy5iYXNlRWxlbWVudEV2ZW50UmVnaXN0cnkgPSBJbmplY3Rpb25Qb2ludC5pbnN0YW5jZShCYXNlRWxlbWVudEV2ZW50UmVnaXN0cnkpO1xuXG4gICAgICAgIC8qKiBAdHlwZSB7T2JqZWN0fSAqL1xuICAgICAgICB0aGlzLnRlc3RDbGFzcyA9IHRlc3RDbGFzcztcblxuICAgICAgICAvKiogQHR5cGUge0Z1bmN0aW9ufSAqL1xuICAgICAgICB0aGlzLnRlc3RGdW5jdGlvbiA9IHRlc3RGdW5jdGlvbjtcblxuICAgICAgICAvKiogQHR5cGUge1Rlc3RUcmlnZ2VyfSAqL1xuICAgICAgICB0aGlzLnRlc3RUcmlnZ2VyID0gdGVzdFRyaWdnZXI7XG4gICAgfVxuXG5cdHBvc3RDb25maWcoKSB7XG5cdFx0dGhpcy5jb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudEZhY3RvcnkuY3JlYXRlKFRlc3RFbnRyeUZ1bmN0aW9uLkNPTVBPTkVOVF9OQU1FKTtcbiAgICAgICAgQ2FudmFzU3R5bGVzLmVuYWJsZVN0eWxlKFRlc3RFbnRyeUZ1bmN0aW9uLkNPTVBPTkVOVF9OQU1FKTtcbiAgICAgICAgdGhpcy5jb21wb25lbnQuc2V0Q2hpbGQoXCJ0ZXN0RW50cnlGdW5jdGlvbk5hbWVcIiwgdGhpcy50ZXN0RnVuY3Rpb24ubmFtZSk7XG5cbiAgICAgICAgdGhpcy5iYXNlRWxlbWVudEV2ZW50UmVnaXN0cnkuYXR0YWNoKHRoaXMuY29tcG9uZW50LmdldChcInJ1bkJ1dHRvblwiKSwgXCJvbmNsaWNrXCIsIFwiLy9ldmVudDpydW5DbGlja2VkXCIsIHRoaXMuY29tcG9uZW50LmNvbXBvbmVudEluZGV4KTtcbiAgICAgICAgdGhpcy5iYXNlRWxlbWVudEV2ZW50UmVnaXN0cnkubGlzdGVuKFwiLy9ldmVudDpydW5DbGlja2VkXCIsIG5ldyBNZXRob2QodGhpcywgdGhpcy5ydW5DbGlja2VkKSwgdGhpcy5jb21wb25lbnQuY29tcG9uZW50SW5kZXgpO1xuICAgIH1cblxuICAgIHJ1bkNsaWNrZWQoKSB7XG4gICAgICAgIHRoaXMudGVzdFRyaWdnZXIucnVuRnVuY3Rpb24odGhpcy50ZXN0Q2xhc3MubmFtZSwgdGhpcy50ZXN0RnVuY3Rpb24ubmFtZSk7XG4gICAgfVxuXG4gICAgcmVzdWx0KHRlc3RDbGFzc1N0YXRlKSB7XG4gICAgICAgIGlmIChUZXN0Q2xhc3NTdGF0ZS5SVU5OSU5HID09PSB0ZXN0Q2xhc3NTdGF0ZS5zdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5ydW5uaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFRlc3RDbGFzc1N0YXRlLlNVQ0NFU1MgPT09IHRlc3RDbGFzc1N0YXRlLnN0YXRlKSB7XG4gICAgICAgICAgICB0aGlzLnN1Y2NlZWQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoVGVzdENsYXNzU3RhdGUuRkFJTCA9PT0gdGVzdENsYXNzU3RhdGUuc3RhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuZmFpbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmFpbCgpIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnQuZ2V0KFwidGVzdEVudHJ5RnVuY3Rpb25OYW1lXCIpLnNldEF0dHJpYnV0ZVZhbHVlKFwic3R5bGVcIiwgXCJmb250LXdlaWdodDpib2xkO2NvbG9yOnJlZFwiKTtcbiAgICB9XG5cbiAgICBzdWNjZWVkKCkge1xuICAgICAgICB0aGlzLmNvbXBvbmVudC5nZXQoXCJ0ZXN0RW50cnlGdW5jdGlvbk5hbWVcIikuc2V0QXR0cmlidXRlVmFsdWUoXCJzdHlsZVwiLCBcImZvbnQtd2VpZ2h0OmJvbGQ7Y29sb3I6Z3JlZW5cIik7XG4gICAgfVxuXG4gICAgcnVubmluZygpIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnQuZ2V0KFwidGVzdEVudHJ5RnVuY3Rpb25OYW1lXCIpLnNldEF0dHJpYnV0ZVZhbHVlKFwic3R5bGVcIiwgXCJmb250LXdlaWdodDpib2xkO2NvbG9yOmJsYWNrXCIpO1xuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgICB0aGlzLmNvbXBvbmVudC5nZXQoXCJ0ZXN0RW50cnlGdW5jdGlvbk5hbWVcIikucmVtb3ZlQXR0cmlidXRlKFwic3R5bGVcIik7XG4gICAgfVxufSIsImltcG9ydCB7IExpc3QsIE1ldGhvZCB9IGZyb20gXCJjb3JldXRpbF92MVwiO1xuaW1wb3J0IHsgQ2FudmFzU3R5bGVzLCBDb21wb25lbnRGYWN0b3J5LCBCYXNlRWxlbWVudEV2ZW50UmVnaXN0cnkgfSBmcm9tIFwianVzdHJpZ2h0X2NvcmVfdjFcIjtcbmltcG9ydCB7IEluamVjdGlvblBvaW50LCBQcm92aWRlciB9IGZyb20gXCJtaW5kaV92MVwiO1xuaW1wb3J0IHsgVGVzdENsYXNzU3RhdGUsIFRlc3RUcmlnZ2VyIH0gZnJvbSBcInRlc3RiZW5jaF92MVwiO1xuaW1wb3J0IHsgVGVzdEVudHJ5RnVuY3Rpb24gfSBmcm9tIFwiLi4vdGVzdEVudHJ5RnVuY3Rpb24vdGVzdEVudHJ5RnVuY3Rpb25cIjtcblxuZXhwb3J0IGNsYXNzIFRlc3RFbnRyeSB7XG5cbiAgICBzdGF0aWMgZ2V0IENPTVBPTkVOVF9OQU1FKCkgeyByZXR1cm4gXCJUZXN0RW50cnlcIjsgfVxuXHRzdGF0aWMgZ2V0IFRFTVBMQVRFX1VSTCgpIHsgcmV0dXJuIFwiL2Fzc2V0cy9qdXN0cmlnaHRqcy10ZXN0L3Rlc3RFbnRyeS5odG1sXCI7IH1cbiAgICBzdGF0aWMgZ2V0IFNUWUxFU19VUkwoKSB7IHJldHVybiBcIi9hc3NldHMvanVzdHJpZ2h0anMtdGVzdC90ZXN0RW50cnkuY3NzXCI7IH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdGVzdENsYXNzXG4gICAgICogQHBhcmFtIHtUZXN0VHJpZ2dlcn0gdGVzdFRyaWdnZXIgXG4gICAgICovXG5cdGNvbnN0cnVjdG9yKHRlc3RDbGFzcywgdGVzdFRyaWdnZXIpIHtcblxuXHRcdC8qKiBAdHlwZSB7Q29tcG9uZW50RmFjdG9yeX0gKi9cbiAgICAgICAgdGhpcy5jb21wb25lbnRGYWN0b3J5ID0gSW5qZWN0aW9uUG9pbnQuaW5zdGFuY2UoQ29tcG9uZW50RmFjdG9yeSk7XG5cblx0XHQvKiogQHR5cGUge0Jhc2VFbGVtZW50RXZlbnRSZWdpc3RyeX0gKi9cbiAgICAgICAgdGhpcy5iYXNlRWxlbWVudEV2ZW50UmVnaXN0cnkgPSBJbmplY3Rpb25Qb2ludC5pbnN0YW5jZShCYXNlRWxlbWVudEV2ZW50UmVnaXN0cnkpO1xuICAgICAgICBcbiAgICAgICAgLyoqIEB0eXBlIHtQcm92aWRlcjxUZXN0RW50cnlGdW5jdGlvbj59ICovXG4gICAgICAgIHRoaXMudGVzdEVudHJ5RnVuY3Rpb25Qcm92aWRlciA9IEluamVjdGlvblBvaW50LnByb3ZpZGVyKFRlc3RFbnRyeUZ1bmN0aW9uKVxuXG4gICAgICAgIC8qKiBAdHlwZSB7T2JqZWN0fSAqL1xuICAgICAgICB0aGlzLnRlc3RDbGFzcyA9IHRlc3RDbGFzcztcblxuICAgICAgICAvKiogQHR5cGUge1Rlc3RUcmlnZ2VyfSAqL1xuICAgICAgICB0aGlzLnRlc3RUcmlnZ2VyID0gdGVzdFRyaWdnZXI7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtMaXN0PFRlc3RFbnRyeUZ1bmN0aW9uPn0gKi9cbiAgICAgICAgdGhpcy50ZXN0RW50cnlGdW5jdGlvbkxpc3QgPSBuZXcgTGlzdCgpO1xuXG4gICAgICAgIHRoaXMuZmFpbGVkID0gZmFsc2U7XG4gICAgfVxuXG5cdHBvc3RDb25maWcoKSB7XG5cdFx0dGhpcy5jb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudEZhY3RvcnkuY3JlYXRlKFRlc3RFbnRyeS5DT01QT05FTlRfTkFNRSk7XG4gICAgICAgIENhbnZhc1N0eWxlcy5lbmFibGVTdHlsZShUZXN0RW50cnkuQ09NUE9ORU5UX05BTUUpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudC5zZXRDaGlsZChcInRlc3RFbnRyeU5hbWVcIiwgdGhpcy50ZXN0Q2xhc3MubmFtZSk7XG5cbiAgICAgICAgdGhpcy5iYXNlRWxlbWVudEV2ZW50UmVnaXN0cnkuYXR0YWNoKHRoaXMuY29tcG9uZW50LmdldChcInJ1bkJ1dHRvblwiKSwgXCJvbmNsaWNrXCIsIFwiLy9ldmVudDpydW5DbGlja2VkXCIsIHRoaXMuY29tcG9uZW50LmNvbXBvbmVudEluZGV4KTtcbiAgICAgICAgdGhpcy5iYXNlRWxlbWVudEV2ZW50UmVnaXN0cnkubGlzdGVuKFwiLy9ldmVudDpydW5DbGlja2VkXCIsIG5ldyBNZXRob2QodGhpcywgdGhpcy5ydW5DbGlja2VkKSwgdGhpcy5jb21wb25lbnQuY29tcG9uZW50SW5kZXgpO1xuXG4gICAgICAgIC8qKiBAdHlwZSB7TGlzdDxUZXN0RW50cnlGdW5jdGlvbj59ICovXG4gICAgICAgIGNvbnN0IHRlc3RGdW5jdGlvbnMgPSB0aGlzLnRlc3RDbGFzcy50ZXN0RnVuY3Rpb25zKCk7XG4gICAgICAgIHRlc3RGdW5jdGlvbnMuZm9yRWFjaCgodGVzdEZ1bmN0aW9uLCBwYXJlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMudGVzdEVudHJ5RnVuY3Rpb25Qcm92aWRlci5nZXQoW3RoaXMudGVzdENsYXNzLCB0ZXN0RnVuY3Rpb24sIHRoaXMudGVzdFRyaWdnZXJdKS50aGVuKCh0ZXN0RW50cnlGdW5jdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudGVzdEVudHJ5RnVuY3Rpb25MaXN0LmFkZCh0ZXN0RW50cnlGdW5jdGlvbik7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnQuZ2V0KFwidGVzdEVudHJ5RnVuY3Rpb25zXCIpLmFkZENoaWxkKHRlc3RFbnRyeUZ1bmN0aW9uLmNvbXBvbmVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LHRoaXMpO1xuICAgIH1cblxuICAgIHJ1bkNsaWNrZWQoKSB7XG4gICAgICAgIHRoaXMuZmFpbGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMudGVzdFRyaWdnZXIucnVuQ2xhc3ModGhpcy50ZXN0Q2xhc3MubmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtUZXN0Q2xhc3NTdGF0ZX0gdGVzdENsYXNzU3RhdGUgXG4gICAgICovXG4gICAgcmVzdWx0KHRlc3RDbGFzc1N0YXRlKSB7XG4gICAgICAgIHRoaXMudGVzdEVudHJ5RnVuY3Rpb25MaXN0LmZvckVhY2goKHRlc3RFbnRyeUZ1bmN0aW9uLCBwYXJlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICh0ZXN0RW50cnlGdW5jdGlvbi50ZXN0RnVuY3Rpb24ubmFtZSA9PT0gdGVzdENsYXNzU3RhdGUuZnVuY3Rpb25OYW1lKSB7XG4gICAgICAgICAgICAgICAgdGVzdEVudHJ5RnVuY3Rpb24ucmVzdWx0KHRlc3RDbGFzc1N0YXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LHRoaXMpO1xuICAgICAgICBpZiAoIXRoaXMuZmFpbGVkICYmIFRlc3RDbGFzc1N0YXRlLlJVTk5JTkcgPT09IHRlc3RDbGFzc1N0YXRlLnN0YXRlKSB7XG4gICAgICAgICAgICB0aGlzLnJ1bm5pbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuZmFpbGVkICYmIFRlc3RDbGFzc1N0YXRlLlNVQ0NFU1MgPT09IHRlc3RDbGFzc1N0YXRlLnN0YXRlKSB7XG4gICAgICAgICAgICB0aGlzLnN1Y2NlZWQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoVGVzdENsYXNzU3RhdGUuRkFJTCA9PT0gdGVzdENsYXNzU3RhdGUuc3RhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuZmFpbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmFpbCgpIHtcbiAgICAgICAgdGhpcy5mYWlsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmNvbXBvbmVudC5nZXQoXCJ0ZXN0RW50cnlOYW1lXCIpLnNldEF0dHJpYnV0ZVZhbHVlKFwic3R5bGVcIiwgXCJmb250LXdlaWdodDpib2xkO2NvbG9yOnJlZFwiKTtcbiAgICB9XG5cbiAgICBzdWNjZWVkKCkge1xuICAgICAgICB0aGlzLmNvbXBvbmVudC5nZXQoXCJ0ZXN0RW50cnlOYW1lXCIpLnNldEF0dHJpYnV0ZVZhbHVlKFwic3R5bGVcIiwgXCJmb250LXdlaWdodDpib2xkO2NvbG9yOmdyZWVuXCIpO1xuICAgIH1cblxuICAgIHJ1bm5pbmcoKSB7XG4gICAgICAgIHRoaXMuY29tcG9uZW50LmdldChcInRlc3RFbnRyeU5hbWVcIikuc2V0QXR0cmlidXRlVmFsdWUoXCJzdHlsZVwiLCBcImZvbnQtd2VpZ2h0OmJvbGQ7Y29sb3I6YmxhY2tcIik7XG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuZmFpbGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMudGVzdEVudHJ5RnVuY3Rpb25MaXN0LmZvckVhY2goKHRlc3RFbnRyeUZ1bmN0aW9uLCBwYXJlbnQpID0+IHtcbiAgICAgICAgICAgIHRlc3RFbnRyeUZ1bmN0aW9uLnJlc2V0KCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSx0aGlzKTtcbiAgICAgICAgdGhpcy5jb21wb25lbnQuZ2V0KFwidGVzdEVudHJ5TmFtZVwiKS5yZW1vdmVBdHRyaWJ1dGUoXCJzdHlsZVwiKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgTWFwLCBNZXRob2QgfSBmcm9tIFwiY29yZXV0aWxfdjFcIjtcbmltcG9ydCB7IENhbnZhc1N0eWxlcywgQ29tcG9uZW50RmFjdG9yeSwgQmFzZUVsZW1lbnRFdmVudFJlZ2lzdHJ5IH0gZnJvbSBcImp1c3RyaWdodF9jb3JlX3YxXCI7XG5pbXBvcnQgeyBJbmplY3Rpb25Qb2ludCB9IGZyb20gXCJtaW5kaV92MVwiO1xuaW1wb3J0IHsgVGVzdENsYXNzU3RhdGUsIFRlc3RUcmlnZ2VyIH0gZnJvbSBcInRlc3RiZW5jaF92MVwiO1xuaW1wb3J0IHsgTGluZUVudHJ5IH0gZnJvbSBcIi4vbGluZUVudHJ5L2xpbmVFbnRyeS5qc1wiO1xuaW1wb3J0IHsgVGVzdEVudHJ5IH0gZnJvbSBcIi4vdGVzdEVudHJ5L3Rlc3RFbnRyeS5qc1wiXG5cbmV4cG9ydCBjbGFzcyBUZXN0QmVuY2hWaWV3IHtcblxuICAgIHN0YXRpYyBnZXQgQ09NUE9ORU5UX05BTUUoKSB7IHJldHVybiBcIlRlc3RCZW5jaFZpZXdcIjsgfVxuXHRzdGF0aWMgZ2V0IFRFTVBMQVRFX1VSTCgpIHsgcmV0dXJuIFwiL2Fzc2V0cy9qdXN0cmlnaHRqcy10ZXN0L3Rlc3RCZW5jaFZpZXcuaHRtbFwiOyB9XG4gICAgc3RhdGljIGdldCBTVFlMRVNfVVJMKCkgeyByZXR1cm4gXCIvYXNzZXRzL2p1c3RyaWdodGpzLXRlc3QvdGVzdEJlbmNoVmlldy5jc3NcIjsgfVxuICAgIFxuICAgIC8qKiBcbiAgICAgKiBAcGFyYW0ge1Rlc3RUcmlnZ2VyfSB0ZXN0VHJpZ2dlciBcbiAgICAgKi9cblx0Y29uc3RydWN0b3IodGVzdFRyaWdnZXIpIHtcblxuXHRcdC8qKiBAdHlwZSB7Q29tcG9uZW50RmFjdG9yeX0gKi9cbiAgICAgICAgdGhpcy5jb21wb25lbnRGYWN0b3J5ID0gSW5qZWN0aW9uUG9pbnQuaW5zdGFuY2UoQ29tcG9uZW50RmFjdG9yeSk7XG5cblx0XHQvKiogQHR5cGUge0Jhc2VFbGVtZW50RXZlbnRSZWdpc3RyeX0gKi9cbiAgICAgICAgdGhpcy5iYXNlRWxlbWVudEV2ZW50UmVnaXN0cnkgPSBJbmplY3Rpb25Qb2ludC5pbnN0YW5jZShCYXNlRWxlbWVudEV2ZW50UmVnaXN0cnkpO1xuICAgICAgICBcbiAgICAgICAgLyoqIEB0eXBlIHtUZXN0VHJpZ2dlcn0gKi9cbiAgICAgICAgdGhpcy50ZXN0VHJpZ2dlciA9IHRlc3RUcmlnZ2VyO1xuXG4gICAgICAgIC8qKiBAdHlwZSB7TWFwPFRlc3RFbnRyeT59ICovXG4gICAgICAgIHRoaXMudGVzdEVudHJ5TWFwID0gbmV3IE1hcCgpO1xuICAgIH1cblxuXHRwb3N0Q29uZmlnKCkge1xuXHRcdHRoaXMuY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRGYWN0b3J5LmNyZWF0ZShUZXN0QmVuY2hWaWV3LkNPTVBPTkVOVF9OQU1FKTtcbiAgICAgICAgQ2FudmFzU3R5bGVzLmVuYWJsZVN0eWxlKFRlc3RCZW5jaFZpZXcuQ09NUE9ORU5UX05BTUUpO1xuXG4gICAgICAgIHRoaXMuYmFzZUVsZW1lbnRFdmVudFJlZ2lzdHJ5LmF0dGFjaCh0aGlzLmNvbXBvbmVudC5nZXQoXCJjbGVhckJ1dHRvblwiKSwgXCJvbmNsaWNrXCIsIFwiLy9ldmVudDpjbGVhckNsaWNrZWRcIiwgdGhpcy5jb21wb25lbnQuY29tcG9uZW50SW5kZXgpO1xuICAgICAgICB0aGlzLmJhc2VFbGVtZW50RXZlbnRSZWdpc3RyeS5saXN0ZW4oXCIvL2V2ZW50OmNsZWFyQ2xpY2tlZFwiLCBuZXcgTWV0aG9kKHRoaXMsIHRoaXMuY2xlYXJDbGlja2VkKSwgdGhpcy5jb21wb25lbnQuY29tcG9uZW50SW5kZXgpO1xuXG4gICAgICAgIHRoaXMuYmFzZUVsZW1lbnRFdmVudFJlZ2lzdHJ5LmF0dGFjaCh0aGlzLmNvbXBvbmVudC5nZXQoXCJydW5BbGxCdXR0b25cIiksIFwib25jbGlja1wiLCBcIi8vZXZlbnQ6cnVuQWxsQ2xpY2tlZFwiLCB0aGlzLmNvbXBvbmVudC5jb21wb25lbnRJbmRleCk7XG4gICAgICAgIHRoaXMuYmFzZUVsZW1lbnRFdmVudFJlZ2lzdHJ5Lmxpc3RlbihcIi8vZXZlbnQ6cnVuQWxsQ2xpY2tlZFwiLCBuZXcgTWV0aG9kKHRoaXMsIHRoaXMucnVuQWxsQ2xpY2tlZCksIHRoaXMuY29tcG9uZW50LmNvbXBvbmVudEluZGV4KTtcblxuICAgICAgICB0aGlzLmJhc2VFbGVtZW50RXZlbnRSZWdpc3RyeS5hdHRhY2godGhpcy5jb21wb25lbnQuZ2V0KFwicmVzZXRCdXR0b25cIiksIFwib25jbGlja1wiLCBcIi8vZXZlbnQ6cmVzZXRDbGlja2VkXCIsIHRoaXMuY29tcG9uZW50LmNvbXBvbmVudEluZGV4KTtcbiAgICAgICAgdGhpcy5iYXNlRWxlbWVudEV2ZW50UmVnaXN0cnkubGlzdGVuKFwiLy9ldmVudDpyZXNldENsaWNrZWRcIiwgbmV3IE1ldGhvZCh0aGlzLCB0aGlzLnJlc2V0Q2xpY2tlZCksIHRoaXMuY29tcG9uZW50LmNvbXBvbmVudEluZGV4KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1Rlc3RFbnRyeX0gdGVzdEVudHJ5IFxuICAgICAqL1xuICAgIGFkZFRlc3RFbnRyeSh0ZXN0RW50cnkpIHtcbiAgICAgICAgdGhpcy50ZXN0RW50cnlNYXAuc2V0KHRlc3RFbnRyeS50ZXN0Q2xhc3MubmFtZSwgdGVzdEVudHJ5KTtcbiAgICAgICAgdGhpcy5jb21wb25lbnQuYWRkQ2hpbGQoXCJ0ZXN0TGlzdFwiLCB0ZXN0RW50cnkuY29tcG9uZW50KTtcbiAgICB9XG5cbiAgICBydW5BbGxDbGlja2VkKCkge1xuICAgICAgICB0aGlzLnRlc3RUcmlnZ2VyLnJ1bkFsbCgpO1xuICAgIH1cblxuICAgIGNsZWFyQ2xpY2tlZCgpIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnQuY2xlYXJDaGlsZHJlbihcInRlc3RSZXN1bHRcIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtMaW5lRW50cnl9IGxpbmUgXG4gICAgICovXG4gICAgYWRkTGluZShsaW5lKSB7XG4gICAgICAgIHRoaXMuY29tcG9uZW50LmFkZENoaWxkKFwidGVzdFJlc3VsdFwiLCBsaW5lLmNvbXBvbmVudCk7XG4gICAgfVxuXG4gICAgcmVzZXRDbGlja2VkKCkge1xuICAgICAgICB0aGlzLnRlc3RFbnRyeU1hcC5mb3JFYWNoKChrZXksIHZhbHVlLCBwYXJlbnQpID0+IHtcbiAgICAgICAgICAgIC8qKiBAdHlwZSB7VGVzdEVudHJ5fSAqL1xuICAgICAgICAgICAgY29uc3QgdGVzdEVudHJ5ID0gdmFsdWU7XG4gICAgICAgICAgICB0ZXN0RW50cnkucmVzZXQoKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7VGVzdENsYXNzU3RhdGV9IHRlc3RDbGFzc1N0YXRlIFxuICAgICAqL1xuICAgIHJlc3VsdCh0ZXN0Q2xhc3NTdGF0ZSkge1xuICAgICAgICBpZiAodGhpcy50ZXN0RW50cnlNYXAuY29udGFpbnModGVzdENsYXNzU3RhdGUuY2xhc3NOYW1lKSkge1xuICAgICAgICAgICAgLyoqIEB0eXBlIHtUZXN0RW50cnl9ICovXG4gICAgICAgICAgICBjb25zdCB0ZXN0RW50cnkgPSB0aGlzLnRlc3RFbnRyeU1hcC5nZXQodGVzdENsYXNzU3RhdGUuY2xhc3NOYW1lKTtcbiAgICAgICAgICAgIHRlc3RFbnRyeS5yZXN1bHQodGVzdENsYXNzU3RhdGUpO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IFRlc3RCZW5jaCwgVGVzdFRyaWdnZXIgfSBmcm9tIFwidGVzdGJlbmNoX3YxXCI7XG5cbmV4cG9ydCBjbGFzcyBUZXN0QmVuY2hUZXN0VHJpZ2dlciBleHRlbmRzIFRlc3RUcmlnZ2VyIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtUZXN0QmVuY2h9XG4gICAgICovXG4gICAgc2V0IHRlc3RCZW5jaCh0ZXN0QmVuY2gpIHtcbiAgICAgICAgLyoqIEB0eXBlIHtUZXN0QmVuY2h9ICovXG4gICAgICAgIHRoaXMudGhlVGVzdEJlbmNoID0gdGVzdEJlbmNoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJ1biB0ZXN0IGJ5IGNsYXNzIG5hbWVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gY2xhc3NOYW1lIFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmdW5jdGlvbk5hbWVcbiAgICAgKi9cbiAgICBydW5GdW5jdGlvbihjbGFzc05hbWUsIGZ1bmN0aW9uTmFtZSkge1xuICAgICAgICB0aGlzLnRoZVRlc3RCZW5jaC5ydW5GdW5jdGlvbihjbGFzc05hbWUsIGZ1bmN0aW9uTmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUnVuIHRlc3QgYnkgY2xhc3MgbmFtZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWUgXG4gICAgICovXG4gICAgcnVuQ2xhc3MoY2xhc3NOYW1lKSB7XG4gICAgICAgIHRoaXMudGhlVGVzdEJlbmNoLnJ1bkNsYXNzKGNsYXNzTmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUnVuIGFsbCB0ZXN0IGNsYXNzZXNcbiAgICAgKi9cbiAgICBydW5BbGwoKSB7XG4gICAgICAgIHRoaXMudGhlVGVzdEJlbmNoLnJ1bkFsbCgpO1xuICAgIH1cblxufSIsImltcG9ydCB7IEluc3RhbmNlUG9zdENvbmZpZ1RyaWdnZXIsIE1pbmRpQ29uZmlnLCBNaW5kaUluamVjdG9yIH0gZnJvbSBcIm1pbmRpX3YxXCI7XG5pbXBvcnQgeyBPYmplY3RQcm92aWRlciB9IGZyb20gXCJ0ZXN0YmVuY2hfdjFcIjtcblxuZXhwb3J0IGNsYXNzIERpT2JqZWN0UHJvdmlkZXIgZXh0ZW5kcyBPYmplY3RQcm92aWRlciB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBhc3luYyBwcm92aWRlKHRoZUNsYXNzLCBhcmdzID0gW10pIHtcbiAgICAgICAgY29uc3Qgb2JqZWN0ID0gbmV3IHRoZUNsYXNzKC4uLmFyZ3MpO1xuICAgICAgICBjb25zdCBjb25maWcgPSBuZXcgTWluZGlDb25maWcoKTtcbiAgICAgICAgY29uZmlnLmFkZEFsbEluc3RhbmNlUHJvY2Vzc29yKFtJbnN0YW5jZVBvc3RDb25maWdUcmlnZ2VyXSk7XG4gICAgICAgIGlmIChvYmplY3QudHlwZUNvbmZpZ0xpc3QpIHtcbiAgICAgICAgICAgIGNvbmZpZy5hZGRBbGxUeXBlQ29uZmlnKG9iamVjdC50eXBlQ29uZmlnTGlzdCk7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgY29uZmlnLmZpbmFsaXplKCk7XG4gICAgICAgIGF3YWl0IE1pbmRpSW5qZWN0b3IuZ2V0SW5zdGFuY2UoKS5pbmplY3RUYXJnZXQob2JqZWN0LCBjb25maWcpO1xuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxufSIsImltcG9ydCB7IExvZ2dlciwgTWV0aG9kIH0gZnJvbSBcImNvcmV1dGlsX3YxXCI7XG5pbXBvcnQgeyBDb21wb25lbnRGYWN0b3J5IH0gZnJvbSBcImp1c3RyaWdodF9jb3JlX3YxXCI7XG5pbXBvcnQgeyBJbmplY3Rpb25Qb2ludCwgUHJvdmlkZXIgfSBmcm9tIFwibWluZGlfdjFcIjtcbmltcG9ydCB7IFRlc3RCZW5jaCwgVGVzdENsYXNzUmVzdWx0IH0gZnJvbSBcInRlc3RiZW5jaF92MVwiO1xuaW1wb3J0IHsgVGVzdEJlbmNoVmlldyB9IGZyb20gXCIuL3Rlc3RCZW5jaFZpZXcvdGVzdEJlbmNoVmlldy5qc1wiO1xuaW1wb3J0IHsgVGVzdEVudHJ5IH0gZnJvbSBcIi4vdGVzdEJlbmNoVmlldy90ZXN0RW50cnkvdGVzdEVudHJ5LmpzXCI7XG5pbXBvcnQgeyBMaW5lRW50cnkgfSBmcm9tIFwiLi90ZXN0QmVuY2hWaWV3L2xpbmVFbnRyeS9saW5lRW50cnkuanNcIjtcbmltcG9ydCB7IFRlc3RCZW5jaFRlc3RUcmlnZ2VyIH0gZnJvbSBcIi4vdGVzdEJlbmNoVmlldy90ZXN0QmVuY2hUZXN0VHJpZ2dlci5qc1wiXG5pbXBvcnQgeyBEaU9iamVjdFByb3ZpZGVyIH0gZnJvbSBcIi4vdGVzdEJlbmNoVmlldy9kaU9iamVjdFByb3ZpZGVyLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBUZXN0QmVuY2hVaSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICAvKiogQHR5cGUge1Rlc3RCZW5jaFRlc3RUcmlnZ2VyfSAqL1xuICAgICAgICB0aGlzLnRlc3RUcmlnZ2VyID0gbmV3IFRlc3RCZW5jaFRlc3RUcmlnZ2VyKCk7XG5cblx0XHQvKiogQHR5cGUge0NvbXBvbmVudEZhY3Rvcnl9ICovXG4gICAgICAgIHRoaXMuY29tcG9uZW50RmFjdG9yeSA9IEluamVjdGlvblBvaW50Lmluc3RhbmNlKENvbXBvbmVudEZhY3RvcnkpO1xuXG4gICAgICAgIC8qKiBAdHlwZSB7VGVzdEJlbmNoVmlld30gKi9cbiAgICAgICAgdGhpcy50ZXN0QmVuY2hWaWV3ID0gSW5qZWN0aW9uUG9pbnQuaW5zdGFuY2UoVGVzdEJlbmNoVmlldywgW3RoaXMudGVzdFRyaWdnZXJdKTtcblxuICAgICAgICAvKiogQHR5cGUge1Byb3ZpZGVyfSAqL1xuICAgICAgICB0aGlzLnRlc3RFbnRyeVByb3ZpZGVyID0gSW5qZWN0aW9uUG9pbnQucHJvdmlkZXIoVGVzdEVudHJ5KTtcblxuICAgICAgICAvKiogQHR5cGUge1Byb3ZpZGVyfSAqL1xuICAgICAgICB0aGlzLmxpbmVFbnRyeVByb3ZpZGVyID0gSW5qZWN0aW9uUG9pbnQucHJvdmlkZXIoTGluZUVudHJ5KTtcblxuICAgICAgICAvKiogQHR5cGUge1Rlc3RCZW5jaH0gKi9cbiAgICAgICAgdGhpcy50ZXN0QmVuY2ggPSBudWxsO1xuXG4gICAgICAgIHRoaXMudGVzdEVudHJ5TG9hZGVkUHJvbWlzZUFycmF5ID0gW107XG5cbiAgICB9XG5cbiAgICBwb3N0Q29uZmlnKCkge1xuICAgICAgICAvKiogQHR5cGUge1Rlc3RCZW5jaH0gKi9cbiAgICAgICAgdGhpcy50ZXN0QmVuY2ggPSBuZXcgVGVzdEJlbmNoKFxuICAgICAgICAgICAgbmV3IE1ldGhvZCh0aGlzLCB0aGlzLmxvZyksXG4gICAgICAgICAgICBuZXcgTWV0aG9kKHRoaXMsIHRoaXMucmVzdWx0KSxcbiAgICAgICAgICAgIG5ldyBEaU9iamVjdFByb3ZpZGVyKCkpO1xuXG4gICAgICAgIHRoaXMudGVzdFRyaWdnZXIudGVzdEJlbmNoID0gdGhpcy50ZXN0QmVuY2g7XG4gICAgfVxuXG4gICAgYWRkVGVzdCh0ZXN0Q2xhc3MpIHtcbiAgICAgICAgY29uc3QgY29udGV4dCA9IHRoaXM7XG4gICAgICAgIGlmKCF0aGlzLnRlc3RCZW5jaC5jb250YWlucyh0ZXN0Q2xhc3MpKSB7XG4gICAgICAgICAgICB0aGlzLnRlc3RCZW5jaC5hZGRUZXN0KHRlc3RDbGFzcyk7XG4gICAgICAgICAgICBjb25zdCB0ZXN0RW50cnlMb2FkZWRQcm9taXNlID0gdGhpcy50ZXN0RW50cnlQcm92aWRlci5nZXQoW3Rlc3RDbGFzcywgdGhpcy50ZXN0QmVuY2hdKS50aGVuKCh0ZXN0RW50cnkpID0+IHtcbiAgICAgICAgICAgICAgICBjb250ZXh0LnRlc3RCZW5jaFZpZXcuYWRkVGVzdEVudHJ5KHRlc3RFbnRyeSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudGVzdEVudHJ5TG9hZGVkUHJvbWlzZUFycmF5LnB1c2godGVzdEVudHJ5TG9hZGVkUHJvbWlzZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtUZXN0Q2xhc3NSZXN1bHR9IHRlc3RDbGFzc1Jlc3VsdCBcbiAgICAgKi9cbiAgICByZXN1bHQodGVzdENsYXNzUmVzdWx0KSB7XG4gICAgICAgIHRoaXMudGVzdEJlbmNoVmlldy5yZXN1bHQodGVzdENsYXNzUmVzdWx0KTtcbiAgICB9XG5cbiAgICBhc3luYyBsb2cobGluZSwgbGV2ZWwpIHtcbiAgICAgICAgY29uc3QgY29sb3IgPSB0aGlzLmFzQ29sb3IobGV2ZWwpO1xuICAgICAgICBjb25zdCBjb250ZXh0ID0gdGhpcztcbiAgICAgICAgY29uc3QgbGluZUVudHJ5ID0gYXdhaXQgdGhpcy5saW5lRW50cnlQcm92aWRlci5nZXQoW2xpbmUsIGNvbG9yXSk7XG4gICAgICAgIGNvbnRleHQudGVzdEJlbmNoVmlldy5hZGRMaW5lKGxpbmVFbnRyeSk7XG4gICAgICAgIHJldHVybiBsaW5lRW50cnk7XG4gICAgfVxuICAgIFxuICAgIGFzQ29sb3IobGV2ZWwpIHtcbiAgICAgICAgaWYgKExvZ2dlci5FUlJPUiA9PT0gbGV2ZWwpIHtcbiAgICAgICAgICAgIHJldHVybiBcInJlZFwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChMb2dnZXIuRkFUQUwgPT09IGxldmVsKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJyZWRcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBnZXQgY29tcG9uZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy50ZXN0QmVuY2hWaWV3LmNvbXBvbmVudDtcbiAgICB9XG5cbn0iXSwibmFtZXMiOlsiSW5qZWN0aW9uUG9pbnQiLCJDb21wb25lbnRGYWN0b3J5IiwiQ2FudmFzU3R5bGVzIiwiQmFzZUVsZW1lbnRFdmVudFJlZ2lzdHJ5IiwiTWV0aG9kIiwiVGVzdENsYXNzU3RhdGUiLCJMaXN0IiwiTWFwIiwiVGVzdFRyaWdnZXIiLCJPYmplY3RQcm92aWRlciIsIk1pbmRpQ29uZmlnIiwiSW5zdGFuY2VQb3N0Q29uZmlnVHJpZ2dlciIsIk1pbmRpSW5qZWN0b3IiLCJUZXN0QmVuY2giLCJMb2dnZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUdPLE1BQU0sU0FBUyxDQUFDO0FBQ3ZCO0FBQ0EsSUFBSSxXQUFXLGNBQWMsR0FBRyxFQUFFLE9BQU8sV0FBVyxDQUFDLEVBQUU7QUFDdkQsQ0FBQyxXQUFXLFlBQVksR0FBRyxFQUFFLE9BQU8seUNBQXlDLENBQUMsRUFBRTtBQUNoRixJQUFJLFdBQVcsVUFBVSxHQUFHLEVBQUUsT0FBTyx3Q0FBd0MsQ0FBQyxFQUFFO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLEdBQUcsSUFBSSxFQUFFO0FBQ2pDO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxnQkFBZ0IsR0FBR0EsdUJBQWMsQ0FBQyxRQUFRLENBQUNDLGtDQUFnQixDQUFDLENBQUM7QUFDMUU7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDekI7QUFDQSxRQUFRLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQzNCLEtBQUs7QUFDTDtBQUNBLENBQUMsVUFBVSxHQUFHO0FBQ2QsRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzFFLFFBQVFDLDhCQUFZLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUMzRCxRQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsUUFB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
