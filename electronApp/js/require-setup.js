'use strict';

/* -------------------------------------------------------------------
Copyright (c) 2017-2017 Hexaware Technologies
This file is part of the Innovation LAB - Offline Bot.
------------------------------------------------------------------- */


requirejs.config({
    baseUrl: 'js',
    paths: {
        jquery: [
            'https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min',
            'lib/jquery.min'
        ],
        bootstrap: [
            'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min',
            'lib/bootstrap.min'
        ],
        uuid: 'lib/uuidv1',
        propeller: 'lib/propeller.min',
        settings: 'settings',
        app: 'src/app',
        utils: 'src/utils',
        apiService: 'src/apiService',
        messageTemplates: 'src/messageTemplates',
        cards: 'src/cards'
        // jq16: 'lib/jquery1.6.min',
        // facemicon:'lib/faceMocion'
    },
    shim: {
        bootstrap: {
            deps: ['jquery']
        },
        propeller: {
            deps: ['jquery', 'bootstrap']
        }
    }
});

requirejs(['src/app']);