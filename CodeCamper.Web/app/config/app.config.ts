
module App {
   'use strict';
   import shared = App.Shared;

   export interface IEvents {
      controllerActivateSuccess: string;
      spinnerToggle: string;
      hasChangesChanged: string;
   }
   export interface IImageSettings {
      imageBasePath: string;
      unknownPersonImageSource: string;
   }

   export interface IKeyCodes {
      backspace: number;
      tab: number;
      enter: number;
      esc: number;
      space: number;
      pageup: number;
      pagedown: number;
      end: number;
      home: number;
      left: number;
      up: number;
      right: number;
      insert: number;
      del: number;
   }

   export interface IConfigurations {
      appErrorPrefix: string;//Configure the exceptionHandler decorator
      docTitle: string;
      events: IEvents;
      remoteServiceName: string;
      version: string;
      imageSettings: IImageSettings;
      keyCodes: IKeyCodes;
      routes: any[];
   }
    
   // Configure Toastr
   toastr.options.timeOut = 4000;
   toastr.options.positionClass = 'toast-bottom-right';

   // For use with the HotTowel-Angular-Breeze add-on that uses Breeze
   var remoteServiceName = '/Breeze/CodeCamper';

   var events: IEvents = {
      controllerActivateSuccess: 'controller.activateSuccess',
      spinnerToggle: 'spinner.toggle',
      hasChangesChanged: 'baseRepository.hasChangesChanged'
   };

   var keyCodes = {
      backspace: 8,
      tab: 9,
      enter: 13,
      esc: 27,
      space: 32,
      pageup: 33,
      pagedown: 34,
      end: 35,
      home: 36,
      left: 37,
      up: 38,
      right: 39,
      insert: 45,
      del: 46
   };

   var config: IConfigurations = {
      appErrorPrefix: '[Camper Error] ', //Configure the exceptionHandler decorator
      docTitle: 'Code Camper: ',
      events: events,
      remoteServiceName: remoteServiceName,
      version: '2.1.0',
      imageSettings: {
         imageBasePath: '../content/images/photos/',
         unknownPersonImageSource: 'unknown_person.jpg'
      },
      keyCodes: keyCodes,
      routes: []
   };

   var app = App.app;
   var appValueId = 'app.config';
   app.value(appValueId, config);

   //Configure the log service
   app.config(['$logProvider', $logProvider => {
      // turn debugging off/on (no info or warn)
      if ($logProvider.debugEnabled) {
         $logProvider.debugEnabled(true);
      }
   }]);
   
   //#region Configure the common services via commonConfig
   app.config(['commonConfigProvider', (cfg: shared.ICommonConfig) => {
      cfg.config.controllerActivateSuccessEvent = config.events.controllerActivateSuccess;
      cfg.config.spinnerToggleEvent = config.events.spinnerToggle;
   }]);

   app.config(['$provide', function ($provide) {
      $provide.decorator('$exceptionHandler', ['$delegate', 'app.config', 'logger', extendExceptionHandler]);
   }]);
    
   // Extend the $exceptionHandler service to also display a toast.
   function extendExceptionHandler($delegate: ng.IExceptionHandlerService, config, logger: App.Shared.ILogger) {
      var appErrorPrefix: string = config.appErrorPrefix;
      
      return function (exception: Error, cause: string) {
         $delegate(exception, cause);
         if (appErrorPrefix && exception.message.indexOf(appErrorPrefix) === 0) { return; }

         var errorData = { exception: exception, cause: cause };
         var msg: string = appErrorPrefix + exception.message;
         logger.logError(msg, errorData, appValueId, true);
      };
   }
   //#endregion
}

 
