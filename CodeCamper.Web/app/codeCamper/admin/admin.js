'use strict';
var App;
(function (App) {
    var CodeCamper;
    (function (CodeCamper) {
        var Admin = (function () {
            function Admin($location, common, config, personsRepository) {
                this.$location = $location;
                this.common = common;
                this.config = config;
                this.personsRepository = personsRepository;
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
            Admin.prototype.activate = function () {
                var _this = this;
                this.common.activateController([], Admin.controllerId)
                    .then(function () { _this.log('Activated Admin View'); });
            };
            Admin.controllerId = 'admin';
            //#endregion
            //#region constructor
            Admin.$inject = ['$location', 'common', 'app.config', 'personsRepository'];
            return Admin;
        })();
        CodeCamper.Admin = Admin;
        // Register with angular
        App.CodeCamper.codeCampModule.controller(Admin.controllerId, Admin);
    })(CodeCamper = App.CodeCamper || (App.CodeCamper = {}));
})(App || (App = {}));
//# sourceMappingURL=admin.js.map