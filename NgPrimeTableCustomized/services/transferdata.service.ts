import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import {
  RaptorCommandType, RaptorCommandResponseType, RaptorCommand,
  RaptorRemoteCommand, RaptorRemoteCommandResponse
} from '../protobufs/rcast-protobufs';
import { Utils } from '../icg-common-model';
import { AppConfig } from '../../app.config';
import { Command } from '../common.model'

@Injectable()
export class TransferdataService {
  private remoteUrl = '';
  constructor(private httpClient: HttpClient, private datePipe: DatePipe, private appConfig: AppConfig) {
    console.log(this.appConfig.getProperty('remoteUrl'));
    this.remoteUrl = this.appConfig.getProperty('remoteUrl');
   }

  public generateCorrelationId(): string {
    const date = new Date();
    // angular 4 datepipe has a bug in IE when used to get a format with time.
    // const correlationId1 = 'REPORTING-C-' + this.datePipe.transform(date, 'yyyyMMdd_HHmmss') + millis;
    const correlationId = 'REPORTING-C-' + this.datePipe.transform(date, 'yyyyMMdd') + '_' + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds();
    return correlationId;
  }

  public sendFile(file: File, metadata: string, type: string, success: (resp) => void, failure: (error) => void) {
    // const formData = new FormData();
    // formData.append('file', file);
    const xhr = new XMLHttpRequest();
    xhr.onload = (e) => {
      if (xhr.status === 200) {
        const resp = RaptorRemoteCommandResponse.decode(new Uint8Array(xhr.response));
        success(resp.correlationId);
      } else {
        console.log('File Upload Failed.');
        failure('File Upload Failed.');
      }
    };
    xhr.open('POST', this.remoteUrl, true);
    xhr.responseType = 'arraybuffer';
    xhr.setRequestHeader('action', 'upload');
    xhr.setRequestHeader('metadata', metadata);
    xhr.setRequestHeader('filename', file.name);
    xhr.setRequestHeader('type', type);
    xhr.setRequestHeader('correlationId', this.generateCorrelationId());
    xhr.setRequestHeader('runmanager', 'true');
    //xhr.send(formData);
    xhr.send(file);
  }

  

  generateReportReq(type: string, metadata: string, successCallback: (resp) => void, failureCallback: (error) => void) {
    const correlationId = this.generateCorrelationId();
    const rcmd = RaptorCommand.create({ command: RaptorCommandType.RAPTOR_GENERATE_REPORT, type, correlationId, metadata });
    const remoteRaptorCMD = RaptorRemoteCommand.create({ command: rcmd });
    const success = (resp: RaptorRemoteCommandResponse) => {
      if (resp) {
        successCallback(resp.correlationId);
      }
    };
    const failure = (error: string) => {
      console.log('Error generating Report');
      failureCallback(error);
    };
    this.sendRequest(remoteRaptorCMD, success, failure);
  }

  sendInfoReq(type: string, metadata: string, successCallback: (resp) => void, failureCallback: (error) => void) {  
    const correlationId = this.generateCorrelationId();
    const rcmd = RaptorCommand.create({ command: RaptorCommandType.RAPTOR_INFORMATION, type, correlationId, metadata });
    const remoreRaptorCMD = RaptorRemoteCommand.create({ command: rcmd });
    const success = (resp: RaptorRemoteCommandResponse) => {
      if (resp) {
        let dataMap;
        if (type === 'JSON_INFORMATION') {
          dataMap = resp.metadata;
        } else {
          dataMap = <Array<Map<string, string>>>this.parse(resp.metadata);
        }
        successCallback(dataMap);
      }
    };
    const failure = (error: string) => {
      console.log('Error occured while retrieving information ==' + error);
      if (failureCallback) {
        failureCallback(error);
      }
    };
    this.sendRequest(remoreRaptorCMD, success, failure);
  }

  public sendRequest(remoreRaptorCMD: RaptorRemoteCommand, success: (resp) => void, failure: (error) => void) {
    const errMsg = RaptorRemoteCommand.verify(remoreRaptorCMD);
    if (errMsg) {
      failure(errMsg);
      throw Error(errMsg);
    }
    const buffer = RaptorRemoteCommand.encode(remoreRaptorCMD).finish();
    const xhr = new XMLHttpRequest();
    xhr.onload = (e) => {
      if (200 <= xhr.status && xhr.status < 300) {
        console.log('sent a Msg and recevied legal response.');
        const resp = RaptorRemoteCommandResponse.decode(new Uint8Array(xhr.response));
        console.log(resp);
        success(resp);
      } else {
        console.error('Error parsing response: ' + xhr.status);
        console.error(String.fromCharCode.apply(null, new Uint8Array(xhr.response)));
        failure('Error parsing response: ' + xhr.status);
      }
    };
    xhr.onerror = (e) => {
      console.error('Error sending request: ' + e);
      failure('Error sending request: ' + e);
    };
    xhr.open('POST', this.remoteUrl, true);
    xhr.responseType = 'arraybuffer';
    xhr.send(buffer);
  }

  public sendCmdRequest(cmd: Command, success: (resp: RaptorRemoteCommandResponse) => void, failure: () => void) {
    console.log('executing cmd: ' + cmd.name)
    const remoreRaptorCMD = RaptorRemoteCommand.create({ command: cmd.raptorCmd })
    this.sendRequest(remoreRaptorCMD, success, failure)
  }

  public parse(result: string): Array<Map<string, string>> {
    const resultObjs: Array<Map<string, string>> = new Array<Map<string, string>>();
    const results: string[] = result.split('\n');
    let temp = 0;
    for (const ele of results) {
      temp++;
      if (ele === null || '' === ele) {
        continue;
      }
      const fields: string[] = ele.split('|');
      const map: Map<string, string> = new Map<string, string>();
      resultObjs.push(map);
      for (const field of fields) {
        const index: number = field.indexOf('=');
        map.set(field.substring(0, index).toLowerCase(), field.substring(index + 1));
      }
    }
    return resultObjs;
  }

  public formatGridData(data: Array<Map<string, string>>): any[] {
    const rst: any[] = [];
    for (const ele of data) {
      //rst.push(Utils.objectToMap(ele));
      rst.push(Utils.mapToObj(ele));
    }
    return rst;
  }

  retrieveDataInfo(type: string, metadata: string, successCallback: (resp) => void, failureCallback: (error) => void) {
    const correlationId = this.generateCorrelationId();
    const rcmd = RaptorCommand.create({ command: RaptorCommandType.RAPTOR_INFORMATION, type, correlationId, metadata });
    const remoreRaptorCMD = RaptorRemoteCommand.create({ command: rcmd });
    const success = (resp: RaptorRemoteCommandResponse) => {
      if (resp) {
        let dataMap;
        if (type === 'JSON_INFORMATION') {
          dataMap = resp.metadata;
         
        } else {
          dataMap = <Array<Map<string, string>>>this.parse(resp.metadata);
        }
         console.log(dataMap);
        successCallback(dataMap);
      }
    };
    const failure = (error: string) => {
      console.log('Error occured while retrieving information ==' + error);
      if (failureCallback) {
        failureCallback(error);
      }
    };
    this.sendRequest(remoreRaptorCMD, success, failure);
  }

}
