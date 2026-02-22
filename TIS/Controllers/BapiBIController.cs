// Decompiled with JetBrains decompiler
// Type: TIS.Controllers.BapiBIController
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

using SAPMobile;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading;
using System.Web.Mvc;
using TIS.Filters;
using TIS.Helper;
using TIS.Models;

namespace TIS.Controllers
{
    [RoleAuthorize(Roles.Administrator, Roles.SuperAdmin, Roles.Employee)]
    public class BapiBIController : Controller
  {
    public ActionResult Index() => (ActionResult) this.View();

    public static bool UpdateEmployee()
    {
      bool flag = false;
      SAPProxyMobile sapProxyMobile1 = new SAPProxyMobile();
      SAPProxyMobile sapProxyMobile2 = new SAPProxyMobile(ConnectionSettings.BAPIConnectionString);
      ZHR_EMP_INFOTable Et_Emp_Info = new ZHR_EMP_INFOTable();
      ZHR_EMP_INFO zhrEmpInfo = new ZHR_EMP_INFO();
      try
      {
        sapProxyMobile2.Zbapi_Get_Employee_Details(ref Et_Emp_Info);
        DataTable dataTable = new DataTable();
        DataTable adoDataTable = Et_Emp_Info.ToADODataTable();
        char[] chArray = new char[1]{ '\'' };
        foreach (DataRow row in (InternalDataCollectionBase) adoDataTable.Rows)
        {
          int int32_1 = Convert.ToInt32(row["Pernr"]);
          string str1 = row["Ename"].ToString();
          string str2 = row["Usrid"].ToString();
          string str3 = row["Orgid"].ToString();
          string str4 = row["Dept_Name"].ToString();
          int int32_2 = Convert.ToInt32(row["Manager_No"]);
          string str5 = row["Costcenter"].ToString();
          string str6 = str2 + "@equate.com";
          string[] strArray = str1.Split(chArray);
          string str7 = "";
          for (int index = 0; index < strArray.Length; ++index)
            str7 = str7 + strArray[index] + " ";
          if (DB.GetData(string.Format("select * from tblUser where Uid={0}", (object) int32_1)) == null)
          {
            DB.ExecuteNonQuery(string.Format("insert into tblUser\r\n                    (Uid, name, username, password, ManagerID, OrgID, Org, email, description, SecManagerID, OrManagerID, CostCenter) \r\n                    values({0},'{1}','{2}','{3}',{4},'{5}','{6}','{7}','{8}',{9}, '{10}', '{11}'  )", (object) int32_1, (object) str7, (object) str2, (object) "", (object) int32_2, (object) str3, (object) str4, (object) str6, (object) "", (object) 0, (object) 0, (object) str5));
            DB.ExecuteNonQuery(string.Format("insert into tblUserRole(Uid,Role_ID) values({0},{1})", (object) int32_1, (object) 1));
          }
          else
            DB.ExecuteNonQuery(string.Format("update tblUser set ManagerID={0},Org='{2}',name='{3}',OrgID='{4}' where Uid={1}", (object) int32_2, (object) int32_1, (object) str4, (object) str7, (object) str3));
        }
        BapiBIController.UpdateContractor();
        flag = true;
      }
      catch
      {
      }
      return flag;
    }

    private static void UpdateContractor()
    {
      try
      {
        DataSet data = DB.GetData("select name+' '+surname as EmpName,EMPUSERID as UID,Dept,TITLE from  View_tblEQL WHERE EMPNO = '' OR EMPNO IS NULL", ConnectionSettings.ContractorConnectionString);
        if (data == null)
          return;
        foreach (DataRow row in (InternalDataCollectionBase) data.Tables[0].Rows)
        {
          string str1 = row["EmpName"].ToString().Replace("'", "");
          string str2 = row["UID"].ToString();
          string str3 = row["Dept"].ToString().Replace("'", "");
          string str4 = row["TITLE"].ToString().Replace("'", "");
          if (DB.GetData(string.Format("select * from tblUser where Username='{0}'", (object) str2)) == null)
          {
            long num = 123;
            DB.ExecuteNonQuery(string.Format("insert into tblUser\r\n                    (Uid, name, username, password, ManagerID, OrgID, Org, email, description, SecManagerID, OrManagerID, CostCenter,Contractor) \r\n                    values({0},'{1}','{2}','{3}',{4},'{5}','{6}','{7}','{8}',{9}, '{10}', '{11}','{12}')", (object) num, (object) str1, (object) str2, (object) "", (object) 0, null, (object) str3, (object) "", (object) str4, (object) 0, (object) 0, (object) "", (object) true));
            DB.ExecuteNonQuery(string.Format("insert into tblUserRole(Uid,Role_ID) values({0},{1})", (object) num, (object) 1));
          }
          else
            DB.ExecuteNonQuery(string.Format("update tblUser set Org='{1}',description='{2}',name='{3}' where Username='{0}'", (object) str2, (object) str3, (object) str4, (object) str1));
        }
      }
      catch (Exception ex)
      {
        throw new Exception(ex.Message);
      }
    }

