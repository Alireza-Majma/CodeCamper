'use strict';
module App.Shared {

   export interface ISearchableObject {
      searchText: string;
      searchMatcher: (o, o2?, o3?) => boolean;
      filteredList: any[];
      modelData: any[];
      search: Function;
   }
   export interface ICommon {
      throttles: Object;
      activateController(promises: Array<ng.IPromise<any>>, controllerId: string)
      $broadcast(event: string, data: any);
      //createSearchThrottle(viewmodel: any, list: string, filteredList: string, filter: string, delay: number): Function;
      createSearchThrottle(viewmodel: any, list: any[], filteredList: any[], filterMatch: string, delay: number): Function;
      buildSearchThrottle(vm: ISearchableObject, applyFilterSucceeded?: Function, delay?: number): Function;
      attachSearch: (vm: ISearchableObject, applyFilterSucceeded: Function) => Function;
      debouncedThrottle(key: string, callback: Function, delay: number, immediate: boolean): void;
      isNumber(val: any): boolean;
      textContains(text: string, searchText: string): boolean
      $q: ng.IQService;
      $rootScope: ng.IRootScopeService;
      $timeout: ng.ITimeoutService;
      commonConfig: any;
      logger: ILogger;
   }

   export class Common implements ICommon {
      public static serviceId: string = 'common';

      //#region variables
      commonConfig: ICommonConfig;
      config: IConfigurations;
      logger: ILogger;
      throttles: Object;
      $rootScope: ng.IRootScopeService;
      $timeout: ng.ITimeoutService;
      $q: ng.IQService;

      //#endregion
      //#region constructor
      
      constructor($q, $rootScope, $timeout, commonConfig, logger,config) {
         this.commonConfig = commonConfig;
         this.logger = logger;
         this.throttles = {};
         this.$rootScope = $rootScope;
         this.$timeout = $timeout;
         this.$q = $q;
         this.config = config;
      }
       //#endregion

      //#region public methods
      activateController(promises: Array<ng.IPromise<any>>, controllerId: string) {
         return this.$q.all(promises).then(this.broadcastSuccessEvent(controllerId));
      }

      private broadcastSuccessEvent(controllerId) {
         var data = { controllerId: controllerId };
         return this.$broadcast(this.commonConfig.config.controllerActivateSuccessEvent, data);
      }

      $broadcast(eventName: string, data: any) {
         return this.$rootScope.$broadcast.apply(this.$rootScope, arguments);
      }

      createSearchThrottle(viewmodel, list, filteredList, filterMatch, delay) {
         // After a delay, search a viewmodel's list using 
         // a filter function, and return a filteredList.

         // custom delay or use default
         delay = +delay || 300;
         // if only vm and list parameters were passed, set others by naming convention 
         if (!filteredList) {
            // assuming list is named sessions, filteredList is filteredSessions
            filteredList = 'filtered' + list[0].toUpperCase() + list.substr(1).toLowerCase(); // string
            // filter function is named sessionFilter
            filterMatch = list + 'Filter'; // function in string form
         }

         // create the filtering function we will call from here
         var filterFn = () => {
            // translates to ...
            // vm.filteredSessions 
            //      = vm.sessions.filter(function(item( { returns vm.sessionFilter (item) } );
            viewmodel[filteredList] = viewmodel[list].filter(function (item) {
               return viewmodel[filterMatch](item);
            });
         };

         return (() => {
            // Wrapped in outer IFFE so we can use closure 
            // over filterInputTimeout which references the timeout
            var filterInputTimeout;

            // return what becomes the 'applyFilter' function in the controller
            return (searchNow) => {
               if (filterInputTimeout) {
                  this.$timeout.cancel(filterInputTimeout);
                  filterInputTimeout = null;
               }
               if (searchNow || !delay) {
                  filterFn();
               } else {
                  filterInputTimeout = this.$timeout(filterFn, delay);
               }
            };
         })();
      }

      attachSearch(vm: ISearchableObject, applyFilterSucceeded: Function) {
         return ($event) =>{
            var searchNow = false;
            if ($event.keyCode === this.config.keyCodes.esc) {
               vm.searchText = '';
               searchNow = true;
            }
            vm['applyFillter'](searchNow).then(applyFilterSucceeded);
         };
      }

      buildSearchThrottle(vm: ISearchableObject, applyFilterSucceeded?: Function, delay?:number) {
         // After a delay, search a viewmodel's list using 
         // a filter function, and return a filteredList.

         // custom delay or use default
         delay = +delay || 300;

         // create the filtering function we will call from here
         var filterFn = (defered) => {
            // translates to ...
            // vm.filteredSessions 
            var filteredList = vm.modelData.filter(vm.searchMatcher);
            defered.resolve(filteredList);
         };

         vm['applyFillter']=(() => {
            // Wrapped in outer IFFE so we can use closure 
            // over filterInputTimeout which references the timeout
            var filterInputTimeout;

            // return what becomes the 'applyFilter' function in the controller
            return (searchNow) => {
               var defered = this.$q.defer();
               if (filterInputTimeout) {
                  this.$timeout.cancel(filterInputTimeout);
                  filterInputTimeout = null;
               }
               if (searchNow || !delay) {
                  filterFn(defered);
               } else {
                  filterInputTimeout = this.$timeout(function () {
                     filterFn(defered);
                  }, delay);
               }
               return defered.promise;
            };
         })();
         if (!applyFilterSucceeded) {
            applyFilterSucceeded = (data: any[]) => { vm.filteredList = data; }
         }
         vm.search = this.attachSearch(vm, applyFilterSucceeded);
         //run it for the first time
         vm.search({ keyCode: this.config.keyCodes.esc });
         return vm.search;
      }
      
      public debouncedThrottle(key: string, callback, delay: number, immediate: boolean): void {
         // Perform some action (callback) after a delay. 
         // Track the callback by key, so if the same callback 
         // is issued again, restart the delay.

         var defaultDelay = 1000;
         delay = delay || defaultDelay;
         if (this.throttles[key]) {
            this.$timeout.cancel(this.throttles[key]);
            this.throttles[key] = undefined;
         }
         if (immediate) {
            callback();
         } else {
            this.throttles[key] = this.$timeout(callback, delay);
         }
      }

      isNumber(val: any): boolean {
         // negative or positive
         return /^[-]?\d+$/.test(val);
      }

      textContains(text: string, searchText: string): boolean {
         return text && -1 !== text.toLowerCase().indexOf(searchText.toLowerCase());
      }
      //#endregion
   }
        
   // Creates "common" service
   commonModule.factory(Common.serviceId, ['$q', '$rootScope', '$timeout', 'commonConfig', 'logger', 'app.config',
      ($q, $rootScope, $timeout, commonConfig, logger, config) => new Common($q, $rootScope, $timeout, commonConfig, logger, config)
    ]);
   
}