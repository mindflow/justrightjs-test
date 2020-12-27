import { ObjectFunction } from "coreutil_v1";
import { ComponentFactory } from "justright_core_v1";
import { InjectionPoint, Provider } from "mindi_v1";
import { TestBench } from "testbench_v1";
import { TestBenchView } from "./testBenchView/testBenchView.js";
import { TestEntry } from "./testBenchView/testEntry/testEntry.js";
import { LineEntry } from "./testBenchView/lineEntry/lineEntry.js";

export class TestBenchUi {

    constructor() {

        /** @type {TestBench} */
        this.testBench = new TestBench(new ObjectFunction(this, this.log));

		/** @type {ComponentFactory} */
        this.componentFactory = InjectionPoint.instance(ComponentFactory);

        /** @type {TestBenchView} */
        this.testBenchView = InjectionPoint.instance(TestBenchView, [this.testBench]);

        /** @type {Provider} */
        this.testEntryProvider = InjectionPoint.provider(TestEntry);

        /** @type {Provider} */
        this.lineEntryProvider = InjectionPoint.provider(LineEntry);

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