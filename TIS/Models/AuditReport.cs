// Decompiled with JetBrains decompiler
// Type: TIS.Models.AuditReport
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

namespace TIS.Models
{
  public class AuditReport
  {
    public int ID { get; set; }

    public string ACTION_NAME { get; set; }

    public string RESULT { get; set; }

    public string USER { get; set; }

    public string USERID { get; set; }

    public string DATE1 { get; set; }

    public int FORM_ID { get; set; }
  }
}
