import {htmltotext} from html-to-text
import path from 'path'
import {EmailComponent} from 'H:/nctvet assesment/practicaltask/second_front_end/src/app/emailTemplate/email/email.component.html'
import fs from fs;
import multer from multer;


// import { dirname } from 'path';
// import { fileURLToPath } from 'url';

// const __dirname = dirname(fileURLToPath(import.meta.url));

// console.log(EmailComponent.email)
// export class  taskEmail {
//     // #temlateURL = 
// }

const templatePath = 'utils/emailTemplate.html';
const templateContent = fs.readFileSync(templatePath, 'utf-8');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

app.post

function replacePlaceholders(html, data){
    for (const key in data){
        if (data.hasOwnProperty(key)){
            const placeHolder = `{{${{key}}}}`;
            html = html.replace(new RegExp(placeHolder,'g'),data[key]);
        }
    }
    return html
}