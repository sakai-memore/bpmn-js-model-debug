import $ from 'jquery';
// import $ from './lib/jQuery.classList';
import 'bootstrap';

import DataUtil from  './lib/DataUtil';
import HbsUtil from  './lib/HbsUtil';

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
  
  await debug(eventBus, elementRegistry, modeling, moddle);

}

// debug entry
const debug = async (eventBus, elementRegistry, modeling, moddle) => {
  // create Helper class
  let cliHelper = new CliHelper(elementRegistry, modeling)
  // 
  // ---------------------------------------debug
  const elKeyAll = await cliHelper.getElemetsIds('Task');
  // console.log(elKeyAll);
  for (let obj of elKeyAll) {
    let elm = await cliHelper.getElementBProperties(obj.id);
    // console.log(elm)
  }
  // getElements
  let taskElms = await cliHelper.getElementsBProperties('Task');
  console.log(`taskElms = ${JSON.stringify(taskElms)}`)
  
  // ---------------------------------------debug for descriptor
  
  
  // open quality assurance if user right clicks on element
  // qa html elements
  const elQualityAssurance = document.getElementById('quality-assurance');
  // 
  const elSuitabilityScore = document.getElementById('suitability-score');
  const elLastChecked = document.getElementById('last-checked');
  const elForm = document.getElementById('form');
  
  // popup <-> parent screen
  // let storeBO;
  // let storeAnalysisDetailsElm;
  let storeElTarget;
  let storeSuitabilityScore;
  
  // validate suitability score  ---not use!
  function validate(el) {
    const {value} = el;
    const okayEl = document.getElementById('okay');
    const warningEl = document.getElementById('warning');
    // 
    if (isNaN(value)) {
      // warningEl.classList.remove('hidden');
      // okayEl.disabled = true;
    } else {
      warningEl.classList.add('hidden');
      okayEl.disabled = false;
    }
  }
  
  bpmnJs.on('element.contextmenu', HIGH_PRIORITY, (elm) => {
    elm.originalEvent.preventDefault();
    elm.originalEvent.stopPropagation();
    // 
    elQualityAssurance.classList.remove('hidden');
    storeElTarget = elm.element; // for other event
    // ignore root element
    if (!elm.element.parent) {
      return;
    }
    
    console.log(elm);
    // 
    let bo = cliHelper.getBusinessObjectOfElement(storeElTarget);
    console.log(bo);
    const extensionElements = bo.extensionElements || moddle.create('bpmn:ExtensionElements');
    let storeAnalysisDetailsElm = cliHelper.getExtensionElement(bo, 'qa:AnalysisDetails');
    
    // 
    elSuitabilityScore.value = bo['suitable'] ? bo['suitable'] : '';
    elSuitabilityScore.focus();
    elLastChecked.textContent = storeAnalysisDetailsElm ? storeAnalysisDetailsElm.lastChecked : '-';
    // 
    console.log(elSuitabilityScore.value)
    // validate(elSuitabilityScore);
  });
  
  // set suitability core and last checked if user submits
  elForm.addEventListener('submit', (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    storeSuitabilityScore = Number(elSuitabilityScore.value);
    
    if (isNaN(storeSuitabilityScore)) {
      return;
    }
    // 
    let bo = cliHelper.getBusinessObjectOfElement(storeElTarget);
    console.log(bo);
    const extensionElements = bo.extensionElements || moddle.create('bpmn:ExtensionElements');
    let storeAnalysisDetailsElm = cliHelper.getExtensionElement(bo, 'qa:AnalysisDetails');
    // 
    if (!storeAnalysisDetailsElm) {
      storeAnalysisDetailsElm = moddle.create('qa:AnalysisDetails');
      extensionElements.get('values').push(storeAnalysisDetailsElm);
    }
    // 
    storeAnalysisDetailsElm.lastChecked = new Date().toISOString();
    cliHelper.updateProperties(storeElTarget, {
      extensionElements,
      suitable: storeSuitabilityScore
    });
    
    // 
    elQualityAssurance.classList.add('hidden');
  });
  
  // close quality assurance if user presses escape
  elForm.addEventListener('keydown', (event) => {
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
  // elSuitabilityScore.addEventListener('input', validate);
  
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

