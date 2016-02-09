
'use strict';

module App.CodeCamper {
   import appShared = App.Shared;
   interface IAttendees {
      title: string;
      getattendees: (forceRefresh?: boolean) => any;
   }

   export interface IPaging {
      pagesize: number;
      currentPage: number;
      maxPagesToShow: number;
      pageCount: () => void;
      filteredCount: number;
   }

   export class Attendees implements IAttendees {
      public static controllerId: string = 'attendees';
      //#region variables
      logger: appShared.ILogger;
      logSuccess: Function;
      logError: Function;
      log: Function;
      title: string;
      searchText: string;
      attendeeList: any[];
      //filteredCount: number;
      totalItemLoaded: number;
      paging: IPaging;
      //#endregion

      //#region constructor
      static $inject = ['$location', 'common', 'app.config', 'personsRepository'];
      constructor(private $location: ng.ILocationService,
                  private common: appShared.ICommon,
                  private config: IConfigurations,
                  private personsRepository: IPersonsRepository) {
      
         this.logger = this.common.logger;
         this.log = this.logger.getLogFn(Attendees.controllerId);
         this.logSuccess = this.logger.getLogFn(Attendees.controllerId, "success");
         this.logError = this.logger.getLogFn(Attendees.controllerId, "error");
         this.title = 'Attendees';
         this.searchText = '';
         this.attendeeList = [];
         //this.filteredCount = 0;
         this.totalItemLoaded = 0;
         this.paging = {
            pagesize: 15,
            currentPage: 1,
            maxPagesToShow: 10,
            pageCount: () => {
               return Math.floor(this.paging.filteredCount / this.paging.pagesize) + 1;
            },
            filteredCount: 0
         };
         this.activate();
      }
      //#endregion
   
      //#region public

      //#endregion
      activate() {
         var promises = [this.getattendees()];
         this.common.activateController(promises, Attendees.controllerId)
            .then(() =>{
               this.log('Activated Attendee View');
            });
      }

      public getattendees(forceRefresh?: boolean) {
         return this.personsRepository.getPagedPersons(this.searchText, forceRefresh, this.paging.currentPage, this.paging.pagesize).then((data)=> {
            this.attendeeList = data.result;
            this.totalItemLoaded = data.totalItemLoaded;
            this.paging.filteredCount = data.filterCount;
            return this.attendeeList;
         });
      }

      public search($event) {
         if ($event.keyCode === this.config.keyCodes.esc) {
            this.searchText = '';
         }
         this.paging.currentPage = 1;
         this.getattendees();
      }

      public searchMatch(o) {
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
         this.getattendees(true);
      }

      public pageCount() {
         return Math.floor(this.paging.filteredCount / this.paging.pagesize) + 1;
      }

      pageChanged() {
         this.getattendees();
      }
      
   }
   // Register with angular
   App.CodeCamper.codeCampModule.controller(Attendees.controllerId,Attendees);
}