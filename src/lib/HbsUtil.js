import $ from 'jquery';
import * as Handlebars from "handlebars";
import DataUtil from './DataUtil'

class HbsUtil {
  
  static renderComponent = async (el, hbs_file_name, data) => {
    
    async function renderTemplate(el, templateSrc, data){
      // rendering hbs
      const template = Handlebars.compile(templateSrc);
      $(el).html(template(data));
    
    }
    const templateUrl = "./src/" + hbs_file_name;
    const templateSrc = await DataUtil.fetchData(templateUrl);
    await renderTemplate(el, templateSrc, data);
  }

}

export default HbsUtil;
