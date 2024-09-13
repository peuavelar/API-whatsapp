import qrcode from "qrcode-terminal";
import { Client } from "whatsapp-web.js";
import connection from "./database_GLPI.js";

const client = new Client();

let aguardandoGLPI = false; // Variável para armazenar o estado de espera de ID do GLPI

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("message", async (message) => {
  // Função assíncrona para usar await
  if (message.body.toLocaleLowerCase() === "oi") {
    client.sendMessage(
      message.from,
      "Olá, seja bem-vindo ao canal de suporte técnico Fundação José Silveira, destinado às unidades externas.\n" +
        "Deseja falar sobre:\n" +
        "1 - Problema técnico 💻⚙️ \n" +
        "2 - Problema no sistema 💻\n" +
        "3 - Falar com um colaborador de sistemas 📲\n" +
        "4 - Deseja acompanhar seu GLPI? \n"
    );
  } else if (message.body === "1") {
    client.sendMessage(
      message.from,
      "Descreva o problema (caso tenha GLPI para tal, informe o ID)"
    );
  } else if (message.body === "2") {
    client.sendMessage(
      message.from,
      "Descreva o problema, se possível encaminhar print/foto do erro no sistema"
    );
  } else if (message.body === "3") {
    client.sendMessage(
      message.from,
      "Para falar diretamente com um colaborador de sistemas ligue: \n9050 \n9053 \n9048"
    );
  } else if (message.body === "4") {
    client.sendMessage(
      message.from,
      "Para verificar o andamento do seu chamado, informe o ID: "
    );
    aguardandoGLPI = true;
  } else if (aguardandoGLPI) {
    const idChamado = message.body;
    console.log(idChamado);

    try {
      // Usa await e passa o parâmetro como array
      const [rows] = await connection.execute(
        "select * from glpiweb.glpi_tickets gt where id = ?",
        [idChamado] // Parâmetro passado como array
      );

      if (rows.length > 0) {
        const statusGLPI = rows[0].status;
        let statusMessageGLPI;
        switch (statusGLPI) {
          case 1:
            statusMessageGLPI = "Aguardando Atendimento";
            break;
          case 3:
          case 2:
            statusMessageGLPI = "Em Atendimento";
            break;
          case 4:
            statusMessageGLPI = "Pendente";
            break;
          case 5:
            statusMessageGLPI = "Solucionado";
            break;
        }
        client.sendMessage(
          message.from,
          `Atualmente o status da seu chamado é: ${statusMessageGLPI}`
        );
        const tecnicoCheck = await connection.execute("select users_id from glpiweb.glpi_tickets_users gtu where tickets_id = ?", [idChamado])
        const nomeTecnico = tecnicoCheck[0];
        client.sendMessage(
          message.from,
          `O Técnico atribuido ao seu chamado é: ${nomeTecnico}`
        );
      } else {
        client.sendMessage(
          message.from,
          "Chamado não encontrado. Verifique o ID informado."
        );
      }
    } catch (error) {
      console.error("Erro ao buscar chamado no banco de dados:", error);
      client.sendMessage(
        message.from,
        "Houve um erro ao buscar seu chamado. Tente novamente mais tarde."
      );
    }

    aguardandoGLPI = false; // Reseta o estado após receber a resposta
  }
});

client.initialize();
