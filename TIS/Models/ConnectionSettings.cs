// Decompiled with JetBrains decompiler
// Type: TIS.Models.ConnectionSettings
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

using System;
using System.Configuration;
using System.Data;
using TIS.Helper;

namespace TIS.Models
{
  public class ConnectionSettings
  {
    private static string _AdminID;
    private static string _AdminPwd;
    private static string _DBConnectionString = "";
    private static string _BAPIConnectionString = "";
    private static string _EPABXConnectionString;
    private static string _ORACLEConnectionString;
    private static string _ContractorConnectionString;
    private static string _LDAPPath;
    private static string _MOCConnectionString = "";
    private static int _MOCDirect;
    private static DataRow drConfig;

    public static string AdminEmail => ConnectionSettings.drConfig != null ? ConnectionSettings.drConfig[nameof (AdminEmail)].ToString() : "";

    public static string AdminID
    {
      get
      {
        if (ConnectionSettings._AdminID == "")
          ConnectionSettings.FillSettings();
        return ConnectionSettings._AdminID;
      }
    }

    public static string SupervGrade => ConnectionSettings.drConfig != null ? ConnectionSettings.drConfig["SuperGrade"].ToString() : "";

    public static bool AllowWaiver => ConnectionSettings.drConfig != null && Convert.ToBoolean(ConnectionSettings.drConfig[nameof (AllowWaiver)]);

    public static bool AllowTrainForceBill => ConnectionSettings.drConfig != null && Convert.ToBoolean(ConnectionSettings.drConfig[nameof (AllowTrainForceBill)]);

    public static string AdminPwd
    {
      get
      {
        if (ConnectionSettings._AdminPwd == "")
          ConnectionSettings.FillSettings();
        return ConnectionSettings._AdminPwd;
      }
    }

    public static string DBConnectionString
    {
      get
      {
        if (ConnectionSettings._DBConnectionString == "")
          ConnectionSettings.FillSettings();
        return ConnectionSettings._DBConnectionString;
      }
    }

    public static string BAPIConnectionString
    {
      get
      {
        if (ConnectionSettings._BAPIConnectionString == "")
          ConnectionSettings.FillSettings();
        return ConnectionSettings._BAPIConnectionString;
      }
    }

    public static string ContractorConnectionString
    {
      get
      {
        if (ConnectionSettings._ContractorConnectionString == "")
          ConnectionSettings.FillSettings();
        return ConnectionSettings._ContractorConnectionString;
      }
    }

    public static string ORACLEConnectionString
    {
      get
      {
        if (ConnectionSettings._ORACLEConnectionString == "")
          ConnectionSettings.FillSettings();
        return ConnectionSettings._ORACLEConnectionString;
      }
    }

    public static int EmpReminder => ConnectionSettings.drConfig != null ? Convert.ToInt32(ConnectionSettings.drConfig[nameof (EmpReminder)]) : -1;

    public static int ForceBillReminder => ConnectionSettings.drConfig != null ? Convert.ToInt32(ConnectionSettings.drConfig[nameof (ForceBillReminder)]) : -1;

    public static int ManagerComplaintReminder => ConnectionSettings.drConfig != null ? Convert.ToInt32(ConnectionSettings.drConfig["MgrComplaintReminder"]) : -1;

    public static string EPABXConnectionString
    {
      get
      {
        if (ConnectionSettings._EPABXConnectionString == "")
          ConnectionSettings.FillSettings();
        return ConnectionSettings._EPABXConnectionString;
      }
    }

    public static int GSMReminder => ConnectionSettings.drConfig != null ? Convert.ToInt32(ConnectionSettings.drConfig[nameof (GSMReminder)]) : -1;

    public static bool HidePersonalCalls => ConnectionSettings.drConfig != null && Convert.ToBoolean(ConnectionSettings.drConfig[nameof (HidePersonalCalls)]);

    public static string HostUrl => ConnectionSettings.drConfig != null ? ConnectionSettings.drConfig[nameof (HostUrl)].ToString() : "";

