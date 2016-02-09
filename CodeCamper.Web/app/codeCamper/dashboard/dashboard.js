'use strict';
var App;
(function (App) {
    var CodeCamper;
    (function (CodeCamper) {
        var Dashboard = (function () {
            function Dashboard($location, common, config, personsRepository, sessionsRepository) {
                var _this = this;
                this.$location = $location;
                this.common = common;
                this.config = config;
                this.personsRepository = personsRepository;
                this.sessionsRepository = sessionsRepository;
                this.content = {
                    predicate: '',
                    reverse: false,
                    setSort: function (prop) {
                        _this.content.predicate = prop;
                        _this.content.reverse = !_this.content.reverse;
                    },
                    title: 'Content',
                    tracks: []
                };
                this.news = {
                    title: 'Code Camper Angular',
                    description: 'Code Camper is a SPA template for Angular developers.'
                };
                this.topSpeakerCarousel = {
                    interval: 2000,
                    topList: [],
                    title: 'Top Speakers'
                };
                this.logger = this.common.logger;
                this.log = this.logger.getLogFn(Dashboard.controllerId);
                this.logSuccess = this.logger.getLogFn(Dashboard.controllerId, "success");
                this.logError = this.logger.getLogFn(Dashboard.controllerId, "error");
                this.title = 'Dashboard';
                this.activate();
            }
            //#endregion
            //#region public
            //#endregion
            Dashboard.prototype.activate = function () {
                var _this = this;
                var promises = [this.getSessionCount(), this.getSpeakerCount(), this.getPersonsCount(), this.getTrackCounts(), this.getTopSpeakers()];
                this.common.activateController(promises, Dashboard.controllerId)
                    .then(function () {
                    _this.log('Activated Dashboard View');
                });
            };
            Dashboard.prototype.getSessionCount = function () {
                var _this = this;
                return this.sessionsRepository.getSessionCount().then(function (data) {
                    return _this.sessionCount = data;
                });
            };
            Dashboard.prototype.getSpeakerCount = function () {
                var _this = this;
                return this.personsRepository.getSpeakerCount().then(function (data) {
                    return _this.speakerCount = data;
                });
            };
            Dashboard.prototype.getPersonsCount = function () {
                var _this = this;
                return this.personsRepository.getPersonsCount().then(function (data) {
                    return _this.attendeeCount = data;
                });
            };
            Dashboard.prototype.getTopSpeakers = function () {
                var _this = this;
                var speakers = this.sessionsRepository.getToSpeakers().then(function (data) {
                    _this.topSpeakerCarousel.topList = data;
                });
            };
            Dashboard.prototype.getTrackCounts = function () {
                return this.content.tracks = this.sessionsRepository.getTrackCounts();
            };
            Dashboard.prototype.setContentSort = function (prop) {
                this.content.predicate = prop;
                this.content.reverse = !this.content.reverse;
            };
            Dashboard.controllerId = 'dashboard';
            //#endregion
            //#region constructor
            Dashboard.$inject = ['$location', 'common', 'app.config', 'personsRepository', 'sessionsRepository'];
            return Dashboard;
        })();
        CodeCamper.Dashboard = Dashboard;
        // Register with angular
        App.CodeCamper.codeCampModule.controller(Dashboard.controllerId, Dashboard);
    })(CodeCamper = App.CodeCamper || (App.CodeCamper = {}));
})(App || (App = {}));
//# sourceMappingURL=dashboard.js.map