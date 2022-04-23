import { InstancePostConfigTrigger, MindiConfig, MindiInjector } from "mindi_v1";
import { ObjectProvider } from "testbench_v1";

export class DiObjectProvider extends ObjectProvider {

    constructor() {
        super();
    }

    async provide(theClass, args = []) {
        const object = new theClass(...args);
        const config = new MindiConfig();
        config.addAllInstanceProcessor([InstancePostConfigTrigger]);
        if (object.typeConfigList) {
            config.addAllTypeConfig(object.typeConfigList);
        }
        await config.finalize();
        await MindiInjector.getInstance().injectTarget(object, config);
        return object;
    }

}