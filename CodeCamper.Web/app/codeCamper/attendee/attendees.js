'use strict';
var App;
(function (App) {
    var CodeCamper;
    (function (CodeCamper) {
        var Attendees = (function () {
            function Attendees($location, common, config, personsRepository) {
                var _this = this;
                this.$location = $location;
                this.common = common;
                this.config = config;
                this.personsRepository = personsRepository;
                this.logger = this.common.logger;
                this.log = this.logger.getLogFn(Attendees.controllerId);
                this.logSuccess = this.logger.getLogFn(Attendees.controllerId, "success");
                this.logError = this.logger.getLogFn(Attendees.controllerId, "error");
                this.title = 'Attendees';
                this.searchText = '';
                this.attendeeList = [];
                //this.filteredCount = 0;
                this.totalItemLoaded = 0;
                this.paging = {
                    pagesize: 15,
                    currentPage: 1,
                    maxPagesToShow: 10,
                    pageCount: function () {
                        return Math.floor(_this.paging.filteredCount / _this.paging.pagesize) + 1;
                    },
                    filteredCount: 0
                };
                this.activate();
            }
            //#endregion
            //#region public
            //#endregion
            Attendees.prototype.activate = function () {
                var _this = this;
                var promises = [this.getattendees()];
                this.common.activateController(promises, Attendees.controllerId)
                    .then(function () {
                    _this.log('Activated Attendee View');
                });
            };
            Attendees.prototype.getattendees = function (forceRefresh) {
                var _this = this;
                return this.personsRepository.getPagedPersons(this.searchText, forceRefresh, this.paging.currentPage, this.paging.pagesize).then(function (data) {
                    _this.attendeeList = data.result;
                    _this.totalItemLoaded = data.totalItemLoaded;
                    _this.paging.filteredCount = data.filterCount;
                    return _this.attendeeList;
                });
            };
            Attendees.prototype.search = function ($event) {
                if ($event.keyCode === this.config.keyCodes.esc) {
                    this.searchText = '';
                }
                this.paging.currentPage = 1;
                this.getattendees();
            };
            Attendees.prototype.searchMatch = function (o) {
                if (!this.searchText) {
                    return true;
                }
                else if (this.common.textContains(o.firstName, this.searchText)) {
                    return true;
                }
                else if (this.common.textContains(o.lastName, this.searchText)) {
                    return true;
                }
                return false;
            };
            Attendees.prototype.refresh = function () {
                this.getattendees(true);
            };
            Attendees.prototype.pageCount = function () {
                return Math.floor(this.paging.filteredCount / this.paging.pagesize) + 1;
            };
            Attendees.prototype.pageChanged = function () {
                this.getattendees();
            };
            Attendees.controllerId = 'attendees';
            //#endregion
            //#region constructor
            Attendees.$inject = ['$location', 'common', 'app.config', 'personsRepository'];
            return Attendees;
        })();
        CodeCamper.Attendees = Attendees;
        // Register with angular
        App.CodeCamper.codeCampModule.controller(Attendees.controllerId, Attendees);
    })(CodeCamper = App.CodeCamper || (App.CodeCamper = {}));
})(App || (App = {}));
//# sourceMappingURL=attendees.js.map