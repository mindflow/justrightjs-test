import { ObjectFunction } from "coreutil_v1";
import { ComponentFactory } from "justright_core_v1";
import { InjectionPoint, Provider } from "mindi_v1";
import { TestBench } from "testbench_v1";
import { TestBenchView } from "./testBenchView/testBenchView.js";
import { TestEntry } from "./testBenchView/testEntry/testEntry.js";
import { LineEntry } from "./testBenchView/lineEntry/lineEntry.js";

export class TestBenchUi {

    constructor() {
        
		/** @type {ComponentFactory} */
        this.componentFactory = InjectionPoint.instance(ComponentFactory);

        /** @type {TestBenchView} */
        this.testBenchView = InjectionPoint.instance(TestBenchView);

        /** @type {Provider} */
        this.testEntryProvider = InjectionPoint.provider(TestEntry);

        /** @type {Provider} */
        this.lineEntryProvider = InjectionPoint.provider(LineEntry);

        /** @type {TestBench} */
        this.testBench = new TestBench(new ObjectFunction(this, this.log));
    }

    addTest(testClass) {
        if(!this.testBench.contains(testClass)) {
            this.testBench.addTest(testClass);
            this.testBenchView.addTestEntry(this.testEntryProvider.get([testClass.name, this.testBench]));
        }
    }

    run() {
        try {
            this.testBench.run();
        } catch (exception) {

        }
    }

    log(line, level) {
        this.testBenchView.addLine(this.lineEntryProvider.get([line]));
    }

    get component() {
        return this.testBenchView.component;
    }

}