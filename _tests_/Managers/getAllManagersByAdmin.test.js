
require("dotenv").config();
const axios = require("axios");
const { getAdminTokenByOtp } = require("../../api/AdminToken");

describe("👔 Менеджеры по TARGET_ORG_ID из .env – красивый вывод", () => {
  let token;
  const orgIdToFind = Number(process.env.TARGET_ORG_ID);

  beforeAll(async () => {
    const tokenResponse = await getAdminTokenByOtp();
    token = tokenResponse.access_token;
    expect(token).toBeDefined();
  });

  it(`должен вывести менеджеров с organization.id = ${orgIdToFind}`, async () => {
    const response = await axios.post(
      process.env.GRAPHQL_URL,
      {
        query: `
          query {
            managers(page: 0, size: 1000) {
              content {
                id
                firstName
                lastName
                middleName
                user {
                  id
                  phoneNumber
                }
                organization {
                  id
                  name
                }
                orgRole {
                  id
                  name
                }
              }
            }
          }
        `
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    const allManagers = response.data?.data?.managers?.content || [];

    const filtered = allManagers.filter(
      (m) => m.organization?.id === orgIdToFind
    );

    if (filtered.length === 0) {
      console.log(`❗️Нет менеджеров с TARGET_ORG_ID = ${orgIdToFind}`);
      return;
    }

    console.log(`📦 Найдено ${filtered.length} менеджера(ов) с TARGET_ORG_ID = ${orgIdToFind}:\n`);

    filtered.forEach((mgr, index) => {
      const fullName = `${mgr.lastName} ${mgr.firstName}`;
      const phone = mgr.user?.phoneNumber || "—";
      const orgName = mgr.organization?.name || "—";
      const orgId = mgr.organization?.id || "—";
      const roleName = mgr.orgRole?.name || "—";
      const roleId = mgr.orgRole?.id || "—";

      console.log(`${index + 1}️⃣ ${fullName}  📱 ${phone}`);
      console.log(`🏢 Организация: ${orgName} (ID: ${orgId})`);
      console.log(`🎭 Роль: ${roleName} (ID: ${roleId})`);
      console.log('---');
    });

    expect(filtered.length).toBeGreaterThan(0);
  });
});
