const axios = require("axios");
const { getAdminTokenByOtp } = require("../api/AdminToken");
const { setOrganizationId } = require("../config/IDstorage");
require("dotenv").config();

describe("Get Organization ID by Name", () => {
  it("should fetch organizations and store the ID of the target one", async () => {
    const tokenResponse = await getAdminTokenByOtp();
    const token = tokenResponse.access_token;

    const response = await axios.post(
      process.env.GRAPHQL_URL,
      {
        query: `
          query {
            organizations(page: 0, size: 150) {
              content {
                id
                name
              }
            }
          }
        `
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const organizations = response.data.data.organizations.content;
    const orgNameToFind = "Choco Delivery"; 
    const found = organizations.find(org => org.name === orgNameToFind);

    expect(found).toBeDefined();

    setOrganizationId(found.id);

    console.log(`✅ Найдена организация: "${found.name}"`);
    console.log(`🆔 Её ID: ${found.id}`);
  });
});
