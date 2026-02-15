// Decompiled with JetBrains decompiler
// Type: TIS.Models.ArchiveBills
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

namespace TIS.Models
{
    public class ArchiveBills
    {
        public int BillId { get; set; }

        public string Mobile { get; set; }

        public string Provider { get; set; }

        public string BillDate { get; set; }

        public string EmployeeName { get; set; }

        public string Deductable { get; set; }

        public string Status { get; set; }

        public string LastUpdate { get; set; }

        public string TotalAmount { get; set; }

        public string Currency { get; set; }
    }
}
