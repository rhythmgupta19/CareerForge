/**
 * CareerForge Invalid Email Reporting Utility
 *
 * This script scans the database for users whose email addresses do not conform to the strict format.
 * It writes a detailed report to 'invalid_emails_report.txt' in the server root.
 *
 * IMPORTANT: This script is for auditing purposes only. It DOES NOT mutate, update, or delete any data.
 */

const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.join(__dirname, '.env') });
}

const mongoose = require('mongoose');
const User = require('../models/User');

// Strict email verification regex (matches the frontend and backend auth validation)
const STRICT_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

async function runReport() {
  console.log('🔄 Starting Invalid Email Audit...');

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/careerforge';
  console.log(`🔌 Connecting to MongoDB: ${uri.replace(/:([^:@]+)@/, ':****@')}`);

  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB successfully.');

    // Fetch all users
    console.log('🔍 Fetching all users from database...');
    const users = await User.find({}, '_id fullName email provider createdAt');
    console.log(`👥 Total users found: ${users.length}`);

    const invalidUsers = [];

    for (const user of users) {
      const email = user.email || '';
      // We also trim and lowercase before matching just to align with the normalized check
      const normalizedEmail = email.trim().toLowerCase();
      
      if (!STRICT_EMAIL_REGEX.test(normalizedEmail)) {
        invalidUsers.push({
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          provider: user.provider,
          createdAt: user.createdAt
        });
      }
    }

    // Build the report content
    const reportPath = path.join(__dirname, '../invalid_emails_report.txt');
    let reportContent = '';
    reportContent += `==================================================\n`;
    reportContent += `CAREERFORGE INVALID EMAIL AUDIT REPORT\n`;
    reportContent += `Generated on: ${new Date().toISOString()}\n`;
    reportContent += `Total Users Checked: ${users.length}\n`;
    reportContent += `Total Malformed/Invalid Emails Found: ${invalidUsers.length}\n`;
    reportContent += `==================================================\n\n`;

    if (invalidUsers.length > 0) {
      reportContent += `List of Malformed Accounts:\n`;
      reportContent += `--------------------------------------------------\n`;
      invalidUsers.forEach((user, index) => {
        reportContent += `[${index + 1}] User ID: ${user.id}\n`;
        reportContent += `    Name: ${user.fullName}\n`;
        reportContent += `    Email in DB: "${user.email}"\n`;
        reportContent += `    Auth Provider: ${user.provider || 'local'}\n`;
        reportContent += `    Created At: ${user.createdAt ? user.createdAt.toISOString() : 'N/A'}\n`;
        reportContent += `--------------------------------------------------\n`;
      });
    } else {
      reportContent += `🎉 Excellent! All users have valid email addresses matching the strict validation rules.\n`;
    }

    // Write report to file
    fs.writeFileSync(reportPath, reportContent, 'utf-8');
    
    // Log summary to console
    console.log('\n======================================');
    console.log('📊 AUDIT SUMMARY:');
    console.log(`- Checked: ${users.length} users`);
    console.log(`- Malformed/Invalid emails: ${invalidUsers.length}`);
    console.log(`- Report generated at: ${reportPath}`);
    console.log('======================================\n');
    
    if (invalidUsers.length > 0) {
      console.log('⚠️  Malformed emails found:');
      invalidUsers.forEach((u) => {
        console.log(`   - "${u.email}" (User: ${u.fullName}, ID: ${u.id})`);
      });
    } else {
      console.log('🎉 No malformed emails found.');
    }

  } catch (err) {
    console.error('❌ An error occurred during the audit:', err.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB.');
  }
}

runReport();
