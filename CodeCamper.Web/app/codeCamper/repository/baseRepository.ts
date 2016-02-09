'use strict';
module App.CodeCamper {
   import appShared = App.Shared;
   import appService = App.Services;
   export interface IBaseRepository {
      breeze: any;
      entityQuery: breeze.EntityQuery;
      resourceNames: appShared.IResourceNames;
      entityNames: appShared.IEntityNames;
      checkLocalCache: (query: any, resourceName: string, forceRefresh?: boolean) => any;
      completeQuery: (isLocally: boolean, query: any) => any;
      isLocally: (resourceName: string, forceRefresh?: boolean) => boolean;
      queryFailed: (error: { message: string }) => any;
      isItemsLoaded: (key: string, value?: any) => any;
      logSuccessMessage: Function;
      fullNamePredicate: (searchText: string) => any;
      getResourceCount: (resourceName: string) => any;
      manager: breeze.EntityManager;
      logger: appShared.ILogger;
      getAllLocal: (entityName: string, ordering?: string, predicate?: breeze.Predicate) => any;
      totalItemsLoaded: (key: string, value?: any) => any;
      setLookupCachedData: (key: string, value?: any) => any;
      getLookupCachedData: (key: string) => any;
      getEntityById: (entityName: string, id: any) => any;
      reset: () => void;
      save: () => void;
      markDeleted:(entity: breeze.Entity)=>void;
      createUnchangedEntity: (entityName: string, values?: any) => any;
      isNullObject: boolean;
   }
   export interface IStoreCache {
      totalLoaded: {};
      isLoaded: {};
   }

   export class BaseRepository implements IBaseRepository {
      public static serviceId: string = 'baseRepository';

      //#region variables
      logger: appShared.ILogger;
      entityQuery: breeze.EntityQuery;
      manager: breeze.EntityManager;
      storeCache: IStoreCache = {
         totalLoaded: {},
         isLoaded: {}
      };
      logSuccess: Function;
      logError: Function;
      isNullObject: boolean;
      resourceNames: appShared.IResourceNames;
      entityNames: appShared.IEntityNames;

      //#endregion
      //#region constructor
      static $inject = ['breeze', 'entityManagerFactory', 'common', 'model', 'app.config'];
      constructor(public breeze: any,
                  private emFactory: appService.IEntityManagerFactory,
                  private common: appShared.ICommon,
                  private model: appShared.IModel,
                  private config: IConfigurations) {
      
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
      public getResourceCount(resourceName:string) {
         if (this.totalItemsLoaded(resourceName)) {
            return this.common.$q.when(this.totalItemsLoaded(resourceName));
         } else {
            var querySucceeded= (data)=> {
               this.logSuccessMessage(resourceName, data.inlineCount, false);
               this.totalItemsLoaded(resourceName, data.inlineCount);
               return data.inlineCount;
            }

            return this.entityQuery.from(resourceName)
               .select('id')
               .inlineCount()
               .using(this.manager).execute()
               .then(querySucceeded, this.queryFailed);
         }
         
      }

      public getAllLocal(entityName: string, ordering?: string, predicate?: breeze.Predicate) {
         var data = this.entityQuery.from(entityName)
            .orderBy(ordering)
            .where(predicate)
            .using(this.manager)
            .executeLocally();
         return data;
      }

      public fullNamePredicate(searchText:string) {
         return this.breeze.Predicate.create('firstName', 'contains', searchText)
            .or('lastName', 'contains', searchText);
      }

      public reset() {
         if (this.manager.hasChanges()) {
            this.manager.rejectChanges();
            this.logSuccess('Changes was Cancled', null, true);
         }
      }

      public save() {
         var saveSucceeded = (result) => {
            this.logSuccess('Updated data was Saved', null, true);
            return result;
         }
         var saveFailed = (error) => {
            var message = 'Save was Failed' +
               this.breeze.saveErrorMessageService.getErrorMessage(error);
            this.logError(message, error);
            throw error;
         }
         return this.manager.saveChanges().then(saveSucceeded, saveFailed)
      }

      public markDeleted(entity: breeze.Entity) {
         entity.entityAspect.setDeleted();
      }

      public getAttendeesfilteredListCount(searchText) {
         var predicate = this.fullNamePredicate(searchText);
         var attendees = this.entityQuery.from(this.entityNames.attendee)
            .where(predicate)
            .using(this.manager)
            .executeLocally();
         return attendees.length;
      }

      public getEntityById(entityName:string, id:any) {
         var querySucceeded= (data) => {
            return data.entity;
         }
         return this.manager.fetchEntityByKey(entityName, parseInt(id))
            .then(querySucceeded, this.queryFailed);
      }

      public checkLocalCache(query: any, resourceName: string, forceRefresh?: boolean) {
         if (this.isLocally(resourceName, forceRefresh)) {
            query = query.using(this.breeze.FetchStrategy.FromLocalCache).select(null);
         } else {
            query = query.inlineCount();
         }
         return query;
      }

      public createUnchangedEntity(entityName:string, values?:any) {
         var initValues = values || { name: ' [Select a ' + entityName.toLowerCase() + ']' };
         var entity = this.manager.createEntity(entityName, initValues, this.breeze.EntityState.Unchanged);
         return entity;
      }

      private setupEventForHasChangesChanged() {
         this.manager.hasChangesChanged.subscribe(function (eventArgs) {
            var data = { hasChanges: eventArgs.hasChanges };
            this.common.$broadcast(this.config.events.hasChangesChanged, data);
         });
      }

      public isLocally(resourceName:string, forceRefresh?:boolean) {
         return (!forceRefresh && this.isItemsLoaded(resourceName));
      }

      public completeQuery(isLocally: boolean, query:any) {
         if (isLocally) {
            query = query.using(this.breeze.FetchStrategy.FromLocalCache).select(null);
         } else {
            query = query.inlineCount();
         }
         return query;
      }
      
      public getResourceName(entityName) {
         var type: breeze.EntityTypeProperties = this.manager.metadataStore.getEntityType(entityName);
         return type.defaultResourceName;
      }

      public getLookupCachedData(key:string) {
         return this.storeCache[key];
      }

      public setLookupCachedData(key:string, value?:any) {
         if (value === undefined) {
            return this.getLookupCachedData(key);
         }
         return this.storeCache[key] = value;
      }

      public totalItemsLoaded(key:string, value?:any) {
         if (value === undefined) {
            return this.storeCache.totalLoaded[key];
         }
         return this.storeCache.totalLoaded[key] = value;
      }

      public isItemsLoaded(key:string, value?:any) {
         if (value === undefined) {
            return this.storeCache.isLoaded[key] || false;
         }
         return this.storeCache.isLoaded[key] = value;
      }

      public logSuccessMessage(resourceName, resultlength, isLocal) {
         var message = 'Retrieved [' + resourceName + '] from ' + (isLocal ? " Local" : "Remote") + ' resource';
         this.logSuccess(message, resultlength, true)
      }
      public queryFailed(error: { message: string }) {
         var msg = this.config.appErrorPrefix + "Error retrieving Data" + error.message;
         this.logError(msg, error);
         throw error;
      }
      //#endregion
   }
        
   // Creates service
   
   App.CodeCamper.codeCampModule.service(BaseRepository.serviceId,BaseRepository);

}