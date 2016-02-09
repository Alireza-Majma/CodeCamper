'use strict';
module App.Shared {

   interface IRouteScope extends ng.IRootScopeService {
      title: string;
   }

   export interface IRoutemediator {
      updateDocTitle: Function;
      handleRouteError: Function;
   }

   export class Routemediator implements IRoutemediator {
      public static serviceId: string = 'routemediator';

      //#region variables
      $rootScope: IRouteScope;
      $location: ng.ILocationService;
      config: IConfigurations;
      handelRouteError: boolean;
      logWarning: Function;
      //#endregion

      //#region constructor
      constructor($rootScope: IRouteScope, $location: ng.ILocationService, config: IConfigurations, common: ICommon) {
         this.$rootScope = $rootScope;
         this.$location = $location;
         this.config = config;
         this.handelRouteError = false;
         var logger = common.logger;
         this.logWarning = logger.getLogFn(Routemediator.serviceId, "warning");
      }
      //#endregion

      //#region public methods
      public handleRouteError() {
         this.$rootScope.$on('$routeChangeError', (event, current, privious, rejection) => {
            if (!this.handelRouteError) {
               this.handelRouteError = true;
               var message = 'Error routing: ' + (current && current.name) + ', ' + (rejection || '');
               this.logWarning(message, current, Routemediator.serviceId, true);
               this.$location.path(this.config.routes[0].url);
            }
         });
      }

      public updateDocTitle() {
         this.$rootScope.$on('$routeChangeSuccess', (event, current, privious): void => {
            this.$rootScope.title = (this.config.docTitle + ' ' + (current.name || ''));
            this.handelRouteError = false;
         });
      }

      //#endregion
   }
        
   // Creates service
   App.Shared.commonBootstrapModule.factory(Routemediator.serviceId, ['$rootScope', '$location', 'app.config', 'common',
      ($rootScope, $location, config, common) => new Routemediator($rootScope, $location, config, common)]);

}