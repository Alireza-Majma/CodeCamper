'use strict';
var App;
(function (App) {
    var Shared;
    (function (Shared) {
        var Model = (function () {
            //#endregion
            //#region constructor
            function Model(modelValidation) {
                //#region variables
                this.entityNames = {
                    attendee: 'Person',
                    person: 'Person',
                    speaker: 'Person',
                    session: 'Session',
                    room: 'Room',
                    track: 'Track',
                    timeSlot: 'TimeSlot'
                };
                this.resourceNames = {
                    speakers: 'Speakers',
                    topSpeakers: 'TopSpeakers',
                    persons: 'Persons',
                    sessions: 'Sessions',
                    rooms: 'Rooms',
                    tracks: 'Tracks',
                    timeSlots: 'TimeSlots'
                };
                this.nullDate = new Date(1900, 0, 1);
                this.modelValidation = modelValidation;
            }
            //#endregion
            //#region public methods
            Model.prototype.configureMetadataStore = function (metadataStore) {
                this.registerTimeSlot(metadataStore);
                this.registerSession(metadataStore);
                this.registerPerson(metadataStore);
                this.modelValidation.createAndRegister(this.entityNames);
                this.ArrayExtension();
            };
            Model.prototype.extendMetadata = function (metadataStore, customAttributes) {
                this.modelValidation.applyValidator(metadataStore, this.entityNames);
                this.modelValidation.applyCustomAttributes(metadataStore, customAttributes);
            };
            //#endregion
            //#region private methods
            Model.prototype.registerTimeSlot = function (metadataStore) {
                metadataStore.registerEntityTypeCtor(this.entityNames.timeSlot, TimeSlot);
                function TimeSlot() {
                    this.getName = getName;
                }
                ;
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
                }
                ;
            };
            Model.prototype.registerSession = function (metadataStore) {
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
            };
            Model.prototype.registerPerson = function (metadataStore) {
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
                                return 'Male';
                            case 'F':
                                return 'Female';
                            default:
                                return 'Unknown';
                        }
                    }
                });
            };
            Model.prototype.ArrayExtension = function () {
                Object.defineProperty(Array.prototype, 'count', {
                    get: function () { return this.length; }
                });
                if (!!Array.prototype['addRange'])
                    return;
                Array.prototype['addRange'] = function (target) {
                    this.push.apply(this, target);
                };
            };
            Model.serviceId = 'model';
            return Model;
        })();
        Shared.Model = Model;
        // Creates service
        App.CodeCamper.codeCampModule.factory(Model.serviceId, ['model.validation',
            function (modelValidation) { return new Model(modelValidation); }]);
    })(Shared = App.Shared || (App.Shared = {}));
})(App || (App = {}));
//# sourceMappingURL=model.js.map