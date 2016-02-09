'use strict';
var App;
(function (App) {
    var CodeCamper;
    (function (CodeCamper) {
        var Sessions = (function () {
            function Sessions($location, common, config, sessionsRepository) {
                var _this = this;
                this.searchMatcher = function (o) {
                    if (!_this.searchText) {
                        return true;
                    }
                    else if (_this.common.textContains(o.title, _this.searchText)) {
                        return true;
                    }
                    else if (_this.common.textContains(o.room.name, _this.searchText)) {
                        return true;
                    }
                    else if (_this.common.textContains(o.track.name, _this.searchText)) {
                        return true;
                    }
                    else if (_this.common.textContains(o.speaker.firstName, _this.searchText)) {
                        return true;
                    }
                    else if (_this.common.textContains(o.speaker.lastName, _this.searchText)) {
                        return true;
                    }
                    return false;
                };
                this.$location = $location;
                this.config = config,
                    this.sessionsRepository = sessionsRepository;
                this.common = common;
                this.logger = this.common.logger;
                this.log = this.logger.getLogFn(Sessions.controllerId);
                this.logSuccess = this.logger.getLogFn(Sessions.controllerId, "success");
                this.logError = this.logger.getLogFn(Sessions.controllerId, "error");
                this.title = 'Sessions';
                this.activate();
            }
            //#endregion
            //#region public
            Sessions.prototype.activate = function () {
                var _this = this;
                var init = function () {
                    _this.search = _this.common.buildSearchThrottle(_this, function (data) { _this.filteredList = data; });
                    _this.log('Activated Session View');
                };
                var promises = [this.getData()];
                this.common.activateController(promises, Sessions.controllerId)
                    .then(init);
            };
            Sessions.prototype.refresh = function () {
                this.getData(true);
            };
            Sessions.prototype.getData = function (forceRefresh) {
                var _this = this;
                return this.sessionsRepository.getSessions(forceRefresh).then(function (data) {
                    _this.modelData = data.result;
                    _this.totalItemLoaded = data.totalItemLoaded;
                    return _this.modelData;
                });
            };
            Sessions.prototype.gotoSession = function (session) {
                if (session && session.id) {
                    this.$location.path('/session/' + session.id);
                }
            };
            Sessions.controllerId = 'sessions';
            //#endregion
            //#region constructor
            Sessions.$inject = ['$location', 'common', 'app.config', 'sessionsRepository'];
            return Sessions;
        })();
        CodeCamper.Sessions = Sessions;
        // Register with angular
        App.CodeCamper.codeCampModule.controller(Sessions.controllerId, Sessions);
    })(CodeCamper = App.CodeCamper || (App.CodeCamper = {}));
})(App || (App = {}));
//# sourceMappingURL=sessions.js.map