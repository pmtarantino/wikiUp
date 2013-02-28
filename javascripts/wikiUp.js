;(function(global, undefined) {
    "use strict";

    if (!global.jQuery) {
        return false;
    }

    var $ = global.jQuery,
        wikiQuantity = 0,

        DEFAULTS = {
            error: 'Error. Try again.',
            loading: 'Loading',
            lang: 'en'
        };

    var wikiUp = function($element, options) {
            var containerId = 'wiki-' + (wikiQuantity++);
            $element
                .data('wikiUp', containerId)
                .bind('mouseover', function() {
                    if (!$element.children('.tooltip').length) {
                        $element.append('<div class="tooltip"><span></span><div id="' + containerId + '"></div></div>');
                        wikiLoad($element, options);
                    }
                });
        };

    var wikiLoad = function($element, options) {
            var $container = $('#' + $element.data('wikiUp')),
                lang = $element.data('lang') || options.lang,
                page = $element.data('wiki'),
                url = 'http://' + lang + '.wikipedia.org/w/api.php?callback=?&action=parse&page=' + page + '&prop=text&format=json&section=0';

            $.ajax({
                type: 'GET',
                url: url,
                data: {},
                async: true,
                contentType: 'application/json; charset=utf-8',
                dataType: 'jsonp',
                success: function(response) {
                    var found = false,
                        paragraphCount = 0,
                        $allText = $(response.parse.text['*']),
                        intro;
                    while (found === false) {
                        found = true;
                        intro = $allText.filter('p:eq(' + paragraphCount + ')').html();

                        if (intro.indexOf('<span') === 0) {
                            paragraphCount++;
                            found = false;
                        }
                    }

                    $container
                        .html(intro)
                        .find('a')
                            .attr('target', '_blank')
                            .not('.references a')
                                .attr('href', function(i, href) {
                                    if (href.indexOf('http') !== 0) {
                                        href = 'http://' + lang + '.wikipedia.org' + href;
                                    }
                                    return href;
                                })
                                .end()
                            .end()
                        .find('sup.reference')
                            .remove();
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    $container.html(options.error);
                },
                beforeSend: function(XMLHttpRequest) {
                    $container.html(options.loading);
                }
            });
        };

    $.fn.wikiUp = function(options) {
        options = $.extend(true, {}, DEFAULTS, options);

        return this.each(function() {
            var $element = $(this);
            if (!$element.data('wikiUp')) {
                wikiUp($element, options);
            }
        });
    };

    // On document ready
    $(function() {
        // Default selector to parse
        $('[data-wiki]').wikiUp();
    });

}(this));