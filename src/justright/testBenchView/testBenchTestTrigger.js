import { TestBench, TestTrigger } from "testbench_v1";

export class TestBenchTestTrigger extends TestTrigger {

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
     * @param {string} className 
     */
    runSingle(className) {
        this.theTestBench.runSingle(className);
    }

    /**
     * Run all test classes
     */
    run() {
        this.theTestBench.run();
    }

}