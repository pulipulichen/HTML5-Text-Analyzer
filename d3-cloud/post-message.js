/*
 * In the popup's scripts, running on <http://example.com>:
 */

// Called sometime after postMessage is called
function receiveMessage(event)
{
  // event.source is window.opener
  // event.data is "hello there!"

  //console.log(event)
  if (event.data 
          && event.data.text
          && typeof(event.data.text) === 'string' 
          && event.data.text.trim().length > 0) {
    document.getElementById('text').value = event.data.text.trim()
    document.getElementById('go').click()
    
    // 等待svg讀取完成
    var lastSVG
    var waitSVG = function () {
      var svg = document.getElementById('vis').innerHTML
      if (lastSVG !== svg) {
        lastSVG = svg
        setTimeout(function () {
          waitSVG()
        }, 1000)
      }
      else {
        event.source.postMessage({
          svg: svg
        },event.origin);
      }
    }
    waitSVG()
  }
  // Assuming you've verified the origin of the received message (which
  // you must do in any case), a convenient idiom for replying to a
  // message is to call postMessage on event.source and provide
  // event.origin as the targetOrigin.
  /*
  event.source.postMessage("hi there yourself!  the secret response " +
                           "is: rheeeeet!",
                           event.origin);
                           */
}

window.addEventListener("message", receiveMessage, true);