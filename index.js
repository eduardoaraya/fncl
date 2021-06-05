import path, { dirname } from 'path';
import importInvoiceNubank from './src/services/import-invoice-nubank.js';
import migrations from './src/modules/database/migrations.js';

global.__dirname = path.resolve(path.dirname(decodeURI(new URL(import.meta.url).pathname)));
// console.log(migrations());
importInvoiceNubank({ __dirname });



