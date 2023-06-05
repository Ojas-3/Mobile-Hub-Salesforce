import { LightningElement, api } from 'lwc';

//static resource
import MOBILE_HUB_PLACEHOLDER from '@salesforce/resourceUrl/projectLogo'

export default class Placeholder extends LightningElement {
    @api message 

    placeholderUrl = MOBILE_HUB_PLACEHOLDER
}