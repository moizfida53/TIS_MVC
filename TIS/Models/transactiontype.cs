using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using TIS.Helper;

namespace TIS.Models
{
    public class transactiontype
    {
        public int amount { get; set; }
        public string TRANS_TYPE { get; set; }
        public float Call_amount { get; set; }
        public string Call_type { get; set; }
        public float Countrywisesum { get; set; }
        public string OUT_COUNTRY { get; set; }



        public List<transactiontype> Gettranstype()
        {
            List<transactiontype> lst = new List<transactiontype>();

            DataSet ds = DB.ExecuteStoredProcDataSet("gettype");
            DataTable dtItems = ds.Tables[0];
            foreach (DataRow rdr in dtItems.Rows)
            {
                lst.Add(new transactiontype
                {
                    amount = Convert.ToInt32(rdr["amount"]),
                    TRANS_TYPE = rdr["TRANS_TYPE"].ToString(),

                });
            }
            return lst;
        }



        public List<transactiontype> Getcalltype(int Year)
        {
            List<transactiontype> lst = new List<transactiontype>();
            {
                SqlParameter[] spa ={
                                       new SqlParameter(){
                                       ParameterName="@Year",
                                       SqlDbType=SqlDbType.Int,
                                       Value=Year

                                    },

                               };
                DataSet ds = DB.ExecuteStoredProcDataSet("sp_GetDashboardChart4", spa);

                DataTable dtItems = ds.Tables[0];
                foreach (DataRow rdr in dtItems.Rows)
                {
                    lst.Add(new transactiontype
                    {
                        Call_amount = Convert.ToSingle(rdr["Call_amount"]),
                        Call_type = rdr["Call_type"].ToString(),

                    });
                }
                return lst;
            }
        }

        public List<transactiontype> GetINTCNT(int Year, string Call_type)
        {
            List<transactiontype> lst = new List<transactiontype>();
            {
                SqlParameter[] spa ={
                                       new SqlParameter(){
                                       ParameterName="@Year",
                                       SqlDbType=SqlDbType.Int,
                                       Value=Year

                                    },
                                          new SqlParameter(){
                                       ParameterName="@Call_type",
                                       SqlDbType=SqlDbType.NVarChar,
                                       Value=Call_type

                                    },

                               };
                DataSet ds = DB.ExecuteStoredProcDataSet("sp_GetDashboardChart6", spa);

                DataTable dtItems = ds.Tables[0];
                foreach (DataRow rdr in dtItems.Rows)
                {
                    lst.Add(new transactiontype
                    {
                        Countrywisesum = Convert.ToSingle(rdr["Countrywisesum"]),
                        OUT_COUNTRY = rdr["OUT_COUNTRY"].ToString(),

                    });
                }
                return lst;
            }
        }


        public List<transactiontype> getcountrydetailsingrid(int Year)
        {
            List<transactiontype> lst = new List<transactiontype>();
            {
                SqlParameter[] spa ={
                                       new SqlParameter(){
                                       ParameterName="@Year",
                                       SqlDbType=SqlDbType.Int,
                                       Value=Year

                                    },

                               };
                DataSet ds = DB.ExecuteStoredProcDataSet("getdataingrid", spa);

                DataTable dtItems = ds.Tables[0];
                foreach (DataRow rdr in dtItems.Rows)
                {
                    lst.Add(new transactiontype
                    {
                        Countrywisesum = Convert.ToSingle(rdr["Countrywisesum"]),
                        OUT_COUNTRY = rdr["OUT_COUNTRY"].ToString(),

                    });
                }
                return lst;
            }
        }


        public List<transactiontype> getcountrymonthwiseingrid(int Year, int month)
        {
            List<transactiontype> lst = new List<transactiontype>();
            {
                SqlParameter[] spa ={
                                       new SqlParameter(){
                                       ParameterName="@Year",
                                       SqlDbType=SqlDbType.Int,
                                       Value=Year

                                    }, new SqlParameter(){
                                       ParameterName="@month",
                                       SqlDbType=SqlDbType.Int,
                                       Value=month

                                    }

                               };
                DataSet ds = DB.ExecuteStoredProcDataSet("getdataingrid", spa);

                DataTable dtItems = ds.Tables[0];
                foreach (DataRow rdr in dtItems.Rows)
                {
                    lst.Add(new transactiontype
                    {
                        Countrywisesum = Convert.ToSingle(rdr["Countrywisesum"]),
                        OUT_COUNTRY = rdr["OUT_COUNTRY"].ToString(),

                    });
                }
                return lst;
            }
        }

    }
}