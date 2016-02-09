'use strict';
var App;
(function (App) {
    var CodeCamper;
    (function (CodeCamper) {
        var Persons = (function () {
            function Persons($location, common, config, personsRepository) {
                this.$location = $location;
                this.common = common;
                this.config = config;
                this.personsRepository = personsRepository;
                this.columnDefs = [{ name: 'Act', displayName: '', width: '7%', enableColumnMenu: false,
                        cellTemplate: '<a href="" ng-click="grid.appScope.vm.gotoPersonDetail(row.entity)"><i class="glyphicon glyphicon-edit ui-grid-cell-contents"></i></a>' },
                    { field: 'firstName', displayName: 'First Name', width: '16%' },
                    { field: 'lastName', displayName: 'Last  Name', width: '16%' },
                    { field: 'email', displayName: 'Email', width: '15%' },
                    { field: 'blog', displayName: 'Blog', width: '15%' },
                    { field: 'twitter', displayName: 'Twitter', width: '15%' },
                    { field: 'genderType', displayName: 'Gender', width: '15%' }];
                this.personGrid = {
                    data: 'vm.personsList',
                    columnDefs: this.columnDefs,
                    paginationPageSizes: [25, 50, 75],
                    paginationPageSize: 25,
                    enableRowSelection: true,
                    enableRowHeaderSelection: false,
                    multiSelect: false,
                };
                this.logger = this.common.logger;
                this.log = this.logger.getLogFn(Persons.controllerId);
                this.logSuccess = this.logger.getLogFn(Persons.controllerId, "success");
                this.logError = this.logger.getLogFn(Persons.controllerId, "error");
                this.title = 'Persons';
                this.activate();
                this.personsList = [];
            }
            //#endregion
            //#region public
            //#endregion
            Persons.prototype.activate = function () {
                var _this = this;
                var promises = [this.getPersons()];
                this.common.activateController(promises, Persons.controllerId)
                    .then(function () {
                    _this.log('Activated person View');
                });
            };
            Persons.prototype.getPersons = function (forceRefresh) {
                var _this = this;
                return this.personsRepository.getAllPersons().then(function (data) {
                    _this.personsList = data;
                    _this.personGrid.data = data;
                    return _this.personsList;
                });
            };
            Persons.prototype.gotoPersonDetail = function (person) {
                if (person && person.id) {
                    this.$location.path('/person/' + person.id);
                }
            };
            Persons.controllerId = 'persons';
            //#endregion
            //#region constructor
            Persons.$inject = ['$location', 'common', 'app.config', 'personsRepository'];
            return Persons;
        })();
        CodeCamper.Persons = Persons;
        // Register with angular
        App.CodeCamper.codeCampModule.controller(Persons.controllerId, Persons);
    })(CodeCamper = App.CodeCamper || (App.CodeCamper = {}));
})(App || (App = {}));
//# sourceMappingURL=persons.js.map