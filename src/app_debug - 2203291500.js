import $ from 'jquery';
// import $ from './lib/jQuery.classList';
import 'bootstrap';

import DataUtil from  './lib/DataUtil';
import HbsUtil from  './lib/HbsUtil';
import Dto from  './lib/AssuranceFormDto';
// import Dto from  './lib/AssuranceFormDtoDummy';

import { togglePanel } from './lib/togglePanel';
import { registerFileDrop } from './lib/registerFileDrop';
import { saveLocal } from './lib/saveLocal';

// -- Custom Modeler
import { CustomBpmnModelerFactory } from "./modeler/CustomBpmnModelerFactory.js";
import { CustomBpmnViewerFactory } from "./viewer/CustomBpmnViewerFactory.js";

// import { getBusinessObject } from './modeler/util/ModelUtil';

import CliHelper from  './lib/CliHelper.js';


// import './style.css';

// display a diagram: render xml data on canvas ------------------ //
const displayDiagram = async (xml_data) => {
  try {
    // console.log(xml_data);
    const result = bpmnJs.importXML(xml_data);
    const { warnings } = result;
  
  } catch (err) {
    console.log(err.message, err.warnings);
    alert('could not import BPMN 2.0 XML, see console');
  }
}

// draw canvas: display diagram and set variables ---------------- //
const drawCanvas = async (bpmnXML) => {

  // import xml into canvas
  await displayDiagram(bpmnXML);
  
  // get diagram objects
  const canvas = bpmnJs.get("canvas");
  const overlays = bpmnJs.get("overlays");
  const eventBus = bpmnJs.get("eventBus");
  const elementRegistry = bpmnJs.get("elementRegistry");
  const moddle = bpmnJs.get('moddle');
  const modeling = bpmnJs.get('modeling'); // only modeler
  
  // zoom to fit full viewport
  canvas.zoom('fit-viewport');
  
  // for debug
  window.canvas = canvas; // public on window for debug
  window.overlays = overlays; // public on window for debug
  window.eventBus = eventBus; // public on window for debug
  window.elementRegistry = elementRegistry; // public on window for debug
  window.moddle = moddle; // public on window for debug
  window.modeling = modeling; // public on window for debug
  
  // create Helper class
  let cliHelper = new CliHelper(elementRegistry, moddle, modeling);
  await debug(eventBus, cliHelper);

}

// debug entry                                    ---------------- //
const debug = async (eventBus, cliHelper) => {
  // validate suitability score  ---not use!
  function validate(val) {
    const okayEl = document.getElementById('okay');
    const warningEl = document.getElementById('warning');
    // 
    if (isNaN(val)) {
      // warningEl.classList.remove('hidden');
      // okayEl.disabled = true;
    } else {
      warningEl.classList.add('hidden');
      okayEl.disabled = false;
    }
  }
  
  // getElementsBProperties -- debug
  let taskElms = await cliHelper.getElementsBProperties('Task');
  console.log(`taskElms = ${JSON.stringify(taskElms)}`)
  
  /** element contextmenu(right click) event
  */
  eventBus.on('element.contextmenu', HIGH_PRIORITY, async (elm) => {
    elm.originalEvent.preventDefault();
    elm.originalEvent.stopPropagation();
    
    // ignore elements not in a task category
    let isIncludes = await cliHelper.includes(elm.element.id, 'Task');
    if (!isIncludes) {
      console.log(`this element is not in task category: ${elm.element.id}`);
      return;
    } 
    
    // html element operation
    document.getElementById('quality-assurance').classList.remove('hidden');
    let id = elm.element.id;
    $("#element-id").text(id);
    // $("#element-id").text(id);
    
    // get element - businessObject - extensionElements - extentionElement
    let {
      element, 
      bo, 
      extensionElements, 
      analysisDetailsElm } = cliHelper.getExtensionElementsAnalysis(id);
    
    // prepare data for extensionElements.anaylysisDetails
    const jsonObj = Dto.convertfromExtElm(id, bo, analysisDetailsElm);
    // assign score value
    const score = jsonObj.score;
    console.log(`score = "${score}"`);
    const checked_date = jsonObj.checked_date;
    console.log(`checked_date = "${checked_date}"`);
    // html element operation
    $('#suitability-score').val(score);
    $('#last-checked').text(checked_date);
    $('#suitability-score').focus();
    // 
    console.log(`#suitability-score = "${$('#suitability-score').val()}"`)
    // validate($('#suitability-score').val());
  });
  
  
  /** form submit event
  */
  // set suitability core and last checked if user submits
  $('#form').on('submit', (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    // validate a score field
    const score = $('#suitability-score').val();
    console.log(`score = ${score}`)
    if (isNaN(Number(score))) {
      return;
    }
    // assign the element id
    let id = $("#element-id").text();
    
    // operate element and bo and blow elements
    let {
      element, 
      bo, 
      extensionElements, 
      analysisDetailsElm } = cliHelper.getExtensionElementsAnalysis(id);
    
    let jsonObj = {
      suitable: score
    }
    const extensionElmTemp = Dto.converttoExtElm({}, analysisDetailsElm);
    console.log(extensionElmTemp);
    
    // FIXME : can not update extensionElements
    cliHelper.updateProperties(element, {
      extensionElements,
      jsonObj
    });
    console.log(cliHelper.getElement(id));
    
    // operate html element
    let elQualityAssurance = document.getElementById('quality-assurance');
    elQualityAssurance.classList.add('hidden');
  });
  
  // close quality assurance if user presses escape
  $('#form').on('keydown', (event) => {
    let elQualityAssurance = document.getElementById('quality-assurance');
    if (event.key === 'Escape') {
      elQualityAssurance.classList.add('hidden');
    }
  });
  
  // // hide quality assurance if user clicks outside
  // $('window').on('click', (event) => {
  //   // const { target } = event;
  //   if (event.target === elQualityAssurance || elQualityAssurance.contains(event.target)) {
  //     return;
  //   }
  //   elQualityAssurance.classList.add('hidden');
  // });
  
  // // validate suitability score if user inputs value
  // $('#suitability-score').on('input', validate);
  
}


