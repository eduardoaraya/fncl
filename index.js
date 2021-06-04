import path from 'path';
import importInvoiceNubank from './src/services/import-invoice-nubank.js';
import dbConnection from './src/modules/db-connection.js';

const __dirname = path.resolve(path.dirname(decodeURI(new URL(import.meta.url).pathname)));
dbConnection();

// importInvoiceNubank({ __dirname });



