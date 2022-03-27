class CliHelper {
  // private 
  static _cli ;

  constructor(cli) {
    this._cli = cli;
  }
  
  // const listBo = async () => { // can not use!
  async listBo() {
    const elmIds = await this._cli.elements();
    let elm ;
    let elmsObj = {};
    for (let id of elmIds) {
      elm = await this._cli.element(id);
      elmsObj[id] = elm.businessObject;
    }
    return elmsObj
  }
  
  // list Model objects 
  async listMo() {
    const elmIds = await this._cli.elements();
    let elm ;
    let elmsObj = {};
    for (let id of elmIds) {
      elm = await this._cli.element(id);
      elmsObj[id] = elm;
    }
    return elmsObj
  }

  

}


// // if use private fields, can not use this syntax!
// CliHelper.prototype.listBo = async () => {
//   const elmIds = await this._cli.elements();
//   let elm ;
//   let elmsObj = {};
//   for (let id of elmIds) {
//     elm = await this._cli.element(id);
//     elmsObj[id] = elm.businessObject;
//   }
//   return elmsObj
// }

export default CliHelper;
