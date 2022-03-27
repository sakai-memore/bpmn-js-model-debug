import BpmnModeler from "bpmn-js/lib/Modeler";
import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/bpmn";
// import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";

import CliModule from "bpmn-js-cli";

// import camundaModdleExtensionModule from "camunda-bpmn-moddle/lib";
// import customDescriptor from "./descriptor/camundaDescriptor.json";

// import customModdleExtensionModule from "custom-bpmn-moddle/lib";
// import customDescriptor from "./descriptor/customDescriptor.json";
import customDescriptor from "./descriptor/qaDescriptor.json";

export class CustomBpmnModelerFactory {}

export class CustomBpmnModeler extends BpmnModeler {}

CustomBpmnModelerFactory.prototype.get_instance = (divIdContainer, divIdParentPropertiesPanel) => {
  // new Bpmn Modeler
  const bpmnModeler = new CustomBpmnModeler({
    container: divIdContainer,
    propertiesPanel: {
      parent: divIdParentPropertiesPanel
    },
    additionalModules: [
      propertiesPanelModule,
      propertiesProviderModule, 
      // customModdleExtensionModule,
      CliModule
    ],
    moddleExtensions: {
      custom: customDescriptor
    },
    keyboard: {
      bindTo: document
    },
    cli: {
      bindTo: 'cli'
    }
  });
  return bpmnModeler
}

