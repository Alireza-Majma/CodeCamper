'use strict';
var App;
(function (App) {
    var Services;
    (function (Services) {
        var EntityManagerFactory = (function () {
            function EntityManagerFactory(breeze, config, model) {
                this.breeze = breeze;
                this.config = config;
                this.model = model;
                this.newManager;
                this.setNamingConventionToCamelCase();
                this.preventValidateOnAttach();
                this.metadataStore = this.createMetadataStore();
                this.serviceName = config.remoteServiceName;
                this.manager = null;
            }
            EntityManagerFactory.prototype.newManager = function () {
                this.manager = new breeze.EntityManager({
                    serviceName: this.serviceName,
                    metadataStore: this.metadataStore
                });
                return this.manager;
            };
            EntityManagerFactory.prototype.newManagerIfNot = function () {
                if (!this.manager) {
                    this.manager = this.newManager();
                }
                return this.manager;
            };
            EntityManagerFactory.prototype.createMetadataStore = function () {
                var store = new breeze.MetadataStore();
                this.model.configureMetadataStore(store);
                return store;
            };
            EntityManagerFactory.prototype.setNamingConventionToCamelCase = function () {
                // Convert server - side PascalCase to client - side camelCase property names
                breeze.NamingConvention.camelCase.setAsDefault();
            };
            EntityManagerFactory.prototype.preventValidateOnAttach = function () {
                new breeze.ValidationOptions({ validateOnAttach: false }).setAsDefault();
            };
            EntityManagerFactory.serviceId = 'entityManagerFactory';
            return EntityManagerFactory;
        })();
        Services.EntityManagerFactory = EntityManagerFactory;
        App.app.factory(EntityManagerFactory.serviceId, ['breeze', 'app.config', 'model', function (breeze, config, model) { return new EntityManagerFactory(breeze, config, model); }]);
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
//# sourceMappingURL=entityManagerFactory.js.map