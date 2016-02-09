'use strict';

module App.Shared {

   interface IMinLengthContext {
      messageTemplate: string;
      isRequired: boolean;
      minLength: number;
   }

   interface IRangeContext {
      messageTemplate: string;
      isRequired: boolean;
      minValue: number;
      maxValue: number;
   }

   export interface IModelValidation {
   }

   export class ModelValidation implements IModelValidation {
      public static serviceId: string = 'model.validation';
   
      //#region variables
      breeze: any;
      common: ICommon;
      config: IConfigurations;
      logger: ILogger;

      //#endregion

      //#region constructor
      constructor(breeze: any, common: ICommon, config: IConfigurations) {
         this.breeze = breeze;
         this.common = common;
         this.config = config;
         this.logger = this.common.logger;
      }
      //#endregion

      //#region public methods
      public applyCustomAttributes(metadataStore, customAttributes) {
         customAttributes.forEach((p) => {
            var keyParts = p.key.split(",");
            var value = p.value;
            var entityType = metadataStore.getEntityType(keyParts[0]);
            var prop = entityType.getProperty(keyParts[1]);
            var Validator = this.breeze.Validator;;
            for (var i = p.value.length; i--;) {
               if (p.value[i].indexOf("RequiredAttribute") > -1) {
                  prop.validators.push(Validator.required());
               }
               if (p.value[i].indexOf("EmailAddressAttribute") > -1 || p.value[i].indexOf("DataTypeAttribute(10)") > -1) {
                  prop.validators.push(Validator.emailAddress());
               }
               if (p.value[i].indexOf("UrlAttribute") > -1 || p.value[i].indexOf("DataTypeAttribute(12)") > -1) {
                  prop.validators.push(Validator.url());
               }
               if (p.value[i].indexOf("PhoneNumberAttribute") > -1 || p.value[i].indexOf("DataTypeAttribute(5)") > -1) {
                  prop.validators.push(Validator.phone());
               }
               if (p.value[i].indexOf("CreditCardAttribute") > -1 || p.value[i].indexOf("DataTypeAttribute(14)") > -1) {
                  prop.validators.push(Validator.creditCard());
               }
               if (p.value[i].indexOf("RegularExpressionAttribute") > -1) {
                  var pattern = p.value[i].replace('(', ',').replace(')', ',').split(',')[1];
                  var regExpValidator = Validator.makeRegExpValidator(p.key, new RegExp(pattern, "i"),
                     'Invalid pattern ');
                  prop.validators.push(regExpValidator);
               }
               if (p.value[i].indexOf("MaxLengthAttribute") > -1) {
                  var len = p.value[i].replace('(', ',').replace(')', ',').split(',')[1];
                  prop.validators.push(Validator.maxLength({ maxLength: len }));
               }
               if (p.value[i].indexOf("MinLengthAttribute") > -1) {
                  var len = p.value[i].replace('(', ',').replace(')', ',').split(',')[1];
                  var minLengthValidator = this.createMinLengthValidator(len);
                  Validator.register(minLengthValidator);
                  prop.validators.push(minLengthValidator);

               }
               if (p.value[i].indexOf("StringLengthAttribute") > -1) {
                  var splited = p.value[i].replace('(', ',').replace(')', ',').split(',');
                  prop.validators.push(Validator.stringLength({ minLength: splited[2], maxLength: splited[1] }));
               }
               if (p.value[i].indexOf("RangeAttribute") > -1) {
                  var splited = p.value[i].replace('(', ',').replace(')', ',').split(',');
                  var rangeValidator = this.createRangeValidator(splited[1], splited[2])
                  Validator.register(rangeValidator);
                  prop.validators.push(rangeValidator);
               }
            }
         });
      }

