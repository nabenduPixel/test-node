const nodemailer = require('nodemailer');
const path = require("path");
let ejs = require("ejs");
const EmailTemplate = require("../models/emailTemplate.model");
// const puppeteer = require('puppeteer-core');
const puppeteer = require('puppeteer');
const chromium = require('@sparticuz/chromium');


class EmailHelpers {

    async emailTemplate(templateCode = '', searchText = [], replaceText = []) {
        if (!templateCode) {
            return false;
        }

        let data = await this.templateData(templateCode);
        if (!data) {
            return false;
        }
        const emailSubject = data.subject && data.subject !== 'New Notification From Alta' ? data.subject : templateArray[1];
        const smsBody = data.sms_body || '';
        const isSms = data.is_sms || '';
        const pushBody = data.push_body || '';
        const isPush = data.is_push || '';
        let subject, sms, body;
        if (searchText.length > 0) {
            subject = emailSubject;
            sms = smsBody;
            searchText.map((n, i) => {
                data.email_body = data.email_body.replaceAll(n, replaceText[i])
            })
            body = data.email_body;
        }

        const emailBody = {
            body: body,
            subject: subject,
            sms: sms,
            isSms: isSms,
            pushBody: pushBody,
            isPush: isPush
        };

        return emailBody;
    }

    async templateData(template_code) {
        if (!template_code) {
            return false;
        }

        let data = [];
        const resultData = await EmailTemplate.findOne({ template_code: template_code }).select('-_id name template_category template_code subject email_body is_sms sms_body is_push push_body');
        if (resultData) {
            for (const [key, value] of Object.entries(resultData)) {
                data = value;
            }
            return data;
        }
    }


