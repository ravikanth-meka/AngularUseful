import { RiskStripe } from './riskStripe';
import { Desks } from './desks';

export class UploadParams { 
    riskStripe: RiskStripe = null;
    sheetName: string;
    dataSource:string;
    tradingCvaFlag:string;
    effectiveDate:string;
    // templateDownload
    // upload
    // addRow
    // deleteRow
    // deskUpload
    vegaInputUsMbs:string;
    //vegaUpload

    //desk, deskName and level8Id max 5 elements can be added in single transaction 
    desks:Desks[];


    blank:string;
    // countrytemplateDownload
    // countryUpload


    constructor() {
    }
}
