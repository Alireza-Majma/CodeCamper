'use strict';
declare var moment: moment.MomentStatic;
module App.Shared {
  
   export interface IEntityNames {
      attendee: string;
      person: string;
      speaker: string;
      session: string;
      room: string;
      track: string;
      timeSlot: string;
   }

   export interface IResourceNames {
      speakers: string;
      topSpeakers: string;
      persons: string;
      sessions: string;
      rooms: string;
      tracks: string;
      timeSlots: string;
   }

   export interface IModel {
      entityNames: IEntityNames;
      resourceNames: IResourceNames;
      extendMetadata: (metadataStore: breeze.MetadataStore, customAttributes: any) => void;
      nullDate: Date;
   }

   export class Model implements IModel {
      public static serviceId: string = 'model';
   
      //#region variables
      entityNames: IEntityNames = {
         attendee: 'Person',
         person: 'Person',
         speaker: 'Person',
         session: 'Session',
         room: 'Room',
         track: 'Track',
         timeSlot: 'TimeSlot'
      };
      resourceNames: IResourceNames = {
         speakers: 'Speakers',
         topSpeakers: 'TopSpeakers',
         persons: 'Persons',
         sessions: 'Sessions',
         rooms: 'Rooms',
         tracks: 'Tracks',
         timeSlots: 'TimeSlots'
      };
      nullDate = new Date(1900, 0, 1);
      modelValidation: any;
      //#endregion
      //#region constructor
      constructor(modelValidation) {
         this.modelValidation = modelValidation;
      }
      //#endregion

      //#region public methods
      public configureMetadataStore(metadataStore) {
         this.registerTimeSlot(metadataStore);
         this.registerSession(metadataStore);
         this.registerPerson(metadataStore);

         this.modelValidation.createAndRegister(this.entityNames);
         this.ArrayExtension();
      }

      public extendMetadata(metadataStore: breeze.MetadataStore, customAttributes: any) {
         this.modelValidation.applyValidator(metadataStore, this.entityNames);
         this.modelValidation.applyCustomAttributes(metadataStore, customAttributes);
      }

      //#endregion

      //#region private methods
      private registerTimeSlot(metadataStore) {

         metadataStore.registerEntityTypeCtor(this.entityNames.timeSlot, TimeSlot);

         function TimeSlot() {
            this.getName = getName;
         };

         Object.defineProperty(TimeSlot.prototype, 'name', {
            get: getName
         });

         function getName() {
            var start = this.start;
            
            if (start === new Date(1900, 0, 1)) {
               return ' [Select a timeSlot]';
            }
            var value = moment.utc(start).format('ddd hh:mm a');
            return value;
         };
      }

      registerSession(metadataStore) {
         metadataStore.registerEntityTypeCtor('Session', Session);

         function Session() {
         }

         Object.defineProperty(Session.prototype, 'tagsFormatted', {
            get: function () {
               return this.tags ? this.tags.replace(/\|/g, ', ') : this.tags;
            },
            set: function (value) {
               this.tags = value.replave(/\, /g, '|');
            }
         });
      }

      registerPerson(metadataStore) {
         metadataStore.registerEntityTypeCtor('Person', Person);

         function Person() {
            this.isSpeaker = false;
         }

         Object.defineProperty(Person.prototype, 'fullName', {
            get: function () {
               if (this.id === 0) {
                  return ' [Select a person]';
               }
               return this.firstName ? this.firstName + ' ' + this.lastName : this.lastName;
            }
         });
         Object.defineProperty(Person.prototype, 'genderType', {
            get: function () {
               if (!this.gender) {
                  return 'Unknown';
               }
               switch (this.gender.toUpperCase()) {
                  case 'M':
                     return 'Male'
                  case 'F':
                     return 'Female'
                  default:
                     return 'Unknown';
               }
            }
         });
      }

      ArrayExtension() {
         Object.defineProperty(Array.prototype, 'count', {
            get: function () { return this.length; }
         });

         if (!!Array.prototype['addRange']) return;

         Array.prototype['addRange'] = function (target) {
            this.push.apply(this, target);
         };
      }

      //#endregion
   }
        
   // Creates service
   App.CodeCamper.codeCampModule.factory(Model.serviceId, ['model.validation',
      (modelValidation) => new Model(modelValidation)]);

}