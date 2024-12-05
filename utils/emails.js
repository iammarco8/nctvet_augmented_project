import {htmltotext} from html-to-text
import path from 'path'
import {EmailComponent} from 'H:/nctvet assesment/practicaltask/second_front_end/src/app/emailTemplate/email/email.component.html'
import fs from fs;
import multer from multer;

// this was taught
import ejs from 'ejs';
import nodemailer from'naodemailer';

import{dirname}from 'path';
import { fileURLToPath } from 'url';
const __dirname= dirname(fileURLToPath(import.meta.urll))

export class Email{
    // location of the email template
    #templateUrl = path.join(__dirname,'../veiws/')
    constructor (user, tasks){
        this.to = user.email;
        this.first_name= user.first_name;
        this.last_name = user.last_name;
        this.from = `[task manager]<${process.env.EMAIL_FROM}>`
        this.task = tasks.task_name,
        this.task_date_due = tasks.date_due        
    }
    // configuration
    createMailTransport(){
        if (process.env.NODE_ENV = 'production'){
            // use mailtrap
            return nodemailer.createMailTransport({
                host: 'sandbox.smtp.mailtrap.io',
                port: 2525,
                secure: false,
                auth:{
                    user:process.env.MAILTRAP_USER,
                    pass:process.env.MAILTRAP_PASS,
                }
            });
        } else{
            // it is in production use a valid severlike a gmail mail server
            return naodemailer.createMailTransport({
                host: 'mail.somedomain.com',
                port: 465,
                secure: true,
                auth:{
                    user:process.env.EMAIL_USER,
                    pass:process.env.EMAIL_PASS,
                }
            })
        }
    }
    async sendmail(template, subject, taskInfo){
        const transport = this.createMailTransport();
        const html = await ejs.renderFile(this.#templateUrl + template + '.ejs', {
            // the angular injections would come here
            subject:subject,
            // logo:`${process.env.BASE_URL}/assets.logo.png` refer to the classes here.
            user_name: this.first_name + '' + this.last_name,
            task_assigned: this.task,
            task_date_due:this.task_date_due
        });
        return await transport.sendmail({
           to:`${this.to}, $process.env.COPY_EMAIL` ,
           from:`${this.from}`,
           html:html,
           text:htmltotext(html)
        });
    }
}


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