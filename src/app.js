import express, { json, query } from "express";
import ProductManager from "./manejoArchivos.js"

const pm = new ProductManager()
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const APP_PORT = 8080;

app.listen(APP_PORT, () => {
    console.log(`Servidor escuchando por el puerto: ${APP_PORT}`)
});

let products = [];

let traerProductos = async () => {
    products = await pm.getProduct();
    return products;
}

app.get('/products', (req, resp) => {
    traerProductos()
    console.log("/products")
    resp.send(JSON.stringify(products))
});

app.get('/products/query', (req, resp) => {
    let limit = req.query.limit;
    traerProductos()
    console.log("/products/query")
    if (limit > 0) {
        let prod = products.slice(1, limit)
        resp.send(JSON.stringify(prod));
    } else {
        resp.send(JSON.stringify(products))
    }

});

app.get('/products/:pId', (req, resp) => {
    let id = req.params.pId
    traerProductos();
    console.log("/products:id")
    let producto = products.filter((prod) => prod.id == id)
    producto.length > 0 ? resp.send(JSON.stringify(producto)) : resp.send({ message: "Producto no encontrado" });

});
