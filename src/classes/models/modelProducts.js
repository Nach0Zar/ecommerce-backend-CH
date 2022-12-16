import Model from "./model.js"
class ModelProductsClass extends Model{
    constructor(){
        super("products");
    }
    modifyProductByID = async (idItem, newItemParam) => {
        this.container.modifyByID(idItem, newItemParam);
    }
    async deleteItemByID(idItem){
        this.container.deleteByID(idItem);
    }
}
const modelProducts = new ModelProductsClass();
export default modelProducts;