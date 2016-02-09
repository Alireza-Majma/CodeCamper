
'use strict';

module App.CodeCamper {
   import appShared = App.Shared;
   interface ISessions {
      title: string;
   }

   export class Sessions implements ISessions, appShared.ISearchableObject {
      public static controllerId: string = 'sessions';
      //#region variables
      $location: ng.ILocationService;
      common: appShared.ICommon;
      config: IConfigurations;
      sessionsRepository: ISessionsRepository;
      logger: appShared.ILogger;
      logSuccess: Function;
      logError: Function;
      log: Function;
      title: string;
      modelData: any[];
      filteredList: any[];
      searchText: string;
      totalItemLoaded: number;
      search: Function;
      
      //#endregion

      //#region constructor
      static $inject = ['$location', 'common', 'app.config', 'sessionsRepository'];
      constructor($location: ng.ILocationService, common: appShared.ICommon, config: IConfigurations, sessionsRepository: ISessionsRepository) {
         this.$location = $location;
         this.config = config,
         this.sessionsRepository = sessionsRepository;
         this.common = common;
         this.logger = this.common.logger;
         this.log = this.logger.getLogFn(Sessions.controllerId);
         this.logSuccess = this.logger.getLogFn(Sessions.controllerId, "success");
         this.logError = this.logger.getLogFn(Sessions.controllerId, "error");
         this.title = 'Sessions';

         this.activate();
      }
      //#endregion
   
      //#region public
          
      private activate() {

         var init = () => {
            this.search = this.common.buildSearchThrottle(this, (data: any[]) => { this.filteredList = data; });
            this.log('Activated Session View');
         }
         var promises = [this.getData()];
         this.common.activateController(promises, Sessions.controllerId)
            .then(init);
      }

      public searchMatcher = (o) => {
         if (!this.searchText) {
            return true;
         } else if (this.common.textContains(o.title, this.searchText)) {
            return true;
         } else if (this.common.textContains(o.room.name, this.searchText)) {
            return true;
         } else if (this.common.textContains(o.track.name, this.searchText)) {
            return true;
         } else if (this.common.textContains(o.speaker.firstName, this.searchText)) {
            return true;
         } else if (this.common.textContains(o.speaker.lastName, this.searchText)) {
            return true;
         }
         return false;
      }

      public refresh() {
         this.getData(true);
      }

      public getData(forceRefresh?: boolean) {
         return this.sessionsRepository.getSessions(forceRefresh).then((data) => {
            this.modelData = data.result;
            this.totalItemLoaded = data.totalItemLoaded;
            return this.modelData;
         });
      }

      public gotoSession(session) {
         if (session && session.id) {
            this.$location.path('/session/' + session.id);
         }
      }
      //#endregion
   }
   // Register with angular
   App.CodeCamper.codeCampModule.controller(Sessions.controllerId,Sessions);
}