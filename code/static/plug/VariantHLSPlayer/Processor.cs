using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace VariantHLSPlayer
{
    /// <summary>
    /// FakeAuthChecker 的摘要说明
    /// </summary>
    public class Processor : IHttpHandler
    {
        public const string KEY = "1!qaz2@w";
        public const string PASSWORD = "testtest123";
        public static byte[] IV = new byte[] { 0x8A, 0x8B, 0x44, 0xBA, 0x5C, 0x01, 0x7E, 0xA2 };

        public void ProcessRequest(HttpContext context)
        {
            string password = context.Request["password"];
            string method = context.Request["method"];

            if (method == "encrypt")
            {
                if (context.Request.Files.Count == 0)
                    return;

                var stream = context.Request.Files[0].InputStream;
                byte[] sourceFile = new byte[context.Request.Files[0].ContentLength];

                stream.Read(sourceFile, 0, sourceFile.Length);

                stream.Close();

                byte[] targetStream = DESEncrypt(sourceFile, KEY);

                context.Response.Clear();
                context.Response.ContentType = "application/octet-stream";
                context.Response.AddHeader("Content-Disposition", "attachment; filename=");
                context.Response.BinaryWrite(targetStream);
                context.Response.End();

            }
            else if (method == "decrypt")
            {
                context.Response.ContentType = "text/json";

                if (String.IsNullOrEmpty(password) || password != PASSWORD)
                {
                    context.Response.Write("{\"success\": 0, \"data\": null, \"message\": \"密钥不正确\"}");
                    context.Response.End();
                    return;
                }

                context.Response.Write($"{{\"success\": 1, \"data\": \"{KEY}\", \"message\": \"成功\"}}");
                context.Response.End();
            }
        }

        public bool IsReusable
        {
            get
            {
                return true;
            }
        }



        private static byte[] DESEncrypt(byte[] source, string key)
        {
            var des = DESCryptoServiceProvider.Create();

            des.Mode = CipherMode.ECB;
            des.Padding = PaddingMode.PKCS7;
            des.Key = Encoding.UTF8.GetBytes(key);
            des.IV = IV;

            var transformer = des.CreateEncryptor();

            var targetStream = transformer.TransformFinalBlock(source, 0, source.Length);
            return targetStream;
        }

    }
}