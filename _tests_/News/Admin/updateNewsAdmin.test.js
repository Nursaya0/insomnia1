require("dotenv").config();
const axios = require("axios");
const qs = require("qs");
const fs = require("fs");
const path = require("path");

describe("🛠 updateNewsAdmin: Обновление новости под админом", () => {
  let accessToken;
  let fileId;

  it("должен авторизоваться, загрузить фото и обновить новость", async () => {
    // 🔐 Авторизация
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
    console.log("✅ Access Token получен");

    // 📦 Получение fileId
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
    const { url, fileId: id } = uploadUrlRes.data.data.createFileUploadUrl;
    fileId = id;
    const fullUrl = `${process.env.MINIO_URL}${url}`;

    // 🖼 Загрузка файла
    const filePath = path.resolve(__dirname, "../../assets/dog.jpg");
    const fileBuffer = fs.readFileSync(filePath);

    const uploadRes = await axios.put(fullUrl, fileBuffer, {
      headers: {
        "Content-Type": "image/jpeg",
      },
    });

    expect(uploadRes.status).toBe(200);
    console.log("✅ Фото загружено, fileId:", fileId);

    // ✏️ Обновление новости
    const updateNewsQuery = `
      mutation UpdateNews($newsId: Int!, $input: CreateNewsInput!) {
        updateNews(id: $newsId, input: $input) {
          id
        }
      }
    `;

    const variables = {
      newsId: 59,
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

    const updateRes = await axios.post(
      process.env.GRAPHQL_URL,
      {
        query: updateNewsQuery,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    expect(updateRes.status).toBe(200);
    const updatedId = updateRes.data.data?.updateNews?.id;
    if (updatedId) {
      console.log("📰 Новость успешно обновлена! ID:", updatedId);
    } else {
      console.error("❌ Ошибка при обновлении:", JSON.stringify(updateRes.data, null, 2));
    }
  });
});
