// worker/src/utils/tg.js - Telegram API 封装

const TG_API = 'https://api.telegram.org/bot';

export async function sendMessage(env, chatId, text, keyboard = null) {
  const body = {
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML'
  };

  if (keyboard) {
    body.reply_markup = keyboard;
  }

  const resp = await fetch(`${TG_API}${env.BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  return resp.json();
}

export async function editMessage(env, chatId, messageId, text, keyboard = null) {
  const body = {
    chat_id: chatId,
    message_id: messageId,
    text: text,
    parse_mode: 'HTML'
  };

  if (keyboard) {
    body.reply_markup = keyboard;
  }

  const resp = await fetch(`${TG_API}${env.BOT_TOKEN}/editMessageText`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  return resp.json();
}

export async function deleteMessage(env, chatId, messageId) {
  await fetch(`${TG_API}${env.BOT_TOKEN}/deleteMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId
    })
  });
}

export async function answerCallback(env, callbackId, text = null) {
  const body = { callback_query_id: callbackId };
  if (text) {
    body.text = text;
    body.show_alert = true;
  }

  await fetch(`${TG_API}${env.BOT_TOKEN}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

export async function sendInvoice(env, chatId, product, payload) {
  const body = {
    chat_id: chatId,
    title: product.name,
    description: product.description || product.name,
    payload: payload,
    provider_token: '',  // Telegram Stars 不需要 provider_token
    currency: 'XTR',
    prices: [{
      label: product.name,
      amount: product.price
    }]
  };

  const resp = await fetch(`${TG_API}${env.BOT_TOKEN}/sendInvoice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  return resp.json();
}

export async function answerPreCheckout(env, preCheckoutQueryId, ok = true, errorMessage = '') {
  const body = {
    pre_checkout_query_id: preCheckoutQueryId,
    ok: ok
  };

  if (!ok && errorMessage) {
    body.error_message = errorMessage;
  }

  await fetch(`${TG_API}${env.BOT_TOKEN}/answerPreCheckoutQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

export async function setWebhook(env, url) {
  const resp = await fetch(`${TG_API}${env.BOT_TOKEN}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: url,
      allowed_updates: ['message', 'callback_query', 'pre_checkout_query', 'successful_payment']
    })
  });

  return resp.json();
}

export async function getWebhookInfo(env) {
  const resp = await fetch(`${TG_API}${env.BOT_TOKEN}/getWebhookInfo`);
  return resp.json();
}
