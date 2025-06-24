require('dotenv').config();
const axios = require('axios');
const qs = require('qs');
const fs = require('fs');
const path = require('path');

let accessToken;

describe('📦 Полный цикл: авторизация → загрузка фото → создание новости', () => {
  it('должен загрузить фото и создать новость', async () => {
    // 🔐 Авторизация
    const payload = qs.stringify({
      grant_type: process.env.MANAGER_GRANT_TYPE,
      phone_number: process.env.MANAGER_PHONE_NUMBER,
      client_id: process.env.MANAGER_CLIENT_ID,
      code: process.env.MANAGER_OTP_CODE,
    });

    const tokenRes = await axios.post(
      `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
      payload,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'access-control-allow-origin': '*',
          'strict-transport-security': 'max-age=15724800; includeSubDomains',
        },
      }
    );

    expect(tokenRes.status).toBe(200);
    accessToken = tokenRes.data.access_token;
    console.log('✅ access_token получен');

    // 🧾 Получение fileId и относительного URL
    const fileUploadRes = await axios.post(
      process.env.GRAPHQL_URL,
      {
        query: `
          mutation {
            createFileUploadUrl {
              url
              fileId
            }
          }
        `,
      },
      {
      headers: {
  Authorization: `Bearer ${accessToken}`,
  'Content-Type': 'application/json; charset=utf-8',
  'Accept-Language': 'ru',
  'X-Org-Id': process.env.ORG_ID,
  'X-Member-Id': process.env.MEMBER_ID
}

      }
    );

    expect(fileUploadRes.status).toBe(200);
    const { url, fileId } = fileUploadRes.data.data.createFileUploadUrl;
    console.log('📁 fileId:', fileId);
    console.log('🌐 относительный URL:', url);

    // 🌍 Полный URL
    const fullUrl = `${process.env.MINIO_URL}${url}`;
    console.log('🌍 Полный URL для загрузки:', fullUrl);

    // 🖼 Читаем файл
    const filePath = path.resolve(__dirname, '../../assets/dog.jpg');
    const fileBuffer = fs.readFileSync(filePath);

    // 📤 Загрузка файла
    const uploadRes = await axios.put(fullUrl, fileBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'access-control-allow-origin': '*',
        'strict-transport-security': 'max-age=15724800; includeSubDomains',
      },
    });

    expect(uploadRes.status).toBe(200);
    console.log('✅ Файл успешно загружен в MinIO');

    // 📰 Создание новости
    const createNewsQuery = `
      mutation CreateNews($input: CreateNewsInput!) {
        createNews(input: $input) {
          id
        }
      }
    `;

    const variables = {
      input: {
        title: "Loyal Dogs: Faithful Companions Through the Ages",
        description: "Discover why dogs have earned the title of 'man's best friend' and what makes them such loyal and loving companions.",
        content: "Dogs are more than just pets — they are trusted friends, protectors, and loyal family members. Their unwavering devotion, playful spirit, and sharp intelligence have bonded them with humans for thousands of years. Whether it's the excitement of a wagging tail at the door or the comfort of a quiet companion by your side, dogs know how to make us feel loved and safe.",
        startDate: "2025-06-24T16:39:57Z",
        endDate: "2025-06-30T16:39:58Z",
        imageFileId: fileId,
      },
    };

    const newsRes = await axios.post(
      process.env.GRAPHQL_URL,
      {
        query: createNewsQuery,
        variables: variables,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json; charset=utf-8',
          'access-control-allow-origin': '*',
          'strict-transport-security': 'max-age=15724800; includeSubDomains',
        },
      }
    );

    expect(newsRes.status).toBe(200);

    const newsId = newsRes.data.data?.createNews?.id;
    if (newsId) {
      console.log('📰 Новость создана! ID:', newsId);
    } else {
      console.error('❌ Ошибка при создании новости:', JSON.stringify(newsRes.data, null, 2));
    }
  });
});
