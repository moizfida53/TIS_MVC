// Decompiled with JetBrains decompiler
// Type: TIS.Models.ArrovalBills
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

namespace TIS.Models
{
  public class ArrovalBills
  {
    public int BillId { get; set; }

    public string BillDate { get; set; }

    public string SubNo { get; set; }

    public string Name { get; set; }

    public string Org { get; set; }

    public string Total { get; set; }

    public string BusinessLimit { get; set; }

    public string PLimit { get; set; }

    public string BusinessCharges { get; set; }

    public string DeductableAmount { get; set; }

    public string WaiverAmount { get; set; }

    public string Comments { get; set; }

    public bool IsSelected { get; set; }

    public string AComments { get; set; }
  }
}
