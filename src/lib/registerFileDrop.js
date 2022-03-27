import $ from 'jquery';

export const registerFileDrop = (containerArea, cbFunc) => {

  const handleFileSelect = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const files = e.dataTransfer.files;
    const file = files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
      var xml = e.target.result;
      cbFunc(xml, file.name);
    };
    reader.readAsText(file);
  }

  const handleDragOver = (e) => {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  // containerArea.on('dragover', handleDragOver, false);
  // containerArea.on('drop', handleFileSelect, false);
  containerArea.get(0).addEventListener('dragover', handleDragOver, false);
  containerArea.get(0).addEventListener('drop', handleFileSelect, false);
}
