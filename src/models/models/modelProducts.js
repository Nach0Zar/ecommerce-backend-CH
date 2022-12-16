import Model from "./model.js"
class ModelCartsClass extends Model{
    constructor(){
        super("products");
    }
    modifyProductByID = async (idItem, newItemParam) => {
        let index = this.items.map((item => item.id)).indexOf(idItem);
        this.items[index].modifyProduct(newItemParam.title, newItemParam.price, newItemParam.thumbnail);
        await this.saveDataOnFile();
    }
    async deleteItemByID(idItem){
        let index = this.items.map((item => item.id)).indexOf(idItem);
        (index !== -1) && this.items.splice(index,1);
        await this.saveDataOnFile();
    }
}
const modelCarts = new ModelCartsClass();
export default modelCarts;