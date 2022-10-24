import ProductosDaos from "../daos/productos/ProductosDaos.js";
import { Router } from "express";

const routerProductos = Router();
const ApiProductos = new ProductosDaos();

let PRODUCTOS_FAKER;

routerProductos.get( "/",async (req, res, next) => {
    PRODUCTOS_FAKER =await ApiProductos.getAll(5);
    if(!PRODUCTOS_FAKER){
        return res.status(404).json({ error });
    }else{
        return res.status(200).render('vista', {PRODUCTOS_FAKER});
    }
});

export default routerProductos;