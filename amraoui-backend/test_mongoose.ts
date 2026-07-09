import mongoose from 'mongoose';
import { Requests } from './src/app/modules/requests/requests.model';

const schema = Requests.schema;
console.log(schema.path('message'));
console.log(schema.path('driverQuotes'));
