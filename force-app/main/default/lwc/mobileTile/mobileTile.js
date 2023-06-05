import { LightningElement, api} from 'lwc';

export default class MobileTile extends LightningElement {
    @api mobile={}

    handleClick(){
        this.dispatchEvent(new CustomEvent('selected', {
            detail:this.mobile.Id
        }))
    }
}