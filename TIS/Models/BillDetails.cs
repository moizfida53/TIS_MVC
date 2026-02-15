// Decompiled with JetBrains decompiler
// Type: TIS.Models.BillDetails
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

namespace TIS.Models
{
  public class BillDetails
  {
    public int Id { get; set; }

    public string CallDate { get; set; }

    public string CallTime { get; set; }

    public string TransType { get; set; }

    public string Description { get; set; }

    public string Duration { get; set; }

    public double Amount { get; set; }

    public string Comment { get; set; }

    public string CallType { get; set; }

    public bool Locked { get; set; }

    public int Auid { get; set; }

    public string DialledNo { get; set; }

    public string Name { get; set; }
  }
}
