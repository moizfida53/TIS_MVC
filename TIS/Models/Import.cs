// Decompiled with JetBrains decompiler
// Type: TIS.Models.Import
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

using System;

namespace TIS.Models
{
  public class Import
  {
    public int ID { get; set; }

    public string SUB_NO { get; set; }

    public DateTime BILLDATE { get; set; }

    public string CALLDATE { get; set; }

    public string TRANS_TYPE { get; set; }

    public string DESCRIPTION { get; set; }

    public string AMOUNT { get; set; }

    public string DURATION { get; set; }

    public string CALLTIME { get; set; }
  }
}
