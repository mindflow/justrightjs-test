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
     */
	constructor(line) {

		/** @type {ComponentFactory} */
        this.componentFactory = mindi_v1.InjectionPoint.instance(justright_core_v1.ComponentFactory);

        /** @type {String} */
        this.line = line;
    }

	postConfig() {
		this.component = this.componentFactory.create(LineEntry.COMPONENT_NAME);
        justright_core_v1.CanvasStyles.enableStyle(LineEntry.COMPONENT_NAME);
        this.component.setChild("lineEntry", this.line);
    }

}

class TestEntry {

    static get COMPONENT_NAME() { return "TestEntry"; }
	static get TEMPLATE_URL() { return "/assets/justrightjs-test/testEntry.html"; }
    static get STYLES_URL() { return "/assets/justrightjs-test/testEntry.css"; }
    
    /**
     * 
     * @param {className} string
     * @param {TestTrigger} testTrigger 
     */
	constructor(className, testTrigger) {

		/** @type {ComponentFactory} */
        this.componentFactory = mindi_v1.InjectionPoint.instance(justright_core_v1.ComponentFactory);

		/** @type {EventRegistry} */
		this.eventRegistry = mindi_v1.InjectionPoint.instance(justright_core_v1.EventRegistry);

        this.className = className;

        /** @type {TestTrigger} */
        this.testTrigger = testTrigger;
    }

	postConfig() {
		this.component = this.componentFactory.create(TestEntry.COMPONENT_NAME);
        justright_core_v1.CanvasStyles.enableStyle(TestEntry.COMPONENT_NAME);
        this.component.setChild("testName", this.className);

        this.eventRegistry.attach(this.component.get("runButton"), "onclick", "//event:runClicked", this.component.componentIndex);
        this.eventRegistry.listen("//event:runClicked", new coreutil_v1.ObjectFunction(this, this.runClicked), this.component.componentIndex);
    }

    runClicked() {
        this.testTrigger.runSingle(this.className);
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
    }

	postConfig() {
		this.component = this.componentFactory.create(TestBenchView.COMPONENT_NAME);
        justright_core_v1.CanvasStyles.enableStyle(TestBenchView.COMPONENT_NAME);

        this.eventRegistry.attach(this.component.get("clearButton"), "onclick", "//event:clearClicked", this.component.componentIndex);
        this.eventRegistry.listen("//event:clearClicked", new coreutil_v1.ObjectFunction(this, this.clearClicked), this.component.componentIndex);

        this.eventRegistry.attach(this.component.get("runAllButton"), "onclick", "//event:runAllClicked", this.component.componentIndex);
        this.eventRegistry.listen("//event:runAllClicked", new coreutil_v1.ObjectFunction(this, this.runAllClicked), this.component.componentIndex);
    }

    /**
     * 
     * @param {TestEntry} testEntry 
     */
    addTestEntry(testEntry) {
        this.component.addChild("testList", testEntry.component);
    }

    runAllClicked() {
        this.testTrigger.run();
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

}

class TestBenchUi {

    constructor() {

        /** @type {TestBench} */
        this.testBench = new testbench_v1.TestBench(new coreutil_v1.ObjectFunction(this, this.log));

		/** @type {ComponentFactory} */
        this.componentFactory = mindi_v1.InjectionPoint.instance(justright_core_v1.ComponentFactory);

        /** @type {TestBenchView} */
        this.testBenchView = mindi_v1.InjectionPoint.instance(TestBenchView, [this.testBench]);

        /** @type {Provider} */
        this.testEntryProvider = mindi_v1.InjectionPoint.provider(TestEntry);

        /** @type {Provider} */
        this.lineEntryProvider = mindi_v1.InjectionPoint.provider(LineEntry);

    }

    addTest(testClass) {
        if(!this.testBench.contains(testClass)) {
            this.testBench.addTest(testClass);
            this.testBenchView.addTestEntry(this.testEntryProvider.get([testClass.name, this.testBench]));
        }
    }

    run() {
        this.testBench.run();
    }

