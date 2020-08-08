
import mysql from 'mysql2';
import { Video } from '../model/Video.model';
import { readdir } from 'fs';
import { join } from 'path';

export class Database {
    public static connection: mysql.Pool;
    public static videoSource: Video[];

    public static initialise() {
        this.videoSource = [];
        const assetDirectory: string = join(__dirname, '../assets');
        readdir(assetDirectory, (err, files) => {
            if (err) return console.log('Unable to scan directory: ' + err);

            files.forEach((file, index) => {
                this.videoSource.push(new Video(index, file, join(assetDirectory, file)));
            });
            console.log(this.videoSource);
        });
    }

    public static async runQuery(query: string, parameters?: string[]): Promise<any> {
        return await new Promise((resolve, reject) => {
            this.connection.getConnection((connectionError, connection) => {
                (connectionError) ? reject(connectionError) : connection.query(query, parameters, (queryError, result) => {
                    (queryError) ? reject(queryError) : resolve(result);
                    connection.release();
                });
            });
        });
    }
}