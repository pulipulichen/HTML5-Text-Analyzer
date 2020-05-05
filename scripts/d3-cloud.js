var d3cloudArrayConvert = function (ary) {
  return ary.map(function (item) {
    return {
      text: item.key,
      size: item.value
    }
  })
}

var w
var h

  //取得d3顏色
  var fill = d3.scaleOrdinal(d3.schemeCategory10);
  
/**
 * 
 * @param {type} data
 * var data = [
 {text: "加里山", size: 21},
 {text: "文字雲", size: 18},
 {text: "翠湖 螢火蟲", size: 17}
 ];
 * @returns {undefined}
 */
var drawD3Cloud = function (data, callback) {
  //console.log(data)

  //文字雲/關鍵字，及字型大小（這邊只放三個）

  //取得呈現處的寬、高
  w = parseInt(d3.select("#tag").style("width"), 10);
  h = parseInt(d3.select("#tag").style("height"), 10);
/*
  data = [
    {text: "加里山", size: 21},
    {text: "文字雲", size: 18},
    {text: "翠湖 螢火蟲", size: 17}
  ];
*/
  var drawD3CloudEnd = function (words) {
    return d3.select("#tag").append("svg")
            .attr("width", w)
            .attr("height", h)
            .append("g")
            .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function (d) {
              return d.size + "px";
            })
            .style("font-family", "Microsoft JhengHei")
            .style("cursor", 'pointer')
            .style("fill", function (d, i) {
              return fill(i);
            })
            .attr("text-anchor", "middle")
            .attr("transform", function (d) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) {
              return d.text;
            })

  }

  d3.layout.cloud().size([w, h])
          .words(data)
          .padding(2)
          .rotate(function () {
            return ~~(Math.random() * 2) * 90;
          })
          .rotate(function () {
            return 0;
          })
          .fontSize(function (d) {
            return d.size;
          })
          .on("end", draw)
          .start();

  //console.log('aaaa')
  callback()
}


function draw(words) {
  d3.select("#tag").append("svg")
          .attr("width", '100%')
          .attr("height", '100%')
          .append("g")
          .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")")
          .selectAll("text")
          .data(words)
          .enter().append("text")
          .style("font-size", function (d) {
            return d.size + "px";
          })
          .style("font-family", "Microsoft JhengHei")
          //.style("cursor", 'pointer')
          .style("fill", function (d, i) {
            return fill(i);
          })
          .attr("text-anchor", "middle")
          .attr("transform", function (d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function (d) {
            return d.text;
          })
}