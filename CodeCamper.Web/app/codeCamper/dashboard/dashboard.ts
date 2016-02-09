
'use strict';

module App.CodeCamper {
   import appShared = App.Shared;
   interface IDashboard {
      title: string;
   }

   export interface INews {
      title: string;
      description: string;
   }

   export interface ITopSpeakerCarousel {
      interval: number;
      topList: any[];
      title: string;
   }
   export interface IContent {
      predicate: string;
      reverse: boolean;
      setSort: (prop) => void;
      title: string,
      tracks: any[]
   }
   export class Dashboard implements IDashboard {
      public static controllerId: string = 'dashboard';
      //#region variables
      
      logger: appShared.ILogger;
      logSuccess: Function;
      logError: Function;
      log: Function;
      title: string;
      speakerCount: any;
      sessionCount: any;
      attendeeCount: any;
      content: IContent = {
         predicate: '',
         reverse: false,
         setSort: (prop) => {
            this.content.predicate = prop;
            this.content.reverse = !this.content.reverse;
         },
         title: 'Content',
         tracks: []
      };
      news: INews = {
         title: 'Code Camper Angular',
         description: 'Code Camper is a SPA template for Angular developers.'
      };
      speakerslist: any[];
      topSpeakerCarousel: ITopSpeakerCarousel = {
         interval: 2000,
         topList: [],
         title: 'Top Speakers'
      };
      //#endregion

      //#region constructor
      static $inject = ['$location', 'common', 'app.config', 'personsRepository', 'sessionsRepository'];
      constructor(private $location: ng.ILocationService,
                  private common: appShared.ICommon,
                  private config: IConfigurations,
                  private personsRepository: IPersonsRepository,
                  private sessionsRepository: ISessionsRepository) {
         this.logger = this.common.logger;
         this.log = this.logger.getLogFn(Dashboard.controllerId);
         this.logSuccess = this.logger.getLogFn(Dashboard.controllerId, "success");
         this.logError = this.logger.getLogFn(Dashboard.controllerId, "error");
         this.title = 'Dashboard';
         this.activate();
      }
      //#endregion
   
      //#region public

      //#endregion
      activate() {
         var promises = [this.getSessionCount(), this.getSpeakerCount(), this.getPersonsCount(), this.getTrackCounts(), this.getTopSpeakers()];
         this.common.activateController(promises, Dashboard.controllerId)
            .then(() => {
               this.log('Activated Dashboard View');
            });
      }

      public getSessionCount() {
         return this.sessionsRepository.getSessionCount().then((data) => {
            return this.sessionCount = data;
         });
      }
      public getSpeakerCount() {
         return this.personsRepository.getSpeakerCount().then((data) => {
            return this.speakerCount = data;
         });
      }
      public getPersonsCount() {
         return this.personsRepository.getPersonsCount().then((data) => {
            return this.attendeeCount = data;
         });
      }

      public getTopSpeakers() {
         var speakers = this.sessionsRepository.getToSpeakers().then((data) => {
            this.topSpeakerCarousel.topList = data;
         });
      }

      public getTrackCounts() {
         return this.content.tracks = this.sessionsRepository.getTrackCounts();
      }

      public setContentSort(prop) {
         this.content.predicate = prop;
         this.content.reverse = !this.content.reverse;
      }
   }
   // Register with angular
   App.CodeCamper.codeCampModule.controller(Dashboard.controllerId,Dashboard);
}