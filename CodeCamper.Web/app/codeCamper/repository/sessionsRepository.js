'use strict';
var App;
(function (App) {
    var CodeCamper;
    (function (CodeCamper) {
        var SessionsRepository = (function () {
            function SessionsRepository(common, model, baseRepository, personsRepository) {
                this.common = common;
                this.model = model;
                this.baseRepository = baseRepository;
                this.logger = this.common.logger;
                this.logSuccess = this.logger.getLogFn(SessionsRepository.serviceId, "success");
                this.logError = this.logger.getLogFn(SessionsRepository.serviceId, "error");
                this.primePromise = undefined;
            }
            //#endregion
            //#region public methods
            SessionsRepository.prototype.getSessions = function (forceRefresh) {
                var _this = this;
                var resourceName = this.baseRepository.resourceNames.sessions;
                var isLocal = this.baseRepository.isLocally(resourceName, forceRefresh);
                var query = this.baseRepository.entityQuery.from(resourceName)
                    .select('id,title,code,speakerId,trackId,timeSlotId,roomId,level,tags,description')
                    .orderBy('title').toType(this.baseRepository.entityNames.session);
                query = this.baseRepository.completeQuery(isLocal, query);
                var querySucceeded = function (data) {
                    var result = data.results;
                    _this.baseRepository.logSuccessMessage(resourceName, data.inlineCount, isLocal);
                    _this.baseRepository.isItemsLoaded(resourceName, true);
                    _this.baseRepository.totalItemsLoaded(resourceName, data.inlineCount);
                    return { result: result, totalItemLoaded: _this.baseRepository.totalItemsLoaded(resourceName) };
                };
                return this.baseRepository.manager.executeQuery(query)
                    .then(querySucceeded, this.baseRepository.queryFailed);
            };
            SessionsRepository.prototype.calcIsSpeaker = function () {
                var persons = this.baseRepository.manager.getEntities(this.model.entityNames.person);
                var sessions = this.baseRepository.manager.getEntities(this.model.entityNames.session);
                persons.map(function (p) { p.isSpeaker = false; });
                sessions.map(function (s) { s.speaker.isSpeaker = (s.speaker !== 0); });
            };
            SessionsRepository.prototype.getToSpeakers = function (forceRefresh) {
                var _this = this;
                var resourceName = this.baseRepository.resourceNames.topSpeakers;
                var query = this.baseRepository.entityQuery.from(resourceName).orderBy('value desc').take(10);
                var querySucceeded = function (data) {
                    var result = data.results;
                    for (var i = result.length; i--; i >= 0) {
                        result[i].speaker = _this.baseRepository.manager.getEntityByKey(_this.baseRepository.entityNames.person, result[i].key);
                        result[i].sessionCount = result[i].value;
                        result[i].rank = i + 1;
                    }
                    return result;
                };
                return this.baseRepository.manager.executeQuery(query)
                    .then(querySucceeded, this.baseRepository.queryFailed);
            };
            SessionsRepository.prototype.getToSpeakersOld = function () {
                var getTop10Speakers = function (data) {
                    var sessions = data.result;
                    var speakeGroupCount = [];
                    for (var i = sessions.length; i--; i >= 0) {
                        var speaker = sessions[i].speaker;
                        var item = speakeGroupCount[speaker.id];
                        if (!item) {
                            item = { count: 0, speaker: speaker };
                            speakeGroupCount[speaker.id] = item;
                        }
                        item.count++;
                    }
                    speakeGroupCount.sort(function (o1, o2) { return o1.count < o2.count ? 1 : -1; });
                    return speakeGroupCount.slice(0, 10);
                };
                return this.getSessions().then(getTop10Speakers);
            };
            SessionsRepository.prototype.getSessionById = function (id) {
                return this.baseRepository.getEntityById(this.baseRepository.entityNames.session, id);
            };
            SessionsRepository.prototype.create = function () {
                return this.baseRepository.manager.createEntity(this.baseRepository.entityNames.session, {
                    roomId: 0,
                    trackId: 0,
                    timeSlotId: 0,
                    speakerId: 0
                });
            };
            SessionsRepository.prototype.reset = function () { this.baseRepository.reset(); };
            SessionsRepository.prototype.save = function () { this.baseRepository.save(); };
            SessionsRepository.prototype.markDeleted = function (entity) { this.baseRepository.markDeleted(entity); };
            SessionsRepository.prototype.checkCachedData = function (forceRefresh) {
                var _this = this;
                var resourceName = this.model.resourceNames.sessions;
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
                        defered.resolve(data);
                    };
                    this.baseRepository.entityQuery
                        .from(resourceName)
                        .select('id,title,code,speakerId,trackId,timeSlotId,roomId,level,tags,description')
                        .orderBy("title")
                        .inlineCount()
                        .toType(this.baseRepository.entityNames.session)
                        .using(this.baseRepository.manager).execute()
                        .then(querySucceeded, this.baseRepository.queryFailed);
                }
                return defered.promise;
            };
            SessionsRepository.prototype.getSessionCount = function () { return this.baseRepository.getResourceCount(this.baseRepository.resourceNames.sessions); };
            ;
            SessionsRepository.prototype.getTrackCounts = function () { return this.baseRepository.getLookupCachedData('tracksCount'); };
            SessionsRepository.serviceId = 'sessionsRepository';
            //#endregion
            //#region constructor
            SessionsRepository.$inject = ['common', 'model', 'baseRepository', 'personsRepository'];
            return SessionsRepository;
        })();
        CodeCamper.SessionsRepository = SessionsRepository;
        // Creates service
        App.CodeCamper.codeCampModule.service(SessionsRepository.serviceId, SessionsRepository);
    })(CodeCamper = App.CodeCamper || (App.CodeCamper = {}));
})(App || (App = {}));
//# sourceMappingURL=sessionsRepository.js.map