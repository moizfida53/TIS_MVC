// Decompiled with JetBrains decompiler
// Type: TIS.Models.Policy
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

namespace TIS.Models
{
  public class Policy
  {
    public int ID { get; set; }

    public int ProviderID { get; set; }

    public string ProviderName { get; set; }

    public string TransType { get; set; }

    public string Description { get; set; }

    public int CallTypeID { get; set; }

    public string CallType { get; set; }

    public int LineTypeID { get; set; }

    public string LineType { get; set; }

    public bool IsAll { get; set; }

    public bool IsAllDesc { get; set; }

    public bool IsSupImp { get; set; }

    public int[] Emp { get; set; }

    public int[] Num { get; set; }

    public string[] Des { get; set; }
  }
}
