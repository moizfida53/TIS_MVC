// Decompiled with JetBrains decompiler
// Type: TIS.Models.SendEmail
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

namespace TIS.Models
{
    public class SendEmail
    {
        public int Id { get; set; }

        public int TemplateId { get; set; }

        public int Bill_Id { get; set; }
        public string BillDate { get; set; }

        public int[] BID { get; set; }

        public string Subject { get; set; }

        public string EmailText { get; set; }

        public string EmailFrom { get; set; }

        public string EmailTo { get; set; }

        public string CC { get; set; }

        public bool sent { get; set; }

        public string senton { get; set; }

        public int[] EmailID { get; set; }

        public string TemplateName { get; set; }

        public int IsSent { get; set; }
    }
}
