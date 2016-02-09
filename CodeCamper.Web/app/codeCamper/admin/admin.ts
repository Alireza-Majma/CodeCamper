
'use strict';

module App.CodeCamper {
   import appShared = App.Shared;
   interface IAdmin {
      title: string;
   }

   export class Admin implements IAdmin {
      public static controllerId: string = 'admin';
      //#region variables
      logger: appShared.ILogger;
      logSuccess: Function;
      logError: Function;
      log: Function;
      title: string;
      //#endregion

      //#region constructor
      static $inject = ['$location', 'common', 'app.config', 'personsRepository'];
      constructor(private $location: ng.ILocationService,
                  private common: appShared.ICommon,
                  private config: IConfigurations,
                  private personsRepository: IPersonsRepository) {
      
         this.logger = this.common.logger;
         this.log = this.logger.getLogFn(Admin.controllerId);
         this.logSuccess = this.logger.getLogFn(Admin.controllerId, "success");
         this.logError = this.logger.getLogFn(Admin.controllerId, "error");
         this.title = 'Admin';
         this.activate();
      }
      //#endregion
   
      //#region public

      //#endregion
      activate() {
         this.common.activateController([], Admin.controllerId)
            .then(()=> { this.log('Activated Admin View'); });
      }
   }
   // Register with angular
   App.CodeCamper.codeCampModule.controller(Admin.controllerId,Admin);
}