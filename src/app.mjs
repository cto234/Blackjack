import express from 'express'
import path from 'path'
import url from 'url';

const app = express();

const __dirname = path.dirname(url.fileURLToPath(import.meta.url)); 
app.use(express.static(path.join(__dirname, 'public')));     

app.use(express.urlencoded({ extended: false }));

app.listen(3000);