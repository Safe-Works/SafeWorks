import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

class EmailNotificationModel {
    private transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async sendCustomEmail(toEmail: string, subject: string, htmlContent: string) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: toEmail,
                subject: subject,
                html: htmlContent
            };
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Erro ao enviar e-mail:", error);
        }
    }

    createEmailWorkerNotification(contract: any, contractId: string, clientContact: any) {
        const emailHtml = `
            <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                    
                        h1 {
                            color: #FFA500;
                        }
                    
                        p {
                            font-size: 16px;
                            line-height: 1.6;
                            color: #666;
                        }
                    
                        ul {
                            list-style: none;
                            padding: 0;
                        }
                    
                        ul li {
                            margin-bottom: 10px;
                        }
                    
                        a {
                            color: #007bff;
                            text-decoration: none;
                        }
                    
                        .container {
                            background: #fff;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            border: 2px solid #2C3E50;
                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        }
                    
                        .header {
                            background: #2C3E50;
                            color: #FFA500;
                            text-align: center;
                            padding: 10px 0;
                        }
                    
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                    
                        .content {
                            padding: 20px 0;
                        }
                    
                        .signature {
                            text-align: center;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Contrato de Serviço</h1>
                        </div>
                        <div class="content">
                            <p>Olá ${contract.worker.name},</p>
                            <p>Você recebeu um novo contrato para o serviço: ${contract.advertisement.title}</p>
                            <p>ID do Contrato: ${contractId}</p>
                            <p>Detalhes do Contrato:</p>
                            <ul>
                                <li>Cliente: ${contract.client.name}</li>
                                <li>E-mail: ${clientContact.email}</li>
                                <li>Telefone: ${clientContact.telephone_number}</li>
                                <li>Valor: R$${contract.price}</li>
                            </ul>
                            <p>Entre em contato com o seu cliente para discutir os detalhes.</p>
                        </div>
                        <div class="signature">
                            <p>Atenciosamente,<br>SafeWorks!</p>
                        </div>
                    </div>
                </body>
            </html>
        `;
        return emailHtml;
    }
    clientEmailWorkerNotification(contract: any, contractId: string, workerContact: any) {
        const emailHtml = `
            <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                    
                        h1 {
                            color: #FFA500;
                        }
                    
                        p {
                            font-size: 16px;
                            line-height: 1.6;
                            color: #666;
                        }
                    
                        ul {
                            list-style: none;
                            padding: 0;
                        }
                    
                        ul li {
                            margin-bottom: 10px;
                        }
                    
                        a {
                            color: #007bff;
                            text-decoration: none;
                        }
                    
                        .container {
                            background: #fff;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            border: 2px solid #2C3E50;
                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        }
                    
                        .header {
                            background: #2C3E50;
                            color: #FFA500;
                            text-align: center;
                            padding: 10px 0;
                        }
                    
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                    
                        .content {
                            padding: 20px 0;
                        }
                    
                        .signature {
                            text-align: center;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Contrato de Serviço</h1>
                        </div>
                        <div class="content">
                            <p>Olá ${contract.client.name},</p>
                            <p>Você contratou o serviço: ${contract.advertisement.title}</p>
                            <p>ID do Contrato: ${contractId}</p>
                            <p>Detalhes do Contrato:</p>
                            <ul>
                                <li>Trabalhador: ${contract.worker.name}</li>
                                <li>E-mail: ${workerContact.email}</li>
                                <li>Telefone: ${workerContact.telephone_number}</li>
                                <li>Valor: R$${contract.price}</li>
                            </ul>
                            <p>Entre em contato com o trabalhador para discutir os detalhes.</p>
                        </div>
                        <div class="signature">
                            <p>Atenciosamente,<br>SafeWorks!</p>
                        </div>
                    </div>
                </body>
            </html>
        `;
        return emailHtml;
    }
}

export default EmailNotificationModel;
