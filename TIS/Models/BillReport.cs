// Decompiled with JetBrains decompiler
// Type: TIS.Models.BillReport
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

namespace TIS.Models
{
    public class BillReport
    {
        //public int BILL_ID { get; set; }
        //public string SUB_NO { get; set; }
        //public string BILLDATE { get; set; }
        //public string EMPLOYEENO { get; set; }
        //public string EMPLOYEENAME { get; set; }
        //public string TOTALAMOUNT { get; set; }
        ////New added on 28 July 23
        //public string ManagerName { get; set; }
        //public string BillStatus { get; set; }
        //public string DateIdentified { get; set; }
        //public string LASTUPDATEDON { get; set; }
        //public string ApprovedDate { get; set; }
        //public string DEDUCTIBLEAMOUNT { get; set; }
        //public string BUSINESSCHARGES { get; set; }
        //public string SUB_DESC { get; set; }
        //public string Company { get; set; }
        //public string PAYROLLCATEGORY { get; set; }
        //public string Forced_by_UID { get; set; }
        //public string Forced_Date { get; set; }

        public int BILL_ID { get; set; }
        public string BILLDATE { get; set; }
        public string EMPLOYEENO { get; set; }
        public string EMPLOYEENAME { get; set; }
        public string SUB_NO { get; set; }
        public string SUB_DESC { get; set; }
        public string TOTALAMOUNT { get; set; }
        public string BUSINESSCHARGES { get; set; }
        public string PERSONALCHARGES { get; set; }
        public string DEDUCTIBLEAMOUNT { get; set; }
        public string COSTCENTER { get; set; }
        public string COSTCENTERCODE { get; set; }
        public string DEPARTMENT { get; set; }
        public string PAYROLLCATEGORY { get; set; }
        public string BillStatus { get; set; }
        public string Company { get; set; }
        public string PROVIDERNAME { get; set; }
        public string Forced_by_UID { get; set; }
        public string Forced_Date { get; set; }
    }
}