    public int FlushToDisk(string fileName)
    {
      Thread.Sleep(4000);
      return 0;
    }

    public string ExportToBapi()
    {
      int num1 = 0;
      int num2 = 0;
      int num3 = 0;
      SAPProxyMobile sapProxyMobile1 = new SAPProxyMobile();
      SAPProxyMobile sapProxyMobile2 = new SAPProxyMobile(ConnectionSettings.BAPIConnectionString);
      Decimal I_Amount = 0M;
      DataSet dataSet = DB.ExecuteStoredProcDataSet("[SAP_PostZeroAmountBill]");
      if (dataSet != null)
      {
        DataTable table = dataSet.Tables[0];
        num1 = table.Rows.Count;
        foreach (DataRow row in (InternalDataCollectionBase) table.Rows)
        {
          string str1 = "false";
          try
          {
            BAPIRETURN E_Return = new BAPIRETURN();
            BAPIRETURN1 E_Return1 = new BAPIRETURN1();
            HRHRMM_MSG E_Return2 = new HRHRMM_MSG();
            I_Amount = Convert.ToDecimal(row["DeductibleAmount"]);
            string[] strArray = new string[6]
            {
              "[",
              row["Bill_ID"].ToString(),
              "]",
              row["BillNumber"].ToString(),
              "-",
              null
            };
            DateTime dateTime = Convert.ToDateTime(row["BillDate"]);
            strArray[5] = dateTime.ToString("MMM-yy");
            string I_Assign_No = string.Concat(strArray);
            str1 = "false";
            sapProxyMobile2.Zbapi_Mobile_Bill(I_Amount, I_Assign_No, row["UID"].ToString(), out E_Return, out E_Return1, out E_Return2);
            do
              ;
            while (E_Return.Message == "");
            string message = E_Return.Message;
            if (message.StartsWith("Successfully"))
            {
              DB.ExecuteNonQuery("Update TblBills set Posted='true',LastUpdatedON=getdate() where Bill_ID=" + row["Bill_ID"].ToString() ?? "");
              str1 = "true";
              ++num2;
            }
            message.Replace("'", "''");
            object[] objArray = new object[6]
            {
              (object) row["Bill_ID"].ToString(),
              (object) message,
              null,
              null,
              null,
              null
            };
            dateTime = DateTime.Now;
            objArray[2] = (object) dateTime.ToString();
            objArray[3] = (object) str1;
            objArray[4] = (object) row["UID"].ToString();
            objArray[5] = (object) I_Amount;
            DB.ExecuteNonQuery(string.Format("insert into msg values('{0}','{1}','{2}','{3}','{4}','{5}')", objArray));
          }
          catch (Exception ex)
          {
            ++num3;
            this.AuditTrail(nameof (ExportToBapi), ex.ToString());
            string str2 = ex.ToString().Replace("'", "{");
            DB.ExecuteNonQuery(string.Format("insert into msg values('{0}','{1}','{2}','{3}','{4}','{5}')", (object) row["Bill_ID"].ToString(), (object) str2, (object) DateTime.Now.ToString(), (object) str1, (object) row["UID"].ToString(), (object) I_Amount));
          }
        }
      }
      return num1.ToString() + " No of Records were Selected, out of Which " + (object) num2 + " Were Succesfully posted" + (object) num3 + " Were Failed";
    }

    public void AuditTrail(string Function, string Error)
    {
      SqlParameter[] paramColl = new SqlParameter[2];
      SqlParameter sqlParameter1 = new SqlParameter();
      sqlParameter1.ParameterName = "@Exception";
      sqlParameter1.SqlDbType = SqlDbType.NVarChar;
      sqlParameter1.Value = (object) Error;
      paramColl[0] = sqlParameter1;
      SqlParameter sqlParameter2 = new SqlParameter();
      sqlParameter2.ParameterName = "@FunctionName";
      sqlParameter2.SqlDbType = SqlDbType.NVarChar;
      sqlParameter2.Value = (object) Function;
      paramColl[1] = sqlParameter2;
      DB.ExecuteStoredProc("sp_Exception", paramColl);
    }

    public delegate void MyDelegate();
  }
}
