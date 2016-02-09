'use strict';
module App.CodeCamper {
   import appShared = App.Shared;
   import appService = App.Services;
   export interface IMiscRepository {
      prime: () => void;
      getLookups: () => void;
   }

   export class MiscRepository implements IMiscRepository {
      public static serviceId: string = 'miscRepository';

      //#region variables
      common: appShared.ICommon;
      model: appShared.IModel;
      baseRepository: IBaseRepository;
      personsRepository: any;
      logger: appShared.ILogger;
      entityQuery: breeze.EntityQuery;
      manager: breeze.EntityManager;
      logSuccess: Function;
      logError: Function;
      primePromise: any;
   
      //#endregion
      //#region constructor
      static $inject = ['common', 'model', 'baseRepository', 'personsRepository'];
      constructor(common: appShared.ICommon, model: appShared.IModel, baseRepository: IBaseRepository, personsRepository) {
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
      public getLookups() {
         var querySucceeded = (data) => {
            var result = data.results[0];
            this.baseRepository.totalItemsLoaded(this.baseRepository.resourceNames.persons, result.personsCount);
            this.baseRepository.totalItemsLoaded(this.baseRepository.resourceNames.sessions, result.sessionsCount);
            this.baseRepository.setLookupCachedData('tracksCount', result.tracksCount);
            this.baseRepository.createUnchangedEntity(this.model.entityNames.room);
            this.baseRepository.createUnchangedEntity(this.model.entityNames.timeSlot, { start: this.model.nullDate, isSessionSlot: true });
            this.baseRepository.createUnchangedEntity(this.model.entityNames.track);
            this.baseRepository.setLookupCachedData(this.model.entityNames.room, this.baseRepository.getAllLocal(this.model.resourceNames.rooms, 'name'));
            this.baseRepository.setLookupCachedData(this.model.entityNames.track, this.baseRepository.getAllLocal(this.model.resourceNames.tracks, 'name'));
            this.baseRepository.setLookupCachedData(this.model.entityNames.timeSlot, this.baseRepository.getAllLocal(this.model.resourceNames.timeSlots, 'start'));

            this.baseRepository.createUnchangedEntity(this.model.entityNames.person);
            this.model.extendMetadata(this.baseRepository.manager.metadataStore, result.customAttributes);
            this.logSuccess('Retrieved [Lookups] from remote source', data, true)
            return true;
         }

         return this.baseRepository.entityQuery.from('Lookups')
            .withParameters({ separatedNames: "rooms;tracks;timeSlots;personsCount;tracksCount;sessionsCount" })
            .using(this.baseRepository.manager).execute()
            .then(querySucceeded, this.baseRepository.queryFailed);
      }
      public prime() {
         if (this.primePromise) {
            return this.primePromise.then(function () { return true });
         }

         var promises = [this.getLookups(), this.personsRepository.getSpeakers()];
         var primeSucceded = (data) => {
            this.logSuccess('Primed the data', null, true);
            return true;
         }

         this.primePromise = this.common.$q.all(promises).then(primeSucceded);
         return this.primePromise;
      }

      //#endregion
   }
        
   // Creates service
   App.CodeCamper.codeCampModule.service(MiscRepository.serviceId, MiscRepository);

}