    public static int HrReminder => ConnectionSettings.drConfig != null ? Convert.ToInt32(ConnectionSettings.drConfig[nameof (HrReminder)]) : -1;

    public static string LDAPPath
    {
      get
      {
        if (ConnectionSettings._LDAPPath == "")
          ConnectionSettings.FillSettings();
        return ConnectionSettings._LDAPPath;
      }
    }

    public static int LMReminder => ConnectionSettings.drConfig != null ? Convert.ToInt32(ConnectionSettings.drConfig[nameof (LMReminder)]) : -1;

    public static string MOCConnectionString
    {
      get
      {
        if (ConnectionSettings._MOCConnectionString == "")
          ConnectionSettings.FillSettings();
        return ConnectionSettings._MOCConnectionString;
      }
    }

    public static int MOCDirect
    {
      get
      {
        if (ConnectionSettings._MOCDirect == -1)
          ConnectionSettings.FillSettings();
        return ConnectionSettings._MOCDirect;
      }
    }

    public static bool NotSendMail => ConnectionSettings.drConfig != null && Convert.ToBoolean(ConnectionSettings.drConfig[nameof (NotSendMail)]);

    public static bool EnableGrade => ConnectionSettings.drConfig != null && Convert.ToBoolean(ConnectionSettings.drConfig[nameof (EnableGrade)]);

    public static bool NotSendSMS => ConnectionSettings.drConfig != null && Convert.ToBoolean(ConnectionSettings.drConfig[nameof (NotSendSMS)]);

    public static bool SkipGMApproval => ConnectionSettings.drConfig != null && Convert.ToBoolean(ConnectionSettings.drConfig[nameof (SkipGMApproval)]);

    public static string SMTPSettings => ConnectionSettings.drConfig != null ? ConnectionSettings.drConfig[nameof (SMTPSettings)].ToString() : "";

    public static bool EnableDiscrepancy => ConnectionSettings.drConfig != null && Convert.ToBoolean(ConnectionSettings.drConfig[nameof (EnableDiscrepancy)]);

    public static bool DedBussCharges => ConnectionSettings.drConfig != null && Convert.ToBoolean(ConnectionSettings.drConfig["DedBussinessCharges"]);

    public static bool DeleteBut => ConnectionSettings.drConfig != null && Convert.ToBoolean(ConnectionSettings.drConfig[nameof (DeleteBut)]);

    public static bool ReRoute => ConnectionSettings.drConfig != null && Convert.ToBoolean(ConnectionSettings.drConfig[nameof (ReRoute)]);

    public static bool ZeroAsUnlimited => ConnectionSettings.drConfig != null && Convert.ToBoolean(ConnectionSettings.drConfig["BusinessZeroAsUnlimited"]);

    public static bool SkipApprovalOnBussChargesZero => ConnectionSettings.drConfig != null && Convert.ToBoolean(ConnectionSettings.drConfig["SkipApprovalBuss"]);

    static ConnectionSettings()
    {
      ConnectionSettings._LDAPPath = "";
      ConnectionSettings._AdminID = "";
      ConnectionSettings._AdminPwd = "";
      ConnectionSettings.drConfig = (DataRow) null;
      ConnectionSettings._MOCDirect = -1;
      ConnectionSettings._EPABXConnectionString = "";
    }

    public static void FillSettings()
    {
      ConnectionSettings._BAPIConnectionString = string.Format(ConfigurationManager.ConnectionStrings["BAPIConnectionString"].ConnectionString);
      try
      {
        ConnectionSettings._MOCDirect = Convert.ToInt32(ConfigurationManager.AppSettings["MOCDirect"]);
      }
      catch
      {
        ConnectionSettings._MOCDirect = 0;
      }
      DataSet data = DB.GetData("select top 1 * from tblConfiguration");
      if (data == null)
        return;
      ConnectionSettings.drConfig = data.Tables[0].Rows[0];
    }
  }
}
