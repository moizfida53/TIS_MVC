// Decompiled with JetBrains decompiler
// Type: TIS.Models.Delg
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

using System;

namespace TIS.Models
{
  public class Delg
  {
    public int ID { get; set; }

    public int secid { get; set; }

    public string SecName { get; set; }

    public int managerid { get; set; }

    public string ManName { get; set; }

    public bool app { get; set; }

    public bool idt { get; set; }

    public DateTime sdate { get; set; }

    public DateTime edate { get; set; }
  }
}
