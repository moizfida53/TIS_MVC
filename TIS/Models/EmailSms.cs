// Decompiled with JetBrains decompiler
// Type: TIS.Models.EmailSms
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

using System;

namespace TIS.Models
{
  public class EmailSms
  {
    public class EmailGroup
    {
      public int GroupID { get; set; }

      public string GroupName { get; set; }

      public string CheckedGroupList { get; set; }

      public int TemplateID { get; set; }

      public string Subject { get; set; }

      public string GroupIDs { get; set; }

      public string Emails { get; set; }
    }

    public class Employees
    {
      public int UID { get; set; }

      public string USERNAME { get; set; }

      public string EMAIL { get; set; }

      public string SUB_NO { get; set; }

      public string ORG { get; set; }

      public int[] Emp { get; set; }

      public string GroupName { get; set; }

      public int GroupID { get; set; }

      public int IsUpdated { get; set; }

      public long[] SUB_NOs { get; set; }
    }

    public class SMSGroup
    {
      public int GroupID { get; set; }

      public string GroupName { get; set; }

      public string CheckedGroupList { get; set; }

      public int TemplateID { get; set; }

      public string GroupIDs { get; set; }

      public string MobileNos { get; set; }

      public string SMS { get; set; }

      public int Language { get; set; }
    }

    public class Mobile
    {
      public string MobileNo { get; set; }
    }

    public class EmailSMSSearch
    {
      public DateTime StartDate { get; set; }

      public DateTime EndDate { get; set; }

      public int Status { get; set; }
    }
  }
}
