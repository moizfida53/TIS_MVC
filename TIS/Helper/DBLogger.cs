// Decompiled with JetBrains decompiler
// Type: TIS.Helper.DBLogger
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

using System;

namespace TIS.Helper
{
  public class DBLogger
  {
    public DateTime ExecTime { get; set; }

    public string Procedure { get; set; }

    public int TimeTaken { get; set; }

    public string Exception { get; set; }
  }
}
