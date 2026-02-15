// Decompiled with JetBrains decompiler
// Type: TIS.Models.Users
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

namespace TIS.Models
{
    public class Users
    {
        public string uid { get; set; }

        public string name { get; set; }

        public string managerId { get; set; }

        public string managerName { get; set; }

        public string managerEmail { get; set; }

        public string Roleid { get; set; }

        public string Username { get; set; }

        public string AdminRoleId { get; set; }

        public int CountryID { get; set; }

        public string Action { get; set; }

        public bool? IsShowHomePage { get; set; }

        public Users() => this.Action = "0";

        public int? CompanyID { get; set; }
    }
}