    log(line, level) {
        this.testBenchView.addLine(this.lineEntryProvider.get([line]));
    }

    get component() {
        return this.testBenchView.component;
    }

}

exports.LineEntry = LineEntry;
exports.TestBenchUi = TestBenchUi;
exports.TestBenchView = TestBenchView;
exports.TestEntry = TestEntry;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianVzdHJpZ2h0X3Rlc3RfdjEuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9qdXN0cmlnaHQvdGVzdEJlbmNoVmlldy9saW5lRW50cnkvbGluZUVudHJ5LmpzIiwiLi4vLi4vc3JjL2p1c3RyaWdodC90ZXN0QmVuY2hWaWV3L3Rlc3RFbnRyeS90ZXN0RW50cnkuanMiLCIuLi8uLi9zcmMvanVzdHJpZ2h0L3Rlc3RCZW5jaFZpZXcvdGVzdEJlbmNoVmlldy5qcyIsIi4uLy4uL3NyYy9qdXN0cmlnaHQvdGVzdEJlbmNoVWkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2FudmFzU3R5bGVzLCBDb21wb25lbnRGYWN0b3J5IH0gZnJvbSBcImp1c3RyaWdodF9jb3JlX3YxXCI7XHJcbmltcG9ydCB7IEluamVjdGlvblBvaW50IH0gZnJvbSBcIm1pbmRpX3YxXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTGluZUVudHJ5IHtcclxuXHJcbiAgICBzdGF0aWMgZ2V0IENPTVBPTkVOVF9OQU1FKCkgeyByZXR1cm4gXCJMaW5lRW50cnlcIjsgfVxyXG5cdHN0YXRpYyBnZXQgVEVNUExBVEVfVVJMKCkgeyByZXR1cm4gXCIvYXNzZXRzL2p1c3RyaWdodGpzLXRlc3QvbGluZUVudHJ5Lmh0bWxcIjsgfVxyXG4gICAgc3RhdGljIGdldCBTVFlMRVNfVVJMKCkgeyByZXR1cm4gXCIvYXNzZXRzL2p1c3RyaWdodGpzLXRlc3QvbGluZUVudHJ5LmNzc1wiOyB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbGluZSBcclxuICAgICAqL1xyXG5cdGNvbnN0cnVjdG9yKGxpbmUpIHtcclxuXHJcblx0XHQvKiogQHR5cGUge0NvbXBvbmVudEZhY3Rvcnl9ICovXHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRGYWN0b3J5ID0gSW5qZWN0aW9uUG9pbnQuaW5zdGFuY2UoQ29tcG9uZW50RmFjdG9yeSk7XHJcblxyXG4gICAgICAgIC8qKiBAdHlwZSB7U3RyaW5nfSAqL1xyXG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XHJcbiAgICB9XHJcblxyXG5cdHBvc3RDb25maWcoKSB7XHJcblx0XHR0aGlzLmNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50RmFjdG9yeS5jcmVhdGUoTGluZUVudHJ5LkNPTVBPTkVOVF9OQU1FKTtcclxuICAgICAgICBDYW52YXNTdHlsZXMuZW5hYmxlU3R5bGUoTGluZUVudHJ5LkNPTVBPTkVOVF9OQU1FKTtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudC5zZXRDaGlsZChcImxpbmVFbnRyeVwiLCB0aGlzLmxpbmUpO1xyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IE9iamVjdEZ1bmN0aW9uIH0gZnJvbSBcImNvcmV1dGlsX3YxXCI7XHJcbmltcG9ydCB7IENhbnZhc1N0eWxlcywgQ29tcG9uZW50RmFjdG9yeSwgRXZlbnRSZWdpc3RyeSB9IGZyb20gXCJqdXN0cmlnaHRfY29yZV92MVwiO1xyXG5pbXBvcnQgeyBJbmplY3Rpb25Qb2ludCB9IGZyb20gXCJtaW5kaV92MVwiO1xyXG5pbXBvcnQgeyBUZXN0VHJpZ2dlciB9IGZyb20gXCJ0ZXN0YmVuY2hfdjFcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUZXN0RW50cnkge1xyXG5cclxuICAgIHN0YXRpYyBnZXQgQ09NUE9ORU5UX05BTUUoKSB7IHJldHVybiBcIlRlc3RFbnRyeVwiOyB9XHJcblx0c3RhdGljIGdldCBURU1QTEFURV9VUkwoKSB7IHJldHVybiBcIi9hc3NldHMvanVzdHJpZ2h0anMtdGVzdC90ZXN0RW50cnkuaHRtbFwiOyB9XHJcbiAgICBzdGF0aWMgZ2V0IFNUWUxFU19VUkwoKSB7IHJldHVybiBcIi9hc3NldHMvanVzdHJpZ2h0anMtdGVzdC90ZXN0RW50cnkuY3NzXCI7IH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7Y2xhc3NOYW1lfSBzdHJpbmdcclxuICAgICAqIEBwYXJhbSB7VGVzdFRyaWdnZXJ9IHRlc3RUcmlnZ2VyIFxyXG4gICAgICovXHJcblx0Y29uc3RydWN0b3IoY2xhc3NOYW1lLCB0ZXN0VHJpZ2dlcikge1xyXG5cclxuXHRcdC8qKiBAdHlwZSB7Q29tcG9uZW50RmFjdG9yeX0gKi9cclxuICAgICAgICB0aGlzLmNvbXBvbmVudEZhY3RvcnkgPSBJbmplY3Rpb25Qb2ludC5pbnN0YW5jZShDb21wb25lbnRGYWN0b3J5KTtcclxuXHJcblx0XHQvKiogQHR5cGUge0V2ZW50UmVnaXN0cnl9ICovXHJcblx0XHR0aGlzLmV2ZW50UmVnaXN0cnkgPSBJbmplY3Rpb25Qb2ludC5pbnN0YW5jZShFdmVudFJlZ2lzdHJ5KTtcclxuXHJcbiAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBjbGFzc05hbWU7XHJcblxyXG4gICAgICAgIC8qKiBAdHlwZSB7VGVzdFRyaWdnZXJ9ICovXHJcbiAgICAgICAgdGhpcy50ZXN0VHJpZ2dlciA9IHRlc3RUcmlnZ2VyO1xyXG4gICAgfVxyXG5cclxuXHRwb3N0Q29uZmlnKCkge1xyXG5cdFx0dGhpcy5jb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudEZhY3RvcnkuY3JlYXRlKFRlc3RFbnRyeS5DT01QT05FTlRfTkFNRSk7XHJcbiAgICAgICAgQ2FudmFzU3R5bGVzLmVuYWJsZVN0eWxlKFRlc3RFbnRyeS5DT01QT05FTlRfTkFNRSk7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnQuc2V0Q2hpbGQoXCJ0ZXN0TmFtZVwiLCB0aGlzLmNsYXNzTmFtZSk7XHJcblxyXG4gICAgICAgIHRoaXMuZXZlbnRSZWdpc3RyeS5hdHRhY2godGhpcy5jb21wb25lbnQuZ2V0KFwicnVuQnV0dG9uXCIpLCBcIm9uY2xpY2tcIiwgXCIvL2V2ZW50OnJ1bkNsaWNrZWRcIiwgdGhpcy5jb21wb25lbnQuY29tcG9uZW50SW5kZXgpO1xyXG4gICAgICAgIHRoaXMuZXZlbnRSZWdpc3RyeS5saXN0ZW4oXCIvL2V2ZW50OnJ1bkNsaWNrZWRcIiwgbmV3IE9iamVjdEZ1bmN0aW9uKHRoaXMsIHRoaXMucnVuQ2xpY2tlZCksIHRoaXMuY29tcG9uZW50LmNvbXBvbmVudEluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICBydW5DbGlja2VkKCkge1xyXG4gICAgICAgIHRoaXMudGVzdFRyaWdnZXIucnVuU2luZ2xlKHRoaXMuY2xhc3NOYW1lKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9iamVjdEZ1bmN0aW9uIH0gZnJvbSBcImNvcmV1dGlsX3YxXCI7XHJcbmltcG9ydCB7IENhbnZhc1N0eWxlcywgQ29tcG9uZW50RmFjdG9yeSwgRXZlbnRSZWdpc3RyeSB9IGZyb20gXCJqdXN0cmlnaHRfY29yZV92MVwiO1xyXG5pbXBvcnQgeyBJbmplY3Rpb25Qb2ludCB9IGZyb20gXCJtaW5kaV92MVwiO1xyXG5pbXBvcnQgeyBUZXN0VHJpZ2dlciB9IGZyb20gXCJ0ZXN0YmVuY2hfdjFcIjtcclxuaW1wb3J0IHsgTGluZUVudHJ5IH0gZnJvbSBcIi4vbGluZUVudHJ5L2xpbmVFbnRyeS5qc1wiO1xyXG5pbXBvcnQgeyBUZXN0RW50cnkgfSBmcm9tIFwiLi90ZXN0RW50cnkvdGVzdEVudHJ5LmpzXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBUZXN0QmVuY2hWaWV3IHtcclxuXHJcbiAgICBzdGF0aWMgZ2V0IENPTVBPTkVOVF9OQU1FKCkgeyByZXR1cm4gXCJUZXN0QmVuY2hWaWV3XCI7IH1cclxuXHRzdGF0aWMgZ2V0IFRFTVBMQVRFX1VSTCgpIHsgcmV0dXJuIFwiL2Fzc2V0cy9qdXN0cmlnaHRqcy10ZXN0L3Rlc3RCZW5jaFZpZXcuaHRtbFwiOyB9XHJcbiAgICBzdGF0aWMgZ2V0IFNUWUxFU19VUkwoKSB7IHJldHVybiBcIi9hc3NldHMvanVzdHJpZ2h0anMtdGVzdC90ZXN0QmVuY2hWaWV3LmNzc1wiOyB9XHJcbiAgICBcclxuICAgIC8qKiBcclxuICAgICAqIEBwYXJhbSB7VGVzdFRyaWdnZXJ9IHRlc3RUcmlnZ2VyIFxyXG4gICAgICovXHJcblx0Y29uc3RydWN0b3IodGVzdFRyaWdnZXIpIHtcclxuXHJcblx0XHQvKiogQHR5cGUge0NvbXBvbmVudEZhY3Rvcnl9ICovXHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRGYWN0b3J5ID0gSW5qZWN0aW9uUG9pbnQuaW5zdGFuY2UoQ29tcG9uZW50RmFjdG9yeSk7XHJcblxyXG5cdFx0LyoqIEB0eXBlIHtFdmVudFJlZ2lzdHJ5fSAqL1xyXG4gICAgICAgIHRoaXMuZXZlbnRSZWdpc3RyeSA9IEluamVjdGlvblBvaW50Lmluc3RhbmNlKEV2ZW50UmVnaXN0cnkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8qKiBAdHlwZSB7VGVzdFRyaWdnZXJ9ICovXHJcbiAgICAgICAgdGhpcy50ZXN0VHJpZ2dlciA9IHRlc3RUcmlnZ2VyO1xyXG4gICAgfVxyXG5cclxuXHRwb3N0Q29uZmlnKCkge1xyXG5cdFx0dGhpcy5jb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudEZhY3RvcnkuY3JlYXRlKFRlc3RCZW5jaFZpZXcuQ09NUE9ORU5UX05BTUUpO1xyXG4gICAgICAgIENhbnZhc1N0eWxlcy5lbmFibGVTdHlsZShUZXN0QmVuY2hWaWV3LkNPTVBPTkVOVF9OQU1FKTtcclxuXHJcbiAgICAgICAgdGhpcy5ldmVudFJlZ2lzdHJ5LmF0dGFjaCh0aGlzLmNvbXBvbmVudC5nZXQoXCJjbGVhckJ1dHRvblwiKSwgXCJvbmNsaWNrXCIsIFwiLy9ldmVudDpjbGVhckNsaWNrZWRcIiwgdGhpcy5jb21wb25lbnQuY29tcG9uZW50SW5kZXgpO1xyXG4gICAgICAgIHRoaXMuZXZlbnRSZWdpc3RyeS5saXN0ZW4oXCIvL2V2ZW50OmNsZWFyQ2xpY2tlZFwiLCBuZXcgT2JqZWN0RnVuY3Rpb24odGhpcywgdGhpcy5jbGVhckNsaWNrZWQpLCB0aGlzLmNvbXBvbmVudC5jb21wb25lbnRJbmRleCk7XHJcblxyXG4gICAgICAgIHRoaXMuZXZlbnRSZWdpc3RyeS5hdHRhY2godGhpcy5jb21wb25lbnQuZ2V0KFwicnVuQWxsQnV0dG9uXCIpLCBcIm9uY2xpY2tcIiwgXCIvL2V2ZW50OnJ1bkFsbENsaWNrZWRcIiwgdGhpcy5jb21wb25lbnQuY29tcG9uZW50SW5kZXgpO1xyXG4gICAgICAgIHRoaXMuZXZlbnRSZWdpc3RyeS5saXN0ZW4oXCIvL2V2ZW50OnJ1bkFsbENsaWNrZWRcIiwgbmV3IE9iamVjdEZ1bmN0aW9uKHRoaXMsIHRoaXMucnVuQWxsQ2xpY2tlZCksIHRoaXMuY29tcG9uZW50LmNvbXBvbmVudEluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtUZXN0RW50cnl9IHRlc3RFbnRyeSBcclxuICAgICAqL1xyXG4gICAgYWRkVGVzdEVudHJ5KHRlc3RFbnRyeSkge1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50LmFkZENoaWxkKFwidGVzdExpc3RcIiwgdGVzdEVudHJ5LmNvbXBvbmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcnVuQWxsQ2xpY2tlZCgpIHtcclxuICAgICAgICB0aGlzLnRlc3RUcmlnZ2VyLnJ1bigpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyQ2xpY2tlZCgpIHtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudC5jbGVhckNoaWxkcmVuKFwidGVzdFJlc3VsdFwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtMaW5lRW50cnl9IGxpbmUgXHJcbiAgICAgKi9cclxuICAgIGFkZExpbmUobGluZSkge1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50LmFkZENoaWxkKFwidGVzdFJlc3VsdFwiLCBsaW5lLmNvbXBvbmVudCk7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgT2JqZWN0RnVuY3Rpb24gfSBmcm9tIFwiY29yZXV0aWxfdjFcIjtcclxuaW1wb3J0IHsgQ29tcG9uZW50RmFjdG9yeSB9IGZyb20gXCJqdXN0cmlnaHRfY29yZV92MVwiO1xyXG5pbXBvcnQgeyBJbmplY3Rpb25Qb2ludCwgUHJvdmlkZXIgfSBmcm9tIFwibWluZGlfdjFcIjtcclxuaW1wb3J0IHsgVGVzdEJlbmNoIH0gZnJvbSBcInRlc3RiZW5jaF92MVwiO1xyXG5pbXBvcnQgeyBUZXN0QmVuY2hWaWV3IH0gZnJvbSBcIi4vdGVzdEJlbmNoVmlldy90ZXN0QmVuY2hWaWV3LmpzXCI7XHJcbmltcG9ydCB7IFRlc3RFbnRyeSB9IGZyb20gXCIuL3Rlc3RCZW5jaFZpZXcvdGVzdEVudHJ5L3Rlc3RFbnRyeS5qc1wiO1xyXG5pbXBvcnQgeyBMaW5lRW50cnkgfSBmcm9tIFwiLi90ZXN0QmVuY2hWaWV3L2xpbmVFbnRyeS9saW5lRW50cnkuanNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUZXN0QmVuY2hVaSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIC8qKiBAdHlwZSB7VGVzdEJlbmNofSAqL1xyXG4gICAgICAgIHRoaXMudGVzdEJlbmNoID0gbmV3IFRlc3RCZW5jaChuZXcgT2JqZWN0RnVuY3Rpb24odGhpcywgdGhpcy5sb2cpKTtcclxuXHJcblx0XHQvKiogQHR5cGUge0NvbXBvbmVudEZhY3Rvcnl9ICovXHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRGYWN0b3J5ID0gSW5qZWN0aW9uUG9pbnQuaW5zdGFuY2UoQ29tcG9uZW50RmFjdG9yeSk7XHJcblxyXG4gICAgICAgIC8qKiBAdHlwZSB7VGVzdEJlbmNoVmlld30gKi9cclxuICAgICAgICB0aGlzLnRlc3RCZW5jaFZpZXcgPSBJbmplY3Rpb25Qb2ludC5pbnN0YW5jZShUZXN0QmVuY2hWaWV3LCBbdGhpcy50ZXN0QmVuY2hdKTtcclxuXHJcbiAgICAgICAgLyoqIEB0eXBlIHtQcm92aWRlcn0gKi9cclxuICAgICAgICB0aGlzLnRlc3RFbnRyeVByb3ZpZGVyID0gSW5qZWN0aW9uUG9pbnQucHJvdmlkZXIoVGVzdEVudHJ5KTtcclxuXHJcbiAgICAgICAgLyoqIEB0eXBlIHtQcm92aWRlcn0gKi9cclxuICAgICAgICB0aGlzLmxpbmVFbnRyeVByb3ZpZGVyID0gSW5qZWN0aW9uUG9pbnQucHJvdmlkZXIoTGluZUVudHJ5KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYWRkVGVzdCh0ZXN0Q2xhc3MpIHtcclxuICAgICAgICBpZighdGhpcy50ZXN0QmVuY2guY29udGFpbnModGVzdENsYXNzKSkge1xyXG4gICAgICAgICAgICB0aGlzLnRlc3RCZW5jaC5hZGRUZXN0KHRlc3RDbGFzcyk7XHJcbiAgICAgICAgICAgIHRoaXMudGVzdEJlbmNoVmlldy5hZGRUZXN0RW50cnkodGhpcy50ZXN0RW50cnlQcm92aWRlci5nZXQoW3Rlc3RDbGFzcy5uYW1lLCB0aGlzLnRlc3RCZW5jaF0pKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcnVuKCkge1xyXG4gICAgICAgIHRoaXMudGVzdEJlbmNoLnJ1bigpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZyhsaW5lLCBsZXZlbCkge1xyXG4gICAgICAgIHRoaXMudGVzdEJlbmNoVmlldy5hZGRMaW5lKHRoaXMubGluZUVudHJ5UHJvdmlkZXIuZ2V0KFtsaW5lXSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjb21wb25lbnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGVzdEJlbmNoVmlldy5jb21wb25lbnQ7XHJcbiAgICB9XHJcblxyXG59Il0sIm5hbWVzIjpbIkluamVjdGlvblBvaW50IiwiQ29tcG9uZW50RmFjdG9yeSIsIkNhbnZhc1N0eWxlcyIsIkV2ZW50UmVnaXN0cnkiLCJPYmplY3RGdW5jdGlvbiIsIlRlc3RCZW5jaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBR08sTUFBTSxTQUFTLENBQUM7QUFDdkI7QUFDQSxJQUFJLFdBQVcsY0FBYyxHQUFHLEVBQUUsT0FBTyxXQUFXLENBQUMsRUFBRTtBQUN2RCxDQUFDLFdBQVcsWUFBWSxHQUFHLEVBQUUsT0FBTyx5Q0FBeUMsQ0FBQyxFQUFFO0FBQ2hGLElBQUksV0FBVyxVQUFVLEdBQUcsRUFBRSxPQUFPLHdDQUF3QyxDQUFDLEVBQUU7QUFD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
