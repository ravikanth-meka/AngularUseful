import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import {
  RaptorCommandType, RaptorCommandResponseType, RaptorCommand,
  RaptorRemoteCommand, RaptorRemoteCommandResponse
} from '../protobufs/rcast-protobufs';
import { TransferdataService } from './transferdata.service';
import { Utils } from '../icg-common-model';
import { Utility } from '../utility';
import { AppConfig } from '../../app.config';
import { RiskStripe } from '../../domain/riskStripe';


@Injectable()
export class DataUploadService {
  private remoteUrl = '';
  constructor(private transferdataService: TransferdataService, private httpClient: HttpClient, private datePipe: DatePipe, private appConfig: AppConfig) {
    console.log(this.appConfig.getProperty('remoteUrl'));
    this.remoteUrl = this.appConfig.getProperty('remoteUrl');
   }

 generateReportReq(reportType: string, type: string, metadata: string, successCallback: (resp) => void, failureCallback: (error) => void) {
    const correlationId = Utility.generateCorrelationId();
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
    this.transferdataService.sendRequest(remoteRaptorCMD, success, failure);
  }

  retrieveDataUploadInfo(type: string, metadata: string, successCallback: (resp) => void, failureCallback: (error) => void) {
    
    this.transferdataService.retrieveDataInfo(type, metadata,successCallback, failureCallback);
  }

 
 
}
