/* eslint-disable linebreak-style */
/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
/* eslint-disable indent */
/* eslint-disable no-debugger */
/* eslint-disable arrow-parens */
/* eslint-disable comma-dangle */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable quotes */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// import * as path from 'path';

// Carregar o arquivo JSON das credenciais da conta de serviço
// Inicializar o Firebase Admin SDK com as credenciais da conta de serviço
admin.initializeApp({
  databaseURL: "https://shoal-236fc.firebaseio.com"
});

exports.sendNotification = functions.firestore
  .document('chatRooms/{chatId}/mensagens/{messageId}')
  .onCreate(async (snapshot, context) => {
    const chatId = context.params.chatId;
    // const messageId = context.params.messageId;
    const messageData = snapshot.data();

    if (!messageData) {
      return null;
    }

    // tokens
    const tokens = await getDeviceTokensForChatRoom(chatId);

    if (tokens.length > 0) {
      const payload = {
        notification: {
          title: 'Nova mensagem',
          body: messageData.content || 'Você tem uma nova mensagem',
          icon: 'default_icon_url',
          click_action: 'URL_TO_OPEN_ON_CLICK'
        }
      };

      return admin.messaging().sendToDevice(tokens, payload)
        .then(response => {
          console.log('Notificação enviada com sucesso');
          return null;
        })
        .catch(error => {
          console.error('Erro ao enviar notificação:', error);
          return null;
        });
    } else {
      return null;
    }
  });

async function getDeviceTokensForChatRoom(chatId: string): Promise<string[]> {
  const chatRoomRef = admin.firestore().collection('chatRooms').doc(chatId);
  const chatRoomSnapshot = await chatRoomRef.get();

  if (!chatRoomSnapshot.exists) {
    return [];
  }

  const chatRoomData = chatRoomSnapshot.data();
  if (!chatRoomData || !chatRoomData.membros) {
    return [];
  }

  const members = chatRoomData.membros;
  const tokens: string[] = [];

  for (const uid of members) {
    const userDoc = await admin.firestore().collection('users').doc(uid).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      if (userData && userData.deviceToken) {
        tokens.push(userData.deviceToken);
      }
    }
  }

  return tokens;
}
