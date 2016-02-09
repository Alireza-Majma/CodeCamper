
'use strict';

module App.CodeCamper {
   import appShared = App.Shared;
   interface ISpeakers {
      title: string;
   }

   export class Speakers implements ISpeakers, appShared.ISearchableObject {
      public static controllerId: string = 'speakers';
      //vm: ISpeakers;
      //#region variables
      $location: ng.ILocationService;
      common: appShared.ICommon;
      config: IConfigurations;
      personsRepository: IPersonsRepository;
      logger: appShared.ILoggerModule;
      title: string;
      modelData: any[];
      filteredList: any[];
      searchText: string;
      totalItemLoaded: number;
      search: Function;
      
      //#endregion

      //#region constructor
      static $inject = ['$location', 'common', 'app.config', 'personsRepository'];
      constructor($location: ng.ILocationService, common: appShared.ICommon, config: IConfigurations, personsRepository: IPersonsRepository) {
         this.$location = $location;
         this.config = config,
         this.personsRepository = personsRepository;
         this.common = common;
         this.logger = this.common.logger.getLogger(Speakers.controllerId);
         this.title = 'Speakers';
         var vm=this;
         this.activate();
      }
      //#endregion
   
      //#region public
      private activate() {
         var init = () => {
            this.common.buildSearchThrottle(this);
            this.logger.log('Activated Speakers View');
         }
         var promises = [this.getData()];
         this.common.activateController(promises, Sessions.controllerId)
            .then(init);
      }

      //It has to be lambda function to properly handle this pointer
      public searchMatcher= (o)=> {
         if (!this.searchText) {
            return true;
         } else if (this.common.textContains(o.firstName, this.searchText)) {
            return true;
         } else if (this.common.textContains(o.lastName, this.searchText)) {
            return true;
         }
         return false;
      }

      public refresh() {
         this.getData(true);
      }

      public getData(forceRefresh?: boolean) {
         return this.personsRepository.getSpeakers(forceRefresh)
            .then((data) => {
               this.modelData = data.result;
               this.totalItemLoaded = data.totalItemLoaded
               return this.modelData;
         });
      }

      public gotoSpeaker(speaker) {
         if (speaker && speaker.id) {
            this.$location.path('/speaker/' + speaker.id);
         }
      }
      //#endregion
   }
   // Register with angular
   App.CodeCamper.codeCampModule.controller(Speakers.controllerId,Speakers);
}