'use strict';
var App;
(function (App) {
    var Controllers;
    (function (Controllers) {
        var Shell = (function () {
            function Shell($rootScope, $scope, $route, config, common) {
                //#region Variables
                this.busyMessage = 'Please wait...';
                this.controllerId = Shell.controllerId;
                this.isBusy = true;
                this.state = true;
                this.toggledClass = '';
                var vm = this;
                vm.common = common;
                vm.config = config;
                vm.$rootScope = $rootScope;
                vm.$route = $route;
                vm.navRoutes = [];
                vm.activate();
                vm.registerEvents();
                vm.spinnerOperations = {
                    radius: 40,
                    lines: 7,
                    length: 20,
                    width: 30,
                    speed: 1.7,
                    corners: 1.0,
                    trail: 100,
                    color: '#F58A00'
                };
            }
            Shell.prototype.toggleSpinner = function (on) {
                this.isBusy = on;
            };
            Shell.prototype.isCurrent = function (route) {
                if (!route.config.name || !this.$route.current || !this.$route.current.name) {
                    return '';
                }
                var menuName = route.config.name;
                return this.$route.current.name.substr(0, menuName.length) === menuName ? 'current active' : '';
            };
            Shell.prototype.activate = function () {
                this.navRoutes = this.config.routes
                    .filter(function (r, index, arr) { return r.settings && !!r.settings.nav; })
                    .sort(function (r1, r2) { return r1.settings.nav - r2.settings.nav; });
                var logger = this.common.logger.getLogFn(this.controllerId, 'success');
                logger('Hot Towel Angular loaded!', null, true);
                this.common.activateController([], this.controllerId);
            };
            Shell.prototype.toggleState = function (id) {
                this.state = !this.state;
                if (this.toggledClass.indexOf("toggled-" + id) > -1) {
                    this.toggledClass = '';
                }
                else {
                    this.toggledClass = 'toggled-' + id;
                }
            };
            Shell.prototype.registerEvents = function () {
                var _this = this;
                var events = this.config.events;
                this.$rootScope.$on('$routeChangeStart', function (event, next, current) { _this.toggleSpinner(true); });
                this.$rootScope.$on(events.controllerActivateSuccess, function (data) { _this.toggleSpinner(false); });
                this.$rootScope.$on(events.spinnerToggle, function (data) { _this.toggleSpinner(data.show); });
            };
            Shell.controllerId = 'shell';
            //#endregion
            Shell.$inject = ['$rootScope', '$scope', '$route', 'app.config', 'common'];
            return Shell;
        })();
        Controllers.Shell = Shell;
        // Register with angular
        App.app.controller(Shell.controllerId, Shell);
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
//# sourceMappingURL=shell.js.map