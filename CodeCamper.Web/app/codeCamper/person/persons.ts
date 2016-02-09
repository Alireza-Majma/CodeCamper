
'use strict';

module App.CodeCamper {
   import appShared = App.Shared;
   interface IPersons {
      title: string;
   }
   
   export class Persons implements IPersons {
      public static controllerId: string = 'persons';
      //#region variables
      logger: appShared.ILogger;
      logSuccess: Function;
      logError: Function;
      log: Function;
      title: string;
      speakerCount: any;
      sessionCount: any;
      attendeeCount: any;
      personsList: any[];
      columnDefs = [{name: 'Act', displayName: '', width: '7%', enableColumnMenu: false,
                     cellTemplate: '<a href="" ng-click="grid.appScope.vm.gotoPersonDetail(row.entity)"><i class="glyphicon glyphicon-edit ui-grid-cell-contents"></i></a>' },
                     { field: 'firstName', displayName: 'First Name', width: '16%' },
                     { field: 'lastName', displayName: 'Last  Name', width: '16%' },
                     { field: 'email', displayName: 'Email', width: '15%' },
                     { field: 'blog', displayName: 'Blog', width: '15%' },
                     { field: 'twitter', displayName: 'Twitter', width: '15%' },
                     { field: 'genderType', displayName: 'Gender', width: '15%' }]
      personGrid = {
         data: 'vm.personsList',
         columnDefs: this.columnDefs,
         paginationPageSizes: [25, 50, 75],
         paginationPageSize: 25,
         enableRowSelection: true,
         enableRowHeaderSelection: false,
         multiSelect: false,
      };
      
      //#endregion

      //#region constructor
      static $inject = ['$location', 'common', 'app.config', 'personsRepository'];
      constructor(private $location: ng.ILocationService,
                  private common: appShared.ICommon,
                  private config: IConfigurations,
                  private personsRepository: IPersonsRepository) {
         this.logger = this.common.logger;
         this.log = this.logger.getLogFn(Persons.controllerId);
         this.logSuccess = this.logger.getLogFn(Persons.controllerId, "success");
         this.logError = this.logger.getLogFn(Persons.controllerId, "error");
         this.title = 'Persons';
         this.activate();
         this.personsList = [];
      }
      //#endregion
   
      //#region public

      //#endregion
      activate() {
         var promises = [this.getPersons()];
         this.common.activateController(promises, Persons.controllerId)
            .then(() => {
               this.log('Activated person View');
            });
      }

      public getPersons(forceRefresh?: boolean): ng.IPromise<any> {
         return this.personsRepository.getAllPersons().then((data) => {
            this.personsList = data;
            this.personGrid.data = data;
            return this.personsList;
         });
      }

      public gotoPersonDetail(person: any) {
         if (person && person.id) {
            this.$location.path('/person/' + person.id);
         }
      }
      
   }
   // Register with angular
   
   App.CodeCamper.codeCampModule.controller(Persons.controllerId, Persons);
}