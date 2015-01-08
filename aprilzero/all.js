(function() {
    window.AprilzeroAbout = (function() {
        function AprilzeroAbout() {
            this.bindEvents();
        }
        AprilzeroAbout.prototype.init = function() {
            return aprilzero.sport.setupMri();
        };
        AprilzeroAbout.prototype.cleanupChat = function() {
            $('#write_message').blur();
            return $('.chat').removeClass('opened');
        };
        AprilzeroAbout.prototype.bindEvents = function() {
            $(document).on('click', '.chat .head', (function(_this) {
                return function(e) {
                    var chat;
                    e.preventDefault();
                    chat = $(e.currentTarget).parents('.chat');
                    chat.toggleClass('opened');
                    chat.removeClass('unread');
                    if (chat.hasClass('opened')) {
                        return $('#write_message').focus();
                    }
                };
            })(this));
            $(document).on('submit', '#write_message_form', (function(_this) {
                return function(e) {
                    var first_message, form;
                    e.preventDefault();
                    form = $(e.currentTarget);
                    _this.guestName = $('#write_message_form .name-field').val();
                    _this.guestEmail = $('#write_message_form .email-field').val();
                    if (form.hasClass('request-details') && _this.guestEmail && _this.guestName) {
                        first_message = true;
                        $('#write_message').focus();
                        form.removeClass('request-details');
                        $('.chat').removeClass('anonymous');
                    }
                    if ($('#write_message').val()) {
                        $.post(form.attr('action'), form.serialize(), function(data) {
                            _this.addMessage(data);
                            if (first_message) {
                                timeoutSet(900, function() {
                                    return _this.addMessage('Hello ' + _this.guestName + '!<br /><br />Your message has been sent.  You can keep typing here or send me an email at <a href="mailto:hi@aprilzero.com">hi@aprilzero.com</a>', true);
                                });
                            }
                            $('#write_message').focus();
                            if (_this.guestEmail && _this.guestEmail) {
                                $('#textarea-sizer').text('');
                                return $('#write_message').val('');
                            }
                        });
                    }
                    if (!(_this.guestName && _this.guestEmail)) {
                        $('#write_message_form').addClass('request-details');
                        return $('#write_message_name').focus();
                    }
                };
            })(this));
            $(document).on('keydown', '#write_message', (function(_this) {
                return function(e) {
                    if (e.which === 13) {
                        e.preventDefault();
                        $('#write_message_form').submit();
                    }
                    if (e.keyCode === 27) {
                        return _this.cleanupChat();
                    }
                };
            })(this));
            $(document).on('keyup', '#write_message', (function(_this) {
                return function(e) {
                    var val;
                    val = $('#write_message').val();
                    return $('#textarea-sizer').text(val);
                };
            })(this));
            return $(document).on('click', '#write_name_done', (function(_this) {
                return function(e) {
                    return $('#write_message_form').submit();
                };
            })(this));
        };
        AprilzeroAbout.prototype.addMessage = function(text, fromSite) {
            var mClass, message, messages;
            if (text) {
                if (fromSite) {
                    mClass = 'new message';
                } else {
                    mClass = 'new your message';
                }
                message = $('<div class="' + mClass + '">' + text + '</div>');
                messages = $('.conversation .messages');
                messages.append(message);
                messages.animate({scrollTop: messages.prop('scrollHeight') + 40}, 150);
                return timeoutSet(10, function() {
                    return message.removeClass('new');
                });
            }
        };
        AprilzeroAbout.prototype.parsePeople = function(people) {
            var classes, key, person, personInfo, value, _i, _len, _ref, _results;
            _results = [];
            for (_i = 0, _len = people.length; _i < _len; _i++) {
                person = people[_i];
                console.log;
                classes = 'basic';
                if (person[1] !== null) {
                    classes = 'detailed';
                    if (person[1].twitter && person[1].twitter.followers > 1000) {
                        classes += ' popular';
                    }
                }
                personInfo = '<div class="person ' + classes + '">';
                personInfo += '<span class="email-address">' + person[0] + '</span>';
                if (person[1] !== null) {
                    personInfo += '<div class="info">';
                    _ref = person[1];
                    for (key in _ref) {
                        value = _ref[key];
                        if (key === 'twitter' && value) {
                            personInfo += '<a class="twitter" href="http://twitter.com/' + value.handle + '"><span class="avatar"><img src="' + value.avatar + '" /></span><span class="followers">' + numberWithCommas(value.followers || 0) + ' followers</span></a>';
                        }
                    }
                    personInfo += '</div>';
                }
                personInfo += '</div>';
                _results.push($('#people-json-parse').append(personInfo));
            }
            return _results;
        };
        return AprilzeroAbout;
    })();
    window.Aprilzero = (function() {
        function Aprilzero() {
        }
        Aprilzero.prototype.init = function() {
            aprilzero.loading = new AprilzeroLoading;
            aprilzero.home = new AprilzeroHome;
            aprilzero.explorer = new AprilzeroExplorer;
            aprilzero.sport = new AprilzeroSport;
            aprilzero.journal = new AprilzeroJournal;
            aprilzero.about = new AprilzeroAbout;
            return aprilzero.mood = new AprilzeroMood;
        };
        Aprilzero.prototype.createMap = function(map_style, points, map_id, line_color, bottom_padding) {
            var bounds, bounds_options, line, line_options, map, map_options, total_length;
            bottom_padding = bottom_padding || 0;
            line_color = line_color || '#444';
            line_options = {color: line_color,smoothFactor: 1.1,weight: 4,opacity: 1,fillOpacity: 1,lineCap: 'round'};
            map_options = {dragging: false,touchZoom: false,scrollWheelZoom: false,doubleClickZoom: false,boxZoom: false,tap: false,zoomControl: false,attributionControl: false,paddingBottomRight: [0, 20]};
            line = L.polyline(points, line_options);
            bounds = line.getBounds();
            bounds_options = {paddingTopLeft: [20, 20],paddingBottomRight: [20, bottom_padding]};
            map = L.mapbox.map(map_id, map_style, map_options).fitBounds(bounds, bounds_options);
            line.addTo(map);
            total_length = line._path.getTotalLength();
            $(line._path).css({'stroke-dasharray': total_length + 10,'stroke-dashoffset': total_length + 10});
            timeoutSet(30, function() {
                return $('#' + map_id).addClass('showing');
            });
            return map;
        };
        return Aprilzero;
    })();
    window.AprilzeroExplorer = (function() {
        function AprilzeroExplorer() {
            this.bindEvents();
            this.scrollLock = true;
        }
        AprilzeroExplorer.prototype.init = function() {
            this.unlockScrolling();
            this.incrementSeconds();
            this.dayOpened = false;
            return this.plotPoint($('.map-container .blip'));
        };
        AprilzeroExplorer.prototype.initMonth = function() {
            this.delayHexes();
            return window.scrollTo(0, 0);
        };
        AprilzeroExplorer.prototype.initDay = function(day) {
            if ($('html').hasClass('browser-firefox')) {
                this.initMonth();
                $('body').removeClass('day quickload').addClass('month');
                return false;
            }
            if (aprilzero.loading.isMobile) {
                $('body').removeClass('quickload day').addClass('month');
                this.jumpToDay(day);
                return;
            }
            window.scrollTo(0, 0);
            $('body').addClass('quickload scrollable').removeClass('intro');
            this.delayHexes();
            this.scrollToAndOpen(day, true);
            return this.analyzeScrollDepth();
        };
        AprilzeroExplorer.prototype.delayHexes = function() {
            var honeycomb;
            honeycomb = $('#page .honeycomb');
            return $('.jitter', honeycomb).each((function(_this) {
                return function(n, el) {
                    return $(el).attr('style', '-webkit-animation-delay:' + parseInt(Math.random() * 2000) + 'ms;');
                };
            })(this));
        };
        AprilzeroExplorer.prototype.incrementSeconds = function() {
            var el, increment_interval;
            el = $('.incrementable-seconds');
            this.seconds = this.seconds || parseInt(el.data('seconds'));
            increment_interval = intervalSet(40, (function(_this) {
                return function() {
                    el.text(numberWithCommas(_this.seconds));
                    return _this.seconds = (parseFloat(_this.seconds) + 0.04).toFixed(2);
                };
            })(this));
            return aprilzero.loading.intervals.push(increment_interval);
        };
        AprilzeroExplorer.prototype.plotPoint = function(el, size) {
            var coords, latitude, longitude;
            size = size || 'large';
            latitude = el.data('latitude');
            longitude = el.data('longitude');
            coords = this.getMapProjection(size)([longitude, latitude]);
            el.css({left: parseInt(coords[0]),top: parseInt(coords[1])}).addClass('positioned');
            return timeoutSet(450, function() {
                return el.addClass('showing');
            });
        };
        AprilzeroExplorer.prototype.getMapProjection = function(size) {
            var height, projection, translation, width;
            if (size === 'small') {
                width = 240;
                height = 160;
                translation = 1.4;
            } else {
                width = 700;
                height = 320;
                translation = 1;
            }
            return projection = d3.geo.mercator().scale((width + 1) / 2 / Math.PI).translate([width / 2, translation * height / 2]).precision(.1);
        };
        AprilzeroExplorer.prototype.activateDay = function(day) {
            var absDistance, clone, moveUpDistance, scrolledDistance, url;
            if ($('html').hasClass('browser-firefox')) {
                return false;
            }
            if (aprilzero.loading.isMobile) {
                return;
            }
            clearTimeout(this.deactivationTimeout);
            clearTimeout(this.rescrollability);
            clearTimeout(this.delayedL2LoadTimeout);
            clearTimeout(this.showCommitsTimeout);
            this.dayOpened = true;
            $('body').removeClass('scrollable animating show-commits');
            this.activeDayTop = day.position().top;
            scrolledDistance = $('body').scrollTop();
            absDistance = day.offset().top;
            clone = day.clone().removeClass('activated').css('top', this.activeDayTop).appendTo('.days-cloned');
            day.addClass('activated');
            $('.l2').toggleClass('first-day', day.hasClass('first-day'));
            $('.l2').toggleClass('last-day', day.hasClass('last-day'));
            moveUpDistance = scrolledDistance - absDistance + 120;
            this.activeDayMoved = moveUpDistance;
            console.log(moveUpDistance, this.activeDayMoved);
            day.prev().addClass('move-up').css({'-webkit-transform': 'translateY(' + this.activeDayMoved * 0.9 + 'px) translateZ(0)'});
            day.prev().prev().addClass('move-up').css({'-webkit-transform': 'translateY(' + this.activeDayMoved * 0.9 + 'px) translateZ(0)'});
            day.prev().prev().prev().addClass('move-up').css({'-webkit-transform': 'translateY(' + this.activeDayMoved * 0.9 + 'px) translateZ(0)'});
            day.prev().prev().prev().prev().addClass('move-up').css({'-webkit-transform': 'translateY(' + this.activeDayMoved * 0.9 + 'px) translateZ(0)'});
            day.prev().addClass('move-up').css({'transform': 'translateY(' + this.activeDayMoved * 0.9 + 'px) translateZ(0)'});
            day.prev().prev().addClass('move-up').css({'transform': 'translateY(' + this.activeDayMoved * 0.9 + 'px) translateZ(0)'});
            day.prev().prev().prev().addClass('move-up').css({'transform': 'translateY(' + this.activeDayMoved * 0.9 + 'px) translateZ(0)'});
            day.prev().prev().prev().prev().addClass('move-up').css({'transform': 'translateY(' + this.activeDayMoved * 0.9 + 'px) translateZ(0)'});
            day.next().addClass('move-down');
            day.next().next().addClass('move-down');
            day.next().next().next().addClass('move-down');
            day.next().next().next().next().addClass('move-down');
            url = day.find('.permalink').attr('href');
            timeoutSet(20, (function(_this) {
                return function() {
                    $('body').removeClass('moving').addClass('cloned');
                    clone.css({'-webkit-transform': 'translateY(' + _this.activeDayMoved + 'px) translateZ(0)','transform': 'translateY(' + _this.activeDayMoved + 'px) translateZ(0)'});
                    return window.history.replaceState({}, '', url);
                };
            })(this));
            this.showCommitsTimeout = timeoutSet(2300, function() {
                return $('body').addClass('show-commits');
            });
            return this.rescrollability = timeoutSet(2400, (function(_this) {
                return function() {
                    _this.lockScrollingAndBindDeactivation();
                    if (!_this.scrollLock) {
                        return $('body').addClass('scrollable');
                    }
                };
            })(this));
        };
        AprilzeroExplorer.prototype.deactivateDay = function(speed) {
            this.dayOpened = false;
            clearTimeout(this.deactivationTimeout);
            clearTimeout(this.delayedL2LoadTimeout);
            clearTimeout(this.showCommitsTimeout);
            speed = speed || 700;
            $('.days .day.move-up').attr('style', '').removeClass('move-up');
            $('.days .day.move-down').removeClass('move-down');
            $('.days .day.activated').addClass('returning').removeClass('activated');
            $('body').addClass('uncloning').removeClass('cloned').removeClass('quickload').removeClass('show-commits');
            return this.deactivationTimeout = timeoutSet(speed, (function(_this) {
                return function() {
                    return _this.deactivationCleanup();
                };
            })(this));
        };
        AprilzeroExplorer.prototype.deactivationCleanup = function() {
            this.unlockScrolling();
            $('.days-cloned').empty();
            $('body').removeClass('uncloning').addClass('animating scrollable');
            $('.days .day.returning').removeClass('returning');
            window.history.replaceState({}, '', '../');
            return this.dayOpened = false;
        };
        AprilzeroExplorer.prototype.analyzeScrollDepth = function() {
            $('body').toggleClass('scrolled-down', window.scrollY > 400);
            return $('body').toggleClass('scrolled-far', window.scrollY > 1000);
        };
        AprilzeroExplorer.prototype.bindEvents = function() {
            $(window).scroll($.throttle(300, (function(_this) {
                return function(e) {
                    return _this.analyzeScrollDepth();
                };
            })(this)));
            $(document).on('click', '.explorer-content .days .permalink', (function(_this) {
                return function(e) {
                    var day, href, l2_load_delay, link;
                    e.preventDefault();
                    link = $(e.currentTarget);
                    href = link.attr('href');
                    day = link.parents('.day')[0];
                    if (!$('body').hasClass('scrollable')) {
                        return;
                    }
                    if (!_this.dayOpened) {
                        _this.dayOpened = true;
                        $('body').removeClass('l2-loaded').addClass('moving scrolled-down');
                        _this.activateDay($(day));
                        l2_load_delay = 150;
                        l2_load_delay = 400;
                        return $('#page .l2').empty().load(href + ' #l2-details', function() {
                            return _this.delayedL2LoadTimeout = timeoutSet(l2_load_delay, function() {
                                return $('body').addClass('l2-loaded');
                            });
                        });
                    }
                };
            })(this));
            $(document).on('click', '.explorer-content .days-cloned .permalink', (function(_this) {
                return function(e) {
                    e.preventDefault();
                    return _this.deactivateDay();
                };
            })(this));
            $(document).on('click', '.l2 .close.switch-day', (function(_this) {
                return function(e) {
                    e.preventDefault();
                    return _this.deactivateDay();
                };
            })(this));
            $(document).on('click', '.close-active-day', (function(_this) {
                return function(e) {
                    e.preventDefault();
                    return _this.deactivateDay();
                };
            })(this));
            $(document).on('click', '.honeycomb .hex', (function(_this) {
                return function(e) {
                    var day_id, link;
                    e.preventDefault();
                    if (!$('body').hasClass('scrollable')) {
                        return;
                    }
                    if (!_this.dayOpened) {
                        clearTimeout(_this.deactivationTimeout);
                        clearTimeout(_this.rescrollability);
                        clearTimeout(_this.delayedL2LoadTimeout);
                        _this.dayOpened = true;
                        link = $(e.currentTarget);
                        day_id = link.attr('href');
                        return _this.scrollToAndOpen(day_id);
                    }
                };
            })(this));
            $(document).on('click', '.previous.switch-day', (function(_this) {
                return function(e) {
                    return _this.jumpDay(-1);
                };
            })(this));
            return $(document).on('click', '.next.switch-day', (function(_this) {
                return function(e) {
                    return _this.jumpDay(1);
                };
            })(this));
        };
        AprilzeroExplorer.prototype.jumpToDay = function(day_id) {
            var day, distance;
            day = $(day_id);
            distance = day.offset().top;
            return window.scrollTo(0, distance - 120);
        };
        AprilzeroExplorer.prototype.scrollToAndOpen = function(day_id, instant) {
            var day, distance, permalink, revealTimeout, scrollAnimationTime;
            if ($('html').hasClass('browser-firefox')) {
                return false;
            }
            if (aprilzero.loading.isMobile) {
                return;
            }
            instant = instant || false;
            day = $(day_id);
            distance = day.offset().top;
            permalink = day.find('.permalink').attr('href');
            if (instant) {
                $('body').addClass('quickload').removeClass('scrollable');
                timeoutSet(30, (function(_this) {
                    return function() {
                        distance = day.offset().top;
                        window.scrollTo(0, distance - 120);
                        return _this.activateDay(day);
                    };
                })(this));
                revealTimeout = 35;
            } else {
                scrollAnimationTime = parseInt(distance * 0.5);
                $('body').addClass('moving').removeClass('scrollable').stop().animate({scrollTop: distance - 120}, scrollAnimationTime);
                revealTimeout = scrollAnimationTime + 100;
                timeoutSet(revealTimeout, (function(_this) {
                    return function() {
                        return _this.activateDay(day);
                    };
                })(this));
            }
            $('#page .l2').empty().load(permalink + ' #l2-details', function() {
                return timeoutSet(revealTimeout + 100, function() {
                    return $('body').addClass('l2-loaded');
                });
            });
            return timeoutSet(6000, function() {
                return $('body').removeClass('quickload');
            });
        };
        AprilzeroExplorer.prototype.jumpDay = function(jump) {
            var allowed_dump_time, clone, clones, day, direction, distance, href, moveUpDistance, scrolledDistance, startedAt, targetDay;
            clearTimeout(this.dumpingL2Timeout);
            clearTimeout(this.loadNewL2Details);
            clearTimeout(this.newL2Timeout);
            clearTimeout(this.dumpingTimeout);
            clearTimeout(this.clearableL2Dump);
            if (jump < 0) {
                targetDay = $('.days .day.activated').prev();
                direction = 'up';
            } else {
                targetDay = $('.days .day.activated').next();
                direction = 'down';
            }
            if (!targetDay.length) {
                return;
            }
            day = $(targetDay);
            distance = day.offset().top;
            href = day.find('.permalink').attr('href');
            $('.days .day.move-up').attr('style', '').removeClass('move-up');
            $('.days .day.move-down').removeClass('move-down');
            $('.days .day.activated').addClass('returning').removeClass('activated');
            scrolledDistance = $('body').scrollTop() + (154 * jump);
            this.activeDayTop = this.activeDayTop + (154 * jump);
            window.scrollTo(0, scrolledDistance);
            day.addClass('activated');
            $('.l2').toggleClass('first-day', day.hasClass('first-day'));
            $('.l2').toggleClass('last-day', day.hasClass('last-day'));
            moveUpDistance = this.activeDayMoved;
            day.prev().addClass('move-up').css({'-webkit-transform': 'translateY(' + moveUpDistance + 'px)'});
            day.prev().prev().addClass('move-up').css({'-webkit-transform': 'translateY(' + moveUpDistance + 'px)'});
            day.prev().prev().prev().addClass('move-up').css({'-webkit-transform': 'translateY(' + moveUpDistance + 'px)'});
            day.prev().addClass('move-up').css({'transform': 'translateY(' + moveUpDistance + 'px)'});
            day.prev().prev().addClass('move-up').css({'transform': 'translateY(' + moveUpDistance + 'px)'});
            day.prev().prev().prev().addClass('move-up').css({'transform': 'translateY(' + moveUpDistance + 'px)'});
            day.next().addClass('move-down');
            day.next().next().addClass('move-down');
            day.next().next().next().addClass('move-down');
            day.next().next().next().next().addClass('move-down');
            clones = $('.days-cloned').empty();
            clone = day.clone().removeClass('activated').css('-webkit-transform', 'translateY(' + moveUpDistance + 'px)').css('top', this.activeDayTop).appendTo(clones);
            $('body').removeClass('l2-dump dump-up dump-down reload-l2 load-from-up load-from-down show-commits');
            this.dumpingTimeout = timeoutSet(50, (function(_this) {
                return function() {
                    return _this.dumpL2(direction);
                };
            })(this));
            allowed_dump_time = 600;
            startedAt = new Date();
            return this.loadNewL2Details = timeoutSet(100, (function(_this) {
                return function() {
                    window.history.replaceState({}, '', href);
                    return $('<div />').load(href, function(response) {
                        return _this.loadNewL2(response, direction, startedAt, allowed_dump_time);
                    });
                };
            })(this));
        };
        AprilzeroExplorer.prototype.dumpL2 = function(direction) {
            return this.clearableL2Dump = timeoutSet(10, function() {
                $('body').addClass('l2-dump dump-' + direction);
                return this.dumpingL2Timeout = timeoutSet(400, function() {
                    $('#l2-details .l2-content').remove();
                    $('#l2-details .backdrop').remove();
                    return $('body').removeClass('l2-loaded');
                });
            });
        };
        AprilzeroExplorer.prototype.loadNewL2 = function(response, direction, startedAt, needToWait) {
            var contents, timeElapsed;
            clearTimeout(this.dumpingL2Timeout);
            clearTimeout(this.showCommitsTimeout);
            contents = $(response);
            timeElapsed = new Date() - startedAt;
            if (timeElapsed > needToWait) {
                return this.insertNewL2Details(contents, direction);
            } else {
                return this.newL2Timeout = timeoutSet(needToWait - timeElapsed, (function(_this) {
                    return function() {
                        return _this.insertNewL2Details(contents, direction);
                    };
                })(this));
            }
        };
        AprilzeroExplorer.prototype.insertNewL2Details = function(contents, direction) {
            var destination, newBackdrop, newContent;
            destination = $('#l2-details');
            newBackdrop = contents.find('.backdrop').addClass('new from-' + direction);
            newContent = contents.find('.l2-content').addClass('new');
            destination.append(newBackdrop);
            destination.append(newContent);
            timeoutSet(10, function() {
                return $('body').addClass('l2-loaded');
            });
            timeoutSet(20, function() {
                return $('body').removeClass('l2-dump dump-up dump-down');
            });
            return this.showCommitsTimeout = timeoutSet(1000, function() {
                return $('body').addClass('show-commits');
            });
        };
        AprilzeroExplorer.prototype.lockScrollingAndBindDeactivation = function() {
            $(window).on('mousewheel', (function(_this) {
                return function(e) {
                    e.preventDefault();
                    if (_this.dayOpened) {
                        return _this.deactivateDay();
                    }
                };
            })(this));
            return $(window).on('keydown', (function(_this) {
                return function(e) {
                    if (e.which === 40 || e.which === 39 || e.which === 32) {
                        e.preventDefault();
                        $('body').addClass('keypressed-down').removeClass('keypressed-up');
                        _this.kpDownTimeout = timeoutSet(220, function() {
                            return $('body').removeClass('keypressed-down');
                        });
                        return _this.jumpDay(1);
                    } else if (e.which === 38 || e.which === 37) {
                        e.preventDefault();
                        $('body').addClass('keypressed-up').removeClass('keypressed-down');
                        _this.kpUpTimeout = timeoutSet(220, function() {
                            return $('body').removeClass('keypressed-up');
                        });
                        return _this.jumpDay(-1);
                    } else if (e.which === 27) {
                        return _this.deactivateDay();
                    }
                };
            })(this));
        };
        AprilzeroExplorer.prototype.unlockScrolling = function() {
            $(window).unbind('mousewheel');
            return $(window).unbind('keydown');
        };
        return AprilzeroExplorer;
    })();
    window.timeoutSet = function(time, fn) {
        return setTimeout(fn, time);
    };
    window.intervalSet = function(time, fn) {
        return setInterval(fn, time);
    };
    window.numberWithCommas = function(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    window.incrementFromZero = function(selector, decimals, speed, overshoot, commas) {
        var destination, element, incrementing, value, valueIncrement;
        commas = commas || false;
        element = selector.first().addClass('processed');
        element.css('width', element.width());
        destination = element.text().replace(',', '');
        value = 0.0;
        valueIncrement = 0.1;
        if (destination > 15) {
            value = 11;
            valueIncrement = 0.42;
        }
        if (destination > 40) {
            value = 40;
            valueIncrement = 1.5;
            if (speed === 'slow') {
                value = 43;
                valueIncrement = 0.93;
            }
        }
        if (destination > 100) {
            value = 63;
            valueIncrement = 7.3;
        }
        if (destination > 300) {
            value = 60;
            valueIncrement = 63;
        }
        if (destination > 4000) {
            value = 3;
            valueIncrement = 5.3;
        }
        if (destination > 10000) {
            value = 6;
            valueIncrement = 137.3;
        }
        return incrementing = intervalSet(20, function() {
            if (value >= destination) {
                clearInterval(incrementing);
                if (commas) {
                    return element.text(numberWithCommas(destination));
                } else {
                    return element.text(destination);
                }
            } else {
                if (destination > 4000) {
                    value = (value + valueIncrement) * 1.73;
                    return element.text(Math.floor(value));
                } else {
                    value += valueIncrement;
                    if (decimals) {
                        return element.text(value.toFixed(decimals));
                    } else {
                        if (commas) {
                            return element.text(numberWithCommas(Math.floor(value)));
                        } else {
                            return element.text(Math.floor(value));
                        }
                    }
                }
            }
        });
    };
    window.padWithZeros = function(n, digits) {
        n = n + '';
        if (n.length >= digits) {
            return n;
        } else {
            return new Array(digits - n.length + 1).join('0') + n;
        }
    };
    window.AprilzeroHome = (function() {
        function AprilzeroHome() {
            this.bindSpinner();
            this.bindTouch();
            this.previewing = 'sport';
        }
        AprilzeroHome.prototype.init = function() {
            this.ageRunning = false;
            this.touchLocked = false;
            this.clearTimeouts();
            aprilzero.explorer.plotPoint($('.map-container .blip'), 'small');
            return this.createRunMap();
        };
        AprilzeroHome.prototype.preload = function() {
            this.switchHomePreviewTo('sport');
            return this.clearTimeouts();
        };
        AprilzeroHome.prototype.clearTimeouts = function() {
            clearTimeout(this.hrIncrement);
            clearTimeout(this.hrDecrement1);
            return clearTimeout(this.hrDecrement2);
        };
        AprilzeroHome.prototype.createRunMap = function() {
            var map_style, points;
            map_style = false;
            map_style = 'aprilzero.iiok8dn4';
            points = eval($('.raw-points').first().text());
            return aprilzero.createMap(map_style, points, 'homepage-run-map', '#00aeef', 90);
        };
        AprilzeroHome.prototype.bindSpinner = function() {
            $(document).on('mouseenter', '.sections-nav a', (function(_this) {
                return function(e) {
                    var section, url;
                    url = $(e.currentTarget).attr('href');
                    section = url.replace('/', '').replace('/', '');
                    if (section === _this.previewing) {
                        return;
                    }
                    return _this.switchHomePreviewTo(section);
                };
            })(this));
            $(document).on('click', '.full-preview', (function(_this) {
                return function(e) {
                    var link, section;
                    e.preventDefault();
                    link = $(e.currentTarget);
                    section = link.data('section');
                    if (section === _this.previewing) {
                        aprilzero.loading.readyToSwitch = false;
                        return aprilzero.loading.delayedGoTo(link.attr('href'), link.data('section'), link.data('level'));
                    } else {
                        return _this.switchHomePreviewTo(section);
                    }
                };
            })(this));
            $(document).on('mouseenter', '.full-preview', (function(_this) {
                return function(e) {
                    var section, url;
                    e.preventDefault();
                    url = $(e.currentTarget).attr('href');
                    section = url.replace('/', '').replace('/', '');
                    return _this.switchHomeHoverTo(section);
                };
            })(this));
            return $(document).on('mouseleave', '.full-preview', (function(_this) {
                return function(e) {
                    return _this.switchHomeHoverTo(false);
                };
            })(this));
        };
        AprilzeroHome.prototype.bindTouch = function() {
        };
        AprilzeroHome.prototype.switchHomePreviewTo = function(section) {
            this.previewing = section;
            return $('body').removeClass('preview-sport preview-explorer preview-journal intro').removeClass('hover-sport hover-explorer hover-journal').addClass('preview-' + section);
        };
        AprilzeroHome.prototype.switchHomeHoverTo = function(section) {
            var body;
            body = $('body').removeClass('hover-sport hover-explorer hover-journal');
            if (section) {
                return body.addClass('hover-' + section);
            }
        };
        AprilzeroHome.prototype.getMapProjection = function() {
            var height, projection, translation, width;
            width = 240;
            height = 160;
            translation = 1.4;
            return projection = d3.geo.mercator().scale((width + 1) / 2 / Math.PI).translate([width / 2, translation * height / 2]).precision(.1);
        };
        return AprilzeroHome;
    })();
    window.AprilzeroJournal = (function() {
        function AprilzeroJournal() {
        }
        AprilzeroJournal.prototype.init = function() {
            return $('#page').append('<script async src="//platform.twitter.com/widgets.js" charset="utf-8" />');
        };
        return AprilzeroJournal;
    })();
    window.AprilzeroLoading = (function() {
        function AprilzeroLoading() {
            $.pjax.defaults.scrollTo = false;
            this.bindPjaxEvents();
            this.bindLoadEvents();
            this.bindHistoryEvents();
            this.bindResizeEvents();
            this.introLastsFor = 1950;
            this.subIntroLastsFor = 1200;
            this.animationsStartAfter = 1650;
            this.leavingDuration = 400;
            this.subLeavingDuration = 400;
            this.timeUntilScrollable = 800;
            this.timeUntilScrollable = 1100;
            this.mobileWidthThreshold = 600;
            this.timeYThreshold = 550;
            this.intervals = [];
            this.timeouts = [];
            this.currentSection = '';
            this.currentPage = '';
            this.currentLevel = 0;
            this.cachedPages = {};
        }
        AprilzeroLoading.prototype.firstLoad = function() {
            this.phase1();
            return timeoutSet(5, (function(_this) {
                return function() {
                    return _this.startCascade();
                };
            })(this));
        };
        AprilzeroLoading.prototype.phase1 = function() {
            return this.setUAClasses();
        };
        AprilzeroLoading.prototype.phase2 = function() {
            var el, pageClass;
            el = $('#page .body-class-level-2').first();
            if (el.length !== 1) {
                el = $('#page .body-class-level-1').first();
            }
            if (el.length !== 1) {
                el = $('#page .body-class').first();
            }
            pageClass = el.val();
            this.previousSection = this.currentSection;
            this.previousPage = this.currentPage;
            this.previousLevel = this.currentLevel;
            this.currentSection = el.data('section');
            this.currentPage = el.data('page');
            this.currentLevel = el.data('level');
            $('body').removeClass('no-js leaving switching-page');
            $('body').addClass(pageClass + ' level-' + this.currentLevel);
            this.initializePage(this.currentSection, this.currentPage, true);
            return console.log('phase2', $('body').attr('class'));
        };
        AprilzeroLoading.prototype.phase3 = function() {
            $('body').removeClass('unloaded');
            $('body').addClass('intro loaded');
            this.initializePage(this.currentSection, this.currentPage);
            return this.cachedPages[window.location.pathname] = $('#page').html();
        };
        AprilzeroLoading.prototype.phase4 = function() {
            return $('body').removeClass('intro going-out going-in');
        };
        AprilzeroLoading.prototype.phase5 = function() {
            return $('body').addClass('animating');
        };
        AprilzeroLoading.prototype.startCascade = function(depth) {
            this.clearTimeouts();
            depth = depth || 0;
            this.phase2();
            this.phase3Timeout = timeoutSet(20, (function(_this) {
                return function() {
                    return _this.phase3();
                };
            })(this));
            this.phase4Timeout = timeoutSet((depth ? this.subIntroLastsFor : this.introLastsFor), (function(_this) {
                return function() {
                    return _this.phase4();
                };
            })(this));
            this.phase5Timeout = timeoutSet(this.animationsStartAfter, (function(_this) {
                return function() {
                    return _this.phase5();
                };
            })(this));
            return this.scrollableTimeout = timeoutSet(this.timeUntilScrollable, function() {
                return $('body').addClass('scrollable');
            });
        };
        AprilzeroLoading.prototype.abortLoad = function() {
            return this.clearTimeouts();
        };
        AprilzeroLoading.prototype.clearTimeouts = function() {
            var interval, timeout, _i, _j, _len, _len1, _ref, _ref1;
            _ref = this.intervals;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                interval = _ref[_i];
                clearInterval(interval);
            }
            _ref1 = this.timeouts;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                timeout = _ref1[_j];
                clearTimeout(timeout);
            }
            clearTimeout(this.delayedLoad);
            clearInterval(this.switchInterval);
            clearTimeout(this.phase3Timeout);
            clearTimeout(this.phase4Timeout);
            clearTimeout(this.phase5Timeout);
            clearTimeout(this.scrollableTimeout);
            this.intervals = [];
            return this.timeouts = [];
        };
        AprilzeroLoading.prototype.triggerResizeSwitch = function() {
            this.resetUAClasses();
            return this.setUAClasses();
        };
        AprilzeroLoading.prototype.unsetBodyClasses = function(extra) {
            if (extra == null) {
                extra = '';
            }
            $('body').attr('class', extra + ' unloaded leaving preview-' + aprilzero.home.previewing);
            return timeoutSet(15, function() {
                return aprilzero.about.cleanupChat();
            });
        };
        AprilzeroLoading.prototype.lightlyUnsetBodyClasses = function(section, depth) {
            var direction;
            direction = 'same-level';
            if (this.currentLevel > depth) {
                direction = 'going-out';
            } else if (this.currentLevel < depth) {
                direction = 'going-in';
            }
            console.log(this.currentLevel, 'to', depth, direction);
            $('body').attr('class', section + ' unloaded switching-page ' + direction);
            return console.log('lightlyUnset', $('body').attr('class'));
        };
        AprilzeroLoading.prototype.resetUAClasses = function() {
            return $('html, #device-info').removeClass('touch cursor mobile desktop time-x time-y');
        };
        AprilzeroLoading.prototype.setUAClasses = function(classes) {
            classes = classes || this.getUAClasses();
            return $('html, #device-info').attr('class', classes);
        };
        AprilzeroLoading.prototype.getUAClasses = function() {
            var classes, sizeClasses;
            sizeClasses = this.updateSizeClasses();
            classes = 'detected ' + $('html').data('ua');
            classes += window.hasOwnProperty('ontouchstart') ? ' touch' : ' cursor';
            return classes += ' ' + sizeClasses;
        };
        AprilzeroLoading.prototype.updateSizeClasses = function() {
            return this.currentSizeClasses = this.getSizeClasses();
        };
        AprilzeroLoading.prototype.getSizeClasses = function() {
            var classes, width;
            width = $(window).width();
            if (width < this.mobileWidthThreshold) {
                classes = 'mobile';
                this.isMobile = true;
            } else {
                classes = 'desktop';
                this.isMobile = false;
            }
            return classes += ' ' + this.getTimeOrientationClasses(width);
        };
        AprilzeroLoading.prototype.getTimeOrientationClasses = function(width) {
            width = width || $(window).width();
            if (width < this.timeYThreshold) {
                aprilzero.timeDirection = 'y';
                return 'time-y';
            } else {
                aprilzero.timeDirection = 'x';
                return 'time-x';
            }
        };
        AprilzeroLoading.prototype.bindLoadEvents = function() {
            return $(document).on('ready', (function(_this) {
                return function() {
                    return _this.firstLoad();
                };
            })(this));
        };
        AprilzeroLoading.prototype.bindHistoryEvents = function() {
            return $(window).on('pjax:popstate', (function(_this) {
                return function() {
                    _this.unsetBodyClasses();
                    return timeoutSet(50, function() {
                        return _this.goBack();
                    });
                };
            })(this));
        };
        AprilzeroLoading.prototype.bindPjaxEvents = function() {
            this.readyToSwitch = true;
            $(document).on('click', 'a.pjax', (function(_this) {
                return function(e) {
                    var link;
                    e.preventDefault();
                    link = $(e.currentTarget);
                    _this.readyToSwitch = false;
                    return _this.delayedGoTo(link.attr('href'), link.data('section'), link.data('level'));
                };
            })(this));
            return $(document).on('pjax:complete', (function(_this) {
                return function() {
                    return _this.readyToSwitch = true;
                };
            })(this));
        };
        AprilzeroLoading.prototype.bindResizeEvents = function() {
            $(window).resize($.debounce(150, true, (function(_this) {
                return function() {
                    if (_this.orientationChanged) {
                        return;
                    }
                    $('body').addClass('resizing');
                    if (!(_this.getSizeClasses() === _this.currentSizeClasses)) {
                        return _this.triggerResizeSwitch();
                    }
                };
            })(this)));
            $(window).resize($.debounce(300, false, (function(_this) {
                return function() {
                    if (_this.orientationChanged) {
                        return;
                    }
                    $('body').removeClass('resizing');
                    if (!(_this.getSizeClasses() === _this.currentSizeClasses)) {
                        return _this.triggerResizeSwitch();
                    }
                };
            })(this)));
            return $(window).on('orientationchange', (function(_this) {
                return function(e) {
                    _this.orientationChanged = true;
                    window.scrollTo(0, 0);
                    return timeoutSet(200, function() {
                        return _this.orientationChanged = false;
                    });
                };
            })(this));
        };
        AprilzeroLoading.prototype.delayedGoTo = function(url, section, depth, skipCascade) {
            if (skipCascade == null) {
                skipCascade = false;
            }
            this.clearTimeouts();
            if (section === this.currentSection) {
                if (!skipCascade) {
                    this.lightlyUnsetBodyClasses(section, depth);
                }
                if (depth === 2) {
                    $.pjax({url: url,container: '#l2-cache',fragment: '.l2',timeout: 5000});
                    return this.delayedLoad = timeoutSet(this.subLeavingDuration, (function(_this) {
                        return function() {
                            return _this.switchInterval = intervalSet(25, function() {
                                return _this.tryUncache(2, skipCascade);
                            });
                        };
                    })(this));
                } else {
                    $.pjax({url: url,container: '#l1-cache',fragment: '.l1',timeout: 5000});
                    return this.delayedLoad = timeoutSet(this.subLeavingDuration, (function(_this) {
                        return function() {
                            return _this.switchInterval = intervalSet(25, function() {
                                return _this.tryUncache(1);
                            });
                        };
                    })(this));
                }
            } else {
                this.unsetBodyClasses();
                $.pjax({url: url,container: '#page-cache',timeout: 5000});
                return this.delayedLoad = timeoutSet(this.leavingDuration, (function(_this) {
                    return function() {
                        return _this.switchInterval = intervalSet(25, function() {
                            return _this.tryUncache();
                        });
                    };
                })(this));
            }
        };
        AprilzeroLoading.prototype.tryUncache = function(depth, skipCascade) {
            if (depth == null) {
                depth = 0;
            }
            if (skipCascade == null) {
                skipCascade = false;
            }
            if (this.readyToSwitch === true) {
                if (depth === 1) {
                    this.uncacheLevel1(depth);
                } else if (depth === 2) {
                    this.uncacheLevel2(skipCascade);
                } else {
                    this.uncache();
                }
                return clearInterval(this.switchInterval);
            }
        };
        AprilzeroLoading.prototype.uncache = function() {
            var cache;
            cache = $('#page-cache').html();
            $('#page').empty().html(cache);
            $('body').removeClass('leaving switching-page switching-subpage');
            return timeoutSet(5, (function(_this) {
                return function() {
                    return _this.startCascade();
                };
            })(this));
        };
        AprilzeroLoading.prototype.uncacheLevel1 = function(depth) {
            var cache;
            cache = $('#l1-cache').html();
            $('.l1').empty().html(cache);
            $('body').removeClass('leaving switching-page switching-subpage');
            return timeoutSet(5, (function(_this) {
                return function() {
                    return _this.startCascade(depth);
                };
            })(this));
        };
        AprilzeroLoading.prototype.uncacheLevel2 = function(skipCascade) {
            var cache;
            cache = $('#l2-cache').html();
            $('.l2').empty().html(cache);
            $('body').removeClass('leaving switching-page switching-subpage');
            return timeoutSet(5, (function(_this) {
                return function() {
                    if (!skipCascade) {
                        return _this.startCascade(2);
                    }
                };
            })(this));
        };
        AprilzeroLoading.prototype.goBack = function() {
            var cachedPage;
            cachedPage = this.cachedPages[window.location.pathname];
            if (cachedPage) {
                $('#page').html(cachedPage);
                $('body').removeClass('leaving level-0 level-1 level-2 switching-page switching-subpage');
                return timeoutSet(5, (function(_this) {
                    return function() {
                        return _this.startCascade(_this.previousLevel);
                    };
                })(this));
            } else {
                return window.location.replace(window.location.toString());
            }
        };
        AprilzeroLoading.prototype.initializePage = function(section, page, preload) {
            var day, url;
            if (section === 'home') {
                if (preload) {
                    aprilzero.home.preload();
                } else {
                    aprilzero.home.init();
                }
            } else if (section === 'sport') {
                if (!preload) {
                    aprilzero.sport.init();
                }
            } else if (section === 'explorer') {
                if (!preload) {
                    aprilzero.explorer.init();
                }
                if (!preload && page === 'month') {
                    aprilzero.explorer.initMonth();
                } else if (!preload && page === 'day quickload') {
                    url = location.pathname.split('/');
                    day = url[url.length - 2];
                    aprilzero.explorer.initDay('#day-' + day);
                }
            } else if (section === 'journal') {
                if (!preload) {
                    aprilzero.journal.init();
                }
            } else if (section === 'about') {
                aprilzero.about.init();
            } else if (section === 'mood') {
                aprilzero.mood.init();
            }
            if (section !== 'sport') {
                return aprilzero.sport.cleanup();
            }
        };
        return AprilzeroLoading;
    })();
    window.AprilzeroMood = (function() {
        function AprilzeroMood() {
        }
        AprilzeroMood.prototype.init = function() {
            return this.bindEvents();
        };
        AprilzeroMood.prototype.bindEvents = function() {
            if ($('#id_comfort').val() < 6) {
                $('body').addClass('uncomfortable');
            }
            return $('#page').on('change', '.mood-range-slider input', (function(_this) {
                return function(e) {
                    var amount, input, label, value;
                    input = $(e.currentTarget);
                    label = input.parents('label');
                    amount = input.val();
                    value = $('.value', label);
                    value.text(amount);
                    if (input.attr('name') === 'comfort') {
                        if (amount < 6) {
                            return $('body').addClass('uncomfortable');
                        } else {
                            return $('body').removeClass('uncomfortable');
                        }
                    }
                };
            })(this));
        };
        return AprilzeroMood;
    })();
    window.AprilzeroSport = (function() {
        function AprilzeroSport() {
            this.bindEvents();
            this.sportTimeouts = [];
            this.sportIntervals = [];
        }
        AprilzeroSport.prototype.init = function() {
            this.sportTimeouts.push(timeoutSet(350, (function(_this) {
                return function() {
                    return _this.incrementStats();
                };
            })(this)));
            this.sportTimeouts.push(timeoutSet(600, (function(_this) {
                return function() {
                    return _this.createMap();
                };
            })(this)));
            return this.setupMri();
        };
        AprilzeroSport.prototype.bindEvents = function() {
            $(document).on('touchstart', '.mri', (function(_this) {
                return function(e) {
                    if (_this.touchLocked) {
                        return;
                    }
                    $('body').addClass('touching-mri');
                    _this.touchLocked = true;
                    return false;
                };
            })(this));
            $(document).on('touchend', '.mri', (function(_this) {
                return function(e) {
                    timeoutSet(10, function() {
                        return $('body').removeClass('touching-mri');
                    });
                    return _this.touchLocked = false;
                };
            })(this));
            $(document).on('webkitAnimationEnd', '.mri .blip', (function(_this) {
                return function(e) {
                    return _this.loopScanAnimation();
                };
            })(this));
            $(document).on('click', '.switch-focus', (function(_this) {
                return function(e) {
                    var target;
                    e.preventDefault();
                    target = $(e.currentTarget).attr('href').replace('#', '');
                    return _this.switchFocus(target);
                };
            })(this));
            $(document).on('click', '.back-to-sport', (function(_this) {
                return function(e) {
                    e.preventDefault();
                    return _this.removeFocus();
                };
            })(this));
            return $(document).on('click', '.run .go-to-day', (function(_this) {
                return function(e) {
                    var link;
                    e.preventDefault();
                    if (aprilzero.loading.isMobile) {
                        return false;
                    } else {
                        link = $(e.currentTarget);
                        aprilzero.loading.readyToSwitch = false;
                        return aprilzero.loading.delayedGoTo(link.attr('href'), link.data('section'), link.data('level'));
                    }
                };
            })(this));
        };
        AprilzeroSport.prototype.switchFocus = function(subsection) {
            $('body').removeClass('loaded').addClass('leaving');
            return timeoutSet(350, (function(_this) {
                return function() {
                    $('body').removeClass('leaving').addClass('focus focus-' + subsection);
                    return timeoutSet(20, function() {
                        return $('body').addClass('loaded');
                    });
                };
            })(this));
        };
        AprilzeroSport.prototype.removeFocus = function() {
            $('body').removeClass('loaded').addClass('leaving');
            return timeoutSet(350, function() {
                $('body').removeClass('leaving').removeClass('focus focus-climbs focus-runs focus-walks');
                return timeoutSet(20, function() {
                    return $('body').addClass('loaded');
                });
            });
        };
        AprilzeroSport.prototype.setupMri = function() {
            return timeoutSet(2700, function() {
                return $('body').addClass('scan-faster');
            });
        };
        AprilzeroSport.prototype.loopScanAnimation = function() {
            $('.mri .blip').css({webkitAnimationName: 'none'});
            $('.mri .layer').css({webkitAnimationName: 'none'});
            return timeoutSet(8, function() {
                $('.mri .blip').css({webkitAnimationName: 'mri-blip'});
                $('.mri .layer.one').css({webkitAnimationName: 'mri-glow-1'});
                $('.mri .layer.two').css({webkitAnimationName: 'mri-glow-2'});
                $('.mri .layer.three').css({webkitAnimationName: 'mri-glow-3'});
                $('.mri .layer.four').css({webkitAnimationName: 'mri-glow-4'});
                return $('.mri .layer.five').css({webkitAnimationName: 'mri-glow-5'});
            });
        };
        AprilzeroSport.prototype.createMap = function(suffix) {
            var map_style, points;
            map_style = false;
            points = eval($('.raw-points').first().text());
            return this.map = aprilzero.createMap(map_style, points, 'latest-run-map', '#444');
        };
        AprilzeroSport.prototype.remakeMap = function() {
            $('#latest-run-map').remove();
            $('.latest.run-card').prepend('<div id="latest-run-map" class="run-map" />');
            return timeoutSet(10, (function(_this) {
                return function() {
                    return _this.createMap();
                };
            })(this));
        };
        AprilzeroSport.prototype.incrementStats = function() {
            if ($('html').hasClass('cursor')) {
                this.sportTimeouts.push(incrementFromZero($('.bpm-increment'), 0, 'fast', 2));
                this.sportTimeouts.push(incrementFromZero($('.weight-increment'), 1, 'fast', 0));
                this.sportTimeouts.push(incrementFromZero($('.bodyfat-increment'), 1, 'fast', 0));
                this.sportTimeouts.push(incrementFromZero($('.age-increment'), 0, 'fast', 0));
                this.sportTimeouts.push(incrementFromZero($('.age-decimal-increment'), 0, 'fast', 0));
                this.sportTimeouts.push(incrementFromZero($('.header-steps-increment'), 0, 'fast', 0, true));
                return this.sportTimeouts.push(timeoutSet(300, (function(_this) {
                    return function() {
                        var ageDecimals, decimalsPerSecond;
                        ageDecimals = $('#page .age-decimal-increment');
                        decimalsPerSecond = Math.pow(10, 9) / (365 * 24 * 60 * 60);
                        return _this.sportIntervals.push(intervalSet(70, function() {
                            return _this.updateAgeDecimals(ageDecimals, decimalsPerSecond);
                        }));
                    };
                })(this)));
            }
        };
        AprilzeroSport.prototype.updateAgeDecimals = function(element, decimalsPerSecond) {
            return element.html(parseInt(parseFloat(element.text()) + decimalsPerSecond * 0.07));
        };
        AprilzeroSport.prototype.cleanup = function() {
            var interval, timeout, _i, _j, _len, _len1, _ref, _ref1;
            _ref = this.sportIntervals;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                interval = _ref[_i];
                clearInterval(interval);
            }
            _ref1 = this.sportTimeouts;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                timeout = _ref1[_j];
                clearTimeout(timeout);
            }
            this.sportTimeouts = [];
            return this.sportIntervals = [];
        };
        return AprilzeroSport;
    })();
}).call(this);
