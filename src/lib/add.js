const add = (a, b) => {
  return (a + b);
}

export default add;


// ------------------------------// entry point
const debug = () => {
  console.log(add(12,34));
}

// if(process.argv[1].split('/')[process.argv[1].split('/').length - 1] === import.meta.url.split('/')[import.meta.url.split('/').length - 1]) {
//   //
// } else {
//   console.log(process.argv[1])
//   // debug()
// }
