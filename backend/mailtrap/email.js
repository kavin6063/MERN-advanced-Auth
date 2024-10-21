import { mailtrapClient, sender } from "./mailtrap.config.js";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });
    console.log("Email Sent Successfully", response);
  } catch (err) {
    console.log("Error sending verification :", err);
    throw new Error(`Error sending email: ${err.message}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "4f85372b-7a47-4876-8b31-f8ca23a6ff74",
      template_variables: {
        company_info_name: "The Auth Company",
        name: name,
      },
    });
    console.log("Welcome Email Sent Successfully", response);
  } catch (error) {
    console.log("Error sending welcome email :", error);

    throw new Error(`Error sending email: ${error.message}`);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
  } catch (error) {
    console.log("Error sending password reset email :", error);
    throw new Error(`Error sending email: ${error.message}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
      subject: "Password Reset Successful",
    });
    console.log("Password Reset Email Sent Successfully", response);
  } catch (error) {
    console.log("Error sending password reset email :", error);
    throw new Error(`Error sending email: ${error.message}`);
  }
};
