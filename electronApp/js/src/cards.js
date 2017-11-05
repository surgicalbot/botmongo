'use strict';

/* -------------------------------------------------------------------
Copyright (c) 2017-2017 Hexaware Technologies
This file is part of the Innovation LAB - Offline Bot.
------------------------------------------------------------------- */


define(['messageTemplates', 'uuid'], function (messageTpl, uuidv1) {

    class CardDesign {

        constructor(card, responseType) {
            this.data = card;
            this.responseType = responseType;
        }

        getHTML() {
            //Return Plain Text Response Type Payload
            if (this.responseType == "plaintext") {
                console.log(this.data);
                return messageTpl.plaintext(this.data);
            }
            //Return Card Response Type Payload
            if (this.responseType == "card") {
                console.log(JSON.stringify(this.data));
                return messageTpl.card(this.data);
            }
            //Return Carousel Response Type Payload
            if (this.responseType == "carousel") {
                return messageTpl.carousel(this.data, uuidv1());
            }
            //Return Quick replies Response Type Payload
            if (this.responseType == "quickreplies") {
                return messageTpl.quickreplies(this.data);
            }

          
        }
    }

    return function (card, responseType) {
        return new CardDesign(card, responseType).getHTML();
    }
});
