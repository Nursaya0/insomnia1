const { getTokenByOtp } = require("../api/client");

describe("Получение токена по OTP", () => {
  it("должен вернуть access_token и refresh_token", async () => {
    const data = await getTokenByOtp();
    expect(data).toHaveProperty("access_token");
    expect(data).toHaveProperty("refresh_token");
    expect(data.expires_in).toBeGreaterThan(0);
  });
});
