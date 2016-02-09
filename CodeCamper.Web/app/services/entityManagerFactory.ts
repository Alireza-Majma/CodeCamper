
'use strict';

module App.Services {

   export interface IEntityManagerFactory {
      newManager(): breeze.EntityManager;
      newManagerIfNot(): breeze.EntityManager;
   }

   export class EntityManagerFactory {
      public static serviceId = 'entityManagerFactory';
      metadataStore: any;
      serviceName: any;
      private breeze: any;
      private config: any;
      private model: any;
      private manager: breeze.EntityManager;

      constructor(breeze, config, model) {
         this.breeze = breeze;
         this.config = config;
         this.model = model;
         this.newManager
         this.setNamingConventionToCamelCase();
         this.preventValidateOnAttach();
         this.metadataStore = this.createMetadataStore();
         this.serviceName = config.remoteServiceName;
         this.manager = null;
      }

      public newManager(): breeze.EntityManager {
         this.manager = new breeze.EntityManager({
            serviceName: this.serviceName,
            metadataStore: this.metadataStore
         });

         return this.manager;
      }

      public newManagerIfNot() {
         if (!this.manager) {
            this.manager = this.newManager();
         }
         return this.manager;
      }

      private createMetadataStore(): {} {
         var store = new breeze.MetadataStore();
         this.model.configureMetadataStore(store);
         return store;
      }

      private setNamingConventionToCamelCase(): void {
         // Convert server - side PascalCase to client - side camelCase property names
         breeze.NamingConvention.camelCase.setAsDefault();
      }

      private preventValidateOnAttach() {
         new breeze.ValidationOptions({ validateOnAttach: false }).setAsDefault();
      }
   }

   App.app.factory(EntityManagerFactory.serviceId,
      ['breeze', 'app.config', 'model', (breeze, config, model) => new EntityManagerFactory(breeze, config, model)]);
}