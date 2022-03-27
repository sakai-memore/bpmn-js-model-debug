import Factory from './lib/FactoryForModdle.js';
import { Reader, Writer } from 'moddle-xml';

// import descriptor  from './lib/carDescriptor.js';

const xml = `
<car:root xmlns:props="http://mypackage">
  <car:car id="Car_1">
    car:engine power="121" fuelConsumption="10" />
  </car:car>
</car:root>
`

const testModdel = async () => {
  
  // new Factory
  // const descriptors = [ descriptor ];
  // const factory = new Factory(descriptors);
  const factory = new Factory();
  const carModel = factory.get_moddle();
  const reader = new Reader(carModel);
  const rootHandler = reader.handler('car:Root');
  
  // when
  try {
    const {
      rootElement: cars,
      warnings
    } = await reader.fromXML(xml, rootHandler);
    
    if (warnings.length) {
      console.log('import warnings', warnings);
    }
    
    console.log(cars);
    
    // {
    //  $type: 'my:Root',
    //  cars: [
    //    {
    //      $type: 'my:Car',
    //      id: 'Car_1',
    //      engine: [
    //        { $type: 'my:Engine', powser: 121, fuelConsumption: 10 }
    //      ]
    //    }
    //  ]
    // }
    
  } catch (err) {
    console.log('import error', err, err.warnings);
  }

}

// ------------------------------// entry point
const debug = () => {
  console.log('// ----------------// start debug!');
  // 
  testModdel();
  
  console.log('');
  console.log('// ----------------// end ........');

}

// -------------------------------------------// document.ready
debug();
