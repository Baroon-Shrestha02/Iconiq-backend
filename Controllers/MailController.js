const nodemailer = require("nodemailer");

const sendmail = async (req, res) => {
  const { firstName, lastName, email, number, subject, message } = req.body;
  const LogoUrl =
    "https://res.cloudinary.com/dbwu2fxcs/image/upload/v1756895253/Screenshot_2025-09-03_at_16.11.51_lri3bl.png";

  try {
    // Transporter setup (using Gmail as example)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "baroonshrestha4@gmail.com", // your Gmail
        pass: process.env.app_pass, // App password (not your real Gmail password)
      },
    });

    // Enhanced HTML email template
    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f8f9fa;
            }
            
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
            
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px 20px;
                text-align: center;
            }
            
            .header-icon {
                width: 60px;
                height: 60px;
                margin: 0 auto 15px;
                background-color: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
            }
            
            .header h1 {
                font-size: 28px;
                font-weight: 600;
                margin-bottom: 8px;
            }
            
            .header p {
                font-size: 16px;
                opacity: 0.9;
            }
            
            .content {
                padding: 40px 30px;
            }
            
            .form-section {
                margin-bottom: 30px;
            }
            
            .section-title {
                font-size: 18px;
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 15px;
                padding-bottom: 8px;
                border-bottom: 2px solid #e9ecef;
            }
            
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 25px;
            }
            
            .info-item {
                background-color: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #667eea;
            }
            
            .info-label {
                font-weight: 600;
                color: #495057;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 5px;
            }
            
            .info-value {
                font-size: 16px;
                color: #2c3e50;
                word-break: break-word;
            }
            
            .message-section {
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #28a745;
            }
            
            .message-content {
                font-size: 16px;
                line-height: 1.6;
                color: #2c3e50;
                white-space: pre-wrap;
            }
            
            .footer {
                background-color: #2c3e50;
                color: white;
                padding: 20px;
                text-align: center;
                font-size: 14px;
            }
            
            .timestamp {
                background-color: #e9ecef;
                padding: 15px;
                text-align: center;
                color: #6c757d;
                font-size: 14px;
                border-top: 1px solid #dee2e6;
            }
            
            @media (max-width: 600px) {
                .info-grid {
                    grid-template-columns: 1fr;
                }
                
                .content {
                    padding: 30px 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Header with Icon -->
            <div class="header">
                <div class="header-icon">
                 <img src="${LogoUrl}"  Logo" />
                </div>
                <h1>New Form Submission</h1>
                <p>Someone has reached out through your website</p>
            </div>
            
            <!-- Main Content -->
            <div class="content">
                <!-- Contact Information Section -->
                <div class="form-section">
                    <div class="section-title">👤 Contact Information</div>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Full Name</div>
                            <div class="info-value">${firstName} ${lastName}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Email Address</div>
                            <div class="info-value">${email}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Phone Number</div>
                            <div class="info-value">${
                              number || "Not provided"
                            }</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Subject</div>
                            <div class="info-value">${
                              subject || "General Inquiry"
                            }</div>
                        </div>
                    </div>
                </div>
                
                <!-- Message Section -->
                <div class="form-section">
                    <div class="section-title">💬 Message</div>
                    <div class="message-section">
                        <div class="message-content">${message}</div>
                    </div>
                </div>
            </div>
            
            <!-- Timestamp -->
            <div class="timestamp">
                <strong>Received:</strong> ${new Date().toLocaleString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZoneName: "short",
                  }
                )}
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <p>This email was automatically generated from your contact form.</p>
                <p>Please respond directly to <strong>${email}</strong></p>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: `"Contact Form" ${email}`, // Use your email as sender with display name
      to: "baroonshrestha4@gmail.com", // receiver = your email
      replyTo: email, // Allow easy reply to the actual sender
      subject: `🔔 New Contact: ${subject || "General Inquiry"}`,
      html: htmlTemplate, // Use HTML template
      text: `
Name: ${firstName} ${lastName}
Email: ${email}
Number: ${number || "Not provided"}
Subject: ${subject || "General Inquiry"}
Message: ${message}

Received: ${new Date().toLocaleString()}
      `, // Fallback plain text version
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
};

module.exports = { sendmail };
