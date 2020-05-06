var Request = require("request");
var cheerio = require("cheerio");
const querystring = require('querystring');
const urlG = require('url');

async function getBody(url) {
    var urlParams = new urlG.URLSearchParams(url);
  
    const options = {
      headers: { "content-type": "application/x-www-form-urlencoded" },
      url: url,
      method: 'POST',
    };
    // Return new promise
    return new Promise(function() {
      Request.get(options, function(err, res,body) {
        if (err) {
            console.log(err);
        }else{ 
          var $ = cheerio.load(body);
  
          var element=$("p .telef a");
  
          if(element.length >= 1){
            console.log(urlParams.get('no')+" [Total:"+element.length+"] [Población: "+urlParams.get('lo')+"]");
            element.next().each(function() {
              console.log($(this)[0].prev.data.trim() + (urlParams.get('lo') == 'Caldes de Montbui'.toUpperCase() ? " Calle:"+$(this)[0].parent.next.data.trim():''));
            });
          }else{
            console.log(urlParams.get('no')+" no encontrad@ en la población de "+urlParams.get('lo'));
          }
          return element.length;
        }
      })
    })
  }
  
  function getTelefonos(nombre,poblacion){
      let nombres =  {'no': nombre,'lo':poblacion};
      nombres = querystring.stringify(nombres); 
      var link="http://blancas.paginasamarillas.es/jsp/resultados.jsp?sec=08&pgpv=0&tbus=0&nomprov=Barcelona&idioma=tml_lang&";   
      return getBody(link+nombres);
  }
  require('events').EventEmitter.defaultMaxListeners = 15;
  
  var arrayNombres=['Alejandro','An'];
  var Arraypoblacion=['Sant feliu de Codines','Caldes de Montbui','Bigues y Riells'];
  
  for(var i=0;i<Arraypoblacion.length;i++){ 
    arrayNombres.forEach(element => {
      getTelefonos(element,Arraypoblacion[i].toUpperCase());
    });
  }
  