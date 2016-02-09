'use strict';
var App;
(function (App) {
    var CodeCamper;
    (function (CodeCamper) {
        var BaseRepository = (function () {
            function BaseRepository(breeze, emFactory, common, model, config) {
                this.breeze = breeze;
                this.emFactory = emFactory;
                this.common = common;
                this.model = model;
                this.config = config;
                this.storeCache = {
                    totalLoaded: {},
                    isLoaded: {}
                };
                this.logger = this.common.logger;
                this.entityQuery = this.breeze.EntityQuery;
                this.manager = this.emFactory.newManagerIfNot();
                this.logSuccess = this.logger.getLogFn(BaseRepository.serviceId, "success");
                this.logError = this.logger.getLogFn(BaseRepository.serviceId, "error");
                this.isNullObject = this.breeze.Predicate.create('id', '!=', 0);
                this.resourceNames = this.model.resourceNames;
                this.entityNames = this.model.entityNames;
                this.setupEventForHasChangesChanged();
            }
            //#endregion
            //#region public methods
            BaseRepository.prototype.getResourceCount = function (resourceName) {
                var _this = this;
                if (this.totalItemsLoaded(resourceName)) {
                    return this.common.$q.when(this.totalItemsLoaded(resourceName));
                }
                else {
                    var querySucceeded = function (data) {
                        _this.logSuccessMessage(resourceName, data.inlineCount, false);
                        _this.totalItemsLoaded(resourceName, data.inlineCount);
                        return data.inlineCount;
                    };
                    return this.entityQuery.from(resourceName)
                        .select('id')
                        .inlineCount()
                        .using(this.manager).execute()
                        .then(querySucceeded, this.queryFailed);
                }
            };
            BaseRepository.prototype.getAllLocal = function (entityName, ordering, predicate) {
                var data = this.entityQuery.from(entityName)
                    .orderBy(ordering)
                    .where(predicate)
                    .using(this.manager)
                    .executeLocally();
                return data;
            };
            BaseRepository.prototype.fullNamePredicate = function (searchText) {
                return this.breeze.Predicate.create('firstName', 'contains', searchText)
                    .or('lastName', 'contains', searchText);
            };
            BaseRepository.prototype.reset = function () {
                if (this.manager.hasChanges()) {
                    this.manager.rejectChanges();
                    this.logSuccess('Changes was Cancled', null, true);
                }
            };
            BaseRepository.prototype.save = function () {
                var _this = this;
                var saveSucceeded = function (result) {
                    _this.logSuccess('Updated data was Saved', null, true);
                    return result;
                };
                var saveFailed = function (error) {
                    var message = 'Save was Failed' +
                        _this.breeze.saveErrorMessageService.getErrorMessage(error);
                    _this.logError(message, error);
                    throw error;
                };
                return this.manager.saveChanges().then(saveSucceeded, saveFailed);
            };
            BaseRepository.prototype.markDeleted = function (entity) {
                entity.entityAspect.setDeleted();
            };
            BaseRepository.prototype.getAttendeesfilteredListCount = function (searchText) {
                var predicate = this.fullNamePredicate(searchText);
                var attendees = this.entityQuery.from(this.entityNames.attendee)
                    .where(predicate)
                    .using(this.manager)
                    .executeLocally();
                return attendees.length;
            };
            BaseRepository.prototype.getEntityById = function (entityName, id) {
                var querySucceeded = function (data) {
                    return data.entity;
                };
                return this.manager.fetchEntityByKey(entityName, parseInt(id))
                    .then(querySucceeded, this.queryFailed);
            };
            BaseRepository.prototype.checkLocalCache = function (query, resourceName, forceRefresh) {
                if (this.isLocally(resourceName, forceRefresh)) {
                    query = query.using(this.breeze.FetchStrategy.FromLocalCache).select(null);
                }
                else {
                    query = query.inlineCount();
                }
                return query;
            };
            BaseRepository.prototype.createUnchangedEntity = function (entityName, values) {
                var initValues = values || { name: ' [Select a ' + entityName.toLowerCase() + ']' };
                var entity = this.manager.createEntity(entityName, initValues, this.breeze.EntityState.Unchanged);
                return entity;
            };
            BaseRepository.prototype.setupEventForHasChangesChanged = function () {
                this.manager.hasChangesChanged.subscribe(function (eventArgs) {
                    var data = { hasChanges: eventArgs.hasChanges };
                    this.common.$broadcast(this.config.events.hasChangesChanged, data);
                });
            };
            BaseRepository.prototype.isLocally = function (resourceName, forceRefresh) {
                return (!forceRefresh && this.isItemsLoaded(resourceName));
            };
            BaseRepository.prototype.completeQuery = function (isLocally, query) {
                if (isLocally) {
                    query = query.using(this.breeze.FetchStrategy.FromLocalCache).select(null);
                }
                else {
                    query = query.inlineCount();
                }
                return query;
            };
            BaseRepository.prototype.getResourceName = function (entityName) {
                var type = this.manager.metadataStore.getEntityType(entityName);
                return type.defaultResourceName;
            };
            BaseRepository.prototype.getLookupCachedData = function (key) {
                return this.storeCache[key];
            };
            BaseRepository.prototype.setLookupCachedData = function (key, value) {
                if (value === undefined) {
                    return this.getLookupCachedData(key);
                }
                return this.storeCache[key] = value;
            };
            BaseRepository.prototype.totalItemsLoaded = function (key, value) {
                if (value === undefined) {
                    return this.storeCache.totalLoaded[key];
                }
                return this.storeCache.totalLoaded[key] = value;
            };
            BaseRepository.prototype.isItemsLoaded = function (key, value) {
                if (value === undefined) {
                    return this.storeCache.isLoaded[key] || false;
                }
                return this.storeCache.isLoaded[key] = value;
            };
            BaseRepository.prototype.logSuccessMessage = function (resourceName, resultlength, isLocal) {
                var message = 'Retrieved [' + resourceName + '] from ' + (isLocal ? " Local" : "Remote") + ' resource';
                this.logSuccess(message, resultlength, true);
            };
            BaseRepository.prototype.queryFailed = function (error) {
                var msg = this.config.appErrorPrefix + "Error retrieving Data" + error.message;
                this.logError(msg, error);
                throw error;
            };
            BaseRepository.serviceId = 'baseRepository';
            //#endregion
            //#region constructor
            BaseRepository.$inject = ['breeze', 'entityManagerFactory', 'common', 'model', 'app.config'];
            return BaseRepository;
        })();
        CodeCamper.BaseRepository = BaseRepository;
        // Creates service
        App.CodeCamper.codeCampModule.service(BaseRepository.serviceId, BaseRepository);
    })(CodeCamper = App.CodeCamper || (App.CodeCamper = {}));
})(App || (App = {}));
//# sourceMappingURL=baseRepository.js.map