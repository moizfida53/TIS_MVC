// Decompiled with JetBrains decompiler
// Type: TIS.Models.SearchR
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

using System;

namespace TIS.Models
{
  public class SearchR
  {
    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public int Event { get; set; }

    public int EmpNo { get; set; }

    public string Status { get; set; }

    public string Uid { get; set; }
  }
}
