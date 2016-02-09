'use strict';
var App;
(function (App) {
    var CodeCamper;
    (function (CodeCamper) {
        var SpeakerDetail = (function () {
            function SpeakerDetail($window, $location, $routeParams, $scope, common, config, personsRepository, sessionsRepository) {
                this.isSaving = false;
                this.$location = $location;
                this.config = config,
                    this.personsRepository = personsRepository;
                this.sessionsRepository = sessionsRepository;
                this.$scope = $scope;
                this.$routeParams = $routeParams;
                this.$window = $window;
                this.common = common;
                this.logger = this.common.logger;
                this.log = this.logger.getLogFn(SpeakerDetail.controllerId);
                this.logSuccess = this.logger.getLogFn(SpeakerDetail.controllerId, "success");
                this.logError = this.logger.getLogFn(SpeakerDetail.controllerId, "error");
                this.title = 'SpeakerDetail';
                this.activate();
                this.speaker = undefined;
            }
            //#endregion
            //#region public
            //#endregion
            SpeakerDetail.prototype.activate = function () {
                var _this = this;
                var promises = [this.getPersonById(), this.checkCachedData()];
                this.common.activateController(promises, SpeakerDetail.controllerId)
                    .then(function () {
                    _this.onDestroy();
                    _this.log('Activated speaker Detail View');
                });
            };
            SpeakerDetail.prototype.getTitle = function () {
                if (!this.speaker) {
                    return "Unknow speaker Id :" + this.speakerIdParameter;
                }
                return 'Edit ' + this.speaker['fullName'];
            };
            SpeakerDetail.prototype.checkCachedData = function () {
                return this.sessionsRepository.checkCachedData();
            };
            SpeakerDetail.prototype.getPersonById = function () {
                var _this = this;
                this.speakerIdParameter = this.$routeParams['id'];
                return this.personsRepository.getPersonById(this.speakerIdParameter).then(function (data) {
                    _this.speaker = undefined;
                    if (data) {
                        _this.speaker = data;
                    }
                    else {
                        _this.logError('speaker Id was not found , id: ' + _this.speakerIdParameter);
                    }
                }, function (error) {
                    _this.logError('Unable to get speaker ' + _this.speakerIdParameter);
                });
            };
            SpeakerDetail.prototype.canSave = function () {
                return !this.isSaving;
            };
            SpeakerDetail.prototype.goBack = function () {
                this.$window.history.back();
            };
            SpeakerDetail.prototype.reset = function () {
                this.personsRepository.reset();
            };
            SpeakerDetail.prototype.onDestroy = function () {
                var _this = this;
                this.$scope.$on('$destroy', function () {
                    _this.personsRepository.reset();
                });
            };
            SpeakerDetail.prototype.save = function () {
                var _this = this;
                this.isSaving = true;
                return this.personsRepository.save().then(function (result) {
                    _this.isSaving = false;
                }, function () {
                    this.isSaving = false;
                });
            };
            SpeakerDetail.controllerId = 'speakerDetail';
            //#endregion
            //#region constructor
            SpeakerDetail.$inject = ['$window', '$location', '$routeParams', '$scope', 'common', 'app.config', 'personsRepository', 'sessionsRepository'];
            return SpeakerDetail;
        })();
        CodeCamper.SpeakerDetail = SpeakerDetail;
        // Register with angular
        App.CodeCamper.codeCampModule.controller(SpeakerDetail.controllerId, SpeakerDetail);
    })(CodeCamper = App.CodeCamper || (App.CodeCamper = {}));
})(App || (App = {}));
//# sourceMappingURL=speakerDetail.js.map