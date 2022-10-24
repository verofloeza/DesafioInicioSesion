import { faker } from '@faker-js/faker';

function generarObjetoRandom() {
    return {
        title: faker.commerce.product(),
        price: faker.commerce.price(),
        thumbnails: faker.image.avatar()
    }
}

class Productos{
    constructor(){};

    async getAll(cant){
        let PRODUCTOS_FAKER = [];

        for (let index = 1; index <= cant; index++) {
            PRODUCTOS_FAKER.push({id: index, ...generarObjetoRandom()})
        }

        return PRODUCTOS_FAKER;
    };
}

export default Productos;