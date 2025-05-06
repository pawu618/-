const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Validate email format
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify transporter connection
transporter.verify(function(error, success) {
    if (error) {
        console.log('Error verifying email transport:', error);
    } else {
        console.log('Server is ready to send emails');
    }
});

// POST endpoint for form submission
app.post('/submit-form', async (req, res) => {
    const { name, email, monthly_earnings, goals } = req.body;

    // Input validation
    if (!name || !email || !monthly_earnings || !goals) {
        return res.status(400).json({ 
            message: 'All fields are required',
            success: false 
        });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ 
            message: 'Invalid email format',
            success: false 
        });
    }

    try {
        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'giorgiathletics@gmail.com',
            subject: '🌟 New Aphoria Contact Form Submission',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <h2 style="color: #333; border-bottom: 2px solid #c18aff; padding-bottom: 10px;">New Contact Form Submission</h2>
                    
                    <div style="background-color: white; padding: 20px; border-radius: 5px; margin-top: 20px;">
                        <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
                        <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
                        <p style="margin: 10px 0;"><strong>Current Monthly Earnings:</strong> ${monthly_earnings}</p>
                        <p style="margin: 10px 0;"><strong>Goals:</strong> ${goals}</p>
                    </div>
                    
                    <p style="color: #666; font-size: 12px; margin-top: 20px; text-align: center;">
                        This is an automated message from your Aphoria contact form.
                    </p>
                </div>
            `,
            text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Current Monthly Earnings: ${monthly_earnings}
Goals: ${goals}

- Aphoria Contact Form
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ 
            message: 'Form submitted successfully!',
            success: true 
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            message: 'Error submitting form. Please try again later.',
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 