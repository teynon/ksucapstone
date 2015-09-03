using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;

namespace Electrolyte.Helper
{
    public class Email
    {
        private static string smtpMailServer = "smtp.gmail.com";
        private static int port = 587;

        private static string smtpMailUser = "support@followthru.co";
        private static string smtpMailPass = "f0ll0wthru.support1";
        public static string from = "support@followthru.co";
        public static string fromName = "FollowThru Support";
        public static string replyTo = "support@followthru.co";
        public static string replyToName = "FollowThru Support";

        public static void SendEmail(string to, string toName, string subject, string message)
        {
            try
            {
                SmtpClient mySmtpClient = new SmtpClient(smtpMailServer);
                mySmtpClient.Port = port;
                mySmtpClient.EnableSsl = true;
                mySmtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
                mySmtpClient.UseDefaultCredentials = false;
                mySmtpClient.Credentials = new NetworkCredential(from, smtpMailPass);

                // set smtp-client with basicAuthentication
                mySmtpClient.UseDefaultCredentials = false;
                System.Net.NetworkCredential basicAuthenticationInfo = new
                   System.Net.NetworkCredential(smtpMailUser, smtpMailPass);
                mySmtpClient.Credentials = basicAuthenticationInfo;

                // add from,to mailaddresses
                MailAddress fromAddress = new MailAddress(from, fromName);
                MailAddress toAddress = new MailAddress(to, toName);
                MailMessage myMail = new System.Net.Mail.MailMessage(fromAddress, toAddress);

                // add ReplyTo
                MailAddress replyto = new MailAddress(replyTo);
                myMail.ReplyToList.Add(replyto);

                // set subject and encoding
                myMail.Subject = subject;
                myMail.SubjectEncoding = System.Text.Encoding.UTF8;

                // Load the email template.
                message = message + "<br /><br />FollowThru Support<br />support@followthru.co";

                // set body-message and encoding
                myMail.Body = String.Format(template, Strings.GetBaseURL(), toName, message);
                myMail.BodyEncoding = System.Text.Encoding.UTF8;
                // text or html
                myMail.IsBodyHtml = true;

                mySmtpClient.Send(myMail);
            }

            catch (SmtpException ex)
            {
                throw new ApplicationException
                  ("SmtpException has occured: " + ex.Message);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static string template = "<div style=\"width: 600px; border: 2px solid #e5e5e5;\"><table border=0 cellspacing=0 cellpadding=0 style=\"width: 100%; background: #4fa5f2; border: none; height: 60px; font-size: 24px; color: #FFFFFF; border-bottom: 10px solid #e5e5e5;\"><tr><td width=\"100%\" style=\"padding: 10px;\">{1}</td><td><img src=\"{0}Content/images/Email/logo_blue.png\" /></td></tr></table><div style=\"padding: 20px;\">{2}</div><div style=\"background: #e5e5e5;\"><img src=\"{0}/Content/images/Email/logo_gray.png\" /></div></div>";
    }
}