import express from "express";
import twilio from "twilio";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Twilio config from environment variables (set these in Render)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_VERIFY_SID;
const client = twilio(accountSid, authToken);

// Root endpoint
app.get("/", (req, res) => {
  res.json({ ok: true, message: "✅ SMS OTP backend is running!" });
  });

  // Send OTP
  app.post("/send-otp", async (req, res) => {
    const { phone } = req.body;
      if (!phone) return res.status(400).json({ success: false, message: "Phone number required" });

        try {
            const verification = await client.verify.v2.services(serviceSid)
                  .verifications.create({ to: phone, channel: "sms" });

                      res.json({ success: true, message: "OTP sent successfully!", status: verification.status });
                        } catch (err) {
                            console.error("Send OTP error:", err);
                                res.status(500).json({ success: false, message: "Failed to send OTP", error: err.message });
                                  }
                                  });

                                  // Verify OTP
                                  app.post("/verify-otp", async (req, res) => {
                                    const { phone, code } = req.body;
                                      if (!phone || !code) return res.status(400).json({ success: false, message: "Phone and OTP required" });

                                        try {
                                            const check = await client.verify.v2.services(serviceSid)
                                                  .verificationChecks.create({ to: phone, code });

                                                      if (check.status === "approved") {
                                                            res.json({ success: true, message: "✅ OTP Verified!" });
                                                                } else {
                                                                      res.json({ success: false, message: "❌ Invalid or expired OTP" });
                                                                          }
                                                                            } catch (err) {
                                                                                console.error("Verify OTP error:", err);
                                                                                    res.status(500).json({ success: false, message: "Verification failed", error: err.message });
                                                                                      }
                                                                                      });

                                                                                      const PORT = process.env.PORT || 3000;
                                                                                      app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));