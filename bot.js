const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client();

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('message', message => {

	if (message.body.toLocaleLowerCase() === '' )  {
		client.sendMessage(message.from, 'Olá, seja bem-vindo ao canal de suporte técnico Fundação José Silveira, destinado às unidades externas.\n' +
            
            'Deseja falar sobre:\n' + 
            '1 - Problema técnico 💻⚙️ \n' +
            '2 - Problema no sistema 💻\n' +
            '3 - Falar com um colaborador de sistemas 📲\n' +
            '4 - Deseja acompanhar seu GLPI? \n' );
        
    }

    if (message.body.toLocaleLowerCase() === '1')  {
		client.sendMessage(message.from, 'Descreva o problema (caso tenha GLPI para tal, informe o ID)');
    }

    if (message.body.toLocaleLowerCase() === '2')  {
		client.sendMessage(message.from, 'Descreva o problema, se possivel encaminhar print/foto do erro no sistema');
    }

    if (message.body.toLocaleLowerCase() === '3' )  {
		client.sendMessage(message.from, 'Para falar diretamente com um colaborador de sistemas ligue: \n9050 \n9053 \n9048');
    }

    if (message.body.toLocaleLowerCase() === '4' )  {
      client.sendMessage(message.from, 'Para verificar o andamento do seu chamado, informe o ID: ');
      }


});


client.initialize();

