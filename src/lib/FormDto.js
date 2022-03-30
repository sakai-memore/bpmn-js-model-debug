import _ from 'lodash';
class Dto {
  // 
  static converttoExtElm = (exElm, jsonObj) => {
    // set exElm properties
    // console.log(jsonObj)
    // _.merge(exElm, jsonObj)
    exElm.checkedDate = jsonObj.checkd_date;
    console.log(exElm)
    return exElm;
  }
  // 
  static convertfromExtElm = (id, bo, exElm) => {
    console.log(exElm)
    let checked_date = '' // string date
    if(exElm.checkedDate){
      checked_date = exElm.checkedDate;
    } else {
      checked_date = '-'
    }
    let jsonObj = {
      id : id,
      score: bo.score ? bo.score : '',
      checked_date: checked_date
      // checked_date: exElm ? exElm.checkedDate: '-'
    }
    console.log(jsonObj)
    return jsonObj;
  }
}

export default Dto;
