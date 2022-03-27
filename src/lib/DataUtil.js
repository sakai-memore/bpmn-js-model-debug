class DataUtil {
  // fetch file data
  static fetchData = async (url) => {
    return fetch(url).then(response => response.text());
  }

}

export default DataUtil;
