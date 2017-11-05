'use strict';

/* -------------------------------------------------------------------
Copyright (c) 2017-2017 Hexaware Technologies
This file is part of the Innovation LAB - Offline Bot.
------------------------------------------------------------------- */


define(["utils","settings"], function (utils,settings) {

    var methods = {};

    //User Plain Text
    methods.userplaintext = (data) => {

        let html = `<li class="list-group-item background-color-custom">
            <div class="media-left pull-right animated fadeInRight">

            <div class="media-body user-txt-space">

                <p class="list-group-item-text-user">${data.payload}</p>
                <p class="user-timestamp"><small>${data.time}</small></p>

            </div>

        </li>`;

        return html;
    }

    //Plain Text Template
    methods.plaintext = (data) => {
        let html = `<li class="list-group-item background-color-custom">

            <div class="media-body bot-txt-space animated fadeInLeft">

                <p class="list-group-item-text-bot">${data.payload}</p>
                <p class="bot-res-timestamp"><small> <img style="border-radius:50%;border:2px solid white;" width="20" height="20" src='${settings.botAvatar}'/>${data.time}</small></p>

            </div>


        </li>`;

        return html;
    }

    methods.card = (data) => {
        let html;
        let cardButtons = "";
        let cardBody;
        for (let i in data.payload) {
            cardBody = `<li class="list-group-item background-color-custom animated fadeInLeft">
            <div class="pmd-card pmd-card-default pmd-z-depth custom-infocard">
                <!-- Card header -->
                <div class="pmd-card-title">


                </div>`

            if (data.payload[i].imageUrl != "" && data.payload[i].imageUrl != undefined) {
                cardBody += ` <div class="pmd-card-media">
                    <img src="${data.payload[i].imageUrl}" width="1184" height="666" class="img-responsive">
                    </div>`
            }

            cardBody += `<div class="pmd-card-title">
                <h3 class="card-body"><p class="card-title" style="padding-top:0px!important;">${data.payload[i].title}</p>
                <p class="card-subtitle">`;if(data.payload[i].subtitle)
                {data.payload[i].subtitle};
                cardBody+=`</p>
                </div>`

            if (data.buttons && data.payload[i].type == 1) {
                console.log("Buttons" + data);
                cardButtons = `<div class="pmd-card-actions">`
                for (var j = 0; j < data.payload[i].buttons.length; j++) {
                  if(data.payload[i].buttons[j].postback=="other_queries_non_invoice"){
                    cardButtons += `<button type="button"  class="btn btn-primary infocard-btn-custom cardresponsepayload" data-cardpayloadButton = "${data.payload[i].buttons[j].postback}" onClick="window.location.href='https://server.iad.liveperson.net/hc/70994705/?cmd=file&file=visitorWantsToChat&site=70994705&byhref=1&SESSIONVAR!skill=MyRicohSupport&imageUrl=https://server.iad.liveperson.net/hcp/Gallery/ChatButton-Gallery/English/General/1a'; 'height=400,width=600'" >${data.payload[i].buttons[j].text}</button>`
                  }
                  else{
                    cardButtons += ` <button type="button" class="btn btn-primary infocard-btn-custom cardresponsepayload" data-cardpayloadButton = "${data.payload[i].buttons[j].postback}" >${data.payload[i].buttons[j].text}</button>`
                  }

                }
                cardButtons += `</div>`
            }
            html = cardBody + cardButtons + `</div></div><p class="bot-res-timestamp-card"><small> <img style="border-radius:50%;border:2px solid white;" width="20" height="20" src='${settings.botAvatar}'/>${data.time}</small></p></div></li>`;
        }
        return html;
    }

    methods.quickreplies = (data) => {
        var quickRepliesHtml = `<li class="list-group-item background-color-custom">

        <div class="media-body animated fadeInLeft">`;

        for (let i in data.payload) {


            if (data.payload[i].platform == "facebook") {
                if (data.payload[i].payload.facebook.hasOwnProperty('quick_replies')) {
                    quickRepliesHtml += `<p class="list-group-item-quick-reply-space">${data.payload[i].payload.facebook.text}</p><div class="quick-replies-buttons">`;
                    for (var j = 0; j < data.payload[i].payload.facebook.quick_replies.length; j++) {
                      if(data.payload[i].payload.facebook.quick_replies[j].hasOwnProperty('payload')){
                        quickRepliesHtml += `<button type="button"  class="btn pmd-btn-outline pmd-ripple-effect btn-info QuickreplybtnPayload" data-quickRepliesPayload="${data.payload[i].payload.facebook.quick_replies[j].payload}">${data.payload[i].payload.facebook.quick_replies[j].title}</button>`
                      }
                      else if(data.payload[i].payload.facebook.quick_replies[j].hasOwnProperty('url')){
                        console.log("URL : "+data.payload[i].payload.facebook.quick_replies[j].url);
                        quickRepliesHtml += `<button type="button"  class="btn pmd-btn-outline pmd-ripple-effect btn-info QuickreplybtnPayload" onClick="window.location.href='${data.payload[i].payload.facebook.quick_replies[j].url}'; 'height=400,width=600'" >${data.payload[i].payload.facebook.quick_replies[j].title}</button>`

                      }
                      else if(data.payload[i].payload.facebook.quick_replies[j].hasOwnProperty('tab')){
                        console.log("TAB : "+data.payload[i].payload.facebook.quick_replies[j].tab);
                        quickRepliesHtml += `<button type="button"  class="btn pmd-btn-outline pmd-ripple-effect btn-info QuickreplybtnPayload" onClick="window.open('${data.payload[i].payload.facebook.quick_replies[j].tab}','_blank'); " >${data.payload[i].payload.facebook.quick_replies[j].title}</button>`
                      }
                    }
                }
            }
        }
        quickRepliesHtml += `</div><p class="bot-res-timestamp-qr"><small> <img style="border-radius:50%;border:2px solid white;" width="20" height="20" src='${settings.botAvatar}'/>${data.time}</small></p></div></li>`
        return quickRepliesHtml;
    }

    methods.carousel = (data, uniqueId) => {
        var carousel = `<li class="list-group-item background-color-custom animated fadeInLeft">
        <div id="${uniqueId}" class="carousel slide pmd-card pmd-card-default pmd-z-depth carousel-custom" data-ride="false">
        <!-- Carousel items -->
            <div class="carousel-inner">`;
        var index = 0;

        for (let i in data.payload) {

            if (data.payload[i].type == 1) {
              if(data.action == "SampleInvoiceCarouselIntent"){
                carousel += `<div class="item ${(index == 0) ? 'active' : ''}">
                    <div class="row">
                        <div class="col-md-12">
                            <a href="#" id="carousel-thumbnail-modal" class="thumbnail custom-image-wrap">
                                <img data-target="#center-dialog" data-toggle="modal" class="img-circle" src="${data.payload[i].imageUrl}" data-src="${data.payload[i].imageUrl}" alt="Image" style="max-width:100%;">
                            </a>
                            <h3 class="carousel-body"><p class="carousel-title">${data.payload[i].title}</p>
                            <p class="carousel-subtitle">${data.payload[i].subtitle}</p>`
                if (data.buttons && data.payload[i].type == 1) {
                    for (var j = 0; j < data.payload[i].buttons.length; j++) {
                        carousel += `<button type="button" class="btn-carousel btn-info pmd-btn-outline caroselresponsepayload button-custom" data-carouselpayloadButton = "${data.payload[i].buttons[j].postback}" >${data.payload[i].buttons[j].text}</button>`
                    }
                }
                carousel += `</div>
                    </div><!--.row-->
                </div> <!--.item-->`;
                index = 1;
            }
            else{
              carousel += `<div class="item ${(index == 0) ? 'active' : ''}">
                  <div class="row">
                      <div class="col-md-12">
                          <a href="#" class="thumbnail custom-image-wrap">
                              <img class="img-circle" src="${data.payload[i].imageUrl}" alt="Image" style="max-width:100%;">
                          </a>
                          <h3 class="carousel-body"><p class="carousel-title">${data.payload[i].title}</p>
                          <p class="carousel-subtitle">${data.payload[i].subtitle}</p>`
              if (data.buttons && data.payload[i].type == 1) {
                  for (var j = 0; j < data.payload[i].buttons.length; j++) {
                      carousel += `<button type="button" class="btn-carousel btn-info pmd-btn-outline caroselresponsepayload button-custom" data-carouselpayloadButton = "${data.payload[i].buttons[j].postback}" >${data.payload[i].buttons[j].text}</button>`
                  }
              }
              carousel += `</div>
                  </div><!--.row-->
              </div> <!--.item-->`;
              index = 1;
            }
          }
        }

        carousel += ` </div><!--.carousel-inner-->

		<a data-slide="prev" href="#${uniqueId}" class="left carousel-control custom-carousel-left"><span class="icon-prev" aria-hidden="true"></span>
        <span class="sr-only">Previous</span></a>
		<a data-slide="next" href="#${uniqueId}" class="right carousel-control custom-carousel-right"><span class="icon-next" aria-hidden="true"></span>
        <span class="sr-only">Next</span></a>
	  </div><!--.Carousel--></div><p style="bottom: 10px;" class="bot-res-timestamp-card"><small> <img style="border-radius:50%;border:2px solid white;" width="20" height="20" src='${settings.botAvatar}'/>${data.time}</small></p></div></li>`;

        return carousel;
    }
    return methods;
});
