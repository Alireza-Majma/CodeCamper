var App;
(function (App) {
    var CodeCamper;
    (function (CodeCamper) {
        CodeCamper.codeCampModule = angular.module('app.codeCamper', [
            // Angular modules 
            'ngAnimate',
            'ngRoute',
            'ngSanitize',
            // Custom modules 
            'app.common',
            'app.common.bootstrap',
            // 3rd Party Modules
            'ui.bootstrap',
            'breeze.angular',
            'breeze.directives',
            'ui.grid',
            'ui.grid.pagination',
            'ui.grid.selection']);
        // Handle routing errors and success events
        CodeCamper.codeCampModule.run(['$route', '$templateCache', 'breeze', 'miscRepository', 'routemediator', 'app.config', 'codeCamper.routes',
            function ($route, $templateCache, breeze, dcMisc, routemediator, appConfig, codeCamperRoutes) {
                routemediator.updateDocTitle();
                routemediator.handleRouteError();
                dcMisc.prime();
                appConfig.routes = codeCamperRoutes;
            }]);
    })(CodeCamper = App.CodeCamper || (App.CodeCamper = {}));
})(App || (App = {}));
//# sourceMappingURL=codeCamper.module.js.map