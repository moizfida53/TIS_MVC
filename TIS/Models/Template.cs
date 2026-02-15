// Decompiled with JetBrains decompiler
// Type: TIS.Models.Template
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

namespace TIS.Models
{
  public class Template
  {
    public int Id { get; set; }

    public int CountryId { get; set; }

    public int TemplateId { get; set; }

    public string TemplateName { get; set; }

    public string CountryName { get; set; }

    public string TemplateText { get; set; }

    public string EmailFrom { get; set; }

    public string EmailBCC { get; set; }

    public string Subject { get; set; }
  }
}
