import fs from 'file-system'
class Product {
    static id = 1;
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.id = Product.id++;
    }

}


class ProductManager {
    #listaProducts;
    #productDirPath;
    #productsFilePath;
    #fs;

    constructor() {
        this.#listaProducts = new Array();
        this.#productDirPath = "./Archivos";
        this.#productsFilePath = this.#productDirPath + "/Productos.json";
       this.#fs =fs
    }


    #prepararDirectorioBase = async () => {
        //Creamos el directorio
        await this.#fs.promises.mkdir(this.#productDirPath, { recursive: true });
        //Validamos que exista ya el archivo con products sino se crea vacío para ingresar nuevos:
        if (!this.#fs.existsSync(this.#productsFilePath)) {
            await this.#fs.promises.writeFile(this.#productsFilePath, "[]");
        }
    }
    #traerProductos = async () => {
        let productsFile = await this.#fs.promises.readFile(this.#productsFilePath, "utf-8");
        this.#listaProducts = JSON.parse(productsFile);
    }


    addProduct = async (title, description, price, thumbnail, code, stock) => {

        if (title == null || description == null || price == null || thumbnail == null || stock == null || code == null) {
            console.log("Complete los campos correctamente");
        } else if (!this.#listaProducts.some(prod => prod.code === code)) {
            var productoNuevo = new Product(title, description, price, thumbnail, code, stock);
        } else { return console.log("El code ya existe") }

        console.log("Producto a registrar:");
        console.log(productoNuevo);
        try {
            await this.#prepararDirectorioBase();
            await this.#traerProductos();
            this.#listaProducts.push(productoNuevo);
            await this.#fs.promises.writeFile(this.#productsFilePath, JSON.stringify(this.#listaProducts));
        } catch (error) {
            throw Error(`Error creando producto nuevo: ${JSON.stringify(productoNuevo)}, detalle del error: ${error}`);
        }
    }
    getProduct = async () => {
        try {
            await this.#prepararDirectorioBase();
            await this.#traerProductos();
            return this.#listaProducts;
        } catch (error) {
            throw Error(`Error consultando los products por archivo, valide el archivo: ${this.#productDirPath},
         detalle del error: ${error}`);
        }
    }

    getProductById = async (id) => {
        await this.#traerProductos();
        let prod = await this.#listaProducts.filter(prod => prod.id === id);
        return prod.length > 0
            ? console.log(`Producto id = ${id} encontrado: `, prod)
            : console.error(`Producto con id: ${id} no encontrado.`, ' “Not found” ');
    }

    deleteProduct = async (id) => {
        await this.#traerProductos();
        let listaAux;
        let encontrado = this.#listaProducts.some(prod => prod.id === id);
        if (encontrado) {
            listaAux = await this.#listaProducts.filter(prod => prod.id !== id);
            this.#listaProducts = listaAux;
            console.log(`Producto id = ${id} eliminado con exito: `)
        } else {
            console.error(`Producto no Existe`);
        }
        await this.#fs.promises.writeFile(this.#productsFilePath, JSON.stringify(this.#listaProducts));
    }

    updateProductById = async (id, nuevoProducto) => {
        await this.#traerProductos();
        const updateProduct = this.#listaProducts.map((prod) => {
            if (prod.id === id) {
                return { ...prod, ...nuevoProducto }
            } else {
                return prod
            }
        })
        this.#listaProducts = updateProduct;
        await this.#fs.promises.writeFile(this.#productsFilePath, JSON.stringify(this.#listaProducts));
        console.log(this.#listaProducts)
    }

}

// module.exports = ProductManager;
export default ProductManager;


// let prod = new ProductManager();
// console.log(prod);
// let productos = async()=>{
//     let produ = await prod.getProduct();
//   console.log(produ)
// }

// let persistirproductos = async () =>{
//     await prod.addProduct('kevin','Persona',100,'sin foto','4fkre5d',1);
//     await prod.addProduct('juan','Persona',150,'sin foto','4fke5d',10);
//     await prod.addProduct('pedro','Persona',10,'sin foto','4fk5d',100);
//     await prod.addProduct('nico','Persona',110,'sin foto','4fkr5d',20);
// };
// // persistirproductos();

// // prod.getProductById(8);

// // prod.updateProductById(1,{title:'nico', description: 'Persona', price:110, thumbnail:'sin foto', code:'4fkr5d',stock:20} );

// // prod.deleteProduct(8)

// // productos()
