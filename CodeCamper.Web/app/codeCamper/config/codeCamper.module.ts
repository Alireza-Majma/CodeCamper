module App.CodeCamper {
   import shared = App.Shared;
   export var codeCampModule: ng.IModule = angular.module('app.codeCamper', [
   // Angular modules 
      'ngAnimate',        // animations
      'ngRoute',          // routing
      'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)

   // Custom modules 
      'app.common',           // common functions, logger, spinner
      'app.common.bootstrap', // bootstrap dialog wrapper functions

   // 3rd Party Modules
      'ui.bootstrap',      // ui-bootstrap (ex: carousel, pagination, dialog)
      'breeze.angular',    // configures breeze for an angular app
      'breeze.directives', // contains the breeze validation directive (zValidate)
      'ui.grid',            //angular grid written with no dependencies other than AngularJ
      'ui.grid.pagination',
      'ui.grid.selection']);

   // Handle routing errors and success events
   codeCampModule.run(['$route', '$templateCache', 'breeze', 'miscRepository', 'routemediator', 'app.config', 'codeCamper.routes',
      ($route, $templateCache, breeze, dcMisc, routemediator: shared.IRoutemediator, appConfig, codeCamperRoutes):void =>{
         routemediator.updateDocTitle();
         routemediator.handleRouteError();
         dcMisc.prime();
         appConfig.routes = codeCamperRoutes;
      }]);    
}