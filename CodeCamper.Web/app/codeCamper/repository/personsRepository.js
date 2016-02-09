'use strict';
var App;
(function (App) {
    var CodeCamper;
    (function (CodeCamper) {
        var PersonsRepository = (function () {
            function PersonsRepository(common, model, baseRepository) {
                this.common = common;
                this.model = model;
                this.baseRepository = baseRepository;
                this.logger = this.common.logger;
                this.logSuccess = this.logger.getLogFn(PersonsRepository.serviceId, "success");
                this.logError = this.logger.getLogFn(PersonsRepository.serviceId, "error");
                this.primePromise = undefined;
            }
            //#endregion
            //#region public methods
            PersonsRepository.prototype.getAllPersons = function () {
                var _this = this;
                var query = this.baseRepository.entityQuery.from("persons")
                    .orderBy("lastName, firstName");
                var querySucceeded = function (data) {
                    var result = data.results;
                    _this.logSuccess('persons was retrived from remote', result.length, true);
                    return result;
                };
                return this.baseRepository.manager.executeQuery(query)
                    .then(querySucceeded, this.baseRepository.queryFailed);
            };
            PersonsRepository.prototype.getPersonById = function (id) {
                return this.baseRepository.getEntityById(this.baseRepository.entityNames.person, id);
            };
            PersonsRepository.prototype.create = function () {
                return this.baseRepository.manager.createEntity(this.baseRepository.entityNames.speaker);
            };
            PersonsRepository.prototype.reset = function () { this.baseRepository.reset; };
            PersonsRepository.prototype.save = function () { this.baseRepository.save; };
            PersonsRepository.prototype.markDeleted = function (entity) { this.baseRepository.markDeleted(entity); };
            PersonsRepository.prototype.getPagedPersons = function (searchText, forceRefresh, page, size) {
                var _this = this;
                var resourceName = this.baseRepository.resourceNames.persons;
                var isLocal = this.baseRepository.isLocally(resourceName, forceRefresh);
                var getLocally = function () { return _this.getPagedDataLocally(resourceName, searchText, page, size); };
                return this.checkCachedData(forceRefresh, resourceName).then(getLocally);
            };
            PersonsRepository.prototype.getPagedDataLocally = function (resourceName, searchText, page, size) {
                var _this = this;
                var predicate = null;
                var filterCount;
                if (searchText) {
                    predicate = this.baseRepository.fullNamePredicate(searchText);
                }
                var query = this.baseRepository.entityQuery.from(resourceName)
                    .where(predicate)
                    .take(size || 20)
                    .inlineCount()
                    .skip(page ? (page - 1) * size : 0)
                    .using(this.baseRepository.breeze.FetchStrategy.FromLocalCache)
                    .orderBy("firstName,lastName");
                var querySucceeded = function (data) {
                    var result = data.results;
                    _this.baseRepository.logSuccessMessage(resourceName, data.results.length, true);
                    return { result: result, totalItemLoaded: _this.baseRepository.totalItemsLoaded(resourceName), filterCount: data.inlineCount };
                };
                return this.baseRepository.manager.executeQuery(query)
                    .then(querySucceeded, this.baseRepository.queryFailed);
            };
            PersonsRepository.prototype.checkCachedData = function (forceRefresh, resourceName) {
                var _this = this;
                var isLocal = this.baseRepository.isLocally(resourceName, forceRefresh);
                var defered = this.common.$q.defer();
                if (isLocal) {
                    defered.resolve(true);
                    return defered.promise;
                }
                else {
                    var querySucceeded = function (data) {
                        _this.baseRepository.logSuccessMessage(resourceName, data.inlineCount, isLocal);
                        _this.baseRepository.isItemsLoaded(resourceName, true);
                        _this.baseRepository.totalItemsLoaded(resourceName, data.inlineCount);
                        if (resourceName === _this.baseRepository.resourceNames.speakers) {
                            for (var i = data.results.length; i--;) {
                                data.results[i].isSpeaker = true;
                            }
                        }
                        defered.resolve(true);
                    };
                    this.baseRepository.entityQuery
                        .from(resourceName)
                        .select('id,firstName,lastName,imageSource')
                        .orderBy("firstName,lastName")
                        .inlineCount()
                        .toType(this.baseRepository.entityNames.person)
                        .using(this.baseRepository.manager).execute()
                        .then(querySucceeded, this.baseRepository.queryFailed);
                }
                return defered.promise;
            };
            PersonsRepository.prototype.getPersons = function (forceRefresh, includeNullObjects) {
                var _this = this;
                var resourceName = this.baseRepository.resourceNames.persons;
                var predicate = undefined;
                if (!includeNullObjects) {
                    predicate = this.baseRepository.isNullObject;
                }
                var ordering = "firstName,lastName";
                var getPersonLocally = function () {
                    var result = _this.baseRepository.getAllLocal(_this.baseRepository.resourceNames.persons, ordering, predicate);
                    _this.baseRepository.logSuccessMessage(resourceName, result.length, true);
                    return { result: result, totalItemLoaded: _this.baseRepository.totalItemsLoaded(resourceName) };
                };
                return this.checkCachedData(forceRefresh, resourceName).then(getPersonLocally);
            };
            PersonsRepository.prototype.getSpeakers = function (forceRefresh) {
                var _this = this;
                var resourceName = this.baseRepository.resourceNames.speakers;
                var predicate = this.baseRepository.breeze.Predicate.create('isSpeaker', '==', true);
                var ordering = "firstName,lastName";
                var getSpeakerLocally = function () {
                    var result = _this.baseRepository.getAllLocal(_this.baseRepository.resourceNames.persons, ordering, predicate);
                    _this.baseRepository.logSuccessMessage(resourceName, result.length, true);
                    return { result: result, totalItemLoaded: _this.baseRepository.totalItemsLoaded(resourceName) };
                };
                return this.checkCachedData(forceRefresh, resourceName).then(getSpeakerLocally);
            };
            PersonsRepository.prototype.getPeronsLocally = function (resourceName) {
                var _this = this;
                var query = this.baseRepository.entityQuery.from(resourceName)
                    .orderBy('firstName, lastName')
                    .toType(this.baseRepository.entityNames.person)
                    .using(this.baseRepository.breeze.FetchStrategy.FromLocalCache);
                if (resourceName === this.baseRepository.resourceNames.speakers) {
                    query = query.where(this.baseRepository.breeze.Predicate.create('isSpeaker', '==', true));
                }
                var querySucceeded = function (data) {
                    var result = data.results;
                    _this.baseRepository.logSuccessMessage(resourceName, data.results.length, true);
                    return { result: result, totalItemLoaded: _this.baseRepository.totalItemsLoaded(resourceName) };
                };
                return this.baseRepository.manager.executeQuery(query)
                    .then(querySucceeded, this.baseRepository.queryFailed);
            };
            PersonsRepository.prototype.getPeronsInfo = function (forceRefresh) {
                var _this = this;
                var resourceName = this.baseRepository.resourceNames.persons;
                var getPersonInfoLocally = function () {
                    var query = _this.baseRepository.entityQuery.from(resourceName)
                        .select('id,fullName')
                        .orderBy('firstName, lastName')
                        .toType(_this.baseRepository.entityNames.person)
                        .using(_this.baseRepository.breeze.FetchStrategy.FromLocalCache);
                    if (resourceName === _this.baseRepository.resourceNames.speakers) {
                        query = query.where(_this.baseRepository.breeze.Predicate.create('isSpeaker', '==', true));
                    }
                    var querySucceeded = function (data) {
                        var result = data.results;
                        _this.baseRepository.logSuccessMessage(resourceName, data.results.length, true);
                        return { result: result, totalItemLoaded: _this.baseRepository.totalItemsLoaded(resourceName) };
                    };
                    return _this.baseRepository.manager.executeQuery(query)
                        .then(querySucceeded, _this.baseRepository.queryFailed);
                };
                return this.checkCachedData(forceRefresh, resourceName).then(getPersonInfoLocally);
            };
            PersonsRepository.prototype.getPersonsCount = function () { return this.baseRepository.getResourceCount(this.baseRepository.resourceNames.persons); };
            ;
            PersonsRepository.prototype.getSpeakerCount = function () { return this.baseRepository.getResourceCount(this.baseRepository.resourceNames.speakers); };
            ;
            PersonsRepository.serviceId = 'personsRepository';
            //#endregion
            //#region constructor
            PersonsRepository.$inject = ['common', 'model', 'baseRepository'];
            return PersonsRepository;
        })();
        CodeCamper.PersonsRepository = PersonsRepository;
        // Creates service
        App.CodeCamper.codeCampModule.service(PersonsRepository.serviceId, PersonsRepository);
    })(CodeCamper = App.CodeCamper || (App.CodeCamper = {}));
})(App || (App = {}));
//# sourceMappingURL=personsRepository.js.map