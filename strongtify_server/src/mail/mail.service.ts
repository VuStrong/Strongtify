import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as ejs from "ejs";
import * as juice from "juice";
import * as nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

@Injectable()
export class MailService {
    private smtp: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

    async sendEmail({
        to,
        subject,
        templateName,
        templateVars,
    }: {
        to: string;
        subject: string;
        templateName?: string;
        templateVars: any;
    }) {
        const templatePath = `src/mail/templates/${templateName}.html`;
        const options: any = {
            from: process.env.EMAIL,
            to,
            subject,
        };

        if (templateName && fs.existsSync(templatePath)) {
            const template = fs.readFileSync(templatePath, "utf-8");
            const html = ejs.render(template, templateVars);
            const htmlWithStylesInlined = juice(html);

            options.html = htmlWithStylesInlined;
        }

        this.smtp = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: +process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        return await this.smtp.sendMail(options).catch(() => null);
    }
}
