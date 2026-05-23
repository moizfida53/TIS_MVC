using System;
using System.Data;
using System.Data.OleDb;
using System.Data.SqlClient;
using TIS.Models;

namespace TIS.Helper
{
    public class DB
    {
        private static string _activeDBConn = DB.SetDBConn();

        //private static string SetDBConn() => CommonLogic.ConnectionString("ConnStr");
        private static string SetDBConn() => CommonLogic.ConnectionString("SqlServerConnection");

        public static string GetDBConn() => DB._activeDBConn;

        public static SqlConnection dbConn() => new SqlConnection(DB.GetDBConn());

        public static int ExecuteStoredProc(string StoredProcName) => DB.ExecuteStoredProc(StoredProcName, (SqlParameter[])null);

        public static int ExecuteStoredProc(string StoredProcName, SqlParameter[] paramColl)
        {
            int num = -1;
            using (SqlConnection connection = DB.dbConn())
            {
                connection.Open();
                using (SqlCommand sqlCommand = new SqlCommand(StoredProcName, connection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.CommandTimeout = 0;
                    if (paramColl != null)
                    {
                        foreach (SqlParameter sqlParameter in paramColl)
                            sqlCommand.Parameters.Add(sqlParameter);
                    }

                    num = sqlCommand.ExecuteNonQuery();
                    return num;
                }
            }
        }

        public static int ExecuteSpRetVal(string StoredProcName, SqlParameter[] paramColl)
        {
            int num = 0;
            using (SqlConnection connection = DB.dbConn())
            {
                connection.Open();
                using (SqlCommand sqlCommand = new SqlCommand(StoredProcName, connection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.CommandTimeout = 0;
                    if (paramColl != null)
                    {
                        foreach (SqlParameter sqlParameter in paramColl)
                            sqlCommand.Parameters.Add(sqlParameter);
                    }

                    SqlParameter sqlParameter1 = sqlCommand.Parameters.Add("RetVal", SqlDbType.Int);
                    sqlParameter1.Direction = ParameterDirection.ReturnValue;

                    sqlCommand.ExecuteNonQuery();
                    num = (int)sqlParameter1.Value;
                    return num;
                }
            }
        }

        public static object ExecuteStoredProcScaler(string StoredProcName, SqlParameter[] paramColl)
        {
            object obj = null;
            using (SqlConnection connection = DB.dbConn())
            {
                connection.Open();
                using (SqlCommand sqlCommand = new SqlCommand(StoredProcName, connection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.CommandTimeout = 0;
                    foreach (SqlParameter sqlParameter in paramColl)
                        sqlCommand.Parameters.Add(sqlParameter);

                    obj = sqlCommand.ExecuteScalar();
                    return obj;
                }
            }
        }

        public static DataSet ExecuteStoredProcDataSet(string StoredProcName) => DB.ExecuteStoredProcDataSet(StoredProcName, (SqlParameter[])null);

        public static DataSet ExecuteStoredProcDataSet(string StoredProcName, SqlParameter[] paramColl)
        {
            using (SqlConnection connection = DB.dbConn())
            {
                connection.Open();
                using (SqlCommand selectCommand = new SqlCommand(StoredProcName, connection))
                {
                    selectCommand.CommandType = CommandType.StoredProcedure;
                    selectCommand.CommandTimeout = 0;
                    if (paramColl != null)
                    {
                        foreach (SqlParameter sqlParameter in paramColl)
                            selectCommand.Parameters.Add(sqlParameter);
                    }

                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter(selectCommand);
                    DataSet dataSet = new DataSet();
                    sqlDataAdapter.Fill(dataSet);
                    return dataSet;
                }
            }
        }

        public static SqlParameter SetValueDecimal(SqlParameter sparam, object value)
        {
            if (value == null)
                sparam.Value = DBNull.Value;
            else
                sparam.Value = Convert.ToDecimal(value.ToString());
            return sparam;
        }

        public static SqlParameter SetValueBool(SqlParameter sparam, object value)
        {
            if (value == null)
                sparam.Value = DBNull.Value;
            else
                sparam.Value = Convert.ToBoolean(value.ToString());
            return sparam;
        }

        public static SqlParameter SetValueSmallInt(SqlParameter sparam, object value)
        {
            if (value == null)
                sparam.Value = DBNull.Value;
            else
                sparam.Value = Convert.ToInt16(value.ToString());
            return sparam;
        }

        public static string GetValue(string str)
        {
            string str1 = "";
            DataSet data = DB.GetData(str);
            if (data != null)
                str1 = data.Tables[0].Rows[0][0].ToString();
            return str1;
        }

        public static void ExecuteNonQuery(string sql)
        {
            try
            {
                SqlConnection connection = new SqlConnection(DB.GetDBConn());
                connection.Open();
                sql = sql.Replace("\r\n", " ");
                SqlCommand sqlCommand = new SqlCommand(sql, connection);
                sqlCommand.CommandTimeout = 0;
                sqlCommand.ExecuteNonQuery();
                connection.Close();
            }
            catch (Exception ex)
            {
                // Log exception if needed
            }
        }

        public static DataSet GetData(string sql)
        {
            DataSet dataSet = new DataSet();
            try
            {
                SqlConnection selectConnection = new SqlConnection(DB.GetDBConn());
                selectConnection.Open();
                sql = sql.Replace("\r\n", " ");
                new SqlDataAdapter(sql, selectConnection).Fill(dataSet);
                if (selectConnection.State == ConnectionState.Open)
                    selectConnection.Close();
                if (dataSet.Tables[0].Rows.Count == 0)
                    return null;
            }
            catch (Exception ex)
            {
                // Log exception if needed
                return null;
            }
            return dataSet;
        }

        public static DataSet GetData(string sql, string connString)
        {
            DataSet dataSet = new DataSet();
            try
            {
                SqlConnection selectConnection = new SqlConnection(connString);
                selectConnection.Open();
                sql = sql.Replace("\r\n", " ");
                new SqlDataAdapter(sql, selectConnection).Fill(dataSet);
                if (selectConnection.State == ConnectionState.Open)
                    selectConnection.Close();
                if (dataSet.Tables[0].Rows.Count == 0)
                    return null;
            }
            catch (Exception ex)
            {
                // Log exception if needed
                return null;
            }
            return dataSet;
        }

        public static int GetNewID(string tableName, string fieldName)
        {
            int newId = 1;
            OleDbConnection connection = new OleDbConnection(ConnectionSettings.DBConnectionString);
            connection.Open();
            OleDbDataReader oleDbDataReader = new OleDbCommand(string.Format("select max({0}) from {1}", fieldName, tableName), connection).ExecuteReader();
            while (oleDbDataReader.Read())
            {
                if (oleDbDataReader[0] != DBNull.Value)
                    newId = Convert.ToInt32(oleDbDataReader[0]) + 1;
            }
            connection.Close();
            return newId;
        }

        public static SqlParameter SetValueTinyInt(SqlParameter sparam, object value)
        {
            if (value == null)
                sparam.Value = DBNull.Value;
            else
                sparam.Value = Convert.ToByte(Convert.ToInt32(value));
            return sparam;
        }

        public static SqlParameter SetValueInt(SqlParameter sparam, object value)
        {
            if (value == null)
                sparam.Value = DBNull.Value;
            else
                sparam.Value = Convert.ToInt32(value.ToString());
            return sparam;
        }

        public static SqlParameter SetValueBigInt(SqlParameter sparam, object value)
        {
            if (value == null)
                sparam.Value = DBNull.Value;
            else
                sparam.Value = Convert.ToInt64(value.ToString());
            return sparam;
        }

        public static SqlParameter SetValueDateTime(SqlParameter sparam, object value)
        {
            if (value == null)
                sparam.Value = DBNull.Value;
            else
                sparam.Value = DateTime.Parse(value.ToString());
            return sparam;
        }

        public static SqlParameter SetValueGUID(SqlParameter sparam, object value)
        {
            if (value == null)
                sparam.Value = DBNull.Value;
            else
                sparam.Value = (Guid)value;
            return sparam;
        }

        public static SqlParameter SetValue(SqlParameter sparam, object value)
        {
            if (value == null)
                sparam.Value = DBNull.Value;
            else
                sparam.Value = value;
            return sparam;
        }

        public static SqlParameter[] CreateSQLParameterArray_Obselete(SqlParameter[] spa, SqlParameter sp)
        {
            Array.Resize(ref spa, spa.Length + 1);
            spa[spa.Length - 1] = sp;
            return spa;
        }

        public static string GetNewGUID() => Guid.NewGuid().ToString();
    }
}