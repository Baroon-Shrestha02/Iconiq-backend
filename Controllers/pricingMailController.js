const nodemailer = require("nodemailer");
const { uploadFiles } = require("../Helper/ImageUploader");

const sendMail = async (req, res) => {
  try {
    const { name, email, phone, service, description, price, platforms } =
      req.body;
    let fileUrl = null;

    let attachments = [];
    if (req.files && req.files.file) {
      const uploaded = await uploadFiles(req.files.file);
      fileUrl = uploaded.url;

      // Prepare Nodemailer attachments using temp file path
      const uploadedFile = req.files.file;
      if (uploadedFile && uploadedFile.tempFilePath) {
        attachments.push({
          filename: uploadedFile.name || "attachment",
          path: uploadedFile.tempFilePath,
          contentType: uploadedFile.mimetype || undefined,
        });
      }
    }

    // Parse platforms if provided
    let platformsList = [];
    if (platforms) {
      try {
        platformsList = JSON.parse(platforms);
      } catch (error) {
        console.error("Error parsing platforms:", error);
      }
    }

    // Setup mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "baroonshrestha4@gmail.com",
        pass: process.env.app_pass,
      },
    });

    // Enhanced HTML email template
    const emailTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Service Inquiry</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                margin: 0;
                padding: 20px;
                line-height: 1.6;
            }
            
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
            }
            
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 30px;
                text-align: center;
                color: white;
                position: relative;
                overflow: hidden;
            }
            
            .header::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                animation: pulse 4s ease-in-out infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 0.1; }
            }
            
            .header h1 {
                font-size: 32px;
                font-weight: 700;
                margin-bottom: 10px;
                text-shadow: 0 2px 10px rgba(0,0,0,0.2);
                position: relative;
                z-index: 1;
            }
            
            .header p {
                font-size: 16px;
                opacity: 0.9;
                position: relative;
                z-index: 1;
            }
            
            .badge {
                display: inline-block;
                background: rgba(255, 255, 255, 0.2);
                padding: 8px 20px;
                border-radius: 50px;
                font-size: 14px;
                font-weight: 600;
                margin-top: 15px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.3);
                position: relative;
                z-index: 1;
            }
            
            .content {
                padding: 40px 30px;
            }
            
            .service-card {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                color: white;
                padding: 25px;
                border-radius: 15px;
                margin-bottom: 30px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(240, 147, 251, 0.3);
            }
            
            .service-title {
                font-size: 24px;
                font-weight: 700;
                margin-bottom: 10px;
            }
            
            .service-price {
                font-size: 28px;
                font-weight: 800;
                opacity: 0.9;
            }
            
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 30px;

            }

            .info-card{
                background: #f8fafc;
                border-left: 4px solid #667eea;
                padding: 18px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.04);
            }
            

            .info-label {
                font-size: 12px;
                font-weight: 600;
                color: #64748b;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 8px;
            }
            
            .info-value {
                font-size: 16px;
                font-weight: 600;
                color: #1e293b;
                word-break: break-word;
            }
            
            .description-section {
                background: #f8fafc;
                padding: 24px;
                border-radius: 14px;
                margin-bottom: 26px;
                border: 1px solid #e2e8f0;
                border-left: 5px solid #7c3aed;
                box-shadow: 0 4px 16px rgba(0,0,0,0.05);
            }
            
            .description-title {
                font-size: 19px;
                font-weight: 800;
                color: #111827;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                letter-spacing: 0.2px;
            }
            
            .description-title::before {
                content: "💭";
                margin-right: 10px;
                font-size: 20px;
            }
            
            .description-text {
                color: #334155;
                font-size: 16px;
                line-height: 1.8;
                background: #ffffff;
                padding: 16px 18px;
                border-radius: 10px;
                border: 1px solid #e5e7eb;
                white-space: pre-wrap;
                word-break: break-word;
            }
            
            .platforms-section {
                background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
                padding: 25px;
                border-radius: 15px;
                margin-bottom: 25px;
            }
            
            .platforms-title {
                font-size: 18px;
                font-weight: 700;
                color: #1e293b;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
            }
            
            .platforms-title::before {
                content: "🚀";
                margin-right: 10px;
                font-size: 20px;
            }
            
            .platform-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }
            
            .platform-tag {
                background: rgba(255, 255, 255, 0.8);
                color: #1e293b;
                padding: 8px 16px;
                border-radius: 25px;
                font-size: 14px;
                font-weight: 600;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .file-section {
                background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
                padding: 25px;
                border-radius: 15px;
                text-align: center;
                margin-bottom: 25px;
            }
            
            .file-title {
                font-size: 18px;
                font-weight: 700;
                color: white;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .file-title::before {
                content: "📎";
                margin-right: 10px;
                font-size: 20px;
            }
            
            .file-button {
                display: inline-block;
                background: rgba(255, 255, 255, 0.9);
                color: #6b46c1;
                padding: 12px 25px;
                border-radius: 50px;
                text-decoration: none;
                font-weight: 600;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            
            .file-button:hover {
                background: white;
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0,0,0,0.15);
            }
            
            .footer {
                background: #1e293b;
                color: white;
                padding: 30px;
                text-align: center;
            }
            
            .footer-title {
                font-size: 20px;
                font-weight: 700;
                margin-bottom: 10px;
            }
            
            .footer-text {
                opacity: 0.8;
                font-size: 14px;
                margin-bottom: 20px;
            }
            
            .timestamp {
                background: rgba(255, 255, 255, 0.1);
                padding: 10px 20px;
                border-radius: 25px;
                font-size: 12px;
                display: inline-block;
                backdrop-filter: blur(10px);
            }
            
            @media (max-width: 600px) {
                .email-container {
                    margin: 10px;
                    border-radius: 15px;
                }
                
                .header, .content {
                    padding: 25px 20px;
                }
                
                .info-grid {
                    grid-template-columns: 1fr;
                }
                
                .header h1 {
                    font-size: 24px;
                }
                
                .service-title {
                    font-size: 20px;
                }
                
                .service-price {
                    font-size: 22px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Header Section -->
            <div class="header">
                <h1>🎉 New Service Inquiry</h1>
                <p>A potential client is interested in your services</p>
                <div class="badge">High Priority</div>
            </div>
            
            <!-- Content Section -->
            <div class="content">
                <!-- Service Information -->
                <div class="service-card">
                    <div class="service-title">${service}</div>
                    <div class="service-price">${price}</div>
                </div>
                
                <!-- Client Information Grid -->
                <div class="info-grid">
                    <div class="info-card">
                        <div class="info-label">👤 Full Name</div>
                        <div class="info-value">${name}</div>
                    </div>
                    <div class="info-card">
                        <div class="info-label">📧 Email Address</div>
                        <div class="info-value">${email}</div>
                    </div>
                    <div class="info-card">
                        <div class="info-label">📱 Phone Number</div>
                        <div class="info-value">${phone}</div>
                    </div>
                    <div class="info-card">
                        <div class="info-label">⏰ Inquiry Time</div>
                        <div class="info-value">${new Date().toLocaleString()}</div>
                    </div>
                </div>
                
                <!-- Project Description -->
                ${
                  description
                    ? `
                <div class="description-section">
                    <div class="description-title">Project Description</div>
                    <div class="description-text">${description}</div>
                </div>
                `
                    : ""
                }
                
                <!-- Selected Platforms -->
                ${
                  platformsList.length > 0
                    ? `
                <div class="platforms-section">
                    <div class="platforms-title">Selected Platforms</div>
                    <div class="platform-tags">
                        ${platformsList
                          .map(
                            (platform) =>
                              `<span class="platform-tag">${platform}</span>`
                          )
                          .join("")}
                    </div>
                </div>
                `
                    : ""
                }
            </div>
            
            <!-- Footer Section -->
            <div class="footer">
                <div class="footer-title">Next Steps</div>
                <div class="footer-text">
                    Review the inquiry details and respond promptly to convert this lead into a client.
                </div>
                <div class="timestamp">
                    Received on ${new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    // Mail options with enhanced template
    const mailOptions = {
      from: email,
      to: "baroonshrestha4@gmail.com",
      subject: `🔥 New ${service} Inquiry from ${name} - ${price}`,
      html: emailTemplate,
      // Also include plain text version for better deliverability
      text: `
        New Service Inquiry
        
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Service: ${service}
        Price: ${price}
        Description: ${description}
        ${
          platformsList.length > 0
            ? `Platforms: ${platformsList.join(", ")}`
            : ""
        }
        ${fileUrl ? `File: ${fileUrl}` : ""}
        
        Received: ${new Date().toLocaleString()}
      `,
      attachments,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ success: true, message: "Inquiry sent successfully" });
  } catch (error) {
    console.error("Error sending inquiry:", error);
    res.status(500).json({ success: false, message: "Failed to send inquiry" });
  }
};

module.exports = { sendMail };
