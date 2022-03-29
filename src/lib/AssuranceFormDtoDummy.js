class Dto {
  // 
  static converttoExtElm = (jsonObj, exElm) => {
    // set exElm properties
    // exElm.lastChecked = new Date().toISOString();
    return exElm;
  }
  // 
  static convertfromExtElm = (id, bo, exElm) => {
    let jsonObj = {
      id : id,
      score: 1234,
      checked_date: '22-03-29 15:00',
      lastChecked: new Date().toISOString(),
    }
    return jsonObj;
  }
}

export default Dto;
