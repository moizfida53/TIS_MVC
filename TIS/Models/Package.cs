// Decompiled with JetBrains decompiler
// Type: TIS.Models.Package
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

using System;

namespace TIS.Models
{
  public class Package
  {
    public string Count { get; set; }

    public int ID { get; set; }

    public string PkgName { get; set; }

    public string PkgDesc { get; set; }

    public int ProviderID { get; set; }

    public string ProviderName { get; set; }

    public int TransID { get; set; }

    public string TransName { get; set; }

    public bool IsAll { get; set; }

    public int DescID { get; set; }

    public string DescName { get; set; }

    public int ExpType { get; set; }

    public double Amount { get; set; }

    public DateTime StartDate { get; set; }
  }
}
