'use strict';
var App;
(function (App) {
    App.app = angular.module('app', [
        // Angular modules 
        'ngAnimate',
        'ngRoute',
        'ngSanitize',
        // 3rd Party Modules
        'ui.bootstrap',
        'breeze.angular',
        'breeze.directives',
        'ui.grid',
        'ui.grid.pagination',
        'ui.grid.selection',
        // Custom modules 
        'app.common',
        'app.common.bootstrap',
        // feature module 
        'app.codeCamper'
    ]);
    // Handle routing errors and success events
    App.app.run(['$route', function ($route) {
            // Include $route to kick start the router.
        }]);
})(App || (App = {}));
//# sourceMappingURL=app.module.js.map