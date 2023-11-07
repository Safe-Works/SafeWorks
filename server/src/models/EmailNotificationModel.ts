import nodemailer from "nodemailer";
import dotenv from "dotenv";
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
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendCustomEmail(toEmail: string, subject: string, htmlContent: string) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: subject,
        html: htmlContent,
      };
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
    }
  }

  getStyle(): string {
    return `<html>
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
        </head>`
  }

  createEmailWorkerNotification(
    contract: any,
    contractId: string,
    clientContact: any
  ) {
    const emailStyle = this.getStyle();
    const emailHtml = `
            ${emailStyle}
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Contrato de Serviço</h1>
                        </div>
                        <div class="content">
                            <p>Olá ${contract.worker.name},</p>
                            <p>Você recebeu um novo contrato para o serviço: ${
                              contract.advertisement.title
                            }</p>
                            <p>ID do Contrato: ${contractId}</p>
                            <p>Detalhes do Contrato:</p>
                            <ul>
                                <li>Cliente: ${contract.client.name}</li>
                                <li>E-mail: ${clientContact.email}</li>
                                <li>Telefone: ${
                                  clientContact.telephone_number
                                }</li>
                                <li>Valor: R$${contract.price}</li>
                                <li>Quantidade: ${contract.quantity}</li>
                                <li>Pagamento: ${
                                  contract.status === "open"
                                    ? "Aprovado"
                                    : "Pendente"
                                }</li>
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

  createEmailHelpRequest(helpRequest: any) {
    const emailStyle = this.getStyle();
    const emailHtml = `
            ${emailStyle}
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Solicitação de ajuda!</h1>
                        </div>
                        <div class="content">
                            <p><b>${helpRequest.title}</b></p>
                            <p>${helpRequest.description}</p>
                            <p>Detalhes do solicitante:</p>
                            <ul>
                                <li>Nome: ${helpRequest.user.name}</li>
                                <li>E-mail: ${helpRequest.user.email}</li>
                                <li>ID: ${helpRequest.user.id}</li>
                            </ul>
                            <p>Detalhe do contrato</p>
                            <ul>
                                <li>${
                                  helpRequest.contractId
                                    ? "ID:" + helpRequest.contractId
                                    : "Nenhum contrato foi especificado."
                                }</li>
                            </ul>
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

  createEmailClientNotification(
    contract: any,
    contractId: string,
    workerContact: any
  ) {
    const emailStyle = this.getStyle();
    const emailHtml = `
            ${emailStyle}
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
                                <li>Quantidade: ${contract.quantity}</li>
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

  workerFinishedContractToClient(contract: any, contractId: string) {
    const emailStyle = this.getStyle();
    const emailHtml = `
            ${emailStyle}
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Contrato de Serviço Finalizado</h1>
                        </div>
                        <div class="content">
                            <p>Olá ${contract.client.name},</p>
                            <p>O contrato ${contract.advertisement.title} foi marcado como finalizado pelo trabalhador.</p>
                            <p>ID do Contrato: ${contractId}</p>
                            <p>Detalhes do Contrato:</p>
                            <ul>
                                <li>Trabalhador: ${contract.worker.name}</li>
                                <li>Valor: R$${contract.price}</li>
                                <li>Quantidade: ${contract.quantity}</li>
                            </ul>
                            <p>Entre no seu histórico de contratos e também marque o contrato como finalizado.</p>
                            <p>Caso tenha ocorrido algum problema com o contrato, você pode fazer uma denuncia no seu histórico de contratos.</p>
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

  clientFinishedContractToWorker(contract: any, contractId: string) {
    const emailStyle = this.getStyle();
    const emailHtml = `
            ${emailStyle}
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Contrato de Serviço Finalizado</h1>
                        </div>
                        <div class="content">
                            <p>Olá ${contract.worker.name},</p>
                            <p>O contrato ${contract.advertisement.title} foi marcado como finalizado pelo cliente.</p>
                            <p>ID do Contrato: ${contractId}</p>
                            <p>Detalhes do Contrato:</p>
                            <ul>
                                <li>Cliente: ${contract.client.name}</li>
                                <li>Valor: R$${contract.price}</li>
                                <li>Quantidade: ${contract.quantity}</li>
                            </ul>
                            <p>Entre no seu histórico de contratos e também marque o contrato como finalizado.</p>
                            <p>Caso tenha ocorrido algum problema com o contrato, você pode fazer uma denuncia no seu histórico de contratos.</p>
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

  finishedContract(contract: any, contractId: string) {
    const emailStyle = this.getStyle();
    const emailHtml = `
            ${emailStyle}
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Contrato de Serviço Finalizado</h1>
                        </div>
                        <div class="content">
                            <p>Olá ${contract.worker.name},</p>
                            <p>O contrato ${contract.advertisement.title} foi finalizado.</p>
                            <p>O valor do contrato já foi transferido para seu saldo na plataforma.</p>
                            <p>Você pode manter o valor na sua carteira digital SafeWorks ou solicitar o saque.</p>
                            <p>ID do Contrato: ${contractId}</p>
                            <p>Detalhes do Contrato:</p>
                            <ul>
                                <li>Cliente: ${contract.client.name}</li>
                                <li>Valor: R$${contract.price}</li>
                            </ul>
                            <p>Caso tenha ocorrido algum problema com o contrato, você pode fazer uma denuncia no seu histórico de contratos.</p>
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

  onAnalysisComplaint(complaint: any, complaintId: string, userName: string): string {
    const emailStyle = this.getStyle();
    const emailHtml = `
            ${emailStyle}
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Denúncia em Análise</h1>
                        </div>
                        <div class="content">
                            <p>Olá ${userName},</p>
                            <p>A denúncia ${complaint.title} entrou em análise.</p>
                            <p>Um administrador irá análisar os motivos da denúncia e deferir seu resultado em breve.</p>
                            <p>Você receberá uma notificação por email informando quando o status da denúncia for alterado.</p>
                            <p>ID da denúncia: ${complaintId}</p>
                            <p>Detalhes do Contrato:</p>
                            <ul>
                                <li>ID do contrato: ${complaint.contract.id}</li>
                                <li>Título do anúncio: ${complaint.advertisement.title}</li>
                                <li>Cliente: ${complaint.client.name}</li>
                                <li>Trabalhador: ${complaint.worker.name}</li>
                            </ul>
                            <p>Caso tenha ocorrido algum problema, você pode cancelar a denúncia no seu histórico de contratos.</p>
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

  acceptComplaintByClientToWorker(complaint: any, complaintId: string, workerName: string, resultDescription: string): string {
    const emailStyle = this.getStyle();
    const emailHtml = `
            ${emailStyle}
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Denúncia Aceita</h1>
                        </div>
                        <div class="content">
                            <p>Olá ${workerName},</p>
                            <p>A denúncia ${complaint.title} feita pelo cliente foi aceita por um administrador.</p>
                            <p>Desta maneira, o contrato em questão foi marcado como finalizado, e o valor de contratação será restituído para o cliente.</p>
                            <p>Abaixo estão as informações do contrato e a descrição dos motivos que levaram a aceitação da denúncia pelo administrador.</p>
                            <p>Detalhes da Denúncia:</p>
                            <ul>
                                <li>ID da denúncia: ${complaintId}</li>
                                <li>Data da denúncia: ${complaint.created}</li>
                                <li>Motivo de aceite da denúncia: ${resultDescription}</li>
                            </ul>
                            <p>Detalhes do Contrato:</p>
                            <ul>
                                <li>ID do contrato: ${complaint.contract.id}</li>
                                <li>Data de criação do contrato: ${complaint.contract.created}</li>
                                <li>Título do anúncio: ${complaint.advertisement.title}</li>
                                <li>Cliente: ${complaint.client.name}</li>
                                <li>Trabalhador: ${complaint.worker.name}</li>
                            </ul>
                            <p>Seu saldo será atualizado automaticamente, e pode ser consultado em seu perfil na plataforma.</p>
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

  acceptComplaintByClientToClient(complaint: any, complaintId: string, clientName: string, resultDescription: string): string {
    const emailStyle = this.getStyle();
    const emailHtml = `
            ${emailStyle}
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Denúncia Aceita</h1>
                        </div>
                        <div class="content">
                            <p>Olá ${clientName},</p>
                            <p>A sua denúncia ${complaint.title} foi aceita por um administrador.</p>
                            <p>Desta maneira, o contrato em questão foi marcado como finalizado, e o valor de contratação será restituído para o saldo da sua conta na plataforma.</p>
                            <p>Abaixo estão as informações do contrato e a descrição dos motivos que levaram a aceitação da denúncia pelo administrador.</p>
                            <p>Detalhes da Denúncia:</p>
                            <ul>
                                <li>ID da denúncia: ${complaintId}</li>
                                <li>Data da denúncia: ${complaint.created}</li>
                                <li>Motivo de aceite da denúncia: ${resultDescription}</li>
                            </ul>
                            <p>Detalhes do Contrato:</p>
                            <ul>
                                <li>ID do contrato: ${complaint.contract.id}</li>
                                <li>Data de criação do contrato: ${complaint.contract.created}</li>
                                <li>Título do anúncio: ${complaint.advertisement.title}</li>
                                <li>Cliente: ${complaint.client.name}</li>
                                <li>Trabalhador: ${complaint.worker.name}</li>
                            </ul>
                            <p>Seu saldo será atualizado automaticamente, e pode ser consultado em seu perfil na plataforma.</p>
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

  acceptComplaintByWorkerToClient(complaint: any, complaintId: string, clientName: string, resultDescription: string): string {
    const emailStyle = this.getStyle();
    const emailHtml = `
            ${emailStyle}
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Denúncia Aceita</h1>
                        </div>
                        <div class="content">
                            <p>Olá ${clientName},</p>
                            <p>A denúncia ${complaint.title} feita pelo trabalhador foi aceita por um administrador.</p>
                            <p>Desta maneira, o contrato em questão foi marcado como finalizado, e o valor de contratação será restituído para o trabalhador.</p>
                            <p>Abaixo estão as informações do contrato e a descrição dos motivos que levaram a aceitação da denúncia pelo administrador.</p>
                            <p>Detalhes da Denúncia:</p>
                            <ul>
                                <li>ID da denúncia: ${complaintId}</li>
                                <li>Data da denúncia: ${complaint.created}</li>
                                <li>Motivo de aceite da denúncia: ${resultDescription}</li>
                            </ul>
                            <p>Detalhes do Contrato:</p>
                            <ul>
                                <li>ID do contrato: ${complaint.contract.id}</li>
                                <li>Data de criação do contrato: ${complaint.contract.created}</li>
                                <li>Título do anúncio: ${complaint.advertisement.title}</li>
                                <li>Cliente: ${complaint.client.name}</li>
                                <li>Trabalhador: ${complaint.worker.name}</li>
                            </ul>
                            <p>Seu saldo será atualizado automaticamente, e pode ser consultado em seu perfil na plataforma.</p>
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

  acceptComplaintByWorkerToWorker(complaint: any, complaintId: string, workerName: string, resultDescription: string): string {
    const emailStyle = this.getStyle();
    const emailHtml = `
            ${emailStyle}
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Denúncia Aceita</h1>
                        </div>
                        <div class="content">
                            <p>Olá ${workerName},</p>
                            <p>A sua denúncia ${complaint.title} foi aceita por um administrador.</p>
                            <p>Desta maneira, o contrato em questão foi marcado como finalizado, e o valor de contratação será restituído para o saldo da sua conta na plataforma.</p>
                            <p>Abaixo estão as informações do contrato e a descrição dos motivos que levaram a aceitação da denúncia pelo administrador.</p>
                            <p>Detalhes da Denúncia:</p>
                            <ul>
                                <li>ID da denúncia: ${complaintId}</li>
                                <li>Data da denúncia: ${complaint.created}</li>
                                <li>Motivo de aceite da denúncia: ${resultDescription}</li>
                            </ul>
                            <p>Detalhes do Contrato:</p>
                            <ul>
                                <li>ID do contrato: ${complaint.contract.id}</li>
                                <li>Data de criação do contrato: ${complaint.contract.created}</li>
                                <li>Título do anúncio: ${complaint.advertisement.title}</li>
                                <li>Cliente: ${complaint.client.name}</li>
                                <li>Trabalhador: ${complaint.worker.name}</li>
                            </ul>
                            <p>Seu saldo será atualizado automaticamente, e pode ser consultado em seu perfil na plataforma.</p>
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

  rejectComplaintByClientToWorker(complaint: any, complaintId: string, workerName: string, resultDescription: string): string {
    const emailStyle = this.getStyle();
    const emailHtml = `
            ${emailStyle}
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Denúncia Recusada</h1>
                        </div>
                        <div class="content">
                            <p>Olá ${workerName},</p>
                            <p>A denúncia ${complaint.title} feita pelo cliente foi recusada por um administrador.</p>
                            <p>Desta maneira, o contrato em questão foi marcado como finalizado, e o valor de contratação será transferido normalmente para seu saldo na plataforma.</p>
                            <p>Abaixo estão as informações do contrato e a descrição dos motivos que levaram a recusa da denúncia pelo administrador.</p>
                            <p>Detalhes da Denúncia:</p>
                            <ul>
                                <li>ID da denúncia: ${complaintId}</li>
                                <li>Data da denúncia: ${complaint.created}</li>
                                <li>Motivo de recusa da denúncia: ${resultDescription}</li>
                            </ul>
                            <p>Detalhes do Contrato:</p>
                            <ul>
                                <li>ID do contrato: ${complaint.contract.id}</li>
                                <li>Data de criação do contrato: ${complaint.contract.created}</li>
                                <li>Título do anúncio: ${complaint.advertisement.title}</li>
                                <li>Cliente: ${complaint.client.name}</li>
                                <li>Trabalhador: ${complaint.worker.name}</li>
                            </ul>
                            <p>Seu saldo será atualizado automaticamente, e pode ser consultado em seu perfil na plataforma.</p>
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

  rejectComplaintByClientToClient(complaint: any, complaintId: string, clientName: string, resultDescription: string): string {
    const emailStyle = this.getStyle();
    const emailHtml = `
            ${emailStyle}
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Denúncia Recusada</h1>
                        </div>
                        <div class="content">
                            <p>Olá ${clientName},</p>
                            <p>A sua denúncia ${complaint.title} foi recusada por um administrador.</p>
                            <p>Desta maneira, o contrato em questão foi marcado como finalizado, e o valor de contratação será transferido normalmente para o trabalhador</p>
                            <p>Abaixo estão as informações do contrato e a descrição dos motivos que levaram a recusa da denúncia pelo administrador.</p>
                            <p>Detalhes da Denúncia:</p>
                            <ul>
                                <li>ID da denúncia: ${complaintId}</li>
                                <li>Data da denúncia: ${complaint.created}</li>
                                <li>Motivo de recusa da denúncia: ${resultDescription}</li>
                            </ul>
                            <p>Detalhes do Contrato:</p>
                            <ul>
                                <li>ID do contrato: ${complaint.contract.id}</li>
                                <li>Data de criação do contrato: ${complaint.contract.created}</li>
                                <li>Título do anúncio: ${complaint.advertisement.title}</li>
                                <li>Cliente: ${complaint.client.name}</li>
                                <li>Trabalhador: ${complaint.worker.name}</li>
                            </ul>
                            <p>Seu saldo será atualizado automaticamente, e pode ser consultado em seu perfil na plataforma.</p>
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

  rejectComplaintByWorkerToClient(complaint: any, complaintId: string, clientName: string, resultDescription: string): string {
    const emailStyle = this.getStyle();
    const emailHtml = `
            ${emailStyle}
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Denúncia Recusada</h1>
                        </div>
                        <div class="content">
                            <p>Olá ${clientName},</p>
                            <p>A denúncia ${complaint.title} feita pelo trabalhador foi recusada por um administrador.</p>
                            <p>Desta maneira, o contrato em questão foi marcado como finalizado, e o valor de contratação será restituído para o saldo da sua conta na plataforma.</p>
                            <p>Abaixo estão as informações do contrato e a descrição dos motivos que levaram a recusa da denúncia pelo administrador.</p>
                            <p>Detalhes da Denúncia:</p>
                            <ul>
                                <li>ID da denúncia: ${complaintId}</li>
                                <li>Data da denúncia: ${complaint.created}</li>
                                <li>Motivo de recusa da denúncia: ${resultDescription}</li>
                            </ul>
                            <p>Detalhes do Contrato:</p>
                            <ul>
                                <li>ID do contrato: ${complaint.contract.id}</li>
                                <li>Data de criação do contrato: ${complaint.contract.created}</li>
                                <li>Título do anúncio: ${complaint.advertisement.title}</li>
                                <li>Cliente: ${complaint.client.name}</li>
                                <li>Trabalhador: ${complaint.worker.name}</li>
                            </ul>
                            <p>Seu saldo será atualizado automaticamente, e pode ser consultado em seu perfil na plataforma.</p>
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

  rejectComplaintByWorkerToWorker(complaint: any, complaintId: string, workerName: string, resultDescription: string): string {
    const emailStyle = this.getStyle();
    const emailHtml = `
            ${emailStyle}
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Denúncia Recusada</h1>
                        </div>
                        <div class="content">
                            <p>Olá ${workerName},</p>
                            <p>A sua denúncia ${complaint.title} foi recusada por um administrador.</p>
                            <p>Desta maneira, o contrato em questão foi marcado como finalizado, e o valor de contratação será restituído para o cliente</p>
                            <p>Abaixo estão as informações do contrato e a descrição dos motivos que levaram a recusa da denúncia pelo administrador.</p>
                            <p>Detalhes da Denúncia:</p>
                            <ul>
                                <li>ID da denúncia: ${complaintId}</li>
                                <li>Data da denúncia: ${complaint.created}</li>
                                <li>Motivo de recusa da denúncia: ${resultDescription}</li>
                            </ul>
                            <p>Detalhes do Contrato:</p>
                            <ul>
                                <li>ID do contrato: ${complaint.contract.id}</li>
                                <li>Data de criação do contrato: ${complaint.contract.created}</li>
                                <li>Título do anúncio: ${complaint.advertisement.title}</li>
                                <li>Cliente: ${complaint.client.name}</li>
                                <li>Trabalhador: ${complaint.worker.name}</li>
                            </ul>
                            <p>Seu saldo será atualizado automaticamente, e pode ser consultado em seu perfil na plataforma.</p>
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
