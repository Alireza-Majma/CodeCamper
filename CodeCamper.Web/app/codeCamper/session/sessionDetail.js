'use strict';
var App;
(function (App) {
    var CodeCamper;
    (function (CodeCamper) {
        var SessionDetail = (function () {
            function SessionDetail($window, $location, $routeParams, $scope, common, config, baseRepository, sessionsRepository, personsRepository, bsDialog) {
                this.isSaving = false;
                this.speakers = [];
                this.hasChanges = false;
                this.$location = $location;
                this.config = config,
                    this.baseRepository = baseRepository;
                this.sessionsRepository = sessionsRepository;
                this.personsRepository = personsRepository;
                this.$scope = $scope;
                this.$routeParams = $routeParams;
                this.$window = $window;
                this.bsDialog = bsDialog;
                this.common = common;
                this.logger = this.common.logger;
                this.log = this.logger.getLogFn(SessionDetail.controllerId);
                this.logSuccess = this.logger.getLogFn(SessionDetail.controllerId, "success");
                this.logError = this.logger.getLogFn(SessionDetail.controllerId, "error");
                this.title = 'SessionDetail';
                this.rooms = this.baseRepository.setLookupCachedData(this.baseRepository.entityNames.room);
                this.tracks = this.baseRepository.setLookupCachedData(this.baseRepository.entityNames.track);
                this.timeSlots = this.baseRepository.setLookupCachedData(this.baseRepository.entityNames.timeSlot);
                this.activate();
            }
            //#endregion
            //#region public
            //#endregion
            SessionDetail.prototype.activate = function () {
                var _this = this;
                var promises = [this.getSessionById(), this.getPersons()];
                this.common.activateController(promises, SessionDetail.controllerId)
                    .then(function () {
                    _this.onDestroy();
                    _this.onHasChanges();
                    _this.log('Activated Session Detail View');
                });
            };
            SessionDetail.prototype.getTitle = function () {
                if (!this.session) {
                    return "Unknow Session Id :" + this.sessionIdParameter;
                }
                return this.sessionIdParameter === 'new' ? 'New Session' : 'Edit ' + this.session['title'];
            };
            SessionDetail.prototype.getSessionById = function () {
                var _this = this;
                this.sessionIdParameter = this.$routeParams['id'];
                var val = this.sessionIdParameter;
                if (val === "new") {
                    return this.session = this.sessionsRepository.create();
                }
                return this.sessionsRepository.getSessionById(this.sessionIdParameter)
                    .then(function (data) {
                    _this.session = undefined;
                    if (data) {
                        _this.session = data;
                    }
                    else {
                        _this.logError('session Id was not found , id: ' + _this.sessionIdParameter);
                    }
                }, function (error) {
                    _this.logError('Unable to get session ' + _this.sessionIdParameter);
                });
            };
            SessionDetail.prototype.getPersons = function () {
                var _this = this;
                this.personsRepository.getPersons(false, true)
                    .then(function (data) {
                    _this.speakers = data.result;
                });
            };
            SessionDetail.prototype.canSave = function () {
                if (!this.session) {
                    return false;
                }
                if (this.session.entityAspect.entityState.isAdded()) {
                    return true;
                }
                return this.session['hasChanges'] && !this.isSaving;
            };
            SessionDetail.prototype.canDelete = function () {
                if (this.session && this.session.entityAspect && this.session.entityAspect.entityState) {
                    return !this.session.entityAspect.entityState.isAdded();
                }
                return true;
            };
            SessionDetail.prototype.goBack = function () {
                //$window.history.back();
                this.gotoSessionPage();
            };
            SessionDetail.prototype.reset = function () {
                this.sessionsRepository.reset();
                this.goBack();
            };
            SessionDetail.prototype.onDestroy = function () {
                var _this = this;
                this.$scope.$on('$destroy', function () {
                    _this.sessionsRepository.reset();
                });
            };
            SessionDetail.prototype.save = function () {
                var _this = this;
                this.isSaving = true;
                return this.sessionsRepository.save()
                    .then(function (saveResult) {
                    _this.sessionsRepository.calcIsSpeaker();
                    _this.isSaving = false;
                }, function () {
                    _this.isSaving = false;
                });
            };
            SessionDetail.prototype.gotoSessionPage = function () {
                this.$location.path('/sessions');
            };
            SessionDetail.prototype.deleteEntity = function () {
                var _this = this;
                this.bsDialog.deleteDialog('Session')
                    .then(function () {
                    _this.sessionsRepository.markDeleted(_this.session);
                    var success = function () {
                        _this.log('Session was deleted');
                        _this.sessionsRepository.calcIsSpeaker();
                        _this.gotoSessionPage();
                    };
                    var failed = function () {
                        _this.logError('session eas not deleted');
                    };
                    _this.save().then(success, failed);
                });
            };
            SessionDetail.prototype.onHasChanges = function () {
                var _this = this;
                this.$scope.$on(this.config.events.hasChangesChanged, function (event, data) {
                    _this.hasChanges = data.hasChanges;
                });
            };
            SessionDetail.controllerId = 'sessionDetail';
            //#endregion
            //#region constructor
            SessionDetail.$inject = ['$window', '$location', '$routeParams', '$scope', 'common', 'app.config', 'baseRepository', 'sessionsRepository', 'personsRepository', 'bootstrap.dialog'];
            return SessionDetail;
        })();
        CodeCamper.SessionDetail = SessionDetail;
        // Register with angular
        App.CodeCamper.codeCampModule.controller(SessionDetail.controllerId, SessionDetail);
    })(CodeCamper = App.CodeCamper || (App.CodeCamper = {}));
})(App || (App = {}));
//# sourceMappingURL=sessionDetail.js.map