let api = PuliPostMessageAPI()

let url = '//pulipulichen.github.io/d3-cloud/index.html'
//let url = 'http://localhost:8383/d3-cloud/index.html'
let options = {
  mode: 'popup'
}


var popupWordCloud = async function (text) {

  /*
  //var popup = window.open('d3-cloud/index.html', '_blank');
  var popup = window.open('//pulipulichen.github.io/d3-cloud/index.html', '_blank');
  
  // When the popup has fully loaded, if not blocked by a popup blocker:

  // This will successfully queue a message to be sent to the popup, assuming
  // the window hasn't changed its location.
  setTimeout(function () {
    popup.postMessage({text: text}, "*");
  }, 1000)
   */
  api.send(url, text, options)
}

var d3cloudTextParsing = function (ary) {
  var output = []
  ary.forEach(function (item) {
    for (i = 0; i < item.value; i++) {
      output.push(item.key)
    }
  })
  
  return output.join(' ')
}

api.addReceiveListener(function (data) {
  $('#text_input').val(data)
  $("#segment_0161207 button.start").click();
})