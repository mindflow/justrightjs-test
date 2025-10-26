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
            justright_core_v1.Style.from(this.component.get("lineEntry"))
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianVzdHJpZ2h0X3Rlc3RfdjEuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9qdXN0cmlnaHQvdGVzdEJlbmNoVmlldy9saW5lRW50cnkvbGluZUVudHJ5LmpzIiwiLi4vLi4vc3JjL2p1c3RyaWdodC90ZXN0QmVuY2hWaWV3L3Rlc3RFbnRyeUZ1bmN0aW9uL3Rlc3RFbnRyeUZ1bmN0aW9uLmpzIiwiLi4vLi4vc3JjL2p1c3RyaWdodC90ZXN0QmVuY2hWaWV3L3Rlc3RFbnRyeS90ZXN0RW50cnkuanMiLCIuLi8uLi9zcmMvanVzdHJpZ2h0L3Rlc3RCZW5jaFZpZXcvdGVzdEJlbmNoVmlldy5qcyIsIi4uLy4uL3NyYy9qdXN0cmlnaHQvdGVzdEJlbmNoVmlldy90ZXN0QmVuY2hUZXN0VHJpZ2dlci5qcyIsIi4uLy4uL3NyYy9qdXN0cmlnaHQvdGVzdEJlbmNoVmlldy9kaU9iamVjdFByb3ZpZGVyLmpzIiwiLi4vLi4vc3JjL2p1c3RyaWdodC90ZXN0QmVuY2hVaS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDYW52YXNTdHlsZXMsIFRlbXBsYXRlQ29tcG9uZW50RmFjdG9yeSwgU3R5bGUgfSBmcm9tIFwianVzdHJpZ2h0X2NvcmVfdjFcIjtcbmltcG9ydCB7IEluamVjdGlvblBvaW50IH0gZnJvbSBcIm1pbmRpX3YxXCI7XG5cbmV4cG9ydCBjbGFzcyBMaW5lRW50cnkge1xuXG5cdHN0YXRpYyBnZXQgVEVNUExBVEVfVVJMKCkgeyByZXR1cm4gXCIvYXNzZXRzL2p1c3RyaWdodGpzLXRlc3QvbGluZUVudHJ5Lmh0bWxcIjsgfVxuICAgIHN0YXRpYyBnZXQgU1RZTEVTX1VSTCgpIHsgcmV0dXJuIFwiL2Fzc2V0cy9qdXN0cmlnaHRqcy10ZXN0L2xpbmVFbnRyeS5jc3NcIjsgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBsaW5lIFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjb2xvciBcbiAgICAgKi9cblx0Y29uc3RydWN0b3IobGluZSwgY29sb3IgPSBudWxsKSB7XG5cblx0XHQvKiogQHR5cGUge1RlbXBsYXRlQ29tcG9uZW50RmFjdG9yeX0gKi9cbiAgICAgICAgdGhpcy5jb21wb25lbnRGYWN0b3J5ID0gSW5qZWN0aW9uUG9pbnQuaW5zdGFuY2UoVGVtcGxhdGVDb21wb25lbnRGYWN0b3J5KTtcblxuICAgICAgICAvKiogQHR5cGUge1N0cmluZ30gKi9cbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcblxuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgfVxuXG5cdHBvc3RDb25maWcoKSB7XG5cdFx0dGhpcy5jb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudEZhY3RvcnkuY3JlYXRlKExpbmVFbnRyeSk7XG4gICAgICAgIENhbnZhc1N0eWxlcy5lbmFibGVTdHlsZShMaW5lRW50cnkubmFtZSk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50LnNldENoaWxkKFwibGluZUVudHJ5XCIsIHRoaXMubGluZSk7XG4gICAgICAgIGlmICh0aGlzLmNvbG9yKSB7XG4gICAgICAgICAgICBTdHlsZS5mcm9tKHRoaXMuY29tcG9uZW50LmdldChcImxpbmVFbnRyeVwiKSlcbiAgICAgICAgICAgICAgICAuc2V0KFwiY29sb3JcIiwgdGhpcy5jb2xvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiY29yZXV0aWxfdjFcIjtcbmltcG9ydCB7IENhbnZhc1N0eWxlcywgVGVtcGxhdGVDb21wb25lbnRGYWN0b3J5LCBTdHlsZSB9IGZyb20gXCJqdXN0cmlnaHRfY29yZV92MVwiO1xuaW1wb3J0IHsgSW5qZWN0aW9uUG9pbnQgfSBmcm9tIFwibWluZGlfdjFcIjtcbmltcG9ydCB7IFRlc3RDbGFzc1N0YXRlLCBUZXN0VHJpZ2dlciB9IGZyb20gXCJ0ZXN0YmVuY2hfdjFcIjtcblxuZXhwb3J0IGNsYXNzIFRlc3RFbnRyeUZ1bmN0aW9uIHtcblxuXHRzdGF0aWMgZ2V0IFRFTVBMQVRFX1VSTCgpIHsgcmV0dXJuIFwiL2Fzc2V0cy9qdXN0cmlnaHRqcy10ZXN0L3Rlc3RFbnRyeUZ1bmN0aW9uLmh0bWxcIjsgfVxuICAgIHN0YXRpYyBnZXQgU1RZTEVTX1VSTCgpIHsgcmV0dXJuIFwiL2Fzc2V0cy9qdXN0cmlnaHRqcy10ZXN0L3Rlc3RFbnRyeUZ1bmN0aW9uLmNzc1wiOyB9XG4gICAgXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHRlc3RDbGFzc1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHRlc3RGdW5jdGlvblxuICAgICAqIEBwYXJhbSB7VGVzdFRyaWdnZXJ9IHRlc3RUcmlnZ2VyIFxuICAgICAqL1xuXHRjb25zdHJ1Y3Rvcih0ZXN0Q2xhc3MsIHRlc3RGdW5jdGlvbiwgdGVzdFRyaWdnZXIpIHtcblxuXHRcdC8qKiBAdHlwZSB7VGVtcGxhdGVDb21wb25lbnRGYWN0b3J5fSAqL1xuICAgICAgICB0aGlzLmNvbXBvbmVudEZhY3RvcnkgPSBJbmplY3Rpb25Qb2ludC5pbnN0YW5jZShUZW1wbGF0ZUNvbXBvbmVudEZhY3RvcnkpO1xuXG4gICAgICAgIC8qKiBAdHlwZSB7T2JqZWN0fSAqL1xuICAgICAgICB0aGlzLnRlc3RDbGFzcyA9IHRlc3RDbGFzcztcblxuICAgICAgICAvKiogQHR5cGUge0Z1bmN0aW9ufSAqL1xuICAgICAgICB0aGlzLnRlc3RGdW5jdGlvbiA9IHRlc3RGdW5jdGlvbjtcblxuICAgICAgICAvKiogQHR5cGUge1Rlc3RUcmlnZ2VyfSAqL1xuICAgICAgICB0aGlzLnRlc3RUcmlnZ2VyID0gdGVzdFRyaWdnZXI7XG4gICAgfVxuXG5cdHBvc3RDb25maWcoKSB7XG5cdFx0dGhpcy5jb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudEZhY3RvcnkuY3JlYXRlKFRlc3RFbnRyeUZ1bmN0aW9uKTtcbiAgICAgICAgQ2FudmFzU3R5bGVzLmVuYWJsZVN0eWxlKFRlc3RFbnRyeUZ1bmN0aW9uLm5hbWUpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudC5zZXRDaGlsZChcInRlc3RFbnRyeUZ1bmN0aW9uTmFtZVwiLCB0aGlzLnRlc3RGdW5jdGlvbi5uYW1lKTtcblxuICAgICAgICB0aGlzLmNvbXBvbmVudC5nZXQoXCJydW5CdXR0b25cIikubGlzdGVuVG8oXCJjbGlja1wiLCBuZXcgTWV0aG9kKHRoaXMsdGhpcy5ydW5DbGlja2VkKSk7XG4gICAgfVxuXG4gICAgcnVuQ2xpY2tlZCgpIHtcbiAgICAgICAgdGhpcy50ZXN0VHJpZ2dlci5ydW5GdW5jdGlvbih0aGlzLnRlc3RDbGFzcy5uYW1lLCB0aGlzLnRlc3RGdW5jdGlvbi5uYW1lKTtcbiAgICB9XG5cbiAgICByZXN1bHQodGVzdENsYXNzU3RhdGUpIHtcbiAgICAgICAgaWYgKFRlc3RDbGFzc1N0YXRlLlJVTk5JTkcgPT09IHRlc3RDbGFzc1N0YXRlLnN0YXRlKSB7XG4gICAgICAgICAgICB0aGlzLnJ1bm5pbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoVGVzdENsYXNzU3RhdGUuU1VDQ0VTUyA9PT0gdGVzdENsYXNzU3RhdGUuc3RhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuc3VjY2VlZCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChUZXN0Q2xhc3NTdGF0ZS5GQUlMID09PSB0ZXN0Q2xhc3NTdGF0ZS5zdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5mYWlsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmYWlsKCkge1xuICAgICAgICBTdHlsZS5mcm9tKHRoaXMuY29tcG9uZW50LmdldChcInRlc3RFbnRyeUZ1bmN0aW9uTmFtZVwiKSlcbiAgICAgICAgICAgIC5zZXQoXCJmb250LXdlaWdodFwiLCBcImJvbGRcIilcbiAgICAgICAgICAgIC5zZXQoXCJjb2xvclwiLCBcInJlZFwiKTtcbiAgICB9XG5cbiAgICBzdWNjZWVkKCkge1xuICAgICAgICBTdHlsZS5mcm9tKHRoaXMuY29tcG9uZW50LmdldChcInRlc3RFbnRyeUZ1bmN0aW9uTmFtZVwiKSlcbiAgICAgICAgICAgIC5zZXQoXCJmb250LXdlaWdodFwiLCBcImJvbGRcIilcbiAgICAgICAgICAgIC5zZXQoXCJjb2xvclwiLCBcImdyZWVuXCIpO1xuICAgIH1cblxuICAgIHJ1bm5pbmcoKSB7XG4gICAgICAgIFN0eWxlLmZyb20odGhpcy5jb21wb25lbnQuZ2V0KFwidGVzdEVudHJ5RnVuY3Rpb25OYW1lXCIpKVxuICAgICAgICAgICAgLnNldChcImZvbnQtd2VpZ2h0XCIsIFwiYm9sZFwiKVxuICAgICAgICAgICAgLnNldChcImNvbG9yXCIsIFwiYmxhY2tcIik7XG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIFN0eWxlLmZyb20odGhpcy5jb21wb25lbnQuZ2V0KFwidGVzdEVudHJ5RnVuY3Rpb25OYW1lXCIpKS5jbGVhcigpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBMaXN0LCBNZXRob2QgfSBmcm9tIFwiY29yZXV0aWxfdjFcIjtcbmltcG9ydCB7IENhbnZhc1N0eWxlcywgVGVtcGxhdGVDb21wb25lbnRGYWN0b3J5LCBTdHlsZSB9IGZyb20gXCJqdXN0cmlnaHRfY29yZV92MVwiO1xuaW1wb3J0IHsgSW5qZWN0aW9uUG9pbnQsIFByb3ZpZGVyIH0gZnJvbSBcIm1pbmRpX3YxXCI7XG5pbXBvcnQgeyBUZXN0Q2xhc3NTdGF0ZSwgVGVzdFRyaWdnZXIgfSBmcm9tIFwidGVzdGJlbmNoX3YxXCI7XG5pbXBvcnQgeyBUZXN0RW50cnlGdW5jdGlvbiB9IGZyb20gXCIuLi90ZXN0RW50cnlGdW5jdGlvbi90ZXN0RW50cnlGdW5jdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgVGVzdEVudHJ5IHtcblxuXHRzdGF0aWMgZ2V0IFRFTVBMQVRFX1VSTCgpIHsgcmV0dXJuIFwiL2Fzc2V0cy9qdXN0cmlnaHRqcy10ZXN0L3Rlc3RFbnRyeS5odG1sXCI7IH1cbiAgICBzdGF0aWMgZ2V0IFNUWUxFU19VUkwoKSB7IHJldHVybiBcIi9hc3NldHMvanVzdHJpZ2h0anMtdGVzdC90ZXN0RW50cnkuY3NzXCI7IH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdGVzdENsYXNzXG4gICAgICogQHBhcmFtIHtUZXN0VHJpZ2dlcn0gdGVzdFRyaWdnZXIgXG4gICAgICovXG5cdGNvbnN0cnVjdG9yKHRlc3RDbGFzcywgdGVzdFRyaWdnZXIpIHtcblxuXHRcdC8qKiBAdHlwZSB7VGVtcGxhdGVDb21wb25lbnRGYWN0b3J5fSAqL1xuICAgICAgICB0aGlzLmNvbXBvbmVudEZhY3RvcnkgPSBJbmplY3Rpb25Qb2ludC5pbnN0YW5jZShUZW1wbGF0ZUNvbXBvbmVudEZhY3RvcnkpO1xuICAgICAgICBcbiAgICAgICAgLyoqIEB0eXBlIHtQcm92aWRlcjxUZXN0RW50cnlGdW5jdGlvbj59ICovXG4gICAgICAgIHRoaXMudGVzdEVudHJ5RnVuY3Rpb25Qcm92aWRlciA9IEluamVjdGlvblBvaW50LnByb3ZpZGVyKFRlc3RFbnRyeUZ1bmN0aW9uKVxuXG4gICAgICAgIC8qKiBAdHlwZSB7T2JqZWN0fSAqL1xuICAgICAgICB0aGlzLnRlc3RDbGFzcyA9IHRlc3RDbGFzcztcblxuICAgICAgICAvKiogQHR5cGUge1Rlc3RUcmlnZ2VyfSAqL1xuICAgICAgICB0aGlzLnRlc3RUcmlnZ2VyID0gdGVzdFRyaWdnZXI7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtMaXN0PFRlc3RFbnRyeUZ1bmN0aW9uPn0gKi9cbiAgICAgICAgdGhpcy50ZXN0RW50cnlGdW5jdGlvbkxpc3QgPSBuZXcgTGlzdCgpO1xuXG4gICAgICAgIHRoaXMuZmFpbGVkID0gZmFsc2U7XG4gICAgfVxuXG5cdHBvc3RDb25maWcoKSB7XG5cdFx0dGhpcy5jb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudEZhY3RvcnkuY3JlYXRlKFRlc3RFbnRyeSk7XG4gICAgICAgIENhbnZhc1N0eWxlcy5lbmFibGVTdHlsZShUZXN0RW50cnkubmFtZSk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50LnNldENoaWxkKFwidGVzdEVudHJ5TmFtZVwiLCB0aGlzLnRlc3RDbGFzcy5uYW1lKTtcblxuICAgICAgICB0aGlzLmNvbXBvbmVudC5nZXQoXCJydW5CdXR0b25cIikubGlzdGVuVG8oXCJjbGlja1wiLCBuZXcgTWV0aG9kKHRoaXMsdGhpcy5ydW5DbGlja2VkKSk7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtMaXN0PFRlc3RFbnRyeUZ1bmN0aW9uPn0gKi9cbiAgICAgICAgY29uc3QgdGVzdEZ1bmN0aW9ucyA9IHRoaXMudGVzdENsYXNzLnRlc3RGdW5jdGlvbnMoKTtcbiAgICAgICAgdGVzdEZ1bmN0aW9ucy5mb3JFYWNoKCh0ZXN0RnVuY3Rpb24sIHBhcmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy50ZXN0RW50cnlGdW5jdGlvblByb3ZpZGVyLmdldChbdGhpcy50ZXN0Q2xhc3MsIHRlc3RGdW5jdGlvbiwgdGhpcy50ZXN0VHJpZ2dlcl0pLnRoZW4oKHRlc3RFbnRyeUZ1bmN0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXN0RW50cnlGdW5jdGlvbkxpc3QuYWRkKHRlc3RFbnRyeUZ1bmN0aW9uKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudC5nZXQoXCJ0ZXN0RW50cnlGdW5jdGlvbnNcIikuYWRkQ2hpbGQodGVzdEVudHJ5RnVuY3Rpb24uY29tcG9uZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sdGhpcyk7XG4gICAgfVxuXG4gICAgcnVuQ2xpY2tlZCgpIHtcbiAgICAgICAgdGhpcy5mYWlsZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy50ZXN0VHJpZ2dlci5ydW5DbGFzcyh0aGlzLnRlc3RDbGFzcy5uYW1lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1Rlc3RDbGFzc1N0YXRlfSB0ZXN0Q2xhc3NTdGF0ZSBcbiAgICAgKi9cbiAgICByZXN1bHQodGVzdENsYXNzU3RhdGUpIHtcbiAgICAgICAgdGhpcy50ZXN0RW50cnlGdW5jdGlvbkxpc3QuZm9yRWFjaCgodGVzdEVudHJ5RnVuY3Rpb24sIHBhcmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRlc3RFbnRyeUZ1bmN0aW9uLnRlc3RGdW5jdGlvbi5uYW1lID09PSB0ZXN0Q2xhc3NTdGF0ZS5mdW5jdGlvbk5hbWUpIHtcbiAgICAgICAgICAgICAgICB0ZXN0RW50cnlGdW5jdGlvbi5yZXN1bHQodGVzdENsYXNzU3RhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sdGhpcyk7XG4gICAgICAgIGlmICghdGhpcy5mYWlsZWQgJiYgVGVzdENsYXNzU3RhdGUuUlVOTklORyA9PT0gdGVzdENsYXNzU3RhdGUuc3RhdGUpIHtcbiAgICAgICAgICAgIHRoaXMucnVubmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5mYWlsZWQgJiYgVGVzdENsYXNzU3RhdGUuU1VDQ0VTUyA9PT0gdGVzdENsYXNzU3RhdGUuc3RhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuc3VjY2VlZCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChUZXN0Q2xhc3NTdGF0ZS5GQUlMID09PSB0ZXN0Q2xhc3NTdGF0ZS5zdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5mYWlsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmYWlsKCkge1xuICAgICAgICB0aGlzLmZhaWxlZCA9IHRydWU7XG4gICAgICAgIFN0eWxlLmZyb20odGhpcy5jb21wb25lbnQuZ2V0KFwidGVzdEVudHJ5TmFtZVwiKSlcbiAgICAgICAgICAgIC5zZXQoXCJmb250LXdlaWdodFwiLCBcImJvbGRcIilcbiAgICAgICAgICAgIC5zZXQoXCJjb2xvclwiLCBcInJlZFwiKTtcbiAgICB9XG5cbiAgICBzdWNjZWVkKCkge1xuICAgICAgICBTdHlsZS5mcm9tKHRoaXMuY29tcG9uZW50LmdldChcInRlc3RFbnRyeU5hbWVcIikpXG4gICAgICAgICAgICAuc2V0KFwiZm9udC13ZWlnaHRcIiwgXCJib2xkXCIpXG4gICAgICAgICAgICAuc2V0KFwiY29sb3JcIiwgXCJncmVlblwiKTtcbiAgICB9XG5cbiAgICBydW5uaW5nKCkge1xuICAgICAgICBTdHlsZS5mcm9tKHRoaXMuY29tcG9uZW50LmdldChcInRlc3RFbnRyeU5hbWVcIikpXG4gICAgICAgICAgICAuc2V0KFwiZm9udC13ZWlnaHRcIiwgXCJib2xkXCIpXG4gICAgICAgICAgICAuc2V0KFwiY29sb3JcIiwgXCJibGFja1wiKTtcbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgdGhpcy5mYWlsZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy50ZXN0RW50cnlGdW5jdGlvbkxpc3QuZm9yRWFjaCgodGVzdEVudHJ5RnVuY3Rpb24sIHBhcmVudCkgPT4ge1xuICAgICAgICAgICAgdGVzdEVudHJ5RnVuY3Rpb24ucmVzZXQoKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LHRoaXMpO1xuICAgICAgICBTdHlsZS5mcm9tKHRoaXMuY29tcG9uZW50LmdldChcInRlc3RFbnRyeU5hbWVcIikpLmNsZWFyKCk7XG4gICAgfVxufSIsImltcG9ydCB7IE1hcCwgTWV0aG9kIH0gZnJvbSBcImNvcmV1dGlsX3YxXCI7XG5pbXBvcnQgeyBDYW52YXNTdHlsZXMsIFRlbXBsYXRlQ29tcG9uZW50RmFjdG9yeSB9IGZyb20gXCJqdXN0cmlnaHRfY29yZV92MVwiO1xuaW1wb3J0IHsgSW5qZWN0aW9uUG9pbnQgfSBmcm9tIFwibWluZGlfdjFcIjtcbmltcG9ydCB7IFRlc3RDbGFzc1N0YXRlLCBUZXN0VHJpZ2dlciB9IGZyb20gXCJ0ZXN0YmVuY2hfdjFcIjtcbmltcG9ydCB7IExpbmVFbnRyeSB9IGZyb20gXCIuL2xpbmVFbnRyeS9saW5lRW50cnkuanNcIjtcbmltcG9ydCB7IFRlc3RFbnRyeSB9IGZyb20gXCIuL3Rlc3RFbnRyeS90ZXN0RW50cnkuanNcIlxuXG5leHBvcnQgY2xhc3MgVGVzdEJlbmNoVmlldyB7XG5cblx0c3RhdGljIGdldCBURU1QTEFURV9VUkwoKSB7IHJldHVybiBcIi9hc3NldHMvanVzdHJpZ2h0anMtdGVzdC90ZXN0QmVuY2hWaWV3Lmh0bWxcIjsgfVxuICAgIHN0YXRpYyBnZXQgU1RZTEVTX1VSTCgpIHsgcmV0dXJuIFwiL2Fzc2V0cy9qdXN0cmlnaHRqcy10ZXN0L3Rlc3RCZW5jaFZpZXcuY3NzXCI7IH1cbiAgICBcbiAgICAvKiogXG4gICAgICogQHBhcmFtIHtUZXN0VHJpZ2dlcn0gdGVzdFRyaWdnZXIgXG4gICAgICovXG5cdGNvbnN0cnVjdG9yKHRlc3RUcmlnZ2VyKSB7XG5cblx0XHQvKiogQHR5cGUge1RlbXBsYXRlQ29tcG9uZW50RmFjdG9yeX0gKi9cbiAgICAgICAgdGhpcy5jb21wb25lbnRGYWN0b3J5ID0gSW5qZWN0aW9uUG9pbnQuaW5zdGFuY2UoVGVtcGxhdGVDb21wb25lbnRGYWN0b3J5KTtcbiAgICAgICAgXG4gICAgICAgIC8qKiBAdHlwZSB7VGVzdFRyaWdnZXJ9ICovXG4gICAgICAgIHRoaXMudGVzdFRyaWdnZXIgPSB0ZXN0VHJpZ2dlcjtcblxuICAgICAgICAvKiogQHR5cGUge01hcDxUZXN0RW50cnk+fSAqL1xuICAgICAgICB0aGlzLnRlc3RFbnRyeU1hcCA9IG5ldyBNYXAoKTtcbiAgICB9XG5cblx0cG9zdENvbmZpZygpIHtcblx0XHR0aGlzLmNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50RmFjdG9yeS5jcmVhdGUoVGVzdEJlbmNoVmlldyk7XG4gICAgICAgIENhbnZhc1N0eWxlcy5lbmFibGVTdHlsZShUZXN0QmVuY2hWaWV3Lm5hbWUpO1xuXG5cdFx0dGhpcy5jb21wb25lbnQuZ2V0KFwiY2xlYXJCdXR0b25cIikubGlzdGVuVG8oXCJjbGlja1wiLCBuZXcgTWV0aG9kKHRoaXMsdGhpcy5jbGVhckNsaWNrZWQpKTtcblx0XHR0aGlzLmNvbXBvbmVudC5nZXQoXCJydW5BbGxCdXR0b25cIikubGlzdGVuVG8oXCJjbGlja1wiLCBuZXcgTWV0aG9kKHRoaXMsdGhpcy5ydW5BbGxDbGlja2VkKSk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50LmdldChcInJlc2V0QnV0dG9uXCIpLmxpc3RlblRvKFwiY2xpY2tcIiwgbmV3IE1ldGhvZCh0aGlzLHRoaXMucmVzZXRDbGlja2VkKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtUZXN0RW50cnl9IHRlc3RFbnRyeSBcbiAgICAgKi9cbiAgICBhZGRUZXN0RW50cnkodGVzdEVudHJ5KSB7XG4gICAgICAgIHRoaXMudGVzdEVudHJ5TWFwLnNldCh0ZXN0RW50cnkudGVzdENsYXNzLm5hbWUsIHRlc3RFbnRyeSk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50LmFkZENoaWxkKFwidGVzdExpc3RcIiwgdGVzdEVudHJ5LmNvbXBvbmVudCk7XG4gICAgfVxuXG4gICAgcnVuQWxsQ2xpY2tlZCgpIHtcbiAgICAgICAgdGhpcy50ZXN0VHJpZ2dlci5ydW5BbGwoKTtcbiAgICB9XG5cbiAgICBjbGVhckNsaWNrZWQoKSB7XG4gICAgICAgIHRoaXMuY29tcG9uZW50LmNsZWFyQ2hpbGRyZW4oXCJ0ZXN0UmVzdWx0XCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7TGluZUVudHJ5fSBsaW5lIFxuICAgICAqL1xuICAgIGFkZExpbmUobGluZSkge1xuICAgICAgICB0aGlzLmNvbXBvbmVudC5hZGRDaGlsZChcInRlc3RSZXN1bHRcIiwgbGluZS5jb21wb25lbnQpO1xuICAgIH1cblxuICAgIHJlc2V0Q2xpY2tlZCgpIHtcbiAgICAgICAgdGhpcy50ZXN0RW50cnlNYXAuZm9yRWFjaCgoa2V5LCB2YWx1ZSwgcGFyZW50KSA9PiB7XG4gICAgICAgICAgICAvKiogQHR5cGUge1Rlc3RFbnRyeX0gKi9cbiAgICAgICAgICAgIGNvbnN0IHRlc3RFbnRyeSA9IHZhbHVlO1xuICAgICAgICAgICAgdGVzdEVudHJ5LnJlc2V0KCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSx0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1Rlc3RDbGFzc1N0YXRlfSB0ZXN0Q2xhc3NTdGF0ZSBcbiAgICAgKi9cbiAgICByZXN1bHQodGVzdENsYXNzU3RhdGUpIHtcbiAgICAgICAgaWYgKHRoaXMudGVzdEVudHJ5TWFwLmNvbnRhaW5zKHRlc3RDbGFzc1N0YXRlLmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgIC8qKiBAdHlwZSB7VGVzdEVudHJ5fSAqL1xuICAgICAgICAgICAgY29uc3QgdGVzdEVudHJ5ID0gdGhpcy50ZXN0RW50cnlNYXAuZ2V0KHRlc3RDbGFzc1N0YXRlLmNsYXNzTmFtZSk7XG4gICAgICAgICAgICB0ZXN0RW50cnkucmVzdWx0KHRlc3RDbGFzc1N0YXRlKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBUZXN0QmVuY2gsIFRlc3RUcmlnZ2VyIH0gZnJvbSBcInRlc3RiZW5jaF92MVwiO1xuXG5leHBvcnQgY2xhc3MgVGVzdEJlbmNoVGVzdFRyaWdnZXIgZXh0ZW5kcyBUZXN0VHJpZ2dlciB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7VGVzdEJlbmNofVxuICAgICAqL1xuICAgIHNldCB0ZXN0QmVuY2godGVzdEJlbmNoKSB7XG4gICAgICAgIC8qKiBAdHlwZSB7VGVzdEJlbmNofSAqL1xuICAgICAgICB0aGlzLnRoZVRlc3RCZW5jaCA9IHRlc3RCZW5jaDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSdW4gdGVzdCBieSBjbGFzcyBuYW1lXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZSBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZnVuY3Rpb25OYW1lXG4gICAgICovXG4gICAgcnVuRnVuY3Rpb24oY2xhc3NOYW1lLCBmdW5jdGlvbk5hbWUpIHtcbiAgICAgICAgdGhpcy50aGVUZXN0QmVuY2gucnVuRnVuY3Rpb24oY2xhc3NOYW1lLCBmdW5jdGlvbk5hbWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJ1biB0ZXN0IGJ5IGNsYXNzIG5hbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIFxuICAgICAqL1xuICAgIHJ1bkNsYXNzKGNsYXNzTmFtZSkge1xuICAgICAgICB0aGlzLnRoZVRlc3RCZW5jaC5ydW5DbGFzcyhjbGFzc05hbWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJ1biBhbGwgdGVzdCBjbGFzc2VzXG4gICAgICovXG4gICAgcnVuQWxsKCkge1xuICAgICAgICB0aGlzLnRoZVRlc3RCZW5jaC5ydW5BbGwoKTtcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBJbnN0YW5jZVBvc3RDb25maWdUcmlnZ2VyLCBNaW5kaUNvbmZpZywgTWluZGlJbmplY3RvciB9IGZyb20gXCJtaW5kaV92MVwiO1xuaW1wb3J0IHsgT2JqZWN0UHJvdmlkZXIgfSBmcm9tIFwidGVzdGJlbmNoX3YxXCI7XG5cbmV4cG9ydCBjbGFzcyBEaU9iamVjdFByb3ZpZGVyIGV4dGVuZHMgT2JqZWN0UHJvdmlkZXIge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgYXN5bmMgcHJvdmlkZSh0aGVDbGFzcywgYXJncyA9IFtdKSB7XG4gICAgICAgIGNvbnN0IG9iamVjdCA9IG5ldyB0aGVDbGFzcyguLi5hcmdzKTtcbiAgICAgICAgY29uc3QgY29uZmlnID0gbmV3IE1pbmRpQ29uZmlnKCk7XG4gICAgICAgIGNvbmZpZy5hZGRBbGxJbnN0YW5jZVByb2Nlc3NvcihbSW5zdGFuY2VQb3N0Q29uZmlnVHJpZ2dlcl0pO1xuICAgICAgICBpZiAob2JqZWN0LnR5cGVDb25maWdMaXN0KSB7XG4gICAgICAgICAgICBjb25maWcuYWRkQWxsVHlwZUNvbmZpZyhvYmplY3QudHlwZUNvbmZpZ0xpc3QpO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IGNvbmZpZy5maW5hbGl6ZSgpO1xuICAgICAgICBhd2FpdCBNaW5kaUluamVjdG9yLmdldEluc3RhbmNlKCkuaW5qZWN0VGFyZ2V0KG9iamVjdCwgY29uZmlnKTtcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBMb2dnZXIsIE1ldGhvZCB9IGZyb20gXCJjb3JldXRpbF92MVwiO1xuaW1wb3J0IHsgVGVtcGxhdGVDb21wb25lbnRGYWN0b3J5IH0gZnJvbSBcImp1c3RyaWdodF9jb3JlX3YxXCI7XG5pbXBvcnQgeyBJbmplY3Rpb25Qb2ludCwgUHJvdmlkZXIgfSBmcm9tIFwibWluZGlfdjFcIjtcbmltcG9ydCB7IFRlc3RCZW5jaCwgVGVzdENsYXNzUmVzdWx0IH0gZnJvbSBcInRlc3RiZW5jaF92MVwiO1xuaW1wb3J0IHsgVGVzdEJlbmNoVmlldyB9IGZyb20gXCIuL3Rlc3RCZW5jaFZpZXcvdGVzdEJlbmNoVmlldy5qc1wiO1xuaW1wb3J0IHsgVGVzdEVudHJ5IH0gZnJvbSBcIi4vdGVzdEJlbmNoVmlldy90ZXN0RW50cnkvdGVzdEVudHJ5LmpzXCI7XG5pbXBvcnQgeyBMaW5lRW50cnkgfSBmcm9tIFwiLi90ZXN0QmVuY2hWaWV3L2xpbmVFbnRyeS9saW5lRW50cnkuanNcIjtcbmltcG9ydCB7IFRlc3RCZW5jaFRlc3RUcmlnZ2VyIH0gZnJvbSBcIi4vdGVzdEJlbmNoVmlldy90ZXN0QmVuY2hUZXN0VHJpZ2dlci5qc1wiXG5pbXBvcnQgeyBEaU9iamVjdFByb3ZpZGVyIH0gZnJvbSBcIi4vdGVzdEJlbmNoVmlldy9kaU9iamVjdFByb3ZpZGVyLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBUZXN0QmVuY2hVaSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICAvKiogQHR5cGUge1Rlc3RCZW5jaFRlc3RUcmlnZ2VyfSAqL1xuICAgICAgICB0aGlzLnRlc3RUcmlnZ2VyID0gbmV3IFRlc3RCZW5jaFRlc3RUcmlnZ2VyKCk7XG5cblx0XHQvKiogQHR5cGUge1RlbXBsYXRlQ29tcG9uZW50RmFjdG9yeX0gKi9cbiAgICAgICAgdGhpcy5jb21wb25lbnRGYWN0b3J5ID0gSW5qZWN0aW9uUG9pbnQuaW5zdGFuY2UoVGVtcGxhdGVDb21wb25lbnRGYWN0b3J5KTtcblxuICAgICAgICAvKiogQHR5cGUge1Rlc3RCZW5jaFZpZXd9ICovXG4gICAgICAgIHRoaXMudGVzdEJlbmNoVmlldyA9IEluamVjdGlvblBvaW50Lmluc3RhbmNlKFRlc3RCZW5jaFZpZXcsIFt0aGlzLnRlc3RUcmlnZ2VyXSk7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtQcm92aWRlcn0gKi9cbiAgICAgICAgdGhpcy50ZXN0RW50cnlQcm92aWRlciA9IEluamVjdGlvblBvaW50LnByb3ZpZGVyKFRlc3RFbnRyeSk7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtQcm92aWRlcn0gKi9cbiAgICAgICAgdGhpcy5saW5lRW50cnlQcm92aWRlciA9IEluamVjdGlvblBvaW50LnByb3ZpZGVyKExpbmVFbnRyeSk7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtUZXN0QmVuY2h9ICovXG4gICAgICAgIHRoaXMudGVzdEJlbmNoID0gbnVsbDtcblxuICAgICAgICB0aGlzLnRlc3RFbnRyeUxvYWRlZFByb21pc2VBcnJheSA9IFtdO1xuXG4gICAgfVxuXG4gICAgcG9zdENvbmZpZygpIHtcbiAgICAgICAgLyoqIEB0eXBlIHtUZXN0QmVuY2h9ICovXG4gICAgICAgIHRoaXMudGVzdEJlbmNoID0gbmV3IFRlc3RCZW5jaChcbiAgICAgICAgICAgIG5ldyBNZXRob2QodGhpcywgdGhpcy5sb2cpLFxuICAgICAgICAgICAgbmV3IE1ldGhvZCh0aGlzLCB0aGlzLnJlc3VsdCksXG4gICAgICAgICAgICBuZXcgRGlPYmplY3RQcm92aWRlcigpKTtcblxuICAgICAgICB0aGlzLnRlc3RUcmlnZ2VyLnRlc3RCZW5jaCA9IHRoaXMudGVzdEJlbmNoO1xuICAgIH1cblxuICAgIGFkZFRlc3QodGVzdENsYXNzKSB7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzO1xuICAgICAgICBpZighdGhpcy50ZXN0QmVuY2guY29udGFpbnModGVzdENsYXNzKSkge1xuICAgICAgICAgICAgdGhpcy50ZXN0QmVuY2guYWRkVGVzdCh0ZXN0Q2xhc3MpO1xuICAgICAgICAgICAgY29uc3QgdGVzdEVudHJ5TG9hZGVkUHJvbWlzZSA9IHRoaXMudGVzdEVudHJ5UHJvdmlkZXIuZ2V0KFt0ZXN0Q2xhc3MsIHRoaXMudGVzdEJlbmNoXSkudGhlbigodGVzdEVudHJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgY29udGV4dC50ZXN0QmVuY2hWaWV3LmFkZFRlc3RFbnRyeSh0ZXN0RW50cnkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnRlc3RFbnRyeUxvYWRlZFByb21pc2VBcnJheS5wdXNoKHRlc3RFbnRyeUxvYWRlZFByb21pc2UpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7VGVzdENsYXNzUmVzdWx0fSB0ZXN0Q2xhc3NSZXN1bHQgXG4gICAgICovXG4gICAgcmVzdWx0KHRlc3RDbGFzc1Jlc3VsdCkge1xuICAgICAgICB0aGlzLnRlc3RCZW5jaFZpZXcucmVzdWx0KHRlc3RDbGFzc1Jlc3VsdCk7XG4gICAgfVxuXG4gICAgYXN5bmMgbG9nKGxpbmUsIGxldmVsKSB7XG4gICAgICAgIGNvbnN0IGNvbG9yID0gdGhpcy5hc0NvbG9yKGxldmVsKTtcbiAgICAgICAgY29uc3QgY29udGV4dCA9IHRoaXM7XG4gICAgICAgIGNvbnN0IGxpbmVFbnRyeSA9IGF3YWl0IHRoaXMubGluZUVudHJ5UHJvdmlkZXIuZ2V0KFtsaW5lLCBjb2xvcl0pO1xuICAgICAgICBjb250ZXh0LnRlc3RCZW5jaFZpZXcuYWRkTGluZShsaW5lRW50cnkpO1xuICAgICAgICByZXR1cm4gbGluZUVudHJ5O1xuICAgIH1cbiAgICBcbiAgICBhc0NvbG9yKGxldmVsKSB7XG4gICAgICAgIGlmIChMb2dnZXIuRVJST1IgPT09IGxldmVsKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJyZWRcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoTG9nZ2VyLkZBVEFMID09PSBsZXZlbCkge1xuICAgICAgICAgICAgcmV0dXJuIFwicmVkXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZ2V0IGNvbXBvbmVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGVzdEJlbmNoVmlldy5jb21wb25lbnQ7XG4gICAgfVxuXG59Il0sIm5hbWVzIjpbIkluamVjdGlvblBvaW50IiwiVGVtcGxhdGVDb21wb25lbnRGYWN0b3J5IiwiQ2FudmFzU3R5bGVzIiwiU3R5bGUiLCJNZXRob2QiLCJUZXN0Q2xhc3NTdGF0ZSIsIkxpc3QiLCJNYXAiLCJUZXN0VHJpZ2dlciIsIk9iamVjdFByb3ZpZGVyIiwiTWluZGlDb25maWciLCJJbnN0YW5jZVBvc3RDb25maWdUcmlnZ2VyIiwiTWluZGlJbmplY3RvciIsIlRlc3RCZW5jaCIsIkxvZ2dlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBR08sTUFBTSxTQUFTLENBQUM7QUFDdkI7QUFDQSxDQUFDLFdBQVcsWUFBWSxHQUFHLEVBQUUsT0FBTyx5Q0FBeUMsQ0FBQyxFQUFFO0FBQ2hGLElBQUksV0FBVyxVQUFVLEdBQUcsRUFBRSxPQUFPLHdDQUF3QyxDQUFDLEVBQUU7QUFDaEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssR0FBRyxJQUFJLEVBQUU7QUFDakM7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLGdCQUFnQixHQUFHQSx1QkFBYyxDQUFDLFFBQVEsQ0FBQ0MsMENBQXdCLENBQUMsQ0FBQztBQUNsRjtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FB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
