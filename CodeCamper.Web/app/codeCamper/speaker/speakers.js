'use strict';
var App;
(function (App) {
    var CodeCamper;
    (function (CodeCamper) {
        var Speakers = (function () {
            function Speakers($location, common, config, personsRepository) {
                var _this = this;
                //It has to be lambda function to properly handle this pointer
                this.searchMatcher = function (o) {
                    if (!_this.searchText) {
                        return true;
                    }
                    else if (_this.common.textContains(o.firstName, _this.searchText)) {
                        return true;
                    }
                    else if (_this.common.textContains(o.lastName, _this.searchText)) {
                        return true;
                    }
                    return false;
                };
                this.$location = $location;
                this.config = config,
                    this.personsRepository = personsRepository;
                this.common = common;
                this.logger = this.common.logger.getLogger(Speakers.controllerId);
                this.title = 'Speakers';
                var vm = this;
                this.activate();
            }
            //#endregion
            //#region public
            Speakers.prototype.activate = function () {
                var _this = this;
                var init = function () {
                    _this.common.buildSearchThrottle(_this);
                    _this.logger.log('Activated Speakers View');
                };
                var promises = [this.getData()];
                this.common.activateController(promises, CodeCamper.Sessions.controllerId)
                    .then(init);
            };
            Speakers.prototype.refresh = function () {
                this.getData(true);
            };
            Speakers.prototype.getData = function (forceRefresh) {
                var _this = this;
                return this.personsRepository.getSpeakers(forceRefresh)
                    .then(function (data) {
                    _this.modelData = data.result;
                    _this.totalItemLoaded = data.totalItemLoaded;
                    return _this.modelData;
                });
            };
            Speakers.prototype.gotoSpeaker = function (speaker) {
                if (speaker && speaker.id) {
                    this.$location.path('/speaker/' + speaker.id);
                }
            };
            Speakers.controllerId = 'speakers';
            //#endregion
            //#region constructor
            Speakers.$inject = ['$location', 'common', 'app.config', 'personsRepository'];
            return Speakers;
        })();
        CodeCamper.Speakers = Speakers;
        // Register with angular
        App.CodeCamper.codeCampModule.controller(Speakers.controllerId, Speakers);
    })(CodeCamper = App.CodeCamper || (App.CodeCamper = {}));
})(App || (App = {}));
//# sourceMappingURL=speakers.js.map