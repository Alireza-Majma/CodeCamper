
'use strict';

module App.CodeCamper {
   import appShared = App.Shared;
   interface IPersonDetail {
      title: string;
   }

   export class PersonDetail implements IPersonDetail {
      public static controllerId: string = 'personDetail';
      //#region variables
      logger: appShared.ILogger;
      logSuccess: Function;
      logError: Function;
      log: Function;
      title: string;
      person: Object;
      personIdParameter: string;
      isSaving: boolean = false;
      
      //#endregion

      //#region constructor
      static $inject = ['$window', '$location', '$routeParams', '$scope', 'common', 'app.config', 'personsRepository'];
      constructor(private $window,
                  private $location: ng.ILocationService,
                  private $routeParams: ng.route.IRouteParamsService,
                  private $scope: ng.IRootScopeService,
                  private common: appShared.ICommon,
                  private config: IConfigurations,
                  private personsRepository: IPersonsRepository) {
         
         this.logger = this.common.logger;
         this.log = this.logger.getLogFn(PersonDetail.controllerId);
         this.logSuccess = this.logger.getLogFn(PersonDetail.controllerId, "success");
         this.logError = this.logger.getLogFn(PersonDetail.controllerId, "error");
         this.title = 'PersonDetail';
         this.activate();
         this.person = undefined;
         
      }
      //#endregion
   
      //#region public

      //#endregion
      activate() {
         var promises = [this.getPersonById()];
         this.common.activateController(promises, PersonDetail.controllerId)
            .then(() => {
               this.onDestroy();
               this.log('Activated person Detail View');
            });
      }

      public getTitle() {
         if (!this.person) {
            return "Unknow person Id :" + this.personIdParameter;
         }
         return 'Edit ' + this.person['fullName'];
      }

      public getPersonById() {
         this.personIdParameter = this.$routeParams['id'];
         return this.personsRepository.getPersonById(this.personIdParameter).then((data) => {
            this.person = undefined;
            if (data) {
               this.person = data;
            } else {
               this.logError('person Id was not found , id: ' + this.personIdParameter);
            }
         }, (error) => {
            this.logError('Unable to get person ' + this.personIdParameter);
         });
      }

      public canSave() {
         return !this.isSaving;
      }

      public goBack() {
         this.$window.history.back();
      }

      public reset() {
         this.personsRepository.reset();
      }

      public onDestroy() {
         this.$scope.$on('$destroy', () => {
            this.personsRepository.reset();
         });
      }

      public save() {
         this.isSaving = true;

         return this.personsRepository.save().then((result)=> {
            this.isSaving = false;
         }, function () {
            this.isSaving = false;
         });
      }
   }
   // Register with angular
   App.CodeCamper.codeCampModule.controller(PersonDetail.controllerId,PersonDetail);
}