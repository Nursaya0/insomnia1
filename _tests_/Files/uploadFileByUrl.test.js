require('dotenv').config();
const axios = require('axios');
const qs = require('qs');
const fs = require('fs');
const path = require('path');

let accessToken;

describe('🔐 Авторизация менеджера', () => {
  it('должен получить access_token', async () => {
    const payload = qs.stringify({
      grant_type: process.env.MANAGER_GRANT_TYPE,
      phone_number: process.env.MANAGER_PHONE_NUMBER,
      client_id: process.env.MANAGER_CLIENT_ID,
      code: process.env.MANAGER_OTP_CODE,
    });

    const res = await axios.post(
      `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
      payload,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    expect(res.status).toBe(200);
    accessToken = res.data.access_token;
    console.log('✅ Токен получен');
  });
});

describe('📦 Получение fileId и загрузка фото в MinIO', () => {
  it('должен получить fileId, загрузить файл и вывести ORG_ID / MEMBER_ID', async () => {
    const query = `
      mutation {
        createFileUploadUrl {
          url
          fileId
        }
      }
    `;

    const res = await axios.post(
      process.env.GRAPHQL_URL,
      { query },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    expect(res.status).toBe(200);

    const { url, fileId } = res.data.data.createFileUploadUrl;

    console.log('📁 fileId:', fileId);
    console.log('🌐 относительный URL:', url);
    console.log('🏢 ORG_ID:', process.env.ORG_ID);
    console.log('👤 MEMBER_ID:', process.env.MEMBER_ID);

    // ✅ Собираем полный URL через MINIO_URL из .env
    const fullUrl = `${process.env.MINIO_URL}${url}`;
    console.log('🌍 полный URL для загрузки:', fullUrl);

    // 📥 Путь к файлу
    const filePath = path.join(__dirname, '../assets/dog.jpg');
    const fileBuffer = fs.readFileSync(filePath);

    // 🛫 Загрузка файла в MinIO
    const uploadRes = await axios.put(fullUrl, fileBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
      },
    });

    expect(uploadRes.status).toBe(200);
    console.log('✅ Файл успешно загружен в MinIO');
  });
});
