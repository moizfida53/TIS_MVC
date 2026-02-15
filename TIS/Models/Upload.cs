// Decompiled with JetBrains decompiler
// Type: TIS.Models.Upload
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

using System;

namespace TIS.Models
{
  public class Upload
  {
    public int ID { get; set; }

    public string FileName { get; set; }

    public string SheetName { get; set; }

    public DateTime UploadDate { get; set; }

    public DateTime BillDate { get; set; }

    public string BillAmount { get; set; }

    public string ProviderName { get; set; }

    public int ProviderID { get; set; }

    public int Month { get; set; }

    public int Year { get; set; }

    public string DbBased { get; set; }
  }
}
