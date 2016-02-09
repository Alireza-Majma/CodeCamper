'use strict';
var App;
(function (App) {
    var CodeCamper;
    (function (CodeCamper) {
        var PersonDetail = (function () {
            function PersonDetail($window, $location, $routeParams, $scope, common, config, personsRepository) {
                this.$window = $window;
                this.$location = $location;
                this.$routeParams = $routeParams;
                this.$scope = $scope;
                this.common = common;
                this.config = config;
                this.personsRepository = personsRepository;
                this.isSaving = false;
                this.logger = this.common.logger;
                this.log = this.logger.getLogFn(PersonDetail.controllerId);
                this.logSuccess = this.logger.getLogFn(PersonDetail.controllerId, "success");
                this.logError = this.logger.getLogFn(PersonDetail.controllerId, "error");
                this.title = 'PersonDetail';
                this.activate();
                this.person = undefined;
            }
            //#endregion
            //#region public
            //#endregion
            PersonDetail.prototype.activate = function () {
                var _this = this;
                var promises = [this.getPersonById()];
                this.common.activateController(promises, PersonDetail.controllerId)
                    .then(function () {
                    _this.onDestroy();
                    _this.log('Activated person Detail View');
                });
            };
            PersonDetail.prototype.getTitle = function () {
                if (!this.person) {
                    return "Unknow person Id :" + this.personIdParameter;
                }
                return 'Edit ' + this.person['fullName'];
            };
            PersonDetail.prototype.getPersonById = function () {
                var _this = this;
                this.personIdParameter = this.$routeParams['id'];
                return this.personsRepository.getPersonById(this.personIdParameter).then(function (data) {
                    _this.person = undefined;
                    if (data) {
                        _this.person = data;
                    }
                    else {
                        _this.logError('person Id was not found , id: ' + _this.personIdParameter);
                    }
                }, function (error) {
                    _this.logError('Unable to get person ' + _this.personIdParameter);
                });
            };
            PersonDetail.prototype.canSave = function () {
                return !this.isSaving;
            };
            PersonDetail.prototype.goBack = function () {
                this.$window.history.back();
            };
            PersonDetail.prototype.reset = function () {
                this.personsRepository.reset();
            };
            PersonDetail.prototype.onDestroy = function () {
                var _this = this;
                this.$scope.$on('$destroy', function () {
                    _this.personsRepository.reset();
                });
            };
            PersonDetail.prototype.save = function () {
                var _this = this;
                this.isSaving = true;
                return this.personsRepository.save().then(function (result) {
                    _this.isSaving = false;
                }, function () {
                    this.isSaving = false;
                });
            };
            PersonDetail.controllerId = 'personDetail';
            //#endregion
            //#region constructor
            PersonDetail.$inject = ['$window', '$location', '$routeParams', '$scope', 'common', 'app.config', 'personsRepository'];
            return PersonDetail;
        })();
        CodeCamper.PersonDetail = PersonDetail;
        // Register with angular
        App.CodeCamper.codeCampModule.controller(PersonDetail.controllerId, PersonDetail);
    })(CodeCamper = App.CodeCamper || (App.CodeCamper = {}));
})(App || (App = {}));
//# sourceMappingURL=personDetail.js.map