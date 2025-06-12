const { getTokenByOtp, refreshToken } = require("../api/client");

describe("Authorization Requests", () => {
  // сюда запишем refresh_token из первого теста
  let savedRefreshToken = "";

  it("should get token by OTP", async () => {
    const res = await getTokenByOtp();

    expect(res).toHaveProperty("access_token");
    expect(res).toHaveProperty("refresh_token");
    expect(res.expires_in).toBeGreaterThan(0);

    // сохраним, чтобы использовать в следующем тесте
    savedRefreshToken = res.refresh_token;
  });

  it("should refresh token", async () => {
    // если вдруг первый тест не записал refresh_token
    if (!savedRefreshToken) {
      const retry = await getTokenByOtp();
      savedRefreshToken = retry.refresh_token;
    }

    const res = await refreshToken(savedRefreshToken);

    expect(res).toHaveProperty("access_token");
    expect(res).toHaveProperty("refresh_token");
    expect(res.expires_in).toBeGreaterThan(0);
  });
});
