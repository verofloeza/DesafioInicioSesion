import * as dotenv from 'dotenv';

import connectMongo from 'connect-mongo';

dotenv.config();

const MongoStore = connectMongo.create({
    mongoUrl: `${process.env.URL_MONGO_DB}?retryWrites=true&w=majority`,
    ttl: 600 
})

export const config = {
    atlas: {
        strConn: process.env.URL_MONGO_DB
    },
    atlasSesion: {
        strConn: MongoStore
    }
}