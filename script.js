var _panel = $("#segment_0161207");

var _segment_0161207 = function () {
    var _panel = $("#segment_0161207");

	_segment_0161207_start();
	
    var _input = _panel.find(".text-input").val();

	//console.log("before _count_sentence");
    _count_sentence(_panel, _input, function() {
		//console.log("before _discourse_analyse");
		_discourse_analyse(_panel, _input, function () {
			//console.log("before _neighbor_discourse_analyse");
			_neighbor_discourse_analyse(_panel, _input, function() {
				// ----------------------------------
				
				// 換行
				// 標點符號
				
				_input = _input_remove_punctuation(_panel, _input);
				var _clean_input = _input_remove_space(_input);
				//console.log(_clean_input);

				_panel.find(".output-length span").html(_clean_input.length);

				

				// ----------------------------------
				var _data = {};

				var _len = parseInt(_panel.find(".segment-length").val(), 10);
				for (var _i = 0; _i < _input.length - _len + 1; _i++) {
					var _word = _input.substr(_i, _len);
					if (_word.indexOf(" ") > -1) {
						continue;
					}

					if (typeof(_data[_word]) === "undefined") {
						_data[_word] = 0;
					}
					_data[_word]++;
				}
				
				// ----------------------------------

				//console.log("before _count_index");
				_count_index(_panel, _data, function () {
					//console.log("before _output_different");
					_output_different(_panel, _data, function () {
						// ----------------------------------
						//console.log("after _output_different");
						//var _ary = _sort_ary(_data);
						_sort_ary_async(_data, function(_ary) {
							//console.log("after _output_different 1");
							var _table = _create_table(_ary); 
							//console.log("after _output_different 2");
							$("#segment_0161207 .output tbody").remove();
							
							$("#segment_0161207 .output").append(_table);

							// -----------------
							//console.log("before _draw_wordcloud");
							_draw_wordcloud(_panel, _ary, function () {
								//console.log("before _count_function_words");
								_count_function_words(_panel, _input, function () {
									_segment_0161207_finish();
								});
							});

						});	//_sort_ary_async(_data, function(_ary) {

					});
				});
				
			});	//_neighbor_discourse_analyse(_panel, _input, function() {
		});	// _discourse_analyse(_panel, _input, function () {
	});	// _count_sentence(_panel, _input, function() {
	
	
};

var _segment_0161207_start = function () {
	_panel.find(".button.start").addClass("loading").addClass("disabled");
	_panel.find(".result-container").hide();
	$('body').addClass("wait");
};

var _segment_0161207_finish = function () {
	_panel.find(".button.start").removeClass("loading").removeClass("disabled");
	_panel.find(".result-container").show();
	setTimeout(function () {
		var _anchor = document.querySelector( '#result_container' );
		smoothScroll.animateScroll( _anchor, 0, { speed: 500, easing: 'linear' } );
	}, 100);
	$('body').removeClass("wait");
};

// ----------------------------

var _input_remove_punctuation = function (_panel, _input) {
	var _remove_punctuation = _panel.find(".remove_punctuation").val();
	var _remove_number = (_panel.find(".remove_number:checked").length === 1);
	if (_remove_number === true) {
		_remove_punctuation = _remove_punctuation + "(0-9)";
	}
	
	var _remove_english = (_panel.find(".remove_english:checked").length === 1);
	//console.log(_panel.find(".remove_english:checked").length);
	if (_remove_english === true) {
		_remove_punctuation = _remove_punctuation + "(A-Z)(a-z)";
	}
	
    var _regex = new RegExp("[" + _remove_punctuation + "]", "g");
	_input = _input.replace(_regex," ");
    _input = _input.replace(/\r?\n|\r/g," ");
	
	return _input;
};

var _input_remove_space = function (_input) {
	return _input.replace(/ /g, "");
};


// ----------------------------