    static async generatePdfFromHtml(htmlContent) {

        const browser = await puppeteer.launch({
            executablePath: await chromium.executablePath(),
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf();
        await browser.close();
        return pdfBuffer;
    }


    async sendEmailNotification(emailData, toEmail, toName, subject, attachment = '', attachment2 = '') {
        if (!emailData || !toEmail || !toName || !subject) {
            return false;
        }

        const emailGetway = process.env.EMAIL_GETWAY;
        if (!emailGetway) {
            return false;
        }

        try {
            // Create the transporter
            const transporter = nodemailer.createTransport({
                service: process.env.MAIL_HOST,
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_PORT,
                auth: {
                    user: process.env.MAIL_USERNAME,
                    pass: process.env.MAIL_PASSWORD,
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });

            const emailBody = emailData.body.replace('\n\t/\[|\]/g', '');
            const EMAIL_SIGNATURE = 'support@altabooking.com';
            const ADMIN_EMAIL = 'support@altabooking.com';

            // Generate HTML content for the email
            const emailHTML = `<!doctype html>
                                    <html>
                                        <head>
                                            <meta charset="utf-8">
                                            <title>Alta Booking</title>
                                            <style>
                                                body{color:#231f20;}
                                                .bg-main{background:#23b7ca;}
                                                .calendarIcon{background:${path.join(__dirname, "../storage/administrator/images/calenderIcon.png")} no-repeat right 10px top 0; background-size: 15px auto !important; padding-right: 30px;}
                                                .locationIcon{background:${path.join(__dirname, "../storage/administrator/images/locationIcon.png")} no-repeat right 10px top 0; background-size: 15px auto !important; padding-right: 30px;}
                                                .clockIcon{background:${path.join(__dirname, "../storage/administrator/images/clockIcon.png")} no-repeat right 10px top 0; background-size: 15px auto !important; padding-right: 30px;}
                                                .distanceIcon{background:${path.join(__dirname, "../storage/administrator/images/distanceIcon.png")} no-repeat right 10px top 0; background-size: 22px auto !important; padding-right: 30px;}
                                                .turmIconSm{ background:${path.join(__dirname, "../storage/administrator/images/termIconSm.png")}0 50% no-repeat; padding-left:30px; margin-right:20px; line-height:25px; display:inline-block; color: #23b7ca;}
                                                .tripDetails p{font-size:14px; margin-top:5px; margin-bottom:7px;}
                                                .links a{display:block; color:#23b7ca; text-decoration:none; font-size:14px; margin-bottom:7px;}
                                                .btn-main{ color: #fff; background-color: #23b7ca; border-color: #168f9f; display:inline-block; padding:15px 20px; text-align: center; line-height:120%; border-radius:30px; text-decoration:none;}
                                                .btn-main:hover{background-color:#168f9f;}
                                                .dwnloadStore li{list-style:none; display:inline-block; vertical-align:middle;}
                                                .dwnloadStore li img{width:100px; display:block; margin:0 auto;}
                                            </style>
                                        </head>

                                        <body paddingwidth="0" paddingheight="0"   style="padding-top: 0; padding-bottom: 0; padding-top: 0; padding-bottom: 0; margin:0; background-repeat: repeat; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased;" offset="0" toppadding="0" leftpadding="0" style="margin-left:5px; margin-right:5px; margin-top:0px; margin-bottom:0px;">
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style='font-family:helvetica, sans-serif;' bgcolor="#ffffff">
                                                <thead>
                                                    <tr>
                                                        <td class="bg-main" style="padding:15px;">
                                                            <table width="100%">
                                                                <tr>
                                                                    <td>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    ${emailBody}
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <td>
                                                            <table width="100%" style="border-top:solid 1px #000;">
                                                                <tr>
                                                                    <td style="padding:15px; background:#f9f9f9; border-top:dotted 1px #ccc; border-bottom:dotted 1px #ccc;">
                                                                        <p style="color:#414141; font-size:14px; line-height:20px; margin:0;">For more details please contact our <a style="color: #23b7ca; text-decoration:none;" href="https://support.altabooking.com/open.php">Customer Support</a></p>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="padding-top:10px; padding-bottom:10px;">
                                                                        <p style="color:#b6b6b6; font-size:14px; line-height:20px; margin:0;">Please do not reply to this email. It has been sent from an email account that is not monitored. If you have any queries regarding your booking, please contact Alta Booking customer care - <a style="color: #23b7ca; text-decoration:none;" href="mailto:${ADMIN_EMAIL}">${ADMIN_EMAIL}</a></p>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="padding-top:10px; padding-bottom:20px;">
                                                                        ${EMAIL_SIGNATURE}
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </body>
                                    </html>
                                    `;

            // Prepare mail options
            const mailOptions = {
                from: process.env.MAIL_USERNAME,
                to: toEmail,
                subject: subject,
                html: emailHTML,
            };

            // If there is an attachment, generate the PDF and attach it
            if (attachment) {
                const templatePath = path.join(__dirname, '../views/', 'downloadpdf.ejs');
                const html = await ejs.renderFile(templatePath, { data: attachment });

                // const browser = await puppeteer.launch({
                //     args: ['--no-sandbox', '--disable-setuid-sandbox'],
                //     headless: true,
                // });
                const browser = await puppeteer.launch({
                    args: chromium.args,
                    defaultViewport: chromium.defaultViewport,
                    executablePath: await chromium.executablePath(),
                    headless: chromium.headless,
                    ignoreHTTPSErrors: true,
                });

                const page = await browser.newPage();
                await page.setContent(html, { waitUntil: 'networkidle0' });
                const pdfBuffer = await page.pdf({
                    format: 'A4',
                    printBackground: true,
                });
                await browser.close();

                mailOptions.attachments = [{
                    filename: `booking_${Date.now()}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf',
                }];
            }

            // Send the email
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent:', info.response);
            return info.response;

        } catch (error) {
            console.error('Error sending email:', error);
            throw error; // Rethrow to handle in calling function if needed
        }
    }


    static async generateEmailHtml(emailBody, adminEmail, emailSignature) {
        return `<!doctype html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>Alta Booking</title>
                    <style>
                        body { color: #231f20; }
                        .bg-main { background: #23b7ca; }
                        .calendarIcon { background: url('../../public/administrator/images/calenderIcon.png') no-repeat right 10px top 0; background-size: 15px auto !important; padding-right: 30px; }
                        .locationIcon { background: url('../../public/administrator/images/locationIcon.png') no-repeat right 10px top 0; background-size: 15px auto !important; padding-right: 30px; }
                        .clockIcon { background: url('../../public/administrator/images/clockIcon.png') no-repeat right 10px top 0; background-size: 15px auto !important; padding-right: 30px; }
                        .distanceIcon { background: url('../../public/administrator/images/distanceIcon.png') no-repeat right 10px top 0; background-size: 22px auto !important; padding-right: 30px; }
                        .turmIconSm { background: url('../../public/administrator/images/termIconSm.png') 0 50% no-repeat; padding-left: 30px; margin-right: 20px; line-height: 25px; display: inline-block; color: #23b7ca; }
                        .tripDetails p { font-size: 14px; margin-top: 5px; margin-bottom: 7px; }
                        .links a { display: block; color: #23b7ca; text-decoration: none; font-size: 14px; margin-bottom: 7px; }
                        .btn-main { color: #fff; background-color: #23b7ca; border-color: #168f9f; display: inline-block; padding: 15px 20px; text-align: center; line-height: 120%; border-radius: 30px; text-decoration: none; }
                        .btn-main:hover { background-color: #168f9f; }
                        .dwnloadStore li { list-style: none; display: inline-block; vertical-align: middle; }
                        .dwnloadStore li img { width: 100px; display: block; margin: 0 auto; }
                    </style>
                </head>
                <body paddingwidth="0" paddingheight="0" style="padding-top: 0; padding-bottom: 0; padding-top: 0; padding-bottom: 0; margin: 0; background-repeat: repeat; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased;" offset="0" toppadding="0" leftpadding="0">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="font-family: helvetica, sans-serif;" bgcolor="#ffffff">
                        <thead>
                            <tr>
                                <td class="bg-main" style="padding: 15px;">
                                    <table width="100%">
                                        <tr>
                                            <td></td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            ${emailBody}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td>
                                    <table width="100%" style="border-top: solid 1px #000;">
                                        <tr>
                                            <td style="padding: 15px; background: #f9f9f9; border-top: dotted 1px #ccc; border-bottom: dotted 1px #ccc;">
                                                <p style="color: #414141; font-size: 14px; line-height: 20px; margin: 0;">For more details please contact our <a style="color: #23b7ca; text-decoration: none;" href="https://support.altabooking.com/open.php">Customer Support</a></p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-top: 10px; padding-bottom: 10px;">
                                                <p style="color: #b6b6b6; font-size: 14px; line-height: 20px; margin: 0;">Please do not reply to this email. It has been sent from an email account that is not monitored. If you have any queries regarding your booking, please contact Alta Booking customer care - <a style="color: #23b7ca; text-decoration: none;" href="mailto:${adminEmail}">${adminEmail}</a></p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-top: 10px; padding-bottom: 20px;">
                                                ${emailSignature}
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </body>
            </html>`;
    }

    async getMailTemplate(emailBody = '') {
        const SITE_TITLE = 'Altabooking.com'; // Replace with your site title or fetch it from a config
        const ADMIN_EMAIL = 'support@altabooking.com'; // Replace with your admin email or fetch it from a config

        const template = ` <table width="600" cellspacing="0" cellpadding="0" border="0" align="center"> <tbody> <tr> <td style="padding:20px;background:#4795DB;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#ffffff;"></td> </tr> <tr> <td style="padding-top:0;padding-right:20px;padding-bottom:20px;padding-left:20px;background:#4795DB;text-align:center;font-family:Arial,Helvetica,sans-serif"> <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#ffffff;border-radius:10px;"> <tbody> <tr> <td> <table width="100%" cellspacing="0" cellpadding="0" border="0"> <tbody> <tr> <td width="100%" align="center" style="padding:20px;"></td> </tr> </tbody> </table> </td> </tr> <tr> <td style="padding:10px;font-size:25px;font-weight:bold;line-height:20px;color:#a2a1a1;font-family:Arial,Helvetica,sans-serif;" align="center"> ${SITE_TITLE} </td> </tr> <tr> <td style="color:#333333;" align="center">&nbsp;</td> </tr> <tr> <td valign="top" align="left" style="color:#6f6f6f;font-size:14px;border-left:1px solid #dfdfdf;border-right:1px solid #dfdfdf;line-height:150%; padding-top:20px; padding-bottom:20px; padding-left:20px; padding-right:20px;font-family:Arial,Helvetica,sans-serif;border-top:solid 1px #4795DB;"> ${emailBody} </td> </tr> <tr> <td valign="middle" align="left" style="padding:10px;font-size:12px;line-height:20px;color:#a2a1a1;font-family:Arial,Helvetica,sans-serif; border-top:solid 1px #4795DB;"> If you have any questions about your account, please send an email to <a href="mailto:${ADMIN_EMAIL}" style="color:#ffd16e; text-decoration:none;">${ADMIN_EMAIL}</a> </td> </tr> <tr> <td valign="middle" align="center" style="padding:10px;font-size:14px;line-height:20px;font-weight:bold;color:#a2a1a1;font-family:Arial,Helvetica,sans-serif;"> ${SITE_TITLE} &copy; copyright </td> </tr> </tbody> </table> </td> </tr> </tbody> </table>`;

        return template;
    }

}

module.exports = new EmailHelpers();