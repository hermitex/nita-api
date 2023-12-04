const {
  studentPlatformRegistrationNotification,
  studentCourseEnrollmentNotification,
  adminRegistrationAdminNotification,
} = require("../repositories/emailTemplate");

const nodemailer = require("nodemailer");

exports.sendEmail = async ({
  recipient,
  studentName,
  courseName,
  startDate, 
  endDate,
  phone = "0797165741",
  cc = [],
  bcc = [],
  type,
}) => {
  try {
    if (!recipient) {
      throw new Error("Email recipient not found");
    }

    const transporter = nodemailer.createTransport({
      host: "mail.smtp2go.com",
      port: 587,
      secure: false,
      auth: {
        user: "no-reply@dataposit.co.ke",
        pass: process.env.EMAIL_PASS,
      },
    });
    let template;
    let subject;
    let replacements = [];

    switch (type) {
      case "STUDENTREGISTRATION":
        replacements = [   
            { placeholder: "{{StudentName}}", value: studentName },
            { placeholder: " {{ContactPhone}}", value: phone },
            { placeholder:  "{{ContactEmail}}", value: "support@nitatraining.com" },
          ];
        template = studentPlatformRegistrationNotification;
        subject = "Nita Registration";
        break;
      case "STUDENTCOURSEENROLMENT":
        replacements = [
            { placeholder: "{{CourseName}}", value: courseName },
            { placeholder: "{{StudentName}}", value: studentName },
            { placeholder: "{{StartDate}}", value: startDate },
            { placeholder: "{{EndDate}}", value: endDate },
          ];
         
        template = studentCourseEnrollmentNotification;
        subject = "Course Enrolment";
        break;
      case "ADMINCOURSEENROLMENT":
        replacements = [
            { placeholder: "{{AdminName}}", value: "Nita Admin" },
            { placeholder: "{{CourseName}}", value: courseName },
            { placeholder: "{{StudentName}}", value: studentName },
          ];
       
        template = adminRegistrationAdminNotification;
        subject = "Course Enrolment";
        break;

      default:
        break;
    }

    replacements.forEach((replacement) => {
        template =
          template.replace(
            new RegExp(replacement.placeholder, "g"),
            replacement.value
          );
      });
    const mailOptions = {
      from: "tiberius.mairura@dataposit.co.ke",
      to: recipient,
      cc: cc,
      bcc: bcc,
      subject: `IMPORTANT: ${subject}`,
      html: template,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    throw new Error("Error sending email");
  }
};