var _count_sentence = function (_panel, _input, _callback) {
    var _punctuation = _panel.find(".punctuation").val();
    var _regex = new RegExp("[" + _punctuation + "]", "g");
    _input = _input.replace(_regex," ");
	_input = _input.replace(/\r?\n|\r/g," ");

    // ----------------------------
    var _sentences = _input.split(" ");

    var _sentences_count = {};
    var _count = 0;
    var _sum = 0;
	
	var _remove_punctuation = _panel.find(".remove_punctuation").val();
	var _remove_regex = new RegExp("[" + _remove_punctuation + "]", "g");
	
    for (var _s in _sentences) {
        var _sentence = _sentences[_s].trim();
		
		_sentence = _sentence.replace(_remove_regex, "");
		
		if (_sentence === "") {
            continue;
        }
		
		//console.log(_sentence);
		
        var _len = _sentence.length + "";
        if (typeof(_sentences_count[_len]) === "undefined") {
            _sentences_count[_len] = 0;
        }
        _sentences_count[_len]++;
        _count++;
        _sum = _sum + _sentence.length;
    }

    // -------------------------
    
    var _sorted_count = _sort_ary(_sentences_count);
    var _table = _create_table(_sorted_count);

    // -------------------------

    _panel.find(".output_sentence tbody").remove();
	_panel.find(".output_sentence").append(_table);
	
    _panel.find(".output_sentence_count span").html(_count);

    var _avg = (_sum/_count);
    _panel.find(".output_sentence_avg span").html(_avg);

    // -------------------------
    var _var_sum = 0;
    for (var _s in _sentences_count) {
        var _len = parseInt(_s, 10);
        var _count = _sentences_count[_s];
        _var_sum = _var_sum + ((_len - _avg) * (_len - _avg) * _count);
    }
    _panel.find(".output_sentence_var span").html((_var_sum/_count));
	
	if (typeof(_callback) === "function") {
		setTimeout(function() {
			_callback();
		}, 100);
	}
};

// ----------------------------

var _count_index = function (_panel, _data, _callback) {
    var _sum = 0;
    for (var _word in _data) {
        var _count = _data[_word];
        _sum = _sum + _count;
    }

    // --------------------
    var _entropy = 0;
    var _simpson = 0;

    for (var _word in _data) {
        var _count = _data[_word];
        var _p = _count / _sum;
        
        _entropy = _entropy + (_p * Math.log(_p));
        _simpson = _simpson + (_p * _p);
    }

    // ------------------------
    _panel.find(".output-entropy span").html(_entropy*-1);
    _panel.find(".output-simpson-index span").html(_simpson);
	
	if (typeof(_callback) === "function") {
		setTimeout(function() {
			_callback();
		}, 100);
	}
};

var _count_function_words = function(_panel, _input, _callback) {
    var _func_words = _panel.find(".function-words").val().split(" ");
    
    var _func_word_count = [];
    
	var _fw_count = 0;
	
    for (var _f in _func_words) {
        var _word = _func_words[_f].trim();
        if (_word === "") {
            continue;
        }
        
        _count = _input.split(_word).length - 1;
        
        _func_word_count.push([_word, _count]);
		_fw_count = _fw_count + _count;
    }
	
	var _clean_input = _input_remove_punctuation(_panel, _input);
	_clean_input = _input_remove_space(_clean_input);
	var _len = _clean_input.length;
	var _avg = _fw_count / _len; 
	
    //console.log(_func_word_count);
    
    var _table = _create_table(_func_word_count);
	//console.log(_panel.find(".output_function_word").length);
	_panel.find(".output_function_word tbody").remove();
    _panel.find(".output_function_word").append(_table);
	_panel.find(".output_function_word_count span").html(_fw_count);
	_panel.find(".output_function_word_proportion span").html(_avg);
	
	if (typeof(_callback) === "function") {
		setTimeout(function() {
			_callback();
		}, 100);
	}
};

// ----------------------------

var _output_different = function (_panel, _data, _callback) {
    var _d_count = 0;
    for (var _d in _data) {
        _d_count++;
    }
    
    _panel.find(".output-different span").html(_d_count);
	
	if (typeof(_callback) === "function") {
		setTimeout(function() {
			_callback();
		}, 100);
	}
};  

// ----------------------------

var _draw_wordcloud = function (_panel, _ary, _callback) {
    //var _panel = $("#segment_0161207");
    var _top = parseInt(_panel.find(".wordcloud-freq").val(), 10);

    var _freq_count = 0;
    var _freq_last;
    var _list = [];
    for (var _i = 0; _i < _ary.length; _i++) {
        var _word = _ary[_i].key;
        var _freq = _ary[_i].value;

        _list.push([_word, _freq]);

		_freq_count++;
        //if (_freq !== _freq_last) {
        //    _freq_count++;
        //    _freq_last = _freq;
        //}
		
		if (_i < _ary.length - 1
			&& _ary[(_i+1)].value === _freq) {
			continue;
		}
		else if (_freq_count === _top || _freq_count > _top) {
            break;
        }
    }

    //console.log(_list.length);

    //WordCloud.minFontSize = "24em";
    var _weightFactor = parseInt(_panel.find(".weight-factor").val(), 10);

    var _canvasSize = parseInt(_panel.find(".canvas-size").val(), 10);

    
    _panel.find(".word-cloud").html('<canvas id="my_canvas" height="'+_canvasSize*0.6+'" width="'+_canvasSize+'"  />');

    WordCloud(document.getElementById('my_canvas')
        , { list: _list
            , weightFactor: _weightFactor } );

	if (typeof(_callback) === "function") {
		setTimeout(function() {
			_callback();
		}, 100);
	}
};

// ----------------------------

var _sort_ary = function (_data) {
    var _ary = [];
    for (var _key in _data) {
        _ary.push({
            key: _key,
            value: _data[_key]
        })
    }

    _ary = _ary.sort(function (a, b) {
        return b.value-a.value;
    });

    return _ary;
};

var _sort_ary_async = function (_data, _callback) {
    var _ary = [];
    for (var _key in _data) {
        _ary.push({
            key: _key,
            value: _data[_key]
        })
    }

	setTimeout(function() {
		_ary = _ary.sort(function (a, b) {
			return b.value-a.value;
		});
		_callback(_ary);
	}, 100);

    //return _ary;
};

var _format_ary = function (_data) {
    var _ary = [];
    for (var _key in _data) {
        _ary.push({
            key: _key,
            value: _data[_key]
        })
    }

    return _ary;
};

// ----------------------------

var _create_table = function(_data, _thead) {
   //var _table = $('<table class="ui celled table"><tbody></tbody></table>'); 
   /*
   if (_thead !== undefined) {
	   var _thead_ele = $('<thead><tr></tr></thead>').prependTo(_table);
	   var _tr = _thead_ele.find("tr");
	   for (var _i = 0; _i < _thead.length; _i++) {
		   //console.log(_thead[_i]);
		   $('<th></th>').appendTo(_tr).html(_thead[_i]);
	   } 
   }
   */
   //var _tbody = _table.find("tbody");
   var _tbody = $("<tbody></tbody>");
   
   for (var _i in _data) {
        var _tr = $("<tr></tr>");
        var _row = _data[_i];
        for (var _r in _row) {
            _tr.append('<td>' + _row[_r] + "</td>");
        }
        _tbody.append(_tr);
   }

   return _tbody;
};

// ----------------------------

var _set_example_text = function () {
	var _text = $(this).data("content");
	//console.log([
	//	$(_button).data("content"),
	//	$(_button).data("data-content"),
	//	$(_button).attr("data-content"),
	//]);
	_panel.find("#text_input").val(_text);
	_segment_0161207();
};

// ----------------------------

var _copy_table = function () {
	var _button = $(this);
	
	var _table = _button.parents("table:first");
	var _tr_coll = _table.find("tbody tr");
	
	var _text = "";
	for (var _r = 0; _r < _tr_coll.length; _r++) {
		if (_r > 0) {
			_text = _text + "\n";
		}
		
		var _tr = _tr_coll.eq(_r);
		var _td_coll = _tr.find("td");
		for (var _c = 0; _c < _td_coll.length; _c++) {
			var _td = _td_coll.eq(_c);
			var _value = _td.text();
			
			if (_c > 0) {
				_text = _text + "\t";
			}
			_text = _text + _value.trim();
		}
	}
	
	_copy_to_clipboard(_text);
};


var _copy_table_value = function () {
	var _button = $(this);
	
	var _table = _button.parents("table:first");
	var _tr_coll = _table.find("tbody tr");
	
	var _text = "";
	for (var _r = 0; _r < _tr_coll.length; _r++) {
		if (_r > 0) {
			_text = _text + "\n";
		}
		
		var _tr = _tr_coll.eq(_r);
		var _td_coll = _tr.find("td:last");
		for (var _c = 0; _c < _td_coll.length; _c++) {
			var _td = _td_coll.eq(_c);
			var _value = _td.text();
			
			if (_c > 0) {
				_text = _text + "\t";
			}
			_text = _text + _value.trim();
		}
	}
	
	_copy_to_clipboard(_text);
};


var _copy_to_clipboard = function(_content) {
	var _button = $('<button type="button" id="clipboard_button"></button>')
		.attr("data-clipboard-text", _content)
		.hide()
		.appendTo("body");
		
	var clipboard = new Clipboard('#clipboard_button');
	
	_button.click();
	
	_button.remove();
};

// ----------------------------

var _discourse_analyse = function (_panel, _input, _callback) {
	
	var _prefix = _panel.find("#discourse_prefix").val().trim();
	var _suffix = _panel.find("#discourse_suffix").val().trim();
	var _question = _panel.find("#discourse_question").val().trim();
	var _exclamation = _panel.find("#discourse_exclamation").val().trim();
	
	var _punctuation = _panel.find(".punctuation").val();
	
	// ------------------------
	// 先把句子斷開，取得每一句內容
	
	var _discourse_coll = [];
	var _normal_coll = [];
	var _question_coll = [];
	var _exclamation_coll = [];
	
	
	//console.log(_input);
	
	var _discourse_head = _input.split(_prefix);
	for (var _i = 1; _i < _discourse_head.length; _i++) {
		var _pos = _discourse_head[_i].indexOf(_suffix);
		if (_pos === -1) {
			continue;
		}
		
		var _discourse = _discourse_head[_i].substr(0, _pos);
		
		var _original_discourse = _discourse;
		_discourse = _input_remove_punctuation(_panel, _discourse);
		_discourse = _input_remove_space(_discourse);
		
		//console.log(_discourse);
		_discourse_coll.push(_discourse);
		if (_original_discourse.indexOf(_question) > -1) {
			_question_coll.push(_discourse);
		}
		if (_original_discourse.indexOf(_exclamation) > -1) {
			_exclamation_coll.push(_discourse);
		}
		if (_original_discourse.indexOf(_question) === -1 && _original_discourse.indexOf(_exclamation) === -1) {
			_normal_coll.push(_discourse);
		}
	}
	
	// --------------------------------
	//console.log(_discourse_coll);
	
	var _stat = function (_coll, _classname_prefix) {
		var _count = _stat_string_collection_count(_coll);
		var _len = _stat_string_collection_len(_coll);
		var _avg = _stat_string_collection_avg(_coll);
		var _var = _stat_string_collection_var(_coll, _avg);
		
		var _clean_input = _input_remove_punctuation(_panel, _input);
		_clean_input = _input_remove_space(_clean_input);
		var _prop = _len / _clean_input.length;
		var _tbody = _stat_string_collection_distribution(_coll);
		
		// ----------------------------
		//var _classname_prefix = 'output_discourse_';
		_panel.find("."+_classname_prefix+"count span").html(_count);
		_panel.find("."+_classname_prefix+"length_average span").html(_avg);
		_panel.find("."+_classname_prefix+"length_variance span").html(_var);
		_panel.find("."+_classname_prefix+"length_total span").html(_len);
		_panel.find("."+_classname_prefix+"length_prop span").html(_prop);
		
		_panel.find("."+_classname_prefix+"distribution tbody").remove();
		_panel.find("."+_classname_prefix+"distribution").append(_tbody);

	};
	
	_stat(_discourse_coll, 'output_discourse_');
	_stat(_normal_coll, 'output_normal_discourse_');
	_stat(_question_coll, 'output_question_discourse_');
	_stat(_exclamation_coll, 'output_exclamation_discourse_');
	
	if (typeof(_callback) === "function") {
		setTimeout(function() {
			_callback();
		}, 100);
	}
}

// ----------------------------

var _neighbor_discourse_analyse = function (_panel, _input, _callback) {
	var _prefix = _panel.find("#discourse_prefix").val().trim();
	var _suffix = _panel.find("#discourse_suffix").val().trim();
	var _question = _panel.find("#discourse_question").val().trim();
	var _exclamation = _panel.find("#discourse_exclamation").val().trim();
	
	var _punctuation = _panel.find(".discourse_punctuation").val();
	var _regex = new RegExp("[" + _punctuation + "]", "g");
	
	// ----------------------
	
	var _before_coll = [];
	var _after_coll = [];
	var _prefix_array = _input.split(_prefix);
	for (var _i = 0; _i < _prefix_array.length; _i++) {
		if (_i < _prefix_array.length - 1) {
			var _part1 = _prefix_array[_i].replace(_regex, " ");
			_part1 = _part1.replace(/\r?\n|\r/g, " ");
			_part1 = _part1.trim();
			
			var _part2 = _part1.split(" ");
			var _str = _part2[(_part2.length-1)];
			_str = _str.trim();
			
			if (_str !== "") {
				_before_coll.push(_str);
			}
		}
		if (_i > 0) {
			var _part1 = _prefix_array[_i].trim();
			var _pos = _part1.indexOf(_suffix);
			if (_pos > -1) {
				var _part2 = _part1.substring(_pos, _part1.length);
				//console.log(_input_remove_punctuation(_panel, _part2));
				var _part3 = _input_remove_punctuation(_panel, _part2).trim().split(" ")[0].trim();
				
				if (_part3 !== "") {
					_after_coll.push(_part3);
				}
			}
		}
	}
	
	var _stat = function (_coll, _classname_prefix) {
		var _dist = {};
		for (var _i = 0; _i < _coll.length; _i++) {
			var _str = _coll[_i].trim();
			if (_str === "") {
				continue;
			}
			
			if (typeof(_dist[_str]) === "undefined") {
				_dist[_str] = 0;
			}
			_dist[_str]++;
		}
		var _ary = _sort_ary(_dist);
		var _tbody = _create_table(_ary); 
		_panel.find("." + _classname_prefix + " tbody").remove();
		_panel.find("." + _classname_prefix).append(_tbody);
	};
	
	//console.log(_before_coll);
	_stat(_before_coll, "output_discourse_before_distribution");
	
	/*
	var _suffix_array = _input.split(_suffix);
	for (var _i = 1; _i < _suffix_array.length; _i++) {
		var _part1 = _suffix_array[_i].replace(_regex, " ");
		_part1 = _part1.replace(/\r?\n|\r/g, " ");
		_part1 = _part1.trim();
		
		var _part2 = _part1.split(" ");
		var _str = _part2[0];
		_str = _str.trim();
		
		_after_coll.push(_str);
	}
	*/
	//console.log(_after_coll);
	_stat(_after_coll, "output_discourse_after_distribution");
	
	if (typeof(_callback) === "function") {
		setTimeout(function() {
			_callback();
		}, 100);
	}
};

// ----------------------------

var _stat_string_collection_avg = function (_str_coll) {
	var _sum = 0;
	var _count = 0;
	for (var _i = 0; _i < _str_coll.length; _i++) {
		var _str = _str_coll[_i].trim();
		if (_str === "") {
			continue;
		} 
		_sum = _sum + _str.length;
		_count++;
	}
	if (_count === 0) {
		return 0;
	}
	return (_sum/_count);
};

var _stat_string_collection_var = function (_str_coll, _avg) {
	var _sum = 0;
	var _count = 0;
	for (var _i = 0; _i < _str_coll.length; _i++) {
		var _str = _str_coll[_i].trim();
		if (_str === "") {
			continue;
		} 
		_sum = _sum + ((_str.length - _avg) * (_str.length - _avg));
		_count++;
	}
	if (_count === 0) {
		return 0;
	}
	
	return (_sum/_count);
};

var _stat_string_collection_len = function (_str_coll) {
	var _sum = 0;
	for (var _i = 0; _i < _str_coll.length; _i++) {
		var _str = _str_coll[_i].trim();
		if (_str === "") {
			continue;
		} 
		_sum = _sum + _str.length;
	}
	return _sum;
};

var _stat_string_collection_count = function (_str_coll) {
	var _count = 0;
	for (var _i = 0; _i < _str_coll.length; _i++) {
		var _str = _str_coll[_i].trim();
		if (_str === "") {
			continue;
		} 
		_count++;
	}
	return _count;
};

var _stat_string_collection_distribution = function (_str_coll) {
	var _freq = {};
	for (var _i = 0; _i < _str_coll.length; _i++) {
		var _str = _str_coll[_i].trim();
		if (_str === "") {
			continue;
		} 
		var _len = _str.length;
		
		if (typeof(_freq[_len]) === "undefined") {
			_freq[_len] = 0;
		}
		_freq[_len]++;
	}
	
	var _ary = _sort_ary(_freq);
	var _tbody = _create_table(_ary); 
	return _tbody;
};

// -------------------

var _accordion_setup = function () {
	$('.ui.accordion .title').click(function () {
		var _this = $(this);
		var _content = _this.next();

		if (_content.css("display") === "block") {
		  _content.slideUp();
		  _this.removeClass("active");
		}
		else {
		  _content.slideDown();
		  _this.addClass("active");
		}
	});
	//$('.ui.accordion').accordion();
};

var _float_action_button = function () {
	
	//var _anchor = document.querySelector( '#segment_0161207' );
	//smoothScroll.animateScroll( _anchor );
	window.scrollTo(0, 0);
	$("#text_input").focus().select();
};

// ----------------------------

$(function () {
  $("#segment_0161207 button.start").click(_segment_0161207);
  //$("#segment_0161207 .text-input").change(_segment_0161207);
  $('.popup').popup();
  
  $("button.example-text").click(_set_example_text);
  $("button.copy-table").click(_copy_table);
  $("button.copy-value").click(_copy_table_value);
  $(".float-action-button").click(_float_action_button);
  
  _accordion_setup();
});