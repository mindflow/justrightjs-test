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

		/** @type {EventRegistry} */
		this.eventRegistry = mindi_v1.InjectionPoint.instance(justright_core_v1.EventRegistry);

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

        this.eventRegistry.attach(this.component.get("runButton"), "onclick", "//event:runClicked", this.component.componentIndex);
        this.eventRegistry.listen("//event:runClicked", new coreutil_v1.ObjectFunction(this, this.runClicked), this.component.componentIndex);
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

		/** @type {EventRegistry} */
        this.eventRegistry = mindi_v1.InjectionPoint.instance(justright_core_v1.EventRegistry);
        
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

        this.eventRegistry.attach(this.component.get("runButton"), "onclick", "//event:runClicked", this.component.componentIndex);
        this.eventRegistry.listen("//event:runClicked", new coreutil_v1.ObjectFunction(this, this.runClicked), this.component.componentIndex);

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

		/** @type {EventRegistry} */
        this.eventRegistry = mindi_v1.InjectionPoint.instance(justright_core_v1.EventRegistry);
        
        /** @type {TestTrigger} */
        this.testTrigger = testTrigger;

        /** @type {Map<TestEntry>} */
        this.testEntryMap = new coreutil_v1.Map();
    }

	postConfig() {
		this.component = this.componentFactory.create(TestBenchView.COMPONENT_NAME);
        justright_core_v1.CanvasStyles.enableStyle(TestBenchView.COMPONENT_NAME);

        this.eventRegistry.attach(this.component.get("clearButton"), "onclick", "//event:clearClicked", this.component.componentIndex);
        this.eventRegistry.listen("//event:clearClicked", new coreutil_v1.ObjectFunction(this, this.clearClicked), this.component.componentIndex);

        this.eventRegistry.attach(this.component.get("runAllButton"), "onclick", "//event:runAllClicked", this.component.componentIndex);
        this.eventRegistry.listen("//event:runAllClicked", new coreutil_v1.ObjectFunction(this, this.runAllClicked), this.component.componentIndex);

        this.eventRegistry.attach(this.component.get("resetButton"), "onclick", "//event:resetClicked", this.component.componentIndex);
        this.eventRegistry.listen("//event:resetClicked", new coreutil_v1.ObjectFunction(this, this.resetClicked), this.component.componentIndex);
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

    provide(theClass, args = []) {
        return new Promise((resolve, reject) => {
            const object = new theClass(...args);
            const config = new mindi_v1.MindiConfig();
            config.addAllInstanceProcessor([mindi_v1.InstancePostConfigTrigger]);
            if (object.typeConfigList) {
                config.addAllTypeConfig(object.typeConfigList);
            }
            config.finalize().then(() => {
                mindi_v1.MindiInjector.getInstance().injectTarget(object, config).then(() => {
                    resolve(object);
                });
            });
        });
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
            new coreutil_v1.ObjectFunction(this, this.log),
            new coreutil_v1.ObjectFunction(this, this.result),
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

    log(line, level) {
        const color = this.asColor(level);
        const context = this;
        this.lineEntryProvider.get([line, color]).then((lineEntry) => {
            context.testBenchView.addLine(lineEntry);
        });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianVzdHJpZ2h0X3Rlc3RfdjEuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9qdXN0cmlnaHQvdGVzdEJlbmNoVmlldy9saW5lRW50cnkvbGluZUVudHJ5LmpzIiwiLi4vLi4vc3JjL2p1c3RyaWdodC90ZXN0QmVuY2hWaWV3L3Rlc3RFbnRyeUZ1bmN0aW9uL3Rlc3RFbnRyeUZ1bmN0aW9uLmpzIiwiLi4vLi4vc3JjL2p1c3RyaWdodC90ZXN0QmVuY2hWaWV3L3Rlc3RFbnRyeS90ZXN0RW50cnkuanMiLCIuLi8uLi9zcmMvanVzdHJpZ2h0L3Rlc3RCZW5jaFZpZXcvdGVzdEJlbmNoVmlldy5qcyIsIi4uLy4uL3NyYy9qdXN0cmlnaHQvdGVzdEJlbmNoVmlldy90ZXN0QmVuY2hUZXN0VHJpZ2dlci5qcyIsIi4uLy4uL3NyYy9qdXN0cmlnaHQvdGVzdEJlbmNoVmlldy9kaU9iamVjdFByb3ZpZGVyLmpzIiwiLi4vLi4vc3JjL2p1c3RyaWdodC90ZXN0QmVuY2hVaS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDYW52YXNTdHlsZXMsIENvbXBvbmVudEZhY3RvcnkgfSBmcm9tIFwianVzdHJpZ2h0X2NvcmVfdjFcIjtcbmltcG9ydCB7IEluamVjdGlvblBvaW50IH0gZnJvbSBcIm1pbmRpX3YxXCI7XG5cbmV4cG9ydCBjbGFzcyBMaW5lRW50cnkge1xuXG4gICAgc3RhdGljIGdldCBDT01QT05FTlRfTkFNRSgpIHsgcmV0dXJuIFwiTGluZUVudHJ5XCI7IH1cblx0c3RhdGljIGdldCBURU1QTEFURV9VUkwoKSB7IHJldHVybiBcIi9hc3NldHMvanVzdHJpZ2h0anMtdGVzdC9saW5lRW50cnkuaHRtbFwiOyB9XG4gICAgc3RhdGljIGdldCBTVFlMRVNfVVJMKCkgeyByZXR1cm4gXCIvYXNzZXRzL2p1c3RyaWdodGpzLXRlc3QvbGluZUVudHJ5LmNzc1wiOyB9XG4gICAgXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGxpbmUgXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGNvbG9yIFxuICAgICAqL1xuXHRjb25zdHJ1Y3RvcihsaW5lLCBjb2xvciA9IG51bGwpIHtcblxuXHRcdC8qKiBAdHlwZSB7Q29tcG9uZW50RmFjdG9yeX0gKi9cbiAgICAgICAgdGhpcy5jb21wb25lbnRGYWN0b3J5ID0gSW5qZWN0aW9uUG9pbnQuaW5zdGFuY2UoQ29tcG9uZW50RmFjdG9yeSk7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtTdHJpbmd9ICovXG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG5cbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgIH1cblxuXHRwb3N0Q29uZmlnKCkge1xuXHRcdHRoaXMuY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRGYWN0b3J5LmNyZWF0ZShMaW5lRW50cnkuQ09NUE9ORU5UX05BTUUpO1xuICAgICAgICBDYW52YXNTdHlsZXMuZW5hYmxlU3R5bGUoTGluZUVudHJ5LkNPTVBPTkVOVF9OQU1FKTtcbiAgICAgICAgdGhpcy5jb21wb25lbnQuc2V0Q2hpbGQoXCJsaW5lRW50cnlcIiwgdGhpcy5saW5lKTtcbiAgICAgICAgaWYgKHRoaXMuY29sb3IpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50LmdldChcImxpbmVFbnRyeVwiKS5zZXRBdHRyaWJ1dGVWYWx1ZShcInN0eWxlXCIsXCJjb2xvcjpcIiArIHRoaXMuY29sb3IpO1xuICAgICAgICB9XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgT2JqZWN0RnVuY3Rpb24gfSBmcm9tIFwiY29yZXV0aWxfdjFcIjtcbmltcG9ydCB7IENhbnZhc1N0eWxlcywgQ29tcG9uZW50RmFjdG9yeSwgRXZlbnRSZWdpc3RyeSB9IGZyb20gXCJqdXN0cmlnaHRfY29yZV92MVwiO1xuaW1wb3J0IHsgSW5qZWN0aW9uUG9pbnQgfSBmcm9tIFwibWluZGlfdjFcIjtcbmltcG9ydCB7IFRlc3RDbGFzc1N0YXRlLCBUZXN0VHJpZ2dlciB9IGZyb20gXCJ0ZXN0YmVuY2hfdjFcIjtcblxuZXhwb3J0IGNsYXNzIFRlc3RFbnRyeUZ1bmN0aW9uIHtcblxuICAgIHN0YXRpYyBnZXQgQ09NUE9ORU5UX05BTUUoKSB7IHJldHVybiBcIlRlc3RFbnRyeUZ1bmN0aW9uXCI7IH1cblx0c3RhdGljIGdldCBURU1QTEFURV9VUkwoKSB7IHJldHVybiBcIi9hc3NldHMvanVzdHJpZ2h0anMtdGVzdC90ZXN0RW50cnlGdW5jdGlvbi5odG1sXCI7IH1cbiAgICBzdGF0aWMgZ2V0IFNUWUxFU19VUkwoKSB7IHJldHVybiBcIi9hc3NldHMvanVzdHJpZ2h0anMtdGVzdC90ZXN0RW50cnlGdW5jdGlvbi5jc3NcIjsgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0ZXN0Q2xhc3NcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSB0ZXN0RnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge1Rlc3RUcmlnZ2VyfSB0ZXN0VHJpZ2dlciBcbiAgICAgKi9cblx0Y29uc3RydWN0b3IodGVzdENsYXNzLCB0ZXN0RnVuY3Rpb24sIHRlc3RUcmlnZ2VyKSB7XG5cblx0XHQvKiogQHR5cGUge0NvbXBvbmVudEZhY3Rvcnl9ICovXG4gICAgICAgIHRoaXMuY29tcG9uZW50RmFjdG9yeSA9IEluamVjdGlvblBvaW50Lmluc3RhbmNlKENvbXBvbmVudEZhY3RvcnkpO1xuXG5cdFx0LyoqIEB0eXBlIHtFdmVudFJlZ2lzdHJ5fSAqL1xuXHRcdHRoaXMuZXZlbnRSZWdpc3RyeSA9IEluamVjdGlvblBvaW50Lmluc3RhbmNlKEV2ZW50UmVnaXN0cnkpO1xuXG4gICAgICAgIC8qKiBAdHlwZSB7T2JqZWN0fSAqL1xuICAgICAgICB0aGlzLnRlc3RDbGFzcyA9IHRlc3RDbGFzcztcblxuICAgICAgICAvKiogQHR5cGUge0Z1bmN0aW9ufSAqL1xuICAgICAgICB0aGlzLnRlc3RGdW5jdGlvbiA9IHRlc3RGdW5jdGlvbjtcblxuICAgICAgICAvKiogQHR5cGUge1Rlc3RUcmlnZ2VyfSAqL1xuICAgICAgICB0aGlzLnRlc3RUcmlnZ2VyID0gdGVzdFRyaWdnZXI7XG4gICAgfVxuXG5cdHBvc3RDb25maWcoKSB7XG5cdFx0dGhpcy5jb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudEZhY3RvcnkuY3JlYXRlKFRlc3RFbnRyeUZ1bmN0aW9uLkNPTVBPTkVOVF9OQU1FKTtcbiAgICAgICAgQ2FudmFzU3R5bGVzLmVuYWJsZVN0eWxlKFRlc3RFbnRyeUZ1bmN0aW9uLkNPTVBPTkVOVF9OQU1FKTtcbiAgICAgICAgdGhpcy5jb21wb25lbnQuc2V0Q2hpbGQoXCJ0ZXN0RW50cnlGdW5jdGlvbk5hbWVcIiwgdGhpcy50ZXN0RnVuY3Rpb24ubmFtZSk7XG5cbiAgICAgICAgdGhpcy5ldmVudFJlZ2lzdHJ5LmF0dGFjaCh0aGlzLmNvbXBvbmVudC5nZXQoXCJydW5CdXR0b25cIiksIFwib25jbGlja1wiLCBcIi8vZXZlbnQ6cnVuQ2xpY2tlZFwiLCB0aGlzLmNvbXBvbmVudC5jb21wb25lbnRJbmRleCk7XG4gICAgICAgIHRoaXMuZXZlbnRSZWdpc3RyeS5saXN0ZW4oXCIvL2V2ZW50OnJ1bkNsaWNrZWRcIiwgbmV3IE9iamVjdEZ1bmN0aW9uKHRoaXMsIHRoaXMucnVuQ2xpY2tlZCksIHRoaXMuY29tcG9uZW50LmNvbXBvbmVudEluZGV4KTtcbiAgICB9XG5cbiAgICBydW5DbGlja2VkKCkge1xuICAgICAgICB0aGlzLnRlc3RUcmlnZ2VyLnJ1bkZ1bmN0aW9uKHRoaXMudGVzdENsYXNzLm5hbWUsIHRoaXMudGVzdEZ1bmN0aW9uLm5hbWUpO1xuICAgIH1cblxuICAgIHJlc3VsdCh0ZXN0Q2xhc3NTdGF0ZSkge1xuICAgICAgICBpZiAoVGVzdENsYXNzU3RhdGUuUlVOTklORyA9PT0gdGVzdENsYXNzU3RhdGUuc3RhdGUpIHtcbiAgICAgICAgICAgIHRoaXMucnVubmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChUZXN0Q2xhc3NTdGF0ZS5TVUNDRVNTID09PSB0ZXN0Q2xhc3NTdGF0ZS5zdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5zdWNjZWVkKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFRlc3RDbGFzc1N0YXRlLkZBSUwgPT09IHRlc3RDbGFzc1N0YXRlLnN0YXRlKSB7XG4gICAgICAgICAgICB0aGlzLmZhaWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZhaWwoKSB7XG4gICAgICAgIHRoaXMuY29tcG9uZW50LmdldChcInRlc3RFbnRyeUZ1bmN0aW9uTmFtZVwiKS5zZXRBdHRyaWJ1dGVWYWx1ZShcInN0eWxlXCIsIFwiZm9udC13ZWlnaHQ6Ym9sZDtjb2xvcjpyZWRcIik7XG4gICAgfVxuXG4gICAgc3VjY2VlZCgpIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnQuZ2V0KFwidGVzdEVudHJ5RnVuY3Rpb25OYW1lXCIpLnNldEF0dHJpYnV0ZVZhbHVlKFwic3R5bGVcIiwgXCJmb250LXdlaWdodDpib2xkO2NvbG9yOmdyZWVuXCIpO1xuICAgIH1cblxuICAgIHJ1bm5pbmcoKSB7XG4gICAgICAgIHRoaXMuY29tcG9uZW50LmdldChcInRlc3RFbnRyeUZ1bmN0aW9uTmFtZVwiKS5zZXRBdHRyaWJ1dGVWYWx1ZShcInN0eWxlXCIsIFwiZm9udC13ZWlnaHQ6Ym9sZDtjb2xvcjpibGFja1wiKTtcbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnQuZ2V0KFwidGVzdEVudHJ5RnVuY3Rpb25OYW1lXCIpLnJlbW92ZUF0dHJpYnV0ZShcInN0eWxlXCIpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBMaXN0LCBPYmplY3RGdW5jdGlvbiB9IGZyb20gXCJjb3JldXRpbF92MVwiO1xuaW1wb3J0IHsgQ2FudmFzU3R5bGVzLCBDb21wb25lbnRGYWN0b3J5LCBFdmVudFJlZ2lzdHJ5IH0gZnJvbSBcImp1c3RyaWdodF9jb3JlX3YxXCI7XG5pbXBvcnQgeyBJbmplY3Rpb25Qb2ludCwgUHJvdmlkZXIgfSBmcm9tIFwibWluZGlfdjFcIjtcbmltcG9ydCB7IFRlc3RDbGFzc1N0YXRlLCBUZXN0VHJpZ2dlciB9IGZyb20gXCJ0ZXN0YmVuY2hfdjFcIjtcbmltcG9ydCB7IFRlc3RFbnRyeUZ1bmN0aW9uIH0gZnJvbSBcIi4uL3Rlc3RFbnRyeUZ1bmN0aW9uL3Rlc3RFbnRyeUZ1bmN0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBUZXN0RW50cnkge1xuXG4gICAgc3RhdGljIGdldCBDT01QT05FTlRfTkFNRSgpIHsgcmV0dXJuIFwiVGVzdEVudHJ5XCI7IH1cblx0c3RhdGljIGdldCBURU1QTEFURV9VUkwoKSB7IHJldHVybiBcIi9hc3NldHMvanVzdHJpZ2h0anMtdGVzdC90ZXN0RW50cnkuaHRtbFwiOyB9XG4gICAgc3RhdGljIGdldCBTVFlMRVNfVVJMKCkgeyByZXR1cm4gXCIvYXNzZXRzL2p1c3RyaWdodGpzLXRlc3QvdGVzdEVudHJ5LmNzc1wiOyB9XG4gICAgXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHRlc3RDbGFzc1xuICAgICAqIEBwYXJhbSB7VGVzdFRyaWdnZXJ9IHRlc3RUcmlnZ2VyIFxuICAgICAqL1xuXHRjb25zdHJ1Y3Rvcih0ZXN0Q2xhc3MsIHRlc3RUcmlnZ2VyKSB7XG5cblx0XHQvKiogQHR5cGUge0NvbXBvbmVudEZhY3Rvcnl9ICovXG4gICAgICAgIHRoaXMuY29tcG9uZW50RmFjdG9yeSA9IEluamVjdGlvblBvaW50Lmluc3RhbmNlKENvbXBvbmVudEZhY3RvcnkpO1xuXG5cdFx0LyoqIEB0eXBlIHtFdmVudFJlZ2lzdHJ5fSAqL1xuICAgICAgICB0aGlzLmV2ZW50UmVnaXN0cnkgPSBJbmplY3Rpb25Qb2ludC5pbnN0YW5jZShFdmVudFJlZ2lzdHJ5KTtcbiAgICAgICAgXG4gICAgICAgIC8qKiBAdHlwZSB7UHJvdmlkZXI8VGVzdEVudHJ5RnVuY3Rpb24+fSAqL1xuICAgICAgICB0aGlzLnRlc3RFbnRyeUZ1bmN0aW9uUHJvdmlkZXIgPSBJbmplY3Rpb25Qb2ludC5wcm92aWRlcihUZXN0RW50cnlGdW5jdGlvbilcblxuICAgICAgICAvKiogQHR5cGUge09iamVjdH0gKi9cbiAgICAgICAgdGhpcy50ZXN0Q2xhc3MgPSB0ZXN0Q2xhc3M7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtUZXN0VHJpZ2dlcn0gKi9cbiAgICAgICAgdGhpcy50ZXN0VHJpZ2dlciA9IHRlc3RUcmlnZ2VyO1xuXG4gICAgICAgIC8qKiBAdHlwZSB7TGlzdDxUZXN0RW50cnlGdW5jdGlvbj59ICovXG4gICAgICAgIHRoaXMudGVzdEVudHJ5RnVuY3Rpb25MaXN0ID0gbmV3IExpc3QoKTtcblxuICAgICAgICB0aGlzLmZhaWxlZCA9IGZhbHNlO1xuICAgIH1cblxuXHRwb3N0Q29uZmlnKCkge1xuXHRcdHRoaXMuY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRGYWN0b3J5LmNyZWF0ZShUZXN0RW50cnkuQ09NUE9ORU5UX05BTUUpO1xuICAgICAgICBDYW52YXNTdHlsZXMuZW5hYmxlU3R5bGUoVGVzdEVudHJ5LkNPTVBPTkVOVF9OQU1FKTtcbiAgICAgICAgdGhpcy5jb21wb25lbnQuc2V0Q2hpbGQoXCJ0ZXN0RW50cnlOYW1lXCIsIHRoaXMudGVzdENsYXNzLm5hbWUpO1xuXG4gICAgICAgIHRoaXMuZXZlbnRSZWdpc3RyeS5hdHRhY2godGhpcy5jb21wb25lbnQuZ2V0KFwicnVuQnV0dG9uXCIpLCBcIm9uY2xpY2tcIiwgXCIvL2V2ZW50OnJ1bkNsaWNrZWRcIiwgdGhpcy5jb21wb25lbnQuY29tcG9uZW50SW5kZXgpO1xuICAgICAgICB0aGlzLmV2ZW50UmVnaXN0cnkubGlzdGVuKFwiLy9ldmVudDpydW5DbGlja2VkXCIsIG5ldyBPYmplY3RGdW5jdGlvbih0aGlzLCB0aGlzLnJ1bkNsaWNrZWQpLCB0aGlzLmNvbXBvbmVudC5jb21wb25lbnRJbmRleCk7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtMaXN0PFRlc3RFbnRyeUZ1bmN0aW9uPn0gKi9cbiAgICAgICAgY29uc3QgdGVzdEZ1bmN0aW9ucyA9IHRoaXMudGVzdENsYXNzLnRlc3RGdW5jdGlvbnMoKTtcbiAgICAgICAgdGVzdEZ1bmN0aW9ucy5mb3JFYWNoKCh0ZXN0RnVuY3Rpb24sIHBhcmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy50ZXN0RW50cnlGdW5jdGlvblByb3ZpZGVyLmdldChbdGhpcy50ZXN0Q2xhc3MsIHRlc3RGdW5jdGlvbiwgdGhpcy50ZXN0VHJpZ2dlcl0pLnRoZW4oKHRlc3RFbnRyeUZ1bmN0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXN0RW50cnlGdW5jdGlvbkxpc3QuYWRkKHRlc3RFbnRyeUZ1bmN0aW9uKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudC5nZXQoXCJ0ZXN0RW50cnlGdW5jdGlvbnNcIikuYWRkQ2hpbGQodGVzdEVudHJ5RnVuY3Rpb24uY29tcG9uZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sdGhpcyk7XG4gICAgfVxuXG4gICAgcnVuQ2xpY2tlZCgpIHtcbiAgICAgICAgdGhpcy5mYWlsZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy50ZXN0VHJpZ2dlci5ydW5DbGFzcyh0aGlzLnRlc3RDbGFzcy5uYW1lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1Rlc3RDbGFzc1N0YXRlfSB0ZXN0Q2xhc3NTdGF0ZSBcbiAgICAgKi9cbiAgICByZXN1bHQodGVzdENsYXNzU3RhdGUpIHtcbiAgICAgICAgdGhpcy50ZXN0RW50cnlGdW5jdGlvbkxpc3QuZm9yRWFjaCgodGVzdEVudHJ5RnVuY3Rpb24sIHBhcmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRlc3RFbnRyeUZ1bmN0aW9uLnRlc3RGdW5jdGlvbi5uYW1lID09PSB0ZXN0Q2xhc3NTdGF0ZS5mdW5jdGlvbk5hbWUpIHtcbiAgICAgICAgICAgICAgICB0ZXN0RW50cnlGdW5jdGlvbi5yZXN1bHQodGVzdENsYXNzU3RhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sdGhpcyk7XG4gICAgICAgIGlmICghdGhpcy5mYWlsZWQgJiYgVGVzdENsYXNzU3RhdGUuUlVOTklORyA9PT0gdGVzdENsYXNzU3RhdGUuc3RhdGUpIHtcbiAgICAgICAgICAgIHRoaXMucnVubmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5mYWlsZWQgJiYgVGVzdENsYXNzU3RhdGUuU1VDQ0VTUyA9PT0gdGVzdENsYXNzU3RhdGUuc3RhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuc3VjY2VlZCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChUZXN0Q2xhc3NTdGF0ZS5GQUlMID09PSB0ZXN0Q2xhc3NTdGF0ZS5zdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5mYWlsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmYWlsKCkge1xuICAgICAgICB0aGlzLmZhaWxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuY29tcG9uZW50LmdldChcInRlc3RFbnRyeU5hbWVcIikuc2V0QXR0cmlidXRlVmFsdWUoXCJzdHlsZVwiLCBcImZvbnQtd2VpZ2h0OmJvbGQ7Y29sb3I6cmVkXCIpO1xuICAgIH1cblxuICAgIHN1Y2NlZWQoKSB7XG4gICAgICAgIHRoaXMuY29tcG9uZW50LmdldChcInRlc3RFbnRyeU5hbWVcIikuc2V0QXR0cmlidXRlVmFsdWUoXCJzdHlsZVwiLCBcImZvbnQtd2VpZ2h0OmJvbGQ7Y29sb3I6Z3JlZW5cIik7XG4gICAgfVxuXG4gICAgcnVubmluZygpIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnQuZ2V0KFwidGVzdEVudHJ5TmFtZVwiKS5zZXRBdHRyaWJ1dGVWYWx1ZShcInN0eWxlXCIsIFwiZm9udC13ZWlnaHQ6Ym9sZDtjb2xvcjpibGFja1wiKTtcbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgdGhpcy5mYWlsZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy50ZXN0RW50cnlGdW5jdGlvbkxpc3QuZm9yRWFjaCgodGVzdEVudHJ5RnVuY3Rpb24sIHBhcmVudCkgPT4ge1xuICAgICAgICAgICAgdGVzdEVudHJ5RnVuY3Rpb24ucmVzZXQoKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LHRoaXMpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudC5nZXQoXCJ0ZXN0RW50cnlOYW1lXCIpLnJlbW92ZUF0dHJpYnV0ZShcInN0eWxlXCIpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBNYXAsIE9iamVjdEZ1bmN0aW9uIH0gZnJvbSBcImNvcmV1dGlsX3YxXCI7XG5pbXBvcnQgeyBDYW52YXNTdHlsZXMsIENvbXBvbmVudEZhY3RvcnksIEV2ZW50UmVnaXN0cnkgfSBmcm9tIFwianVzdHJpZ2h0X2NvcmVfdjFcIjtcbmltcG9ydCB7IEluamVjdGlvblBvaW50IH0gZnJvbSBcIm1pbmRpX3YxXCI7XG5pbXBvcnQgeyBUZXN0Q2xhc3NTdGF0ZSwgVGVzdFRyaWdnZXIgfSBmcm9tIFwidGVzdGJlbmNoX3YxXCI7XG5pbXBvcnQgeyBMaW5lRW50cnkgfSBmcm9tIFwiLi9saW5lRW50cnkvbGluZUVudHJ5LmpzXCI7XG5pbXBvcnQgeyBUZXN0RW50cnkgfSBmcm9tIFwiLi90ZXN0RW50cnkvdGVzdEVudHJ5LmpzXCJcblxuZXhwb3J0IGNsYXNzIFRlc3RCZW5jaFZpZXcge1xuXG4gICAgc3RhdGljIGdldCBDT01QT05FTlRfTkFNRSgpIHsgcmV0dXJuIFwiVGVzdEJlbmNoVmlld1wiOyB9XG5cdHN0YXRpYyBnZXQgVEVNUExBVEVfVVJMKCkgeyByZXR1cm4gXCIvYXNzZXRzL2p1c3RyaWdodGpzLXRlc3QvdGVzdEJlbmNoVmlldy5odG1sXCI7IH1cbiAgICBzdGF0aWMgZ2V0IFNUWUxFU19VUkwoKSB7IHJldHVybiBcIi9hc3NldHMvanVzdHJpZ2h0anMtdGVzdC90ZXN0QmVuY2hWaWV3LmNzc1wiOyB9XG4gICAgXG4gICAgLyoqIFxuICAgICAqIEBwYXJhbSB7VGVzdFRyaWdnZXJ9IHRlc3RUcmlnZ2VyIFxuICAgICAqL1xuXHRjb25zdHJ1Y3Rvcih0ZXN0VHJpZ2dlcikge1xuXG5cdFx0LyoqIEB0eXBlIHtDb21wb25lbnRGYWN0b3J5fSAqL1xuICAgICAgICB0aGlzLmNvbXBvbmVudEZhY3RvcnkgPSBJbmplY3Rpb25Qb2ludC5pbnN0YW5jZShDb21wb25lbnRGYWN0b3J5KTtcblxuXHRcdC8qKiBAdHlwZSB7RXZlbnRSZWdpc3RyeX0gKi9cbiAgICAgICAgdGhpcy5ldmVudFJlZ2lzdHJ5ID0gSW5qZWN0aW9uUG9pbnQuaW5zdGFuY2UoRXZlbnRSZWdpc3RyeSk7XG4gICAgICAgIFxuICAgICAgICAvKiogQHR5cGUge1Rlc3RUcmlnZ2VyfSAqL1xuICAgICAgICB0aGlzLnRlc3RUcmlnZ2VyID0gdGVzdFRyaWdnZXI7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtNYXA8VGVzdEVudHJ5Pn0gKi9cbiAgICAgICAgdGhpcy50ZXN0RW50cnlNYXAgPSBuZXcgTWFwKCk7XG4gICAgfVxuXG5cdHBvc3RDb25maWcoKSB7XG5cdFx0dGhpcy5jb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudEZhY3RvcnkuY3JlYXRlKFRlc3RCZW5jaFZpZXcuQ09NUE9ORU5UX05BTUUpO1xuICAgICAgICBDYW52YXNTdHlsZXMuZW5hYmxlU3R5bGUoVGVzdEJlbmNoVmlldy5DT01QT05FTlRfTkFNRSk7XG5cbiAgICAgICAgdGhpcy5ldmVudFJlZ2lzdHJ5LmF0dGFjaCh0aGlzLmNvbXBvbmVudC5nZXQoXCJjbGVhckJ1dHRvblwiKSwgXCJvbmNsaWNrXCIsIFwiLy9ldmVudDpjbGVhckNsaWNrZWRcIiwgdGhpcy5jb21wb25lbnQuY29tcG9uZW50SW5kZXgpO1xuICAgICAgICB0aGlzLmV2ZW50UmVnaXN0cnkubGlzdGVuKFwiLy9ldmVudDpjbGVhckNsaWNrZWRcIiwgbmV3IE9iamVjdEZ1bmN0aW9uKHRoaXMsIHRoaXMuY2xlYXJDbGlja2VkKSwgdGhpcy5jb21wb25lbnQuY29tcG9uZW50SW5kZXgpO1xuXG4gICAgICAgIHRoaXMuZXZlbnRSZWdpc3RyeS5hdHRhY2godGhpcy5jb21wb25lbnQuZ2V0KFwicnVuQWxsQnV0dG9uXCIpLCBcIm9uY2xpY2tcIiwgXCIvL2V2ZW50OnJ1bkFsbENsaWNrZWRcIiwgdGhpcy5jb21wb25lbnQuY29tcG9uZW50SW5kZXgpO1xuICAgICAgICB0aGlzLmV2ZW50UmVnaXN0cnkubGlzdGVuKFwiLy9ldmVudDpydW5BbGxDbGlja2VkXCIsIG5ldyBPYmplY3RGdW5jdGlvbih0aGlzLCB0aGlzLnJ1bkFsbENsaWNrZWQpLCB0aGlzLmNvbXBvbmVudC5jb21wb25lbnRJbmRleCk7XG5cbiAgICAgICAgdGhpcy5ldmVudFJlZ2lzdHJ5LmF0dGFjaCh0aGlzLmNvbXBvbmVudC5nZXQoXCJyZXNldEJ1dHRvblwiKSwgXCJvbmNsaWNrXCIsIFwiLy9ldmVudDpyZXNldENsaWNrZWRcIiwgdGhpcy5jb21wb25lbnQuY29tcG9uZW50SW5kZXgpO1xuICAgICAgICB0aGlzLmV2ZW50UmVnaXN0cnkubGlzdGVuKFwiLy9ldmVudDpyZXNldENsaWNrZWRcIiwgbmV3IE9iamVjdEZ1bmN0aW9uKHRoaXMsIHRoaXMucmVzZXRDbGlja2VkKSwgdGhpcy5jb21wb25lbnQuY29tcG9uZW50SW5kZXgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7VGVzdEVudHJ5fSB0ZXN0RW50cnkgXG4gICAgICovXG4gICAgYWRkVGVzdEVudHJ5KHRlc3RFbnRyeSkge1xuICAgICAgICB0aGlzLnRlc3RFbnRyeU1hcC5zZXQodGVzdEVudHJ5LnRlc3RDbGFzcy5uYW1lLCB0ZXN0RW50cnkpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudC5hZGRDaGlsZChcInRlc3RMaXN0XCIsIHRlc3RFbnRyeS5jb21wb25lbnQpO1xuICAgIH1cblxuICAgIHJ1bkFsbENsaWNrZWQoKSB7XG4gICAgICAgIHRoaXMudGVzdFRyaWdnZXIucnVuQWxsKCk7XG4gICAgfVxuXG4gICAgY2xlYXJDbGlja2VkKCkge1xuICAgICAgICB0aGlzLmNvbXBvbmVudC5jbGVhckNoaWxkcmVuKFwidGVzdFJlc3VsdFwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0xpbmVFbnRyeX0gbGluZSBcbiAgICAgKi9cbiAgICBhZGRMaW5lKGxpbmUpIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnQuYWRkQ2hpbGQoXCJ0ZXN0UmVzdWx0XCIsIGxpbmUuY29tcG9uZW50KTtcbiAgICB9XG5cbiAgICByZXNldENsaWNrZWQoKSB7XG4gICAgICAgIHRoaXMudGVzdEVudHJ5TWFwLmZvckVhY2goKGtleSwgdmFsdWUsIHBhcmVudCkgPT4ge1xuICAgICAgICAgICAgLyoqIEB0eXBlIHtUZXN0RW50cnl9ICovXG4gICAgICAgICAgICBjb25zdCB0ZXN0RW50cnkgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRlc3RFbnRyeS5yZXNldCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sdGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtUZXN0Q2xhc3NTdGF0ZX0gdGVzdENsYXNzU3RhdGUgXG4gICAgICovXG4gICAgcmVzdWx0KHRlc3RDbGFzc1N0YXRlKSB7XG4gICAgICAgIGlmICh0aGlzLnRlc3RFbnRyeU1hcC5jb250YWlucyh0ZXN0Q2xhc3NTdGF0ZS5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgICAvKiogQHR5cGUge1Rlc3RFbnRyeX0gKi9cbiAgICAgICAgICAgIGNvbnN0IHRlc3RFbnRyeSA9IHRoaXMudGVzdEVudHJ5TWFwLmdldCh0ZXN0Q2xhc3NTdGF0ZS5jbGFzc05hbWUpO1xuICAgICAgICAgICAgdGVzdEVudHJ5LnJlc3VsdCh0ZXN0Q2xhc3NTdGF0ZSk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgVGVzdEJlbmNoLCBUZXN0VHJpZ2dlciB9IGZyb20gXCJ0ZXN0YmVuY2hfdjFcIjtcblxuZXhwb3J0IGNsYXNzIFRlc3RCZW5jaFRlc3RUcmlnZ2VyIGV4dGVuZHMgVGVzdFRyaWdnZXIge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHR5cGUge1Rlc3RCZW5jaH1cbiAgICAgKi9cbiAgICBzZXQgdGVzdEJlbmNoKHRlc3RCZW5jaCkge1xuICAgICAgICAvKiogQHR5cGUge1Rlc3RCZW5jaH0gKi9cbiAgICAgICAgdGhpcy50aGVUZXN0QmVuY2ggPSB0ZXN0QmVuY2g7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUnVuIHRlc3QgYnkgY2xhc3MgbmFtZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWUgXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZ1bmN0aW9uTmFtZVxuICAgICAqL1xuICAgIHJ1bkZ1bmN0aW9uKGNsYXNzTmFtZSwgZnVuY3Rpb25OYW1lKSB7XG4gICAgICAgIHRoaXMudGhlVGVzdEJlbmNoLnJ1bkZ1bmN0aW9uKGNsYXNzTmFtZSwgZnVuY3Rpb25OYW1lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSdW4gdGVzdCBieSBjbGFzcyBuYW1lXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZSBcbiAgICAgKi9cbiAgICBydW5DbGFzcyhjbGFzc05hbWUpIHtcbiAgICAgICAgdGhpcy50aGVUZXN0QmVuY2gucnVuQ2xhc3MoY2xhc3NOYW1lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSdW4gYWxsIHRlc3QgY2xhc3Nlc1xuICAgICAqL1xuICAgIHJ1bkFsbCgpIHtcbiAgICAgICAgdGhpcy50aGVUZXN0QmVuY2gucnVuQWxsKCk7XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgSW5zdGFuY2VQb3N0Q29uZmlnVHJpZ2dlciwgTWluZGlDb25maWcsIE1pbmRpSW5qZWN0b3IgfSBmcm9tIFwibWluZGlfdjFcIjtcbmltcG9ydCB7IE9iamVjdFByb3ZpZGVyIH0gZnJvbSBcInRlc3RiZW5jaF92MVwiO1xuXG5leHBvcnQgY2xhc3MgRGlPYmplY3RQcm92aWRlciBleHRlbmRzIE9iamVjdFByb3ZpZGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIHByb3ZpZGUodGhlQ2xhc3MsIGFyZ3MgPSBbXSkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqZWN0ID0gbmV3IHRoZUNsYXNzKC4uLmFyZ3MpO1xuICAgICAgICAgICAgY29uc3QgY29uZmlnID0gbmV3IE1pbmRpQ29uZmlnKCk7XG4gICAgICAgICAgICBjb25maWcuYWRkQWxsSW5zdGFuY2VQcm9jZXNzb3IoW0luc3RhbmNlUG9zdENvbmZpZ1RyaWdnZXJdKTtcbiAgICAgICAgICAgIGlmIChvYmplY3QudHlwZUNvbmZpZ0xpc3QpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuYWRkQWxsVHlwZUNvbmZpZyhvYmplY3QudHlwZUNvbmZpZ0xpc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uZmlnLmZpbmFsaXplKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgTWluZGlJbmplY3Rvci5nZXRJbnN0YW5jZSgpLmluamVjdFRhcmdldChvYmplY3QsIGNvbmZpZykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBMb2dnZXIsIE9iamVjdEZ1bmN0aW9uIH0gZnJvbSBcImNvcmV1dGlsX3YxXCI7XG5pbXBvcnQgeyBDb21wb25lbnRGYWN0b3J5IH0gZnJvbSBcImp1c3RyaWdodF9jb3JlX3YxXCI7XG5pbXBvcnQgeyBJbmplY3Rpb25Qb2ludCwgUHJvdmlkZXIgfSBmcm9tIFwibWluZGlfdjFcIjtcbmltcG9ydCB7IFRlc3RCZW5jaCwgVGVzdENsYXNzUmVzdWx0IH0gZnJvbSBcInRlc3RiZW5jaF92MVwiO1xuaW1wb3J0IHsgVGVzdEJlbmNoVmlldyB9IGZyb20gXCIuL3Rlc3RCZW5jaFZpZXcvdGVzdEJlbmNoVmlldy5qc1wiO1xuaW1wb3J0IHsgVGVzdEVudHJ5IH0gZnJvbSBcIi4vdGVzdEJlbmNoVmlldy90ZXN0RW50cnkvdGVzdEVudHJ5LmpzXCI7XG5pbXBvcnQgeyBMaW5lRW50cnkgfSBmcm9tIFwiLi90ZXN0QmVuY2hWaWV3L2xpbmVFbnRyeS9saW5lRW50cnkuanNcIjtcbmltcG9ydCB7IFRlc3RCZW5jaFRlc3RUcmlnZ2VyIH0gZnJvbSBcIi4vdGVzdEJlbmNoVmlldy90ZXN0QmVuY2hUZXN0VHJpZ2dlci5qc1wiXG5pbXBvcnQgeyBEaU9iamVjdFByb3ZpZGVyIH0gZnJvbSBcIi4vdGVzdEJlbmNoVmlldy9kaU9iamVjdFByb3ZpZGVyLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBUZXN0QmVuY2hVaSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICAvKiogQHR5cGUge1Rlc3RCZW5jaFRlc3RUcmlnZ2VyfSAqL1xuICAgICAgICB0aGlzLnRlc3RUcmlnZ2VyID0gbmV3IFRlc3RCZW5jaFRlc3RUcmlnZ2VyKCk7XG5cblx0XHQvKiogQHR5cGUge0NvbXBvbmVudEZhY3Rvcnl9ICovXG4gICAgICAgIHRoaXMuY29tcG9uZW50RmFjdG9yeSA9IEluamVjdGlvblBvaW50Lmluc3RhbmNlKENvbXBvbmVudEZhY3RvcnkpO1xuXG4gICAgICAgIC8qKiBAdHlwZSB7VGVzdEJlbmNoVmlld30gKi9cbiAgICAgICAgdGhpcy50ZXN0QmVuY2hWaWV3ID0gSW5qZWN0aW9uUG9pbnQuaW5zdGFuY2UoVGVzdEJlbmNoVmlldywgW3RoaXMudGVzdFRyaWdnZXJdKTtcblxuICAgICAgICAvKiogQHR5cGUge1Byb3ZpZGVyfSAqL1xuICAgICAgICB0aGlzLnRlc3RFbnRyeVByb3ZpZGVyID0gSW5qZWN0aW9uUG9pbnQucHJvdmlkZXIoVGVzdEVudHJ5KTtcblxuICAgICAgICAvKiogQHR5cGUge1Byb3ZpZGVyfSAqL1xuICAgICAgICB0aGlzLmxpbmVFbnRyeVByb3ZpZGVyID0gSW5qZWN0aW9uUG9pbnQucHJvdmlkZXIoTGluZUVudHJ5KTtcblxuICAgICAgICAvKiogQHR5cGUge1Rlc3RCZW5jaH0gKi9cbiAgICAgICAgdGhpcy50ZXN0QmVuY2ggPSBudWxsO1xuXG4gICAgICAgIHRoaXMudGVzdEVudHJ5TG9hZGVkUHJvbWlzZUFycmF5ID0gW107XG5cbiAgICB9XG5cbiAgICBwb3N0Q29uZmlnKCkge1xuICAgICAgICAvKiogQHR5cGUge1Rlc3RCZW5jaH0gKi9cbiAgICAgICAgdGhpcy50ZXN0QmVuY2ggPSBuZXcgVGVzdEJlbmNoKFxuICAgICAgICAgICAgbmV3IE9iamVjdEZ1bmN0aW9uKHRoaXMsIHRoaXMubG9nKSxcbiAgICAgICAgICAgIG5ldyBPYmplY3RGdW5jdGlvbih0aGlzLCB0aGlzLnJlc3VsdCksXG4gICAgICAgICAgICBuZXcgRGlPYmplY3RQcm92aWRlcigpKTtcblxuICAgICAgICB0aGlzLnRlc3RUcmlnZ2VyLnRlc3RCZW5jaCA9IHRoaXMudGVzdEJlbmNoO1xuICAgIH1cblxuICAgIGFkZFRlc3QodGVzdENsYXNzKSB7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzO1xuICAgICAgICBpZighdGhpcy50ZXN0QmVuY2guY29udGFpbnModGVzdENsYXNzKSkge1xuICAgICAgICAgICAgdGhpcy50ZXN0QmVuY2guYWRkVGVzdCh0ZXN0Q2xhc3MpO1xuICAgICAgICAgICAgY29uc3QgdGVzdEVudHJ5TG9hZGVkUHJvbWlzZSA9IHRoaXMudGVzdEVudHJ5UHJvdmlkZXIuZ2V0KFt0ZXN0Q2xhc3MsIHRoaXMudGVzdEJlbmNoXSkudGhlbigodGVzdEVudHJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgY29udGV4dC50ZXN0QmVuY2hWaWV3LmFkZFRlc3RFbnRyeSh0ZXN0RW50cnkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnRlc3RFbnRyeUxvYWRlZFByb21pc2VBcnJheS5wdXNoKHRlc3RFbnRyeUxvYWRlZFByb21pc2UpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7VGVzdENsYXNzUmVzdWx0fSB0ZXN0Q2xhc3NSZXN1bHQgXG4gICAgICovXG4gICAgcmVzdWx0KHRlc3RDbGFzc1Jlc3VsdCkge1xuICAgICAgICB0aGlzLnRlc3RCZW5jaFZpZXcucmVzdWx0KHRlc3RDbGFzc1Jlc3VsdCk7XG4gICAgfVxuXG4gICAgbG9nKGxpbmUsIGxldmVsKSB7XG4gICAgICAgIGNvbnN0IGNvbG9yID0gdGhpcy5hc0NvbG9yKGxldmVsKTtcbiAgICAgICAgY29uc3QgY29udGV4dCA9IHRoaXM7XG4gICAgICAgIHRoaXMubGluZUVudHJ5UHJvdmlkZXIuZ2V0KFtsaW5lLCBjb2xvcl0pLnRoZW4oKGxpbmVFbnRyeSkgPT4ge1xuICAgICAgICAgICAgY29udGV4dC50ZXN0QmVuY2hWaWV3LmFkZExpbmUobGluZUVudHJ5KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIGFzQ29sb3IobGV2ZWwpIHtcbiAgICAgICAgaWYgKExvZ2dlci5FUlJPUiA9PT0gbGV2ZWwpIHtcbiAgICAgICAgICAgIHJldHVybiBcInJlZFwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChMb2dnZXIuRkFUQUwgPT09IGxldmVsKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJyZWRcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBnZXQgY29tcG9uZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy50ZXN0QmVuY2hWaWV3LmNvbXBvbmVudDtcbiAgICB9XG5cbn0iXSwibmFtZXMiOlsiSW5qZWN0aW9uUG9pbnQiLCJDb21wb25lbnRGYWN0b3J5IiwiQ2FudmFzU3R5bGVzIiwiRXZlbnRSZWdpc3RyeSIsIk9iamVjdEZ1bmN0aW9uIiwiVGVzdENsYXNzU3RhdGUiLCJMaXN0IiwiTWFwIiwiVGVzdFRyaWdnZXIiLCJPYmplY3RQcm92aWRlciIsIk1pbmRpQ29uZmlnIiwiSW5zdGFuY2VQb3N0Q29uZmlnVHJpZ2dlciIsIk1pbmRpSW5qZWN0b3IiLCJUZXN0QmVuY2giLCJMb2dnZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUdPLE1BQU0sU0FBUyxDQUFDO0FBQ3ZCO0FBQ0EsSUFBSSxXQUFXLGNBQWMsR0FBRyxFQUFFLE9BQU8sV0FBVyxDQUFDLEVBQUU7QUFDdkQsQ0FBQyxXQUFXLFlBQVksR0FBRyxFQUFFLE9BQU8seUNBQXlDLENBQUMsRUFBRTtBQUNoRixJQUFJLFdBQVcsVUFBVSxHQUFHLEVBQUUsT0FBTyx3Q0FBd0MsQ0FBQyxFQUFFO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLEdBQUcsSUFBSSxFQUFFO0FBQ2pDO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxnQkFBZ0IsR0FBR0EsdUJBQWMsQ0FBQyxRQUFRLENBQUNDLGtDQUFnQixDQUFDLENBQUM7QUFDMUU7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDekI7QUFDQSxRQUFRLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQzNCLEtBQUs7QUFDTDtBQUNBLENBQUMsVUFBVSxHQUFHO0FBQ2QsRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzFFLFFBQVFDLDhCQUFZLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUMzRCxRQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxJ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
