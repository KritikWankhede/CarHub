import { LightningElement ,api} from 'lwc';
import carhubLogo from '@salesforce/resourceUrl/carhub_logo';
export default class PlaceHolder extends LightningElement {
    @api message;

    carImage=carhubLogo;
}