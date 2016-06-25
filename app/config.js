'use strict';

tmwcapp.constant('AppConfig',
  {
    entryFees : {
      "Újonc" : {
        pre : 2000,
        normal : 4000
      },
      "Gyermek" : {
        pre : 4000,
        normal : 6000
      },
      "Serdülő" : {
        pre : 4000,
        normal : 6000
      },
      "Sprint" : {
        pre : 6000,
        normal : 9000
      },
      "Rövid" : {
        pre : 8000,
        normal : 11000
      }
    },
    carouselImages : [
      {src : 'resources/images/carousel/triathlon-swim.jpg', caption : 'Úszás', desc : ''},
      {src : 'resources/images/carousel/triathlon-bicycle.jpg', caption : 'Biciklizés', desc : ''},
      {src : 'resources/images/carousel/triathlon-run.jpg', caption : 'Futás', desc : ''}
    ],
    serviceBaseURL : 'http://192.168.1.104:8080/TriathlonManager/rest/',
    notificationWSEndpoint : 'ws://192.168.1.104:8080/TriathlonManager/notification'
  })