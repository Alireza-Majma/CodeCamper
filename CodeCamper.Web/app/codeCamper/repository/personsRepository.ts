'use strict';
module App.CodeCamper {
   import appShared = App.Shared;
   import appService = App.Services;
   export interface IPersonsRepository {
      getAllPersons: () => any;
      getPersonById: (id: any) => any;
      create: () => any;
      reset: () => any;
      save: () => any;
      markDeleted: (entity) => void;
      getPagedPersons: (searchText: string, forceRefresh?: boolean, page?: number, size?: number) => ng.IPromise<any>;
      getPagedDataLocally: (resourceName: string, searchText: string, page?: number, size?: number) => ng.IPromise<any>;
      getPersons: (forceRefresh?: boolean, includeNullObjects?: boolean) => ng.IPromise<any>;
      getSpeakers: (forceRefresh: boolean) => ng.IPromise<any>;
      getPeronsLocally: (resourceName: string) => any;
      getPeronsInfo: (forceRefresh?: boolean) => any;
      getPersonsCount: () => any;
      getSpeakerCount: () => any;

   }

   export class PersonsRepository implements IPersonsRepository {
      public static serviceId: string = 'personsRepository';
                                         

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
      static $inject = ['common', 'model', 'baseRepository'];
      constructor(common: appShared.ICommon, model: appShared.IModel, baseRepository: IBaseRepository) {
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
      public getAllPersons() {
         var query = this.baseRepository.entityQuery.from("persons")
         //.select('id,firstName,lastName,imageSource')
            .orderBy("lastName, firstName");

         var querySucceeded = (data) => {
            var result = data.results;
            this.logSuccess('persons was retrived from remote', result.length, true)
            return result;
         }

         return this.baseRepository.manager.executeQuery(query)
            .then(querySucceeded, this.baseRepository.queryFailed);
      }

      public getPersonById(id: any) {
         return this.baseRepository.getEntityById(this.baseRepository.entityNames.person, id);
      }

      public create() {
         return this.baseRepository.manager.createEntity(this.baseRepository.entityNames.speaker);
      }

      public reset() { this.baseRepository.reset; }

      public save() { this.baseRepository.save; }

      public markDeleted(entity) { this.baseRepository.markDeleted(entity); }

      public getPagedPersons(searchText: string, forceRefresh?: boolean, page?: number, size?: number) {
         var resourceName = this.baseRepository.resourceNames.persons;
         var isLocal = this.baseRepository.isLocally(resourceName, forceRefresh);
         var getLocally = () => { return this.getPagedDataLocally(resourceName, searchText, page, size) };
         return this.checkCachedData(forceRefresh, resourceName).then(getLocally);
      }

      public getPagedDataLocally(resourceName: string, searchText: string, page?: number, size?: number) {
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

         var querySucceeded = (data) => {
            var result = data.results;
            this.baseRepository.logSuccessMessage(resourceName, data.results.length, true);
            return { result: result, totalItemLoaded: this.baseRepository.totalItemsLoaded(resourceName), filterCount: data.inlineCount };
         }
         return this.baseRepository.manager.executeQuery(query)
            .then(querySucceeded, this.baseRepository.queryFailed);
      }

      private checkCachedData(forceRefresh, resourceName) {
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
               if (resourceName === this.baseRepository.resourceNames.speakers) {
                  for (var i = data.results.length; i--;) {
                     data.results[i].isSpeaker = true;
                  }
               }
               defered.resolve(true);
            }

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
      }

      public getPersons(forceRefresh?: boolean, includeNullObjects?: boolean) {
         var resourceName = this.baseRepository.resourceNames.persons;
         var predicate = undefined;
         if (!includeNullObjects) {
            predicate = this.baseRepository.isNullObject;
         }
         var ordering = "firstName,lastName";
         var getPersonLocally = () => {
            var result = this.baseRepository.getAllLocal(this.baseRepository.resourceNames.persons, ordering, predicate);
            this.baseRepository.logSuccessMessage(resourceName, result.length, true);
            return { result: result, totalItemLoaded: this.baseRepository.totalItemsLoaded(resourceName) };
         }
         return this.checkCachedData(forceRefresh, resourceName).then(getPersonLocally);
      }

      public getSpeakers(forceRefresh?: boolean) {
         var resourceName = this.baseRepository.resourceNames.speakers;
         var predicate = this.baseRepository.breeze.Predicate.create('isSpeaker', '==', true)

         var ordering = "firstName,lastName";
         var getSpeakerLocally = () => {
            var result = this.baseRepository.getAllLocal(this.baseRepository.resourceNames.persons, ordering, predicate);
            this.baseRepository.logSuccessMessage(resourceName, result.length, true);
            return { result: result, totalItemLoaded: this.baseRepository.totalItemsLoaded(resourceName) };
         }
         return this.checkCachedData(forceRefresh, resourceName).then(getSpeakerLocally);
      }

      public getPeronsLocally(resourceName: string) {
         var query = this.baseRepository.entityQuery.from(resourceName)
            .orderBy('firstName, lastName')
            .toType(this.baseRepository.entityNames.person)
            .using(this.baseRepository.breeze.FetchStrategy.FromLocalCache);

         if (resourceName === this.baseRepository.resourceNames.speakers) {
            query = query.where(this.baseRepository.breeze.Predicate.create('isSpeaker', '==', true));
         }
         var querySucceeded = (data) => {
            var result = data.results;
            this.baseRepository.logSuccessMessage(resourceName, data.results.length, true);
            return { result: result, totalItemLoaded: this.baseRepository.totalItemsLoaded(resourceName) };
         }
         return this.baseRepository.manager.executeQuery(query)
            .then(querySucceeded, this.baseRepository.queryFailed);
      }

      public getPeronsInfo(forceRefresh?: boolean) {
         var resourceName = this.baseRepository.resourceNames.persons;

         var getPersonInfoLocally = () => {
            var query = this.baseRepository.entityQuery.from(resourceName)
               .select('id,fullName')
               .orderBy('firstName, lastName')
               .toType(this.baseRepository.entityNames.person)
               .using(this.baseRepository.breeze.FetchStrategy.FromLocalCache);

            if (resourceName === this.baseRepository.resourceNames.speakers) {
               query = query.where(this.baseRepository.breeze.Predicate.create('isSpeaker', '==', true));
            }
            var querySucceeded = (data) => {
               var result = data.results;
               this.baseRepository.logSuccessMessage(resourceName, data.results.length, true);
               return { result: result, totalItemLoaded: this.baseRepository.totalItemsLoaded(resourceName) };
            }
            return this.baseRepository.manager.executeQuery(query)
               .then(querySucceeded, this.baseRepository.queryFailed);
         };

         return this.checkCachedData(forceRefresh, resourceName).then(getPersonInfoLocally);
      }

      public getPersonsCount() { return this.baseRepository.getResourceCount(this.baseRepository.resourceNames.persons) };
      public getSpeakerCount() { return this.baseRepository.getResourceCount(this.baseRepository.resourceNames.speakers) };

      //#endregion
   }
        
   // Creates service
   App.CodeCamper.codeCampModule.service(PersonsRepository.serviceId,PersonsRepository);

}