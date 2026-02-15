// Decompiled with JetBrains decompiler
// Type: TIS.Models.ReportChart
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

using System;

namespace TIS.Models
{
  public class ReportChart
  {
    public string SUB_NO { get; set; }

    public DateTime BillDate { get; set; }

    public string TRANS_TYPE { get; set; }

    public string Amount { get; set; }

    public int AUID { get; set; }

    public string CALLTYPE_TEXT { get; set; }

    public string CCNAME { get; set; }

    public string BUNIT { get; set; }

    public string ORG { get; set; }

    public int PROVIDER { get; set; }

    public string PROVIDER_TEXT { get; set; }

    public int COUNTRYID { get; set; }
  }
}
