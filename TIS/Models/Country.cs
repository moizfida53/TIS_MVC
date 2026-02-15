// Decompiled with JetBrains decompiler
// Type: TIS.Models.Country
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

using System;

namespace TIS.Models
{
  public class Country
  {
    public int COUNTRYID { get; set; }

    public string COUNTRYNAME { get; set; }

    public string CURRENCY { get; set; }

    public string COUNTRYCODE { get; set; }

    public Decimal EXCHANGERATE { get; set; }

    public string SHAYACODE { get; set; }

    public string[] SelectedValues { get; set; }

  }
}
