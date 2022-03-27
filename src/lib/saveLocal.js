import $ from 'jquery';
import {
  debounce
} from 'min-dash';

//// button event  
// const setEncoded = (link, name, data) => {
//   const encodedData = encodeURIComponent(data);
//   if (data) {
//     link.addClass('active').attr({
//       'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
//       'download': name
//     });
//   } else {
//     link.removeClass('active');
//   }
//   console.log('kick setEncoded!')
// }

export const saveLocal = async (elm) => {
  console.log('save lnk_saveLocal');
  // console.log($(this));
  
  const { xml } = await elm.data.bpmnModeler.saveXML({ format: true });
  const blob = new Blob([xml]);
  
  // $(this).download = elm.data.fileName;
  // $(this).href = URL.createObjectURL(blob);
  // $(this).parent.click();
  
  const elLink = document.createElement('a');
  elLink.download = elm.data.fileName;
  elLink.style.display = 'none';
  elLink.href = URL.createObjectURL(blob);
  document.body.appendChild(elLink);
  elLink.click();
  document.body.removeChild(elLink);
  
  // try {
  //   console.log('kick exportArtifacts!');
  //   const { xml } = await elm.data.bpmnModeler.saveXML({ format: true });
  //   setEncoded(elm.data.downloadLink, elm.data.fileName, xml);
  //   
  // } catch (err) {
  //   console.error('Error happened saving diagram: ', err);
  //   setEncoded(elm.data.downloadLink, elm.data.TEMP_XML_NAME, null);
  // }
};

