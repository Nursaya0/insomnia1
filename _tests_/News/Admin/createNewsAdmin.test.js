require("dotenv").config();
const axios = require("axios");
const qs = require("qs");
const fs = require("fs");
const path = require("path");

let accessToken;

describe("📦 Полный цикл (токен админа): загрузка фото → создание новости", () => {
  it("должен загрузить фото и создать новость", async () => {
    // 🔐 Авторизация по OTP
    const payload = qs.stringify({
      grant_type: "password",
      phone_number: process.env.ADMIN_PHONE_NUMBER,
      client_id: process.env.ADMIN_CLIENT_ID,
      code: process.env.ADMIN_OTP_CODE,
    });

    const tokenRes = await axios.post(
      `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
      payload,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    expect(tokenRes.status).toBe(200);
    accessToken = tokenRes.data.access_token;
    console.log("✅ Админ access_token получен");

    // 🧾 Получение fileId и upload URL
    const uploadUrlRes = await axios.post(
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
          "Content-Type": "application/json",
        },
      }
    );

    expect(uploadUrlRes.status).toBe(200);
    const { url, fileId } = uploadUrlRes.data.data.createFileUploadUrl;
    console.log("📁 fileId:", fileId);
    console.log("🌐 относительный URL:", url);

    const fullUrl = `${process.env.MINIO_URL}${url}`;
    console.log("🌍 Полный URL:", fullUrl);

    // 📤 Загрузка файла в MinIO
    const filePath = path.resolve(__dirname, "../../assets/dog.jpg");
    const fileBuffer = fs.readFileSync(filePath);

    const uploadRes = await axios.put(fullUrl, fileBuffer, {
      headers: {
        "Content-Type": "image/jpeg",
      },
    });

    expect(uploadRes.status).toBe(200);
    console.log("✅ Файл успешно загружен в MinIO");

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
        description:
          "Discover why dogs have earned the title of 'man's best friend' and what makes them such loyal and loving companions.",
        content:
          "Dogs are more than just pets — they are trusted friends, protectors, and loyal family members. Their unwavering devotion, playful spirit, and sharp intelligence have bonded them with humans for thousands of years. Whether it's the excitement of a wagging tail at the door or the comfort of a quiet companion by your side, dogs know how to make us feel loved and safe.",
        startDate: "2025-06-24T16:39:57Z",
        endDate: "2025-07-30T16:39:58Z",
        imageFileId: fileId,
      },
    };

    const newsRes = await axios.post(
      process.env.GRAPHQL_URL,
      {
        query: createNewsQuery,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    expect(newsRes.status).toBe(200);

    const newsId = newsRes.data.data?.createNews?.id;
    if (newsId) {
      console.log("📰 Новость успешно создана! ID:", newsId);
    } else {
      console.error("❌ Ошибка при создании новости:", JSON.stringify(newsRes.data, null, 2));
    }
  });
});
