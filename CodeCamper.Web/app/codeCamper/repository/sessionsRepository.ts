'use strict';
module App.CodeCamper {
   import appShared = App.Shared;
   import appService = App.Services;
   export interface ISessionsRepository {
      getSessions: (forceRefresh?: boolean) => any;
      calcIsSpeaker: () => void;
      getToSpeakers: (forceRefresh?: boolean) => any;
      getSessionById: (id: any) => any;
      create: () => any;
      reset: () => void;
      save: () => any;
      markDeleted: (entity) => void;
      checkCachedData: (forceRefresh?: boolean) => any;
      getSessionCount: () => any;
      getTrackCounts: () => any;
   }

   export class SessionsRepository implements ISessionsRepository {
      public static serviceId: string = 'sessionsRepository';

      //#region variables
      common: appShared.ICommon;
      model: appShared.IModel;
      baseRepository: IBaseRepository;
      personsRepository: IPersonsRepository;
      SessionsRepository: any;
      logger: appShared.ILogger;
      entityQuery: breeze.EntityQuery;
      manager: breeze.EntityManager;
      logSuccess: Function;
      logError: Function;
      primePromise: any;
      
      //#endregion
      //#region constructor
      static $inject = ['common', 'model', 'baseRepository', 'personsRepository'];
      constructor(common: appShared.ICommon, model: appShared.IModel, baseRepository: IBaseRepository, personsRepository: IPersonsRepository) {
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
      public getSessions(forceRefresh?: boolean) {
         var resourceName = this.baseRepository.resourceNames.sessions;
         var isLocal = this.baseRepository.isLocally(resourceName, forceRefresh);
         var query = this.baseRepository.entityQuery.from(resourceName)
            .select('id,title,code,speakerId,trackId,timeSlotId,roomId,level,tags,description')
            .orderBy('title').toType(this.baseRepository.entityNames.session);
         query = this.baseRepository.completeQuery(isLocal, query);

         var querySucceeded = (data) => {
            var result = data.results;
            this.baseRepository.logSuccessMessage(resourceName, data.inlineCount, isLocal);
            this.baseRepository.isItemsLoaded(resourceName, true);
            this.baseRepository.totalItemsLoaded(resourceName, data.inlineCount);
            return { result: result, totalItemLoaded: this.baseRepository.totalItemsLoaded(resourceName) };
         }

         return this.baseRepository.manager.executeQuery(query)
            .then(querySucceeded, this.baseRepository.queryFailed);
      }
      public calcIsSpeaker() {
         var persons = this.baseRepository.manager.getEntities(this.model.entityNames.person);
         var sessions = this.baseRepository.manager.getEntities(this.model.entityNames.session);
         persons.map(function (p: any) { p.isSpeaker = false });
         sessions.map(function (s: any) { s.speaker.isSpeaker = (s.speaker !== 0); });
      }

      public getToSpeakers(forceRefresh?: boolean) {
         var resourceName = this.baseRepository.resourceNames.topSpeakers;
         var query = this.baseRepository.entityQuery.from(resourceName).orderBy('value desc').take(10);
         var querySucceeded = (data) => {
            var result = data.results;

            for (var i = result.length; i--; i >= 0) {
               result[i].speaker = this.baseRepository.manager.getEntityByKey(this.baseRepository.entityNames.person, result[i].key);
               result[i].sessionCount = result[i].value;
               result[i].rank = i + 1;
            }
            return result
         }

         return this.baseRepository.manager.executeQuery(query)
            .then(querySucceeded, this.baseRepository.queryFailed);
      }

      public getToSpeakersOld() {
         var getTop10Speakers = (data) => {
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
         }
         return this.getSessions().then(getTop10Speakers);
      }

      public getSessionById(id: any) {
         return this.baseRepository.getEntityById(this.baseRepository.entityNames.session, id);
      }

      public create() {
         return this.baseRepository.manager.createEntity(this.baseRepository.entityNames.session, {
            roomId: 0,
            trackId: 0,
            timeSlotId: 0,
            speakerId: 0
         });
      }

      public reset() { this.baseRepository.reset(); }

      public save() { this.baseRepository.save(); }

      public markDeleted(entity) { this.baseRepository.markDeleted(entity); }

      public checkCachedData(forceRefresh?: boolean) {
         var resourceName = this.model.resourceNames.sessions;
         var isLocal = this.baseRepository.isLocally(resourceName, forceRefresh);
         var defered = this.common.$q.defer();
         if (isLocal) {
            defered.resolve(true);
            return defered.promise;
         } else {
            var querySucceeded = (data) => {
               this.baseRepository.logSuccessMessage(resourceName, data.inlineCount, isLocal);
               this.baseRepository.isItemsLoaded(resourceName, true);
               this.baseRepository.totalItemsLoaded(resourceName, data.inlineCount);
               defered.resolve(data);
            }
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
      }
      public getSessionCount() { return this.baseRepository.getResourceCount(this.baseRepository.resourceNames.sessions) };

      public getTrackCounts() { return this.baseRepository.getLookupCachedData('tracksCount'); }
      /*
      public getTrackCountsOld() {
         var getCount = (data) => {
            var sessions = data.result;
            var trackMap = sessions.reduce(function (accum, session) {
               if (session.track) {
                  var trackName = session.track.name;
                  var trackId = session.track.id;
                  if (!accum[trackId]) {
                     accum[trackId] = { track: trackName, count: 0 };
                  }
                  accum[trackId].count++;
               }
               return accum;
            }, []);
            return trackMap;
         }
         return this.getSessions().then(getCount);
      }
      */
      //#endregion
   }
        
   // Creates service
   App.CodeCamper.codeCampModule.service(SessionsRepository.serviceId,SessionsRepository);

}