const addListener = () => {
  // // Event- Actions
  $("#btn_saveLocal").on("click", {bpmnModeler: bpmnJs, fileName: INITIAL_XML_NAME}, saveLocal);
  $(".toggle-panel").on("click", togglePanel);
  //
  $("#btn_modal_form").on("click",()=>{
    console.log('#btn_modal_form clicked!');
    $("#modal-form").show();
  });
  // Event- Actions : drop a file
  const dropArea = $(EL_DROP_AREA);
  if (!window.FileList || !window.FileReader) {
    window.alert(
      'Looks like you use an older browser that does not support drag and drop. ' +
      'Try using Chrome, Firefox or the Internet Explorer > 10.');
  } else {
    registerFileDrop(dropArea, displayDiagram);
  }
  
}

// ------------------------------// entry point
const root = async () => {
  console.log('// ----------------// start debug!');
  
  // get bpmn XML data
  const url = MEDIA_PATH + INITIAL_XML_NAME;
  console.log(`load from url: ${url}`);
  const bpmnXML = await DataUtil.fetchData(url);
  
  // render hbs
  $(EL_COMPONENTS).html(divComponents);
  for(let itm of aryHbsComponents) {
    console.log(`render ${itm.hbsPath} ...`);
    await HbsUtil.renderComponent(
      itm.el, 
      itm.hbsPath, 
      itm.data
    );
  }
  
  // 
  addListener();
  
  //
  await drawCanvas(bpmnXML);

}

//// helper ///////////////////////////////////////////
const get_instance = (mode) => {
  let retModule = {};
  let factory = {};
  
  factory = new CustomBpmnViewerFactory();
  retModule = factory.get_instance(EL_CANVAS2);
  
  if(mode === 'modeler') {
    factory = new CustomBpmnModelerFactory();
    retModule = factory.get_instance(EL_CANVAS, EL_PROPERTIES_PANEL_PARENT);
  }
  
  return retModule;
}

// -------------------------------------------// document.ready
// variables
const MEDIA_PATH = '../../media/xml/';
// const INITIAL_XML_NAME = 'initialDiagram.bpmn';
const INITIAL_XML_NAME = 'qr-code.bpmn';

const EL_CANVAS = "#js-canvas";
const EL_CANVAS2 = "#js-canvas2";
const EL_PROPERTIES_PANEL_PARENT = "#properties-panel-parent";
const EL_COMPONENTS = "#div-components";
const EL_DROP_AREA = "#row-main";
const EL_LINK_DOWNLOAD = "[data-download]";

const HIGH_PRIORITY = 1500;

const aryHbsComponents = [
  {el: '#form-component', data: {}, hbsPath: './viewer/components/form-component.hbs'},
];
const divComponents = `
  <div id='form-component'></div>
`;

// let CONS_MODE = 'viewer'
let CONS_MODE = 'modeler'

let bpmnJs = {};
bpmnJs = get_instance(CONS_MODE);
bpmnJs.mode = CONS_MODE;
window.bpmnJs = bpmnJs; // public on window for debug
const cli = window.cli;
$(document).on('load', root());

