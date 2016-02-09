
'use strict';

module App.CodeCamper {
   import appShared = App.Shared;
   interface ISpeakerDetail {
      title: string;
   }

   export class SpeakerDetail implements ISpeakerDetail {
      public static controllerId: string = 'speakerDetail';
      //#region variables
      $location: ng.ILocationService;
      $scope: ng.IRootScopeService;
      $routeParams: ng.route.IRouteParamsService;
      $window: ng.IWindowService;
      common: appShared.ICommon;
      config: IConfigurations;
      personsRepository: IPersonsRepository;
      sessionsRepository: ISessionsRepository;
      logger: appShared.ILogger;
      logSuccess: Function;
      logError: Function;
      log: Function;
      title: string;
      speaker: IModelPerson;
      speakerIdParameter: string;
      isSaving: boolean = false;
      
      //#endregion

      //#region constructor
      static $inject = ['$window', '$location', '$routeParams', '$scope', 'common', 'app.config', 'personsRepository', 'sessionsRepository'];
      constructor($window, $location: ng.ILocationService, $routeParams: ng.route.IRouteParamsService, $scope: ng.IRootScopeService, common: appShared.ICommon, config: IConfigurations, personsRepository: IPersonsRepository, sessionsRepository: ISessionsRepository) {
         this.$location = $location;
         this.config = config,
         this.personsRepository = personsRepository;
         this.sessionsRepository = sessionsRepository;
         this.$scope = $scope;
         this.$routeParams = $routeParams;
         this.$window = $window;
         this.common = common;
         this.logger = this.common.logger;
         this.log = this.logger.getLogFn(SpeakerDetail.controllerId);
         this.logSuccess = this.logger.getLogFn(SpeakerDetail.controllerId, "success");
         this.logError = this.logger.getLogFn(SpeakerDetail.controllerId, "error");
         this.title = 'SpeakerDetail';
         this.activate();
         this.speaker = undefined;

      }
      //#endregion
   
      //#region public

      //#endregion
      activate() {
         var promises = [this.getPersonById(), this.checkCachedData()];
         this.common.activateController(promises, SpeakerDetail.controllerId)
            .then(() => {
               this.onDestroy();
               this.log('Activated speaker Detail View');
            });
      }

      public getTitle() {
         if (!this.speaker) {
            return "Unknow speaker Id :" + this.speakerIdParameter;
         }
         return 'Edit ' + this.speaker['fullName'];
      }

      public checkCachedData(): ng.IPromise<any> {
         return this.sessionsRepository.checkCachedData();
      }

      public getPersonById(): ng.IPromise<any> {
         this.speakerIdParameter = this.$routeParams['id'];
         return this.personsRepository.getPersonById(this.speakerIdParameter).then((data) => {
            this.speaker = undefined;
            if (data) {
               this.speaker = data;
            } else {
               this.logError('speaker Id was not found , id: ' + this.speakerIdParameter);
            }
         }, (error) => {
            this.logError('Unable to get speaker ' + this.speakerIdParameter);
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

         return this.personsRepository.save().then((result) => {
            this.isSaving = false;
         }, function () {
            this.isSaving = false;
         });
      }
   }
   // Register with angular
   App.CodeCamper.codeCampModule.controller(SpeakerDetail.controllerId,SpeakerDetail);
}