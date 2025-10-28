const express = require('express');
const { Resend } = require('resend');
const cors = require('cors');

const app = express();
// MUDANÇA: A chave da API foi removida por segurança. Cole a sua chave aqui.
const resend = new Resend('SUA_CHAVE_API_RESEND'); 

app.use(cors());
app.use(express.json());

app.post('/api/enviar-orcamento', async (req, res) => {
  try {
    const {
      nome_completo,
      celular,
      email,
      endereco_imovel,
      metragem,
      responsavel_legal,
      possui_ppci,
      servicos_interesse,
      mensagem_adicional
    } = req.body;

    const agora = new Date();
    const data = agora.toLocaleDateString('pt-BR');
    // MUDANÇA: Variável 'horario' foi removida, pois não será mais usada.

    // Email para a empresa
    await resend.emails.send({
      // MUDANÇA: Nome do remetente alterado.
      from: 'Orçamentos Defender Engenharia <orcamento@defender.eng.br>',
      to: ['marketingdefenderengenharia@gmail.com', 'comercial@defender.eng.br'],
      // MUDANÇA: Assunto simplificado sem o horário.
      subject: `Nova Solicitação de Orçamento — ${nome_completo}`,
      html: `
        <p>Prezada equipe Defender,</p>
        <p>Foi enviada uma nova solicitação de orçamento detalhado através do site oficial em <strong>${data}</strong>.</p>
        
        <p>Seguem as informações preenchidas pelo cliente:</p>
        
        <h3>👤 Dados do Solicitante</h3>
        <ul>
          <li><strong>Nome completo:</strong> ${nome_completo}</li>
          <li><strong>Celular / WhatsApp:</strong> ${celular}</li>
          <li><strong>E-mail:</strong> ${email}</li>
        </ul>
        
        <h3>📍 Dados do Imóvel</h3>
        <ul>
          <li><strong>Endereço completo:</strong> ${endereco_imovel}</li>
          <li><strong>Metragem (m²):</strong> ${metragem || 'Não informado'}</li>
          <li><strong>Responsável legal:</strong> ${responsavel_legal || 'Não informado'}</li>
          <li><strong>Já possui PPCI?</strong> ${possui_ppci}</li>
        </ul>
        
        <h3>🔧 Serviços de Interesse</h3>
        <p>${servicos_interesse}</p>
        
        <h3>📝 Detalhes do Projeto / Mensagem Adicional</h3>
        <p>${mensagem_adicional || 'Nenhuma mensagem adicional'}</p>
        
        <hr>
        <p><small>📅 Registro gerado automaticamente em: ${data}<br>
        Origem: Formulário de Orçamento — defender.eng.br</small></p>
        
        <p>Atenciosamente,<br>
        <strong>Sistema de Orçamentos — Defender Proteção Contra Incêndio</strong></p>
        
        <p>📧 comercial@defender.eng.br | ☎️ (51) 92000-7893<br>
        📍 Av. Guido Mondim, 884 – São Geraldo, Porto Alegre – RS, 90230-260<br>
        🌐 www.defender.eng.br</p>
      `
    });

    // Email para o cliente
    await resend.emails.send({
      // MUDANÇA: Nome do remetente alterado.
      from: 'Orçamentos Defender Engenharia <orcamento@defender.eng.br>',
      to: email,
      // MUDANÇA: Assunto do e-mail alterado conforme solicitado.
      subject: 'Defender Engenharia',
      html: `
        <p>Olá, <strong>${nome_completo}</strong>!</p>
        
        <p>Recebemos sua solicitação de orçamento detalhado com sucesso!</p>
        
        <p>Nossa equipe de engenheiros já está analisando as informações fornecidas e retornará o mais breve possível com uma proposta personalizada para seu projeto.</p>
        
        <p><strong>Resumo da sua solicitação:</strong></p>
        <ul>
          <li>📍 Endereço: ${endereco_imovel}</li>
          <li>🔧 Serviços: ${servicos_interesse}</li>
          <li>📅 Data de envio: ${data}</li>
        </ul>
        
        <p>Se tiver alguma dúvida ou precisar adicionar informações, entre em contato conosco:</p>
        
        <p>📧 comercial@defender.eng.br<br>
        ☎️ WhatsApp: (51) 92000-7893</p>
        
        <p>Agradecemos pela confiança!</p>
        
        <p>Atenciosamente,<br>
        <strong>Equipe Defender Proteção Contra Incêndio</strong></p>
        
        <p><small>📍 Av. Guido Mondim, 884 – São Geraldo, Porto Alegre – RS, 90230-260<br>
        🌐 www.defender.eng.br</small></p>
      `
    });

    res.json({ success: true, message: 'Emails enviados com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar emails:', error);
    res.status(500).json({ success: false, message: 'Erro ao enviar emails', error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});