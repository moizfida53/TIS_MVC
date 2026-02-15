// Decompiled with JetBrains decompiler
// Type: TIS.Models.Telephone
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

using System;

namespace TIS.Models
{
    public class Telephone
    {
        public int ID { get; set; }

        public string SUBNO { get; set; }

        public int PROVIDER { get; set; }

        public string PROVIDERNAME { get; set; }

        public string DESCRIPTION { get; set; }

        public string ACCOUNTNO { get; set; }

        public bool ISASSIGNED { get; set; }

        public bool GENERALPHONE { get; set; }

        public string TYPE { get; set; }

        public int LINETYPE { get; set; }
        public string LINETYPENAME { get; set; }

        public DateTime? ContractExpiry { get; set; }
    }
}
