jest.setTimeout(10_000);
require("dotenv").config();

const { getAdminTokenByOtp } = require("../../api/AdminToken");

describe("Admin Authorization via OTP", () => {
  let tokens;

  it("should get admin token by OTP", async () => {
    tokens = await getAdminTokenByOtp();
    expect(tokens).toHaveProperty("access_token");
    expect(tokens).toHaveProperty("refresh_token");
    expect(tokens.expires_in).toBeGreaterThan(0);
  });
});
