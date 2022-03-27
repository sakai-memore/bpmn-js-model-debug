class SessionStateStore {

  static loadState(id){
    try {
      const serializedState = sessionStorage.getItem(id);
      return JSON.parse(serializedState);
    } catch(err) {
      return undefined;
    }
  };

  static saveState(id, state){
    try {
      const serializedState = JSON.stringify(state);
      sessionStorage.setItem(id, serializedState);
    } catch(err) {
      //ignore
    }
  };
}

export default SessionStateStore;

