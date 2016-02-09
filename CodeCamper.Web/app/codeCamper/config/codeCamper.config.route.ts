
module App.CodeCamper {
   'use strict';
   import shared = App.Shared;

   export interface IConfigRouteSettings {
      nav: number
      content: string
   }

   export interface IConfigRoute {
      templateUrl: string
      title: string
      settings?: IConfigRouteSettings
      resolve?: {}
   }

   export interface IRoute {
      url: string
      config: ng.route.IRoute
      settings?: IConfigRouteSettings
   }

   var codeCamperModule = App.CodeCamper.codeCampModule;
   
   // Collect the routes
   codeCamperModule.constant('codeCamper.routes', getRoutes());
    
   // Configure the routes and route resolvers
   codeCamperModule.config(['$routeProvider', 'codeCamper.routes', routeProvider]);
   function routeProvider($routeProvider: ng.route.IRouteProvider, routes: IRoute[]): void {
      routes.forEach(function (r) {
         //call prime before any route
         r.config.resolve = angular.extend(r.config.resolve || {}, { prime: prime });
         $routeProvider.when(r.url, r.config);
      });
      $routeProvider.otherwise({ redirectTo: '/' });
   }

   prime.$inject = ['miscRepository'];
   function prime(dcMisc) {
      return dcMisc.prime();
   }
    
   // Define the routes 
   function getRoutes(): IRoute[] {
      return [
         {
            url: '/',
            config: {
               templateUrl: 'app/codeCamper/dashboard/dashboard',
               name: 'dashboard'
            },
            settings: {
               nav: 1,
               content: '<i class="fa fa-dashboard "></i>&nbsp;&nbsp; Dashboard'
            }
            //}, {
            //   url: '/admin',
            //   config: {
            //      name: 'admin',
            //      templateUrl: 'app/codeCamper/admin/admin'
            //   },
            //   settings: {
            //      nav: 2,
            //      content: '<i class="fa fa-lock"></i> &nbsp;&nbsp;Admin'
            //   }
         }, {
            url: '/sessions',
            config: {
               name: 'sessions',
               templateUrl: 'app/codeCamper/session/sessions'
            },
            settings: {
               nav: 3,
               content: '<i class="fa fa-calendar"></i> &nbsp;&nbsp;Sessions'
            }
         }, {
            url: '/speakers',
            config: {
               name: 'Speakers',
               templateUrl: 'app/codeCamper/speaker/speakers'
            },
            settings: {
               nav: 4,
               content: '<i class="fa fa-user"></i> &nbsp;&nbsp;Speakers'
            }
         }, {
            url: '/persons',
            config: {
               name: 'Persons',
               templateUrl: 'app/codeCamper/person/persons'
            },
            settings: {
               nav: 5,
               content: '<i class="fa fa-group"></i> &nbsp;&nbsp;Persons'
            }
         }, {
            url: '/attendees',
            config: {
               name: 'Attendees',
               templateUrl: 'app/codeCamper/attendee/attendees'
            },
            settings: {
               nav: 5,
               content: '<i class="fa fa-group"></i> &nbsp;&nbsp;Attendees'
            }
         }, {
            url: '/speaker/:id',
            config: {
               name: 'Speaker Detail',
               templateUrl: 'app/codeCamper/speaker/speakerDetail',
            }
         }, {
            url: '/person/:id',
            config: {
               name: 'Person Detail',
               templateUrl: 'app/codeCamper/person/personDetail',
            }
         }, {
            url: '/session/:id',
            config: {
               name: 'Session Detail',
               templateUrl: 'app/codeCamper/session/sessionDetail',
            }
         }
      ];
   }
}

