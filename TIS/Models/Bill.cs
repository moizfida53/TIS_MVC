// Decompiled with JetBrains decompiler
// Type: TIS.Models.Bill
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

using System;

namespace TIS.Models
{
  public class Bill
  {
    public int Id { get; set; }

    public DateTime BillDate { get; set; }

    public int Uid { get; set; }

    public string EmpName { get; set; }

    public string BillNumber { get; set; }

    public string Mobile { get; set; }

    public double TotalAmount { get; set; }

    public string LastUpdatedOn { get; set; }

    public string Comments { get; set; }

    public string SubsId { get; set; }

    public int ProviderID { get; set; }

    public string ProviderName { get; set; }

    public string ManagerName { get; set; }

    public string StatusName { get; set; }

    public int StatusID { get; set; }

    public string Currency { get; set; }

    public string Department { get; set; }
  }
}