      public applyValidator(metadataStore, entityNames: IEntityNames) {
         var logSuccess = this.logger.getLogFn(ModelValidation.serviceId, "success");
         this.applyRequireReferenceValidators(metadataStore, entityNames);
         this.applyTwitterValidators(metadataStore, entityNames);
         this.applyEmailValidators(metadataStore, entityNames);
         this.applyUrlValidators(metadataStore, entityNames);
         logSuccess('Required Reference Validator have been applyed', null, ModelValidation.serviceId, false);
      }

      public createAndRegister(entityNames: IEntityNames) {
         var requiredReferenceValidator = this.createRequiredReferenceValidator();
         this.breeze.Validator.register(requiredReferenceValidator);
         var twitterValidator = this.createTwitterValidator();
         this.breeze.Validator.register(twitterValidator);
         var logSuccess = this.logger.getLogFn(ModelValidation.serviceId, "success");
         logSuccess('Validators created and registered', null, ModelValidation.serviceId, false);
      }
      
      //#endregion

      
      //#region private methods
      private createMinLengthValidator(minLength) {
         var name = 'minLength' + minLength;
         var ctx: IMinLengthContext = {
            messageTemplate: '%displayName% must be a string with %minLength% chacters or more',
            isRequired: true,
            minLength: minLength
         };
         var val = new this.breeze.Validator(name, valFunction, ctx);
         return val;

         function valFunction(value, ctx: IMinLengthContext) {
            return value.length >= ctx.minLength;
         }
      }

      private createRangeValidator(minValue: number, maxValue: number) {
         var name = 'rangeValue';
         var ctx: IRangeContext = {
            messageTemplate: '%displayName% must be a number between %minValue% upto %maxValue%',
            isRequired: true,
            minValue: minValue,
            maxValue: maxValue
         };
         var val = new this.breeze.Validator(name, valFunction, ctx);
         return val;

         function valFunction(value, ctx) {
            return value >= ctx.minValue && value <= ctx.maxValue;
         }
      }
            
      applyRequireReferenceValidators(metadataStore, entityNames: IEntityNames) {
         var entityType = metadataStore.getEntityType(entityNames.session);
         var requiredReferenceValidator = this.createRequiredReferenceValidator();
         entityType.getProperty('room').validators.push(requiredReferenceValidator);
         entityType.getProperty('track').validators.push(requiredReferenceValidator);
         entityType.getProperty('timeSlot').validators.push(requiredReferenceValidator);
         entityType.getProperty('speaker').validators.push(requiredReferenceValidator);
      }

      private createRequiredReferenceValidator() {
         var name = 'requiredReferenceEntity';
         var ctx = {
            messageTemplate: 'Missing %displayName%',
            isRequired: true
         };
         var val = new this.breeze.Validator(name, valFunction, ctx);
         return val;

         function valFunction(value) {
            return value ? value.id !== 0 : false;
         }
      }
      private createTwitterValidator() {
         var val = this.breeze.Validator.makeRegExpValidator('twitter',
            /^@([a-zA-Z]+)([a-zA-Z0-9_]+)$/,
            'Invalid Twitter User Name: %value%');
         return val;
      }
      applyTwitterValidators(metadataStore, entityNames: IEntityNames) {
         var entityType = metadataStore.getEntityType(entityNames.person);
         var twitterValidator = this.createTwitterValidator();
         entityType.getProperty('twitter').validators.push(twitterValidator);
      }
      applyEmailValidators(metadataStore, entityNames: IEntityNames) {
         var entityType = metadataStore.getEntityType(entityNames.person);
         entityType.getProperty('email').validators.push(this.breeze.Validator.emailAddress());
      }
      applyUrlValidators(metadataStore, entityNames: IEntityNames) {
         var entityType = metadataStore.getEntityType(entityNames.person);
         entityType.getProperty('blog').validators.push(this.breeze.Validator.url());
      }
      //#endregion
   }
        
   // Creates service
   App.CodeCamper.codeCampModule.factory(ModelValidation.serviceId,
      ['breeze', 'common', 'app.config',
         (breeze, common, config) => new ModelValidation(breeze, common, config)]);

}