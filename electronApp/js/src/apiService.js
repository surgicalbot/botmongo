'use strict';

/* -------------------------------------------------------------------
Copyright (c) 2017-2017 Hexaware Technologies
This file is part of the Innovation LAB - Offline Bot.
------------------------------------------------------------------- */


define(['jquery', 'settings', 'utils', 'messageTemplates', 'cards', 'uuid'],
    function ($, config, utils, messageTpl, cards, uuidv1) {

        class ApiHandler {

            constructor() {
                this.options = {
                    sessionId: uuidv1(),
                    lang: "en"
                };
            }

            userSays(userInput, callback) {
                console.log(callback);
                callback(null, messageTpl.userplaintext({
                    "payload": userInput,
                    "senderName": config.userTitle,
                    "senderAvatar": config.userAvatar,
                    "time": utils.currentTime(),
                    "className": 'pull-right'
                }));
            }
            askBot(userInput, userText, callback) {
                this.userSays(userText, callback);

                this.options.query = userInput;

                $.ajax({
                    type: "POST",
                    url: config.chatServerURL + "query?v=20150910",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    headers: {
                        "Authorization": "Bearer " + config.accessToken
                    },
                    data: JSON.stringify(this.options),
                    success: function (response) {
                        let isCardorCarousel = false;
                        let isImage = false;
                        let isQuickReply = false;
                        let isQuickReplyFromApiai = false;
                        //Media attachment
                        let isVideo = false;
                        let videoUrl = null;
                        let isAudio = false;
                        let audioUrl = null;
                        let isFile = false;
                        let fileUrl = null;
                        let isReceipt = false;
                        let receiptData = null;
                        let isList = false;
                        let imageUrl;
                        // airline onboarding
                        let isAirlineBoardingPass = false;
                        let isViewBoardingPassBarCode = false;
                        let isAirlineCheckin = false;
                        let isAirlingFlightUpdate = false;
                        //Generic Template
                        let genericTemplate = false;
                        let genericElement = null;
                        let genericBuy = false;
                        let genericCheckout = null;
                        //To find Card || Carousel
                        let count = 0;
                        let hasbutton;
                        console.log(response);
                        if (response.result.fulfillment.messages) {
                            // console.log("for airline service"+ response);
                            for (let i in response.result.fulfillment.messages) {
                                if (response.result.fulfillment.messages[i].type == 0 && response.result.fulfillment.messages[i].speech !="") {

                                    let cardHTML = cards({
                                        "payload": response.result.fulfillment.messages[i].speech,
                                        "senderName": config.botTitle,
                                        "senderAvatar": config.botAvatar,
                                        "time": utils.currentTime(),
                                        "className": ''
                                    }, "plaintext");
                                    callback(null, cardHTML);
                                }
                                if (response.result.fulfillment.messages[i].type == 1) {
                                    count = count + 1;
                                    hasbutton = (response.result.fulfillment.messages[i].buttons.length > 0) ? true : false;
                                    isCardorCarousel = true;
                                }
                                if (response.result.fulfillment.messages[i].type == 2) {
                                    isQuickReplyFromApiai = true;
                                }
                                if (response.result.fulfillment.messages[i].type == 3) {
                                    isImage = true;
                                }
                                let msgfulfill = response.result.fulfillment.messages[i];

                                if (msgfulfill.type == 4 && msgfulfill.hasOwnProperty("payload") && msgfulfill.payload.hasOwnProperty("facebook")) {
                                    //Quick Replies
                                    if (msgfulfill.payload.facebook.hasOwnProperty("quick_replies")) {
                                        isQuickReply = (msgfulfill.payload.facebook.quick_replies.length > 0) ? true : false;
                                        console.log(isQuickReply);
                                    }

                                    if (msgfulfill.payload.facebook.hasOwnProperty("attachment")) {
                                        count = count + 1;
                                        response.result.fulfillment.messages = response.result.fulfillment.messages[i]["payload"]["facebook"]["attachment"]["payload"]["elements"]

                                        for (let j in response.result.fulfillment.messages) {
                                            response.result.fulfillment.messages[j]["type"] = 1
                                            response.result.fulfillment.messages[j]["imageUrl"] = response.result.fulfillment.messages[j]["image_url"]
                                        }

                                        hasbutton = (response.result.fulfillment.messages[i].buttons.length > 0) ? true : false;
                                        isCardorCarousel = true;
                                    }
                                }

                            }
                        } else {
                            let cardHTML = cards({
                                "action":response.result.action,
                                "payload": response.result.fulfillment.speech,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": ''
                            }, "plaintext");
                            callback(null, cardHTML);
                        }
                        //Carousel
                        if (isCardorCarousel) {
                            if (count == 1) {
                                let cardHTML = cards({
                                    "action":response.result.action,
                                    "payload": response.result.fulfillment.messages,
                                    "senderName": config.botTitle,
                                    "senderAvatar": config.botAvatar,
                                    "time": utils.currentTime(),
                                    "buttons": hasbutton,
                                    "className": ''
                                }, "card");
                                callback(null, cardHTML);
                            } else {
                                let carouselHTML = cards({
                                    "action":response.result.action,
                                    "payload": response.result.fulfillment.messages,
                                    "senderName": config.botTitle,
                                    "senderAvatar": config.botAvatar,
                                    "time": utils.currentTime(),
                                    "buttons": hasbutton,
                                    "className": ''

                                }, "carousel");
                                callback(null, carouselHTML);
                            }
                        }
                        //Image Response
                        if (isImage) {
                            let cardHTML = cards(response.result.fulfillment.messages, "image");
                            callback(null, cardHTML);
                        }
                        //CustomPayload Quickreplies
                        if (isQuickReply) {
                            let cardHTML = cards({
                                "payload": response.result.fulfillment.messages,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": ''
                            }, "quickreplies");
                            callback(null, cardHTML);
                        }
                        //Apiai Quickreply
                        if (isQuickReplyFromApiai) {
                            let cardHTML = cards(response.result.fulfillment.messages, "quickreplyfromapiai");
                            callback(null, cardHTML);
                        }
                        //Video Attachment Payload callback
                        if (isVideo) {
                            let cardHTML = cards({
                                "payload": videoUrl,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": ''
                            }, "video");
                            callback(null, cardHTML);
                        }
                        //Audio Attachment Payload callback
                        if (isAudio) {
                            let cardHTML = cards({
                                "payload": audioUrl,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": ''
                            }, "audio");
                            callback(null, cardHTML);
                        }
                        //File Attachment Payload callback
                        if (isFile) {
                            let cardHTML = cards({
                                "payload": fileUrl,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": ''
                            }, "file");
                            callback(null, cardHTML);
                        }
                        // Receipt Attachment Payload callback
                        if (isReceipt) {
                            let cardHTML = cards({
                                "payload": receiptData,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": ''
                            }, "receipt");
                            callback(null, cardHTML);
                        }
                        // airline Boarding Pass
                        if (isAirlineBoardingPass) {
                            let boardingPassHTML = cards({
                                "payload": response.result.fulfillment.messages,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "buttons": hasbutton,
                                "className": ''
                            }, "airlineBoarding");
                            callback(null, boardingPassHTML);
                        }
                        // -----------------------------------

                        // airline Boarding Pass View bar code
                        if (isViewBoardingPassBarCode) {
                            let ViewBoardingPassBarCodeHTML = cards({
                                "payload": response.result.fulfillment.messages,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "buttons": hasbutton,
                                "className": ''
                            }, "ViewBoardingPassBarCode");
                            callback(null, ViewBoardingPassBarCodeHTML);
                        }
                        // airline Checkin
                        if (isAirlineCheckin) {
                            let CheckinHTML = cards({
                                "payload": response.result.fulfillment.messages,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "buttons": hasbutton,
                                "className": ''
                            }, "airlineCheckin");
                            callback(null, CheckinHTML);
                        }

                        // airline flight update
                        if (isAirlingFlightUpdate) {
                            let CheckinHTML = cards({
                                "payload": response.result.fulfillment.messages,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "buttons": hasbutton,
                                "className": ''
                            }, "airlineFlightUpdate");
                            callback(null, CheckinHTML);
                        }

                        // generic template
                        if (genericTemplate) {
                            let cardHTML = cards({
                                "payload": genericElement,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": ''
                            }, "generic");
                            callback(null, cardHTML);
                        }
                        // List template
                        if (isList) {
                            let cardHTML = cards({
                                "payload": response.result.fulfillment.messages,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": ''
                            }, "list");
                            callback(null, cardHTML);
                        }
                        // Buy
                        if (genericBuy) {
                            let cardHTML = cards({
                                "payload": genericCheckout,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": ''
                            }, "buybutton");
                            callback(null, cardHTML);

                        }

                    },
                    error: function () {
                        callback("Internal Server Error", null);
                    }
                });
            }
        }

        return function (accessToken) {
            return new ApiHandler();
        }
    });
