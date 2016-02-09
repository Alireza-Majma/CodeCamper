'use strict';
module App {

   export var app = angular.module('app', [
   // Angular modules 
      'ngAnimate',        // animations
      'ngRoute',          // routing
      'ngSanitize',       // sanitizes html bindings (ex: sidebarCtrl.js)

   // 3rd Party Modules
      'ui.bootstrap',      // ui-bootstrap (ex: carousel, pagination, dialog)
      'breeze.angular',    // configures breeze for an angular app
      'breeze.directives', // contains the breeze validation directive (zValidate)
      'ui.grid',            //angular grid written with no dependencies other than AngularJ
      'ui.grid.pagination',
      'ui.grid.selection',

   // Custom modules 
      'app.common',           // common functions, logger, spinner
      'app.common.bootstrap', // bootstrap dialog wrapper functions

   // feature module 
      'app.codeCamper'
   ]);
    
   // Handle routing errors and success events
   app.run(['$route', function ($route) {
      // Include $route to kick start the router.
   }]);
}

