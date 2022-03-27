import { Moddle } from 'moddle';
// create a model object from descripor.json
// - descriptor.json has namespace (prefix and name) and types


export default class FactoryForModdle {
  // public 
  moddle ;
  
  constructor(descriptors) {
    this.moddle = new Moddle(descriptors)
  }
  
  get_instance(namespace, data){
    const obj = this.moddle.create(namespace, data);
    return obj;
  }
  
  get_moddle() {
    return this.moddle
  }

}

