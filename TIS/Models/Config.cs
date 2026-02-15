// Decompiled with JetBrains decompiler
// Type: TIS.Models.Config
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

namespace TIS.Models
{
  public class Config
  {
    public string EmpReminder { get; set; }

    public string MgrReminder { get; set; }

    public string FBReminder { get; set; }

    public string LMReminder { get; set; }

    public string SMTP { get; set; }

    public string AdminEmail { get; set; }

    public string HostUrl { get; set; }

    public string SupGrade { get; set; }

    public bool EnableGrade { get; set; }

    public bool DntSndEmail { get; set; }

    public bool HidePerCalls { get; set; }

    public bool GMApp { get; set; }

    public bool EnableDiscrepancy { get; set; }

    public bool SkipAppBusZero { get; set; }

    public bool DedBusCharges { get; set; }

    public bool ZeroUnlimited { get; set; }

    public bool AlwWav { get; set; }

    public bool EnableDelete { get; set; }

    public bool AlwTrainFB { get; set; }

    public bool HideAllowanceLimit { get; set; }

    public bool HidePersonalLimit { get; set; }
  }
}
