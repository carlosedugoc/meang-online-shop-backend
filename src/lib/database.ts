import chalk from 'chalk';
import { MongoClient } from 'mongodb';

const MONGO_DB = process.env.DATABASE || 'mongodb://localhost:27017/meang';
const client = new MongoClient(MONGO_DB);

class Database {
  async init() {
    await client.connect();
    const db = client.db();
    console.log( chalk.blueBright('=================MONGODB DATABASE===================='));
    console.log(`STATUS: ${chalk.greenBright('ONLINE')}`);
    console.log(`DATABASE: ${chalk.greenBright(db.databaseName)}`);
    return db;
  }
}

export default Database;

// import chalk from "chalk";
// import mongoose from 'mongoose'

// async function connectDatabase() {
//     const MONGO_DB = process.env.DATABASE || "mongodb://localhost:27017/meang"
//     return await mongoose.connect(MONGO_DB, {useNewUrlParser: true, useUnifiedTopology: true})
//     // await mongoose.connect(MONGO_DB, {useNewUrlParser: true, useUnifiedTopology: true}).then((res)=> {
//     //     console.log(`STATUS: ${chalk.greenBright('==========================DATABASE ONLINE===========================')}`)
//     //     console.log(res.connections[0].db.databaseName)
//     //     return res.connections[0].db.databaseName
//     // }).catch(error => {
//     //     console.log(`STATUS: ${chalk.redBright('HA OCURRIDO UN ERROR EN LA BASE DE DATOS: ' + error)}`)
//     // });
// }

// export default connectDatabase
