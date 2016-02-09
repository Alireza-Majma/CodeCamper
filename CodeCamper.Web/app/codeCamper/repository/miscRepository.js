'use strict';
var App;
(function (App) {
    var CodeCamper;
    (function (CodeCamper) {
        var MiscRepository = (function () {
            function MiscRepository(common, model, baseRepository, personsRepository) {
                this.common = common;
                this.model = model;
                this.baseRepository = baseRepository;
                this.personsRepository = personsRepository;
                this.logger = this.common.logger;
                this.logSuccess = this.logger.getLogFn(MiscRepository.serviceId, "success");
                this.logError = this.logger.getLogFn(MiscRepository.serviceId, "error");
                this.primePromise = undefined;
            }
            //#endregion
            //#region public methods
            MiscRepository.prototype.getLookups = function () {
                var _this = this;
                var querySucceeded = function (data) {
                    var result = data.results[0];
                    _this.baseRepository.totalItemsLoaded(_this.baseRepository.resourceNames.persons, result.personsCount);
                    _this.baseRepository.totalItemsLoaded(_this.baseRepository.resourceNames.sessions, result.sessionsCount);
                    _this.baseRepository.setLookupCachedData('tracksCount', result.tracksCount);
                    _this.baseRepository.createUnchangedEntity(_this.model.entityNames.room);
                    _this.baseRepository.createUnchangedEntity(_this.model.entityNames.timeSlot, { start: _this.model.nullDate, isSessionSlot: true });
                    _this.baseRepository.createUnchangedEntity(_this.model.entityNames.track);
                    _this.baseRepository.setLookupCachedData(_this.model.entityNames.room, _this.baseRepository.getAllLocal(_this.model.resourceNames.rooms, 'name'));
                    _this.baseRepository.setLookupCachedData(_this.model.entityNames.track, _this.baseRepository.getAllLocal(_this.model.resourceNames.tracks, 'name'));
                    _this.baseRepository.setLookupCachedData(_this.model.entityNames.timeSlot, _this.baseRepository.getAllLocal(_this.model.resourceNames.timeSlots, 'start'));
                    _this.baseRepository.createUnchangedEntity(_this.model.entityNames.person);
                    _this.model.extendMetadata(_this.baseRepository.manager.metadataStore, result.customAttributes);
                    _this.logSuccess('Retrieved [Lookups] from remote source', data, true);
                    return true;
                };
                return this.baseRepository.entityQuery.from('Lookups')
                    .withParameters({ separatedNames: "rooms;tracks;timeSlots;personsCount;tracksCount;sessionsCount" })
                    .using(this.baseRepository.manager).execute()
                    .then(querySucceeded, this.baseRepository.queryFailed);
            };
            MiscRepository.prototype.prime = function () {
                var _this = this;
                if (this.primePromise) {
                    return this.primePromise.then(function () { return true; });
                }
                var promises = [this.getLookups(), this.personsRepository.getSpeakers()];
                var primeSucceded = function (data) {
                    _this.logSuccess('Primed the data', null, true);
                    return true;
                };
                this.primePromise = this.common.$q.all(promises).then(primeSucceded);
                return this.primePromise;
            };
            MiscRepository.serviceId = 'miscRepository';
            //#endregion
            //#region constructor
            MiscRepository.$inject = ['common', 'model', 'baseRepository', 'personsRepository'];
            return MiscRepository;
        })();
        CodeCamper.MiscRepository = MiscRepository;
        // Creates service
        App.CodeCamper.codeCampModule.service(MiscRepository.serviceId, MiscRepository);
    })(CodeCamper = App.CodeCamper || (App.CodeCamper = {}));
})(App || (App = {}));
//# sourceMappingURL=miscRepository.js.map