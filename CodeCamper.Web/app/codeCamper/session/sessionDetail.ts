
'use strict';

module App.CodeCamper {
   import appShared = App.Shared;
   interface ISessionDetail {
      title: string;
   }

   export class SessionDetail implements ISessionDetail {
      public static controllerId: string = 'sessionDetail';
      //#region variables
      $location: ng.ILocationService;
      $scope: ng.IRootScopeService;
      $routeParams: ng.route.IRouteParamsService;
      $window: ng.IWindowService;
      bsDialog: any;
      common: appShared.ICommon;
      config: IConfigurations;
      baseRepository: IBaseRepository;
      sessionsRepository: ISessionsRepository;
      personsRepository: IPersonsRepository;
      logger: appShared.ILogger;
      logSuccess: Function;
      logError: Function;
      log: Function;
      title: string;
      session: breeze.Entity;
      sessionIdParameter: string;
      isSaving: boolean = false;
      rooms: any[];
      tracks: any[];
      timeSlots: any[];
      speakers = [];
      hasChanges = false;

      
      //#endregion

      //#region constructor
      static $inject = ['$window', '$location', '$routeParams', '$scope', 'common', 'app.config', 'baseRepository', 'sessionsRepository', 'personsRepository', 'bootstrap.dialog'];
      constructor($window, $location: ng.ILocationService, $routeParams: ng.route.IRouteParamsService, $scope: ng.IRootScopeService, common: appShared.ICommon, config: IConfigurations, baseRepository: IBaseRepository, sessionsRepository: ISessionsRepository, personsRepository: IPersonsRepository, bsDialog: any) {
         this.$location = $location;
         this.config = config,
         this.baseRepository = baseRepository;
         this.sessionsRepository = sessionsRepository;
         this.personsRepository = personsRepository
         this.$scope = $scope;
         this.$routeParams = $routeParams;
         this.$window = $window;
         this.bsDialog = bsDialog;
         this.common = common;
         this.logger = this.common.logger;
         this.log = this.logger.getLogFn(SessionDetail.controllerId);
         this.logSuccess = this.logger.getLogFn(SessionDetail.controllerId, "success");
         this.logError = this.logger.getLogFn(SessionDetail.controllerId, "error");
         this.title = 'SessionDetail';
         this.rooms = this.baseRepository.setLookupCachedData(this.baseRepository.entityNames.room);
         this.tracks = this.baseRepository.setLookupCachedData(this.baseRepository.entityNames.track);
         this.timeSlots = this.baseRepository.setLookupCachedData(this.baseRepository.entityNames.timeSlot);
         this.activate();

      }
      //#endregion
   
      //#region public

      //#endregion
      activate() {
         var promises = [this.getSessionById(), this.getPersons()];
         this.common.activateController(promises, SessionDetail.controllerId)
            .then(() => {
               this.onDestroy();
               this.onHasChanges();
               this.log('Activated Session Detail View');
            });
      }
      public getTitle() {
         if (!this.session) {
            return "Unknow Session Id :" + this.sessionIdParameter;
         }
         return this.sessionIdParameter === 'new' ? 'New Session' : 'Edit ' + this.session['title'];
      }

      public getSessionById() {
         this.sessionIdParameter = this.$routeParams['id'];
         var val = this.sessionIdParameter;
         if (val === "new") {
            return this.session = this.sessionsRepository.create();
         }
         return this.sessionsRepository.getSessionById(this.sessionIdParameter)
            .then((data) => {
               this.session = undefined;
               if (data) {
                  this.session = data;
               } else {
                  this.logError('session Id was not found , id: ' + this.sessionIdParameter);
               }
            }, (error) => {
               this.logError('Unable to get session ' + this.sessionIdParameter);
            });
      }

      public getPersons() {
         this.personsRepository.getPersons(false, true)
            .then((data) => {
               this.speakers = data.result;
            });
      }

      public canSave() {
         if (!this.session) {
            return false;
         }
         if (this.session.entityAspect.entityState.isAdded()) {
            return true;
         }
         return this.session['hasChanges'] && !this.isSaving;
      }

      public canDelete() {
         if (this.session && this.session.entityAspect && this.session.entityAspect.entityState) {
            return !this.session.entityAspect.entityState.isAdded();
         }
         return true;
      }

      public goBack() {
         //$window.history.back();
         this.gotoSessionPage();
      }

      public reset() {
         this.sessionsRepository.reset();
         this.goBack();
      }

      public onDestroy() {
         this.$scope.$on('$destroy', () => {
            this.sessionsRepository.reset();
         });
      }

      public save() {
         this.isSaving = true;

         return this.sessionsRepository.save()
            .then((saveResult) => {
               this.sessionsRepository.calcIsSpeaker();
               this.isSaving = false;
            }, () => {
               this.isSaving = false;
            });
      }

      public gotoSessionPage() {
         this.$location.path('/sessions');
      }

      public deleteEntity() {
         this.bsDialog.deleteDialog('Session')
            .then(() => {
               this.sessionsRepository.markDeleted(this.session);
               var success = () => {
                  this.log('Session was deleted');
                  this.sessionsRepository.calcIsSpeaker();
                  this.gotoSessionPage();
               }
               var failed = () => {
                  this.logError('session eas not deleted');
               }
               this.save().then(success, failed);
            });
      }

      public onHasChanges() {
         this.$scope.$on(this.config.events.hasChangesChanged,
            (event, data) => {
               this.hasChanges = data.hasChanges;
            }
         )

      }


   }
   // Register with angular
   App.CodeCamper.codeCampModule.controller(SessionDetail.controllerId,SessionDetail);
}