{
    var PreppingsApiUrl = 'https://api.preppings.com/';
    //var PreppingsApiUrl = 'http://localhost:8085/';

    var ColorSchemaConst = 'data-color-schema';
    var DefaultColorSchema = 'light';

    var scripts = document.getElementsByTagName("script");
    var scriptElement = scripts[scripts.length-1];
    var colorSchema = scriptElement.hasAttribute(ColorSchemaConst)
        ? scriptElement.getAttribute(ColorSchemaConst) : DefaultColorSchema;
    var ApiKey = '';
    var key = scriptElement.getAttribute('src').match(/key=([^&]+)/);
    if (key != null && key.length >= 2) {
        ApiKey = key[1];
    }

    if (typeof jQuery == 'undefined') {
        document.write('<script src="' + PreppingsApiUrl + 'static/jquery-1.10.0.min.js" type="text/javascript"></script>');
        document.write('<script src="' + PreppingsApiUrl + 'static/jquery-ui/jquery-ui.min.js" type="text/javascript"></script>');
        document.write('<link href="' + PreppingsApiUrl + 'static/jquery-ui/jquery-ui.min.css" type="text/css" rel="stylesheet"/>');
        document.write('<script ' +
            'src="' + scriptElement.getAttribute('src') + '" ' +
            ColorSchemaConst + '="' + colorSchema + '"></script>');
    } else if (typeof jQuery.ui == 'undefined') {
        document.write('<script src="' + PreppingsApiUrl + 'static/jquery-ui/jquery-ui.min.js" type="text/javascript"></script>');
        document.write('<script ' +
            'src="' + scriptElement.getAttribute('src') + '" ' +
            ColorSchemaConst + '="' + colorSchema + '"></script>');
    } else {
        (function($) {
            $.fn.preppingsBar = function(options) {
                var settings = $.extend({

                }, options);

                var $head = $('head')
                    .append($('<link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300" rel="stylesheet" type="text/css">'))
                    .append($('<link href="' + PreppingsApiUrl + 'static/preppings.css?' + new Date().getTime() + '" rel="stylesheet" type="text/css" />'))
                    .append($('<link href="' + PreppingsApiUrl + 'static/jquery-ui/jquery-ui.min.css" type="text/css" rel="stylesheet"/>'))
                    .append($('<link href="' + PreppingsApiUrl + 'static/colorbox.css" rel="stylesheet" type="text/css" />'));

                // check centerimage is present
                if ($.fn.centerImage == undefined) {
                    $.getScript(PreppingsApiUrl + 'static/jquery.blImageCenter.js');
                }
                // check colorbox is present
                var hasColorbox = $.fn.colorbox != undefined;
                if (!hasColorbox) {
                    $head.append($('<link rel="stylesheet" type="text/css" href="' + PreppingsApiUrl + 'static/colorbox.css"/>'));
                    $.getScript(PreppingsApiUrl + 'static/jquery.colorbox-min.js', function() {
                        popupDelegate(ret);
                    });
                }

                var ret = this;
                var PopupResultStack = {
                    stack: [],
                    lastResult: null,
                    isEmpty: function() {
                        return this.stack.length == 0;
                    },
                    push: function(result) {
                        this.stack.push(result);
                        this.saveLastResult(result);
                    },
                    pop: function(num) {
                        if (num == undefined) {
                            num = 1;
                        }
                        if (num <= this.stack.length) {
                            var result = null;
                            for(var i = 0; i < num; i++) {
                                result = this.stack.pop();
                            }
                            popupResult(result);
                        }
                    },
                    saveLastResult: function(result) {
                        this.lastResult = result;
                    },
                    popupLastResult: function() {
                        if (this.lastResult != null) {
                            popupResult(this.lastResult, true);
                        }
                    },
                    clear: function() {
                        this.lastResult = null;
                        this.stack = [];
                    }
                };

                var popupResult = function(result, dontPush) {
                    $.colorbox({
                        maxWidth: '90%',
                        minWidth: '200px',
                        html: $('<div class="preppings-search-results"><a class="powered-by-preppings" href="http://preppings.com/" target="_blank">Powered by Preppings</a>' + result + '</div>'),
                        onComplete: function() {
                            $('.preppings-search-results .picture img').centerImage();
                            popupDelegate($('.preppings-search-results'));
                            if (dontPush !== true) {
                                PopupResultStack.push(result);
                            } else {
                                // save last result anyway for image colorbox
                                PopupResultStack.saveLastResult(result);
                            }
                        },
                        onClosed: function() {
                            PopupResultStack.clear();
                             $('.preppings-search-bar input[name=q]').focus();
                        }
                    });
                };
                var popupDelegate = function(el) {
                    el.delegate('a.popup', 'click', function(e) {
                        e.stopPropagation();
                        e.preventDefault();
                        var $a = $(this);
                        $.ajax($a.attr('href'), {
                            data: {
                                key: ApiKey
                            },
                            dataType: 'html' ,
                            type: 'GET',
                            crossDomain: true,
                            success: function(result) {
                                popupResult(result, $a.hasClass('no-history'));
                            }
                        });
                    });
                    el.find('a.picture').colorbox({
                        maxWidth: '80%',
                        maxHeight: '80%',
                        onComplete: function() {
                            var originalClose = $.colorbox.close;
                            $.colorbox.close = function(){
                                $.colorbox.close = originalClose;
                                PopupResultStack.popupLastResult();
                            };
                        }
                    });
                    el.find('a.back').click(function(e) {
                        e.stopPropagation();
                        e.preventDefault();

                        PopupResultStack.pop(2);
                    });
                    if(PopupResultStack.isEmpty()) {
                        el.find('a.back').hide();
                    }

                    el.find('a.back-to-search').click(function(e) {
                        e.stopPropagation();
                        e.preventDefault();
                        $.colorbox.close();
                    });
                };

                $.ajax(PreppingsApiUrl + 'api/', {
                    data: {
                        key: ApiKey
                    },
                    dataType: 'html',
                    type: 'POST',
                    crossDomain: true,
                    success: function(result) {
                        ret.append(result);

                        var form = ret.find('form').submit(function(e) {
                            e.stopPropagation();
                            e.preventDefault();

                            var $q = form.find('input[name=q]');
                            var q = $q.val().trim();

                            if (q == '') {
                                $q.val('').
                                    attr('placeholder', 'Type a keyword for search').focus();
                            } else {
                                var $submit = form.find('input[type=submit]');
                                $submit
                                    .val('Searching...')
                                    .attr('disabled', 'disabled');
                                $.ajax(PreppingsApiUrl + 'api/search/', {
                                    data: {
                                        q: q,
                                        key: ApiKey
                                    },
                                    dataType: 'html',
                                    type: 'POST',
                                    crossDomain: true,
                                    success: function(result) {
                                        $submit
                                            .val('Search')
                                            .removeAttr('disabled');
                                        try {
                                            var foundItems = JSON.parse(result);
                                            if (foundItems.length == 1) {
                                                $.ajax(PreppingsApiUrl + 'api/item/', {
                                                    data: {
                                                        title: foundItems[0],
                                                        key: ApiKey
                                                    },
                                                    dataType: 'html',
                                                    type: 'GET',
                                                    crossDomain: true,
                                                    success: function(result) {
                                                        popupResult(result);
                                                    },
                                                    error: function(jqXHR) {
                                                        this.success(jqXHR.responseXML);
                                                    }
                                                });
                                            } else {
                                                form.find('input[name=q]')
                                                    .autocomplete('search', q);
                                            }
                                        } catch(e) {
                                            // html response
                                            popupResult(result);
                                        }
                                    },
                                    error: function(jqXHR) {
                                        this.success(jqXHR.responseXML);
                                    }
                                });
                            }
                        });

                        form.find('input[name=q]')
                            .autocomplete({
                                autoFocus: false,
                                minLength: 2,
                                delay: 300,
                                source: PreppingsApiUrl + 'api/search/?key=' + ApiKey,
                                select: function(event, ui) {
                                    if(ui.item){
                                        $(event.target).val(ui.item.value);
                                    }
                                    $(event.target.form).submit();
                                }
                            })
                            .focus(function() {
                                $(this).autocomplete('search')
                            })
                            .autocomplete("widget").addClass('preppings');

                        var $clear = form.find('input[name=clear]');
                        var updateClearButton = function() {
                            if (form.find('input[name=q]').val().length > 0) {
                                $clear.show();
                            } else {
                                $clear.hide();
                            }
                        };
                        form.find('input[name=q]')
                            .keyup(function() { updateClearButton(); })
                            .keydown(function() { updateClearButton(); })
                            .change(function() { updateClearButton(); })
                            .click(function() { updateClearButton(); });
                        $clear.click(function(e) {
                            e.preventDefault();
                            e.stopPropagation();

                            form.find('input[name=q]')
                                .val('')
                                .focus();

                            updateClearButton();
                        });
                        updateClearButton();



                    },
                    error: function(jqXHR) {
                        ret.append('<div class="error">Cannot load Preppings Search Bar: ' + jqXHR.responseText + '</div>');
                    }

                });

                if (hasColorbox) {
                    popupDelegate(ret);
                }

                return ret;
            };
        }(jQuery));
        var id = 'preppings_' + parseInt(Math.random() * 10000);
        document.write('<div class="preppings-search-bar ' + colorSchema + '" id="' + id +
            '"></div><script type="text/javascript">jQuery(function(){jQuery("#' + id +
            '").preppingsBar({}); });</script>');
    }
}