﻿/// <reference path="common.ts" />
'use strict';
module App.Shared {

   export interface ILogger {
      getLogFn(moduleId: string, fnName?: string): Function
      getLogger(moduleId: string, fnName?: string): ILoggerModule
      log(message: string, data: any, source: string, showToast: boolean)
      logError(message: string, data: any, source: string, showToast: boolean)
      logSuccess(message: string, data: any, source: string, showToast: boolean)
      logWarning(message: string, data: any, source: string, showToast: boolean)
   }

   export interface ILoggerFunction {
      (message: string, data?: any, showToast?: boolean): void;
   }

   export interface ILoggerModule {
      log: ILoggerFunction
      logError: ILoggerFunction
      logSuccess: ILoggerFunction
      logWarning: ILoggerFunction
   }
   
   

   export class Logger implements ILogger {
      public static serviceId = 'logger';
      //#region Variables
      $log;
      logFn: Function;
      service = {
         getLogFn: this.getLogFn,
         getLogger: this.getLogger,
         log: this.log,
         logError: this.logError,
         logSuccess: this.logSuccess,
         logWarning: this.logWarning
      };
      //#endregion
      
      constructor($log) {
         this.$log = $log;
      }
      //#region Public Methods
      //TODO: see if there is a way to solve this more intuitive than returning an anonymous function
      getLogFn(moduleId: string, logFunctionName?: string): ILoggerFunction {
         logFunctionName = logFunctionName || 'log';
         switch (logFunctionName.toLowerCase()) { // convert aliases
            case 'success':
               logFunctionName = 'logSuccess'; break;
            case 'error':
               logFunctionName = 'logError'; break;
            case 'warn':
               logFunctionName = 'logWarning'; break;
            case 'warning':
               logFunctionName = 'logWarning'; break;
         }
         
         return (msg: string, data?: any, showToast?: boolean) => {
            this.logFn = this.service[logFunctionName] || this.service.log;
            this.logFn(msg, data, moduleId, (showToast === undefined) ? true : showToast);
         };
      }

      getLogger(moduleId: string): ILoggerModule {
         return {
            log: this.getLogFn(moduleId, 'log'),
            logError: this.getLogFn(moduleId, 'log'),
            logSuccess: this.getLogFn(moduleId, 'log'),
            logWarning: this.getLogFn(moduleId, 'log')
         };
      }


      log(message: string, data: any, source: string, showToast: boolean) {
         this.logIt(message, data, source, showToast, 'info');
      }

      logWarning(message: string, data: any, source: string, showToast: boolean) {
         this.logIt(message, data, source, showToast, 'warning');
      }

      logSuccess(message: string, data: any, source: string, showToast: boolean) {
         this.logIt(message, data, source, showToast, 'success');
      }

      logError(message: string, data: any, source: string, showToast: boolean) {
         this.logIt(message, data, source, showToast, 'error');
      }

      //#endregion
      private logIt(message: string, data: any, source: string, showToast: any, toastType: string) {
         var write = (toastType === 'error') ? this.$log.error : this.$log.log;
         source = source ? '[' + source + '] ' : '';
         write(source, message, data);
         if (showToast) {
            if (toastType === 'error') {
               toastr.error(message);
            } else if (toastType === 'warning') {
               toastr.warning(message);
            } else if (toastType === 'success') {
               toastr.success(message);
            } else {
               toastr.info(message);
            }
         }
      }
   }

   // Register with angular
   commonModule.factory(Logger.serviceId, ['$log', ($log) => new Logger($log)]);
}