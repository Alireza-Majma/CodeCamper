'use strict';
var App;
(function (App) {
    var Shared;
    (function (Shared) {
        var Routemediator = (function () {
            //#endregion
            //#region constructor
            function Routemediator($rootScope, $location, config, common) {
                this.$rootScope = $rootScope;
                this.$location = $location;
                this.config = config;
                this.handelRouteError = false;
                var logger = common.logger;
                this.logWarning = logger.getLogFn(Routemediator.serviceId, "warning");
            }
            //#endregion
            //#region public methods
            Routemediator.prototype.handleRouteError = function () {
                var _this = this;
                this.$rootScope.$on('$routeChangeError', function (event, current, privious, rejection) {
                    if (!_this.handelRouteError) {
                        _this.handelRouteError = true;
                        var message = 'Error routing: ' + (current && current.name) + ', ' + (rejection || '');
                        _this.logWarning(message, current, Routemediator.serviceId, true);
                        _this.$location.path(_this.config.routes[0].url);
                    }
                });
            };
            Routemediator.prototype.updateDocTitle = function () {
                var _this = this;
                this.$rootScope.$on('$routeChangeSuccess', function (event, current, privious) {
                    _this.$rootScope.title = (_this.config.docTitle + ' ' + (current.name || ''));
                    _this.handelRouteError = false;
                });
            };
            Routemediator.serviceId = 'routemediator';
            return Routemediator;
        })();
        Shared.Routemediator = Routemediator;
        // Creates service
        App.Shared.commonBootstrapModule.factory(Routemediator.serviceId, ['$rootScope', '$location', 'app.config', 'common',
            function ($rootScope, $location, config, common) { return new Routemediator($rootScope, $location, config, common); }]);
    })(Shared = App.Shared || (App.Shared = {}));
})(App || (App = {}));
//# sourceMappingURL=routemediator.js.map