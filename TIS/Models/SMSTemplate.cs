// Decompiled with JetBrains decompiler
// Type: TIS.Models.SMSTemplate
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

namespace TIS.Models
{
  public class SMSTemplate
  {
    public int ID { get; set; }

    public int SMSTemplateId { get; set; }

    public string SMSTemplateName { get; set; }

    public string Message { get; set; }

    public string SMSTo { get; set; }

    public int[] SMSID { get; set; }

    public int Language { get; set; }
  }
}
