class Dto {
  // 
  static converttoExtElm = (jsonObj, exElm) => {
    // set exElm properties
    exElm.lastChecked = new Date().toISOString();
    return exElm;
  }
  // 
  static convertfromExtElm = (id, bo, exElm) => {
    let jsonObj = {
      id : id,
      score: bo.suitable ? bo.suitable : '',
      checked_date: exElm ? (exElm.lastChecked ? exElm.lastChecked:'-' ): '-',
      lastChecked: new Date().toISOString(),
    }
    console.log(jsonObj)
    return jsonObj;
  }
}

export default Dto;
