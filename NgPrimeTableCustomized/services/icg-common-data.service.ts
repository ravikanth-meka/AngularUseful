import { Injectable } from '@angular/core';

import { TransferdataService } from './transferdata.service';
import { Data, Element } from '../icg-common-model';
import { RiskStripe } from '../../domain/riskStripe';

@Injectable()
export class IcgCommonDataService {
  public REPORT_CATEGORY = 'CCAR';
  public BUSINESS_LINE = 'ICG';
  constructor(protected transferdataService: TransferdataService) {
  }

  /**
   * Downloads and creates a File object from the given fileUrl. The target server must serve CORS requests else this call will fail.
   * @param fileUrl 
   * @param successCallback 
   * @param failureCallback 
   */
  downloadFile(fileUrl: string, successCallback: (resp) => void, failureCallback: (error) => void) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function (e) {
      if (xhr.status === 200) {
        try {
          const file = new File([xhr.response], fileUrl.substring(fileUrl.lastIndexOf('/') + 1));
          successCallback(file);
        } catch (err) {
          // hack for IE11 as it doesn't support HTML5 File API file constructor.
          const file = xhr.response;
          file.name = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
          successCallback(file);
        }
      } else {
        failureCallback('Error in downloading the report');
      }
    };
    xhr.onerror = function () {
      failureCallback('Error in download report request');
    };
    xhr.open('GET', fileUrl, true);
    xhr.responseType = 'blob';
    xhr.send();
  }

  /**
   * Retrieves the options list in a sorted order based on given command and sort order and returns them in optnListCallback. The returned list is an array of Data objects;
   * @param informationKey 
   * @param metaData 
   * @param optionIdProp 
   * @param optionLabelProp 
   * @param addAllOption 
   * @param optnListCallback 
   * @param addZeroOption 
   * @param sortOrder 
   */
  getCommonComboBoxDataModelList(informationKey: string, metaData: string, optionIdProp: string, optionLabelProp: string, addAllOption: boolean, optnListCallback: (options) => void, addZeroOption?: boolean, sortOrder?: string) {
    const success = (resp: any[]) => {
      if (resp) {
        let result: Data[] = new Array();
        resp.forEach(respElement => {
          const data: Data = new Data(respElement.get(optionIdProp), respElement.get(optionLabelProp));
          result.push(data);
        });
        result = this.sortComboBoxOptions(result, sortOrder);
        if (addAllOption) {
          result.unshift(new Data('All', 'All'));
        }
        if (addZeroOption && resp.length === 0) {
          result.unshift(new Data('0', '0'));
        }
        optnListCallback(result);
      }
    };
    this.transferdataService.sendInfoReq(informationKey, metaData, success, null);
  }

  /**
   * Constructs the Combobox optionlist based on given options array. The returned list is an array of Data objects;
   * @param options 
   * @param addAllOption 
   */
  getCommonComboBoxDataModelListFromOptions(options: string[], addAllOption: boolean): Data[] {
    let result: Data[] = new Array();
    options.forEach(respElement => {
      const data: Data = new Data(respElement, respElement);
      result.push(data);
    });
    result = this.sortComboBoxOptions(result);
    if (addAllOption) {
      result.unshift(new Data('All', 'All'));
    }
    return result;
  }

  /**
   * sorts the given options array as per the sortingOrder value
   * @param optionArray 
   * @param sortOrder 
   */
  sortComboBoxOptions(optionArray: Data[], sortOrder = 'ASC') {
    if (optionArray) {
      if (sortOrder === 'ASC') {
        return optionArray.sort((n1, n2) => {
          if (n1.label > n2.label) {
            return 1;
          }
          if (n1.label < n2.label) {
            return -1;
          }
          return 0;
        });
      } else if (sortOrder === 'DESC') {
        return optionArray.sort((n2, n1) => {
          if (n1.label > n2.label) {
            return 1;
          }
          if (n1.label < n2.label) {
            return -1;
          }
          return 0;
        });
      }
    }
  }

   getRiskStripes(): RiskStripe[] {
      let riskStripes = [
        new RiskStripe('COMMODITIES', 'Commodities'),
        new RiskStripe('EQUITIES', 'Equities'),
        new RiskStripe('IDR-CC', 'IDR-CC'),
        new RiskStripe('RATES', 'Rates'),
        new RiskStripe('SECURITIZED_PRODUCT', 'Securitized Products'),
        new RiskStripe('14Q LEGAL VEHICLE', '14Q legal Vehicle')
      ]	 
      return riskStripes;	  
   }

getTrdgCvaFvoFlags(): String[] {
      let trdgCvaFvoFlag = [
         'Trading',
         'CVA Hedge',
         'FVO Hedge'     
        ]	 
      return trdgCvaFvoFlag;	  
   }
}


