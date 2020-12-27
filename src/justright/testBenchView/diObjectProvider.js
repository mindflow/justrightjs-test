import { InstancePostConfigTrigger, MindiConfig, MindiInjector } from "mindi_v1";
import { ObjectProvider } from "testbench_v1";

export class DiObjectProvider extends ObjectProvider {

    constructor() {
        super();
    }

    provide(theClass, args = []) {
        return new Promise((resolve, reject) => {
            const object = new theClass(...args);
            const config = new MindiConfig();
            config.addAllInstanceProcessor([InstancePostConfigTrigger]);
            if (object.typeConfigList) {
                config.addAllTypeConfig(object.typeConfigList);
            }
            config.finalize().then(() => {
                MindiInjector.getInstance().injectTarget(object, config);
            });
            resolve(object);
        });
    }

}