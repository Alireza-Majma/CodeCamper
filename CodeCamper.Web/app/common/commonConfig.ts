'use strict';

module App.Shared
{
    export interface ICommonConfig
    {
        config: ICommonConfigEvents;
        $get: any;
    }

    export interface ICommonConfigEvents
    {
        controllerActivateSuccessEvent?: any;
        spinnerToggleEvent?: any;
    }


    class CommonConfig implements ICommonConfig, ng.IServiceProvider
    {
        public static providerId: string = 'commonConfig';
        public config: ICommonConfigEvents;
        public $get: () => { config: ICommonConfigEvents };

        constructor()
        {
            this.config = {
                // These are the properties we need to set
                // controllerActivateSuccessEvent: ''
                // spinnerToggleEvent:''

            };
            this.$get = () =>
            {
                return {config: this.config};
            };
        }
    }
    App.Shared.commonModule.provider(CommonConfig.providerId, CommonConfig);
 }