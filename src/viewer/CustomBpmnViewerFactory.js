import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
// import EmbeddedComments from 'bpmn-js-embedded-comments';
// import CliModule from "bpmn-js-cli";

export class CustomBpmnViewer extends BpmnViewer {}
export class CustomBpmnViewerFactory  {}


CustomBpmnViewerFactory.prototype.get_instance = (divIdContainer) => {
  // new Bpmn Viewer
  const bpmnViewer = new CustomBpmnViewer({
    container: divIdContainer,
    keyboard: {
      bindTo: window
    },
    additionalModules: [
      // EmbeddedComments,
    ]
  });
  return bpmnViewer
}

