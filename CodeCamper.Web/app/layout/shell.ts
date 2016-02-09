
'use strict';

module App.Controllers {

   export interface ISpinnerObtions {
      radius: number;
      lines: number;
      length: number;
      width: number;
      speed: number;
      corners: number;
      trail: number;
      color: string;
   }

   export interface IShell {
      busyMessage: string;
      isBusy: boolean;
      spinnerOperations: ISpinnerObtions;
      toggleSpinner(on: boolean): void;
   }

   export class Shell implements IShell {
      public static controllerId = 'shell';
      //#region Variables
      busyMessage = 'Please wait...';
      controllerId = Shell.controllerId;
      isBusy = true;
      state = true;
      toggledClass = '';
      spinnerOperations: ISpinnerObtions;
      common: App.Shared.ICommon;
      config: IConfigurations;
      $rootScope: any;
      $route: ng.route.IRouteService;
      navRoutes: any[];
      //#endregion
      static $inject = ['$rootScope', '$scope', '$route', 'app.config', 'common'];
      constructor($rootScope: any, $scope: any, $route: ng.route.IRouteService, config: IConfigurations, common: App.Shared.ICommon) {
         var vm = this;
         vm.common = common;
         vm.config = config;
         vm.$rootScope = $rootScope;
         vm.$route = $route;
         vm.navRoutes = [];
         vm.activate();
         vm.registerEvents();
         vm.spinnerOperations = {
            radius: 40,
            lines: 7,
            length: 20,
            width: 30,
            speed: 1.7,
            corners: 1.0,
            trail: 100,
            color: '#F58A00'
         }
      }

      public toggleSpinner(on: boolean): void {
         this.isBusy = on;
      }

      public isCurrent(route) {
         if (!route.config.name || !this.$route.current || !this.$route.current.name) {
            return '';
         }
         var menuName = route.config.name;
         return this.$route.current.name.substr(0, menuName.length) === menuName ? 'current active' : '';
      }
      
      private activate() {
         this.navRoutes = this.config.routes
            .filter((r, index, arr) => { return r.settings && !!r.settings.nav; })
            .sort((r1, r2) => { return r1.settings.nav - r2.settings.nav; });
         var logger = this.common.logger.getLogFn(this.controllerId, 'success');
         logger('Hot Towel Angular loaded!', null, true);

         this.common.activateController([], this.controllerId);
      }

      public toggleState(id) {
         this.state = !this.state;
         if (this.toggledClass.indexOf("toggled-" + id) > -1) {
            this.toggledClass = '';
         } else {
            this.toggledClass = 'toggled-' + id;
         }
      }

      private registerEvents() {
         var events = this.config.events;
         this.$rootScope.$on('$routeChangeStart',
            (event, next, current) => { this.toggleSpinner(true); }
         );

         this.$rootScope.$on(events.controllerActivateSuccess,
            data => { this.toggleSpinner(false); }
         );

         this.$rootScope.$on(events.spinnerToggle,
            data => { this.toggleSpinner(data.show); }
         );
      }
   }
   // Register with angular
   app.controller(Shell.controllerId,Shell);
}