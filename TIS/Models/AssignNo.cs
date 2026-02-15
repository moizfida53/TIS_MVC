// Decompiled with JetBrains decompiler
// Type: TIS.Models.AssignNo
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

using System;

namespace TIS.Models
{
  public class AssignNo
  {
   

    public int ID { get; set; }

    public int UID { get; set; }

    public int SubNoId { get; set; }

    public int LINESTATUS { get; set; }

    public string LINESTATUSNAME { get; set; }

        public string SUBNO { get; set; }

    public string DESCRIPTION { get; set; }

    public string EMPLOYEENAME { get; set; }

    public string EMPLOYEENO { get; set; }

    public decimal ALLOWANCELIMIT { get; set; }

    public decimal BUSINESSLIMIT { get; set; }

    public DateTime STARTDATE { get; set; }

    public DateTime ENDDATE { get; set; }
    public int CostCenterID { get; set; }
        public string CostCenterName { get; set; }

    }
}
