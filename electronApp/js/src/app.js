'use strict';

/* -------------------------------------------------------------------
Copyright (c) 2017-2017 Hexaware Technologies
This file is part of the Innovation LAB - Offline Bot.
------------------------------------------------------------------- */

define(['jquery', 'settings', 'apiService', 'utils'], function ($, config, apiService, utils) {
    $(function () {
        $("textarea#btn-input").val("Hi");
        setTimeout(() => {
            $("a#btn-send-message").click();
        }, 2000)
        /* Web Popup Adjustment header hiding */
        function adjustPopups() {
            let msgboxh = $("div.header-popup").next().height();
            let chath = $("div.header-popup").next().next().height();
            let typetext = $("div.header-popup").next().next().next().height();
            let bodyh = $("body").height();

            let finalcalc = bodyh - (chath + typetext);
            let finalcss = 'calc(100%-' + finalcalc + 'px)';
            $("div.chat-body").css('height', 'calc(' + finalcalc + 'px)');
        }
        //
        /*Query of when Web Popup=1 opens popup  window, hiding web headers*/
        let popup = window.location.search.substring(1).split("=");
        if (popup[1] == 1) {
            $("div.header-popup").addClass("hidden").slideUp("slow");
            adjustPopups();

        }
        else {
            $("div.header-popup").removeClass("hidden")
        }
        //Check if text contains emoji
        function checkEmoji(emo) {
            let emojientity = ['😄', '😉', '😋', '😍', '😢', '😠'];
            var strip_text = '';
            for (var emoj in emojientity) {

                if (emo.indexOf(emojientity[emoj]) !== -1 && emoj == 0) {
                    strip_text = emo.replace(emojientity[emoj], '');

                }
                else if (strip_text.indexOf(emojientity[emoj]) !== -1) {
                    strip_text = strip_text.replace(emojientity[emoj], '');

                }
            }
            return strip_text;
        }
        function sendMessage(refr, ev, textsm) {

            var text = refr.val() || textsm;
            if (text !== "") {
                refr.val('');
                refr.text('');
                //Calling ApiaiService call
                processor.askBot(checkEmoji(text) ? checkEmoji(text) : text, text, function (error, html) {
                    if (error) {
                        alert(error); //change into some inline fancy display, show error in chat window.
                    }
                    if (html) {
                        if (msg_container.hasClass('hidden')) { // can be optimimzed and removed from here
                            msg_container.siblings("h1").addClass('hidden');
                            msg_container.siblings("div.chat-text-para").addClass('hidden');
                            msg_container.siblings(".header-text-logo").removeClass('hidden');
                            msg_container.removeClass('hidden');
                        }
                        msg_container.append(html);
                        utils.scrollSmoothToBottom($('div.chat-body'));

                    }
                });
                ev.preventDefault();
            }
        }
        var chatKeyPressCount = 0;
        //Checking Source
        var isWeb = $('#webchat').context.URL;



        if (config.accessToken && config.chatServerURL) {
            var processor = apiService();
        }

        if (!processor) {
            throw new Error("Message processing manager is not defined!");
        }

        var msg_container = $("ul#msg_container");
        if (msg_container.find('li').length == 0) {
            msg_container.siblings("h1").removeClass('hidden');
            msg_container.siblings("div.chat-text-para").removeClass('hidden');
            msg_container.siblings(".header-text-logo").addClass('hidden');
        } else {
            msg_container.siblings("h1").addClass('hidden');
            msg_container.siblings(".chat-text-para").addClass('hidden');
            msg_container.siblings(".header-text-logo").removeClass('hidden');

        }
        $("a#btn-send-message").click(function (e) {
            sendMessage($("#btn-input"), e);
        });
        //Chatbox Send message
        $("textarea#btn-input").keypress(function (e) {
            if (e.which == 13) {
                if ($.trim($(this).val()) != "") {
                    sendMessage($(this), e);
                }
            }
        });
        //Quick Replies payload button Click
        $(document).on('click', '.QuickreplybtnPayload', function (e) {
            var textInput = $(this).text();
            var payloadInput = $(this).data().quickrepliespayload;
            processor.askBot(payloadInput, textInput, function (error, html) {
                if (error) {
                    console.log("error occured while processing your Request") //change into some inline fancy display, show error in chat window.
                }
                if (html) {
                    msg_container.append(html);
                    utils.scrollSmoothToBottom($('div.chat-body'));

                }
            });
            e.preventDefault();
        });
        //Card Response Postback button
        $(document).on('click', '.cardresponsepayload', function (e) {
            var textInput = $(this).text();
            var payloadInput = $(this).data().cardpayloadbutton;
            console.log('Button Payload' + payloadInput);
            processor.askBot(payloadInput, textInput, function (error, html) {
                if (error) {
                    console.log("error occured while processing your Request") //change into some inline fancy display, show error in chat window.
                }
                if (html) {
                    msg_container.append(html);
                    utils.scrollSmoothToBottom($('div.chat-body'));
                }
            });
            e.preventDefault();
        });
        //List Response Postback button
        $(document).on('click', '.listresponsepayload', function (e) {
            var payloadInput = $(this).attr('data');
            processor.askBot(payloadInput, payloadInput, function (error, html) {
                if (error) {
                    console.log("error occured while processing your Request") //change into some inline fancy display, show error in chat window.
                }
                if (html) {
                    msg_container.append(html);
                    utils.scrollSmoothToBottom($('div.chat-body'));
                }
            });
            e.preventDefault();
        });
        //Carousel Response Postback button
        $(document).on('click', '.caroselresponsepayload', function (e) {
            var payloadInput = $(this).data().carouselpayloadbutton;
            console.log('Button Payload' + payloadInput);
            processor.askBot(payloadInput, payloadInput, function (error, html) {
                if (error) {
                    console.log("error occured while processing your Request") //change into some inline fancy display, show error in chat window.
                }
                if (html) {
                    msg_container.append(html);
                    utils.scrollSmoothToBottom($('div.chat-body'));
                }
            });
            e.preventDefault();
        });

        // airling boarding pass Postback button
        $(document).on('click', '.airlineBoardingViewButton', function (e) {
            //var payloadInput = $(this).data().airlineBoardingButton;
            var payloadInput = "AirlineBoarding_BarCode";
            processor.askBot(payloadInput, payloadInput, function (error, html) {
                if (error) {
                    console.log("error occured while processing your Request") //change into some inline fancy display, show error in chat window.
                }
                if (html) {
                    msg_container.append(html);
                    utils.scrollSmoothToBottom($('div.chat-body'));
                }
            });
            e.preventDefault();
        });

        // generic Template
        $(document).on('click', '.genericTemplateClick', function (e) {
            var payloadInput = $(this).attr("data");
            console.log('Button Payload' + payloadInput);
            window.open(payloadInput, "__blank", 'width=1024,height=700,resizable=no');
            e.preventDefault();
        });
        $(document).on('click', '.genericTemplate', function (e) {
            var payloadInput = $(this).attr("data");;
            console.log('Button Payload' + payloadInput);
            processor.askBot(payloadInput, payloadInput, function (error, html) {
                if (error) {
                    console.log("error occured while processing your Request") //change into some inline fancy display, show error in chat window.
                }
                if (html) {
                    msg_container.append(html);
                    utils.scrollSmoothToBottom($('div.chat-body'));
                }
            });
            e.preventDefault();
        });
        $(document).on('click', '.buyClick', function (e) {
            var payloadInput = $(this).attr("data");;
            console.log('Button Payload' + payloadInput);
            processor.askBot(payloadInput, payloadInput, function (error, html) {
                if (error) {
                    console.log("error occured while processing your Request") //change into some inline fancy display, show error in chat window.
                }
                if (html) {
                    msg_container.append(html);
                    utils.scrollSmoothToBottom($('div.chat-body'));
                }
            });
            e.preventDefault();
        });
        // Quick Reply Postback button
        $(document).on('click', '.apiQuickreplybtnPayload', function (e) {
            var payloadInput = $(this).data().apiquickrepliespayload;
            processor.askBot(payloadInput, payloadInput, function (error, html) {
                if (error) {
                    console.log("error occured while processing your Request") //change into some inline fancy display, show error in chat window.
                }
                if (html) {
                    msg_container.append(html);
                    utils.scrollSmoothToBottom($('div.chat-body'));
                }
            });
            e.preventDefault();
        });
        // Airline Checkin Postback button
        $(document).on('click', '.airlineCheckinButton', function (e) {
            //var payloadInput = $(this).data().airlineBoardingButton;
            var payloadInput = "Checkin";
            console.log('Button Payload' + payloadInput);
            processor.askBot(payloadInput, payloadInput, function (error, html) {
                if (error) {
                    console.log("error occured while processing your Request") //change into some inline fancy display, show error in chat window.
                }
                if (html) {
                    msg_container.append(html);
                    utils.scrollSmoothToBottom($('div.chat-body'));
                }
            });
            e.preventDefault();
        });

        $("#btndownload").on('click', function (e) {
            e.preventDefault();
            var url = $('.img-circle').data().src;
            window.location = (url, 'Download');
        });

        //Disabling Header,Right Click and Developer windows Functionality for Web
        if (isWeb != null || isWeb != undefined) {
            $('.showheader').hide();
            $("chat-body").on("contextmenu", function (e) {
                return false;
            });

            $(document).keydown(function (event) {
                if (event.keyCode == 123) {
                    return false;
                }
                else if (event.ctrlKey && event.shiftKey && event.keyCode == 73) {
                    return false;  //Prevent from ctrl+shift+i
                }
            });
        }





    });
});
