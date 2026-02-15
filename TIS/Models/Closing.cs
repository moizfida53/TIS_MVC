// Decompiled with JetBrains decompiler
// Type: TIS.Models.Closing
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

namespace TIS.Models
{
  public class Closing
  {
    public double BusinessCharges { get; set; }

    public double PersonalCharges { get; set; }

    public double PersonalLimitCharges { get; set; }

    public double DeductibleAmount { get; set; }

    public double TOTALAMOUNT { get; set; }

    public int BID { get; set; }

    public string comments { get; set; }

    public int uid { get; set; }

    public double WaiverAmt { get; set; }
  }
}
