Go
IF Not EXISTS(SELECT 1 FROM sys.columns 
          WHERE Name = N'CompanyID'
          AND Object_ID = Object_ID(N'tblUser'))
BEGIN
    -- Column Exists
	alter table tblUser add CompanyID int
END

Go
IF (Not EXISTS (SELECT * 
                 FROM INFORMATION_SCHEMA.TABLES 
                 WHERE TABLE_TYPE='BASE TABLE' 
                 AND  TABLE_NAME = 'tblCompany'))
BEGIN
	CREATE TABLE [dbo].[tblCompany](
		[Id] [int] IDENTITY(1,1) NOT NULL,
		[CompanyName] [nvarchar](500) NULL,
		[Deleted] [bit] NULL,
	 CONSTRAINT [PK_tblCompany] PRIMARY KEY CLUSTERED 
	(
		[Id] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
	) ON [PRIMARY]
END

GO
ALTER PROCEDURE [dbo].[sp_AddEmployee]

@Count int,
@NAME varchar(max),
@EMPLOYEENO varchar(max),
@CCNO varchar(max)=null,
@EMAIL varchar(max),
@USERNAME varchar(max)=null,
@ORG varchar(max)=null,
@DESCRIPTION varchar(max)=null,
@MANAGERID int=null,
@GRADE varchar(max)=null,
@EXTENSION varchar(max)=null,
@PAYROLL varchar(max)=null,
@ROLEID int=null,
@COUNTRYID int=null,
@UserUid int,
@CompanyID int=null
AS
BEGIN

 IF(@Count=0)
 BEGIN
	 insert into [vwTblUser_tblMaster]([FORM_ID],[ACTION_NAME],[RESULT],[USERID]) 
	 values (1, 'Add New Employee', 'Success',( select Uid = @UserUid ))

	 insert into tblUser(NAME,EMPLOYEENO,COSTCENTER,EMAIL,USERNAME,ORG,DESCRIPTION,MANAGERID,GRADE,EXTENSION,PAYROLLCATEGORY,ISCOSTCENTER,CompanyID)
	 values(@NAME,@EMPLOYEENO,@CCNO,@EMAIL,@USERNAME,@ORG,@DESCRIPTION,@MANAGERID,@GRADE,@EXTENSION,@PAYROLL,0,@CompanyID)

	 insert into vwTBLDetails_TBLMaster (SNO,AT_ID,NEW_VALUE,OLD_VALUE,FIELD_NAME) values (1, (select ID from TBL_AT_MASTER 
	 where date1 = (select max(date1) from TBL_AT_MASTER) ),(select UID from tblUser where Name=@Name and EMPLOYEENO=@EMPLOYEENO ), '','Add Employee')

 END
 
	insert into tblUserRole(Uid,Role_id,COUNTRYID)values((select UID from tblUser where EMPLOYEENO=@EMPLOYEENO),@ROLEID,@COUNTRYID)
 
END

GO
/****** Object:  StoredProcedure [dbo].[sp_UpdateEmployee]    Script Date: 10-10-2023 01:58:26 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_UpdateEmployee]

@Count int,
@UID int,
@NAME varchar(max),
@EMPLOYEENO varchar(max),
@CCNO varchar(max)=null,
@EMAIL varchar(max),
@USERNAME varchar(max)=null,
@ORG varchar(max)=null,
@DESCRIPTION varchar(max)=null,
@MANAGERID int=null,
@GRADE varchar(max)=null,
@EXTENSION varchar(max)=null,
@PAYROLL varchar(max)=null,
@ROLEID int=null,
@COUNTRYID int=null,
@UserUid int,
@CompanyID int=null
AS
BEGIN
 if(@Count=0)
 BEGIN
    insert into [vwTblUser_tblMaster]([FORM_ID],[ACTION_NAME],[RESULT],[USERID]) 
	values (1, 'Update Employee', 'Success',( select Uid = @UserUid ))

	update tblUser set NAME=@NAME,EMPLOYEENO=@EMPLOYEENO,COSTCENTER=@CCNO,EMAIL=@EMAIL,USERNAME=@USERNAME,ORG=@ORG,
	DESCRIPTION=@DESCRIPTION,MANAGERID=@MANAGERID,GRADE=@GRADE,EXTENSION=@EXTENSION,PAYROLLCATEGORY=@PAYROLL,CompanyID=@CompanyID
	where UID=@UID
 END
 
 delete from tblUserRole where Uid=@UID
 insert into tblUserRole(Uid,Role_ID,COUNTRYID) values (@UID,@ROLEID,@COUNTRYID)
 
END

GO


ALTER PROCEDURE [dbo].[sp_GetEmployee] 
@Username varchar(50)
AS
BEGIN
	SET NOCOUNT ON;
	Declare @Role int=0
	Declare @Countryid int=0
	Declare @Uid int=0

Select @Uid=UID from tbluser where username=@Username
SELECT @Role=Role_Id from tblUserrole where uid=@Uid
SELECT @Countryid=CountryID from tbluserrole where uid=@Uid

if(@Role=8)
begin
	select 
	a.UID,a.NAME,a.EMPLOYEENO,a.EMAIL,a.USERNAME,a.ORG,a.DESCRIPTION,a.GRADE,a.MANAGERID,
	b.NAME as MANAGER,
	a.EXTENSION,a.PAYROLLCATEGORY,a.COSTCENTER, a.ISCOSTCENTER, 
	ur.Role_ID as RID, 
	r.RoleName as ROLENAME, 
	c.COUNTRYID, c.COUNTRYNAME ,a.CompanyID, cmp.CompanyName as Company
	from tbluser a
	left join tbluser b on b.uid=a.MANAGERID
	inner join tblUserRole ur on ur.Uid=a.UID
	inner join tblRole r on r.Role_ID=ur.Role_ID
	inner join TBLCOUNTRY c on c.COUNTRYID=ur.COUNTRYID 
	left join tblCompany cmp on cmp.id= a.companyid
	order by a.EMPLOYEENO asc


	Select Role_ID,RoleName from tblRole

	Select COUNTRYID,COUNTRYNAME, CURRENCY, COUNTRYCODE, SHAYACODE, EXCHANGERATE from TBLCOUNTRY 

	Select UID,NAME,EMPLOYEENO from TBLUSER WHERE ISCOSTCENTER='TRUE'

	select ID,CompanyName from tblCompany where DELETED!=1
end
else
begin
	select 
	a.UID,a.NAME,a.EMPLOYEENO,a.EMAIL,a.USERNAME,a.ORG,a.DESCRIPTION,a.GRADE,a.MANAGERID,
	b.NAME as MANAGER,
	a.EXTENSION,a.PAYROLLCATEGORY,a.COSTCENTER, a.ISCOSTCENTER, 
	ur.Role_ID as RID, 
	r.RoleName as ROLENAME, 
	c.COUNTRYID, c.COUNTRYNAME ,a.CompanyID, cmp.CompanyName as Company
	from tbluser a
	inner join tbluser b on b.uid=a.MANAGERID
	inner join tblUserRole ur on ur.Uid=a.UID
	inner join tblRole r on r.Role_ID=ur.Role_ID
	inner join TBLCOUNTRY c on c.COUNTRYID=ur.COUNTRYID 
	left join tblCompany cmp on cmp.id= a.companyid
	where ur.COUNTRYID = @Countryid 
	order by a.EMPLOYEENO asc


	Select Role_ID,RoleName from tblRole where Role_ID<>8

	Select COUNTRYID,COUNTRYNAME, CURRENCY, COUNTRYCODE, SHAYACODE, EXCHANGERATE from TBLCOUNTRY where COUNTRYID=@Countryid

	Select UID,NAME,EMPLOYEENO from TBLUSER WHERE ISCOSTCENTER='TRUE'

	select ID,CompanyName from tblCompany where DELETED!=1
end


--,tbluser b,tbluserrole c,tblrole d,TBLCOUNTRY e 
--where a.MANAGERID=b.UID and a.UID=c.UID and c.Role_ID=d.Role_ID and c.COUNTRYID=e.COUNTRYID


                      
END

GO
Alter VIEW [dbo].[VWPENDINGBILLS]
AS
SELECT        dbo.tblBills.BILL_ID, dbo.tblBills.ROUTEMANAGER, dbo.tblBills.BILLDATE, dbo.tblBills.UID, dbo.tblBills.TOTALAMOUNT, dbo.tblBills.BUSINESSCHARGES, dbo.tblBills.PERSONALCHARGES, 
                         dbo.tblBills.REIMBURSEMENTAMOUNT, dbo.tblBills.STATUS, dbo.tblBills.LASTUPDATEDON, dbo.tblUser.NAME AS EMPLOYEENAME, dbo.tblSubscription_Number.SUB_NO, 
                         dbo.tblSubscription_Number.MONTHLYLIMIT, dbo.tblStatus.Name AS STATUSNAME, dbo.tblBills.COMMENTS, dbo.tblBills.DEDUCTID, MONTH(dbo.tblBills.BILLDATE) AS BILLMONTH, 
                         YEAR(dbo.tblBills.BILLDATE) AS BILLYEAR, dbo.tblUser.EMAIL AS EMPEMAIL, dbo.tblProvider.Name AS PROVIDERNAME, dbo.tblBills.PROVIDER, dbo.tblBills.SUB_NO_ID, 
                         dbo.tblBills.HRACTIONNEW AS HRACTION, dbo.tblBills.CREATEDON, dbo.tblSubscription_Number.BUSSINESSLIMIT, dbo.tblBills.ISDISCREPANCY, dbo.tblBills.M_BILLID, 
                         dbo.tblSubscription_Number.GENERALPHONE, dbo.tblBills.BUSINESSLIMITCHARGES, dbo.tblBills.PERSONALLIMITCHARGES, dbo.tblBills.POSTED, dbo.tblBills.BILLNUMBER, dbo.tblBills.WAIVERAMOUNT, 
                         dbo.tblBills.WAIVERREJECTION, dbo.tblUser.EMPLOYEENO, dbo.tblUser.PAYROLLCATEGORY, tblUser_2.NAME AS Appr_Manager, tblUser_2.EMPLOYEENO AS AppEID, dbo.tblUser.DESCRIPTION, 
                         dbo.tblUser.GRADE, dbo.tblSubscription_Number.ACCOUNTNO, dbo.tblBills.EXTRAALLOWNCEAMOUNT, dbo.tblUser.PF_NUMBER, dbo.tblUser.COSTCENTER, 
                         dbo.tblBills.TOTALAMOUNT - dbo.tblBills.DEDUCTIBLEAMOUNT AS BussCharged, dbo.tblBills.DEDUCTIBLEAMOUNT, dbo.vw_tbluser3.NAME AS CCNAME, dbo.vw_tbluser3.ORG AS ORG1, 
                         CASE WHEN dbo.tbluser.iscostcenter = 1 AND ltrim(dbo.tblsubscription_number.SUB_DESC) <> '' THEN dbo.tblsubscription_number.SUB_DESC ELSE dbo.tbluser.name END AS empORcostcenter, 
                         dbo.tblUser.ISCOSTCENTER, dbo.vw_tbluser3.EMPLOYEENO AS ccnum, dbo.tblBills.LINEMANAGER, dbo.tblBills.BUSINESSCHARGES + dbo.tblBills.WAIVERAMOUNT AS KCC_BUSINESSCHARGES, 
                         dbo.tblBills.ORG_BILLDATE, tblUser_2.EMAIL AS LMEmail,  tblUser_1.NAME AS LMName, dbo.tblUser.ORG, dbo.tblSubscription_Number.SUB_DESC, dbo.tblUser.MANAGERID, 
                         dbo.tblSubscription_Number.LINETYPE, dbo.TBLCOUNTRY.COUNTRYID, dbo.TBLCOUNTRY.CURRENCY,

						 tblUser_1.NAME as ManagerName,
						 dbo.tblStatus.Name as BillStatus,
						 dbo.tblBills.CREATEDON as DateIdentified,
						 isnull((select case when max(LastUpdatedOn) is not null then 
									FORMAT(max(LastUpdatedOn), 'dd-MM-yyyy hh:mm:ss') else '' end
							from dbo.tblBillLog where dbo.tblBillLog.bill_id=dbo.tblBills.BILL_ID and dbo.tblBillLog.status=2),'') ApprovedDate,
							cmp.CompanyName,tbluser.CompanyID
FROM            dbo.tblBills INNER JOIN
                         dbo.tblUser ON dbo.tblBills.UID = dbo.tblUser.UID INNER JOIN
                         dbo.tblSubscription_Number ON dbo.tblBills.SUB_NO_ID = dbo.tblSubscription_Number.ID INNER JOIN
                         dbo.tblStatus ON dbo.tblBills.STATUS = dbo.tblStatus.ID INNER JOIN
                         dbo.tblProvider ON dbo.tblBills.PROVIDER = dbo.tblProvider.ID INNER JOIN
						
                         dbo.tblUser AS tblUser_2 ON dbo.tblBills.ROUTEMANAGER = tblUser_2.UID INNER JOIN
                         dbo.tblUser AS tblUser_1 ON dbo.tblBills.LINEMANAGER = tblUser_1.UID INNER JOIN
						 dbo.TBLCOUNTRY ON dbo.tblProvider.COUNTRYID = dbo.TBLCOUNTRY.COUNTRYID LEFT OUTER JOIN
                         dbo.vw_tbluser3 ON dbo.tblUser.COSTCENTER = dbo.vw_tbluser3.EMPLOYEENO 
						 left join tblcompany cmp on cmp.id= tbluser.CompanyID 

WHERE        (dbo.tblBills.TOTALAMOUNT <> 0)

Go
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetSalesReportFilterData')
begin
	DROP PROCEDURE sp_GetSalesReportFilterData
end
Go
Create PROCEDURE [dbo].[sp_GetSalesReportFilterData] 
AS
BEGIN
	select ID,CompanyName from tblCompany where DELETED!=1
end

Go
IF Not EXISTS(SELECT 1 FROM sys.columns 
          WHERE Name = N'ContractExpiry'
          AND Object_ID = Object_ID(N'tblSubscription_Number'))
BEGIN
    -- Column Exists
	alter table tblSubscription_Number add ContractExpiry datetime
END

GO
ALTER PROCEDURE [dbo].[sp_GetNumber]
@RoleID int,
@CountryID int,
@Command int
	
AS
	SELECT  dbo.tblSubscription_Number.ID, dbo.tblSubscription_Number.SUB_NO,dbo.tblSubscription_Number.GENERALPHONE,dbo.tblSubscription_Number.SUB_DESC, 
                      dbo.tblSubscription_Number.SUB_TYPE, dbo.tblProvider.Name AS SUBS_TYPE, dbo.tblSubscription_Number.LINETYPE, 
                       dbo.tblSubscription_Number.BUSSINESSTYPE,dbo.tblSubscription_Number.ACCOUNTNO, dbo.TBLCOUNTRY.COUNTRYID,
                      CASE WHEN (dbo.tblAssignNo.EndDate >= GETDATE()) AND 
							    (dbo.tblAssignNo.StartDate < GETDATE()) THEN 'TRUE' 
																		ELSE 'FALSE' 
																		END AS ISASSIGNED,
					dbo.tblSubscription_Number.ContractExpiry
    FROM dbo.TBLCOUNTRY INNER JOIN
	dbo.tblProvider ON dbo.TBLCOUNTRY.COUNTRYID=dbo.tblProvider.COUNTRYID RIGHT OUTER JOIN
	dbo.tblSubscription_Number ON dbo.tblProvider.ID=dbo.tblSubscription_Number.SUB_TYPE LEFT OUTER JOIN
	dbo.tblAssignNo ON dbo.tblSubscription_Number.ID = dbo.tblAssignNo.Subs_no_ID where  @CountryID=dbo.tblcountry.COUNTRYID or @RoleID=8
	
	
IF(@Command=2)
BEGIN


	SELECT  dbo.tblAssignNo.ID, dbo.tblAssignNo.Subs_no_ID, dbo.tblAssignNo.UID, dbo.tblAssignNo.StartDate, dbo.tblAssignNo.EndDate, dbo.tblUser.NAME, 
                      dbo.tblSubscription_Number.SUB_NO, dbo.tblSubscription_Number.MONTHLYLIMIT, dbo.tblSubscription_Number.BUSSINESSLIMIT, dbo.tblLineStatus.LineStatus, 
                      dbo.tblLineStatus.ID AS LineStatusID,dbo.tblSubscription_Number.SUB_DESC, dbo.tblUser.EMPLOYEENO,dbo.tblUserRole.COUNTRYID, dbo.tblAssignNo.EXCEPTION
					  ,dbo.tblSubscription_Number.ContractExpiry
     FROM   dbo.tblAssignNo INNER JOIN
                      dbo.tblSubscription_Number ON dbo.tblAssignNo.Subs_no_ID = dbo.tblSubscription_Number.ID INNER JOIN
                      dbo.tblUser ON dbo.tblAssignNo.UID = dbo.tblUser.UID INNER JOIN
                      dbo.tblLineStatus ON dbo.tblSubscription_Number.LINESTATUS = dbo.tblLineStatus.ID INNER JOIN
                      dbo.tblUserRole ON dbo.tblUser.UID = dbo.tblUserRole.Uid where  @CountryID=dbo.tblUserRole.COUNTRYID or @RoleID=8
	
END
RETURN

GO
ALTER PROCEDURE [dbo].[sp_AddTelephone]

@SUBNO varchar(max),
@PROVIDER int,
@DESCRIPTION varchar(max)=null,
@ACCOUNTNO varchar(max)=null,
@TYPE varchar(max)=null,
@LINETYPE int=null,
@ContractExpiry varchar(300)=null

AS
BEGIN
 
	insert into tblSubscription_Number(SUB_NO,SUB_TYPE,SUB_DESC,ACCOUNTNO,BUSSINESSTYPE,LINETYPE,ContractExpiry)values(@SUBNO,@PROVIDER,@DESCRIPTION,@ACCOUNTNO,@TYPE,@LINETYPE,@ContractExpiry)
	insert into [vwTblUser_tblMaster]([FORM_ID],[ACTION_NAME],[RESULT],[USERID]) values (2, 'Add Telephone', 'Success',(select Id from tblSubscription_Number where SUB_NO=@SUBNO))

END

GO
ALTER PROCEDURE [dbo].[sp_UpdateTelephone]

@ID int,
@SUBNO varchar(max),
@PROVIDER int,
@DESCRIPTION varchar(max)=null,
@ACCOUNTNO varchar(max)=null,
@TYPE varchar(max)=null,
@LINETYPE int=null,
@ContractExpiry varchar(500)=null

AS
BEGIN
 
insert into [vwTblUser_tblMaster]([FORM_ID],[ACTION_NAME],[RESULT],[USERID]) values (2, 'Update Telephone', 'Success',(select Id from tblSubscription_Number where SUB_NO=@SUBNO)) 
update tblSubscription_Number set SUB_NO=@SUBNO,SUB_TYPE=@PROVIDER,SUB_DESC=@DESCRIPTION,ACCOUNTNO=@ACCOUNTNO,BUSSINESSTYPE=@TYPE,LINETYPE=@LINETYPE,ContractExpiry=@ContractExpiry where ID=@ID

END

GO
ALTER PROCEDURE [dbo].[sp_GetTelData]
@RoleID int,
@CountryID int
	
AS
	SELECT dbo.tblSubscription_Number.ID, dbo.tblSubscription_Number.SUB_NO,dbo.tblSubscription_Number.GENERALPHONE,dbo.tblSubscription_Number.SUB_DESC, 
                      dbo.tblSubscription_Number.SUB_TYPE, dbo.tblProvider.Name AS SUBS_TYPE, dbo.tblSubscription_Number.LINETYPE, 
                       dbo.tblSubscription_Number.BUSSINESSTYPE,dbo.tblSubscription_Number.ACCOUNTNO, dbo.TBLCOUNTRY.COUNTRYID,
                      CASE WHEN (dbo.tblAssignNo.EndDate >= GETDATE()) AND 
							    (dbo.tblAssignNo.StartDate < GETDATE()) THEN 'TRUE' 
																		ELSE 'FALSE' 
																		END AS ISASSIGNED,
					dbo.tblSubscription_Number.ContractExpiry
    FROM dbo.TBLCOUNTRY INNER JOIN
	dbo.tblProvider ON dbo.TBLCOUNTRY.COUNTRYID=dbo.tblProvider.COUNTRYID RIGHT OUTER JOIN
	dbo.tblSubscription_Number ON dbo.tblProvider.ID=dbo.tblSubscription_Number.SUB_TYPE LEFT OUTER JOIN
	dbo.tblAssignNo ON dbo.tblSubscription_Number.ID = dbo.tblAssignNo.Subs_no_ID where  @CountryID=dbo.tblcountry.COUNTRYID OR @RoleID=8
	
	
	
	SELECT  dbo.tblAssignNo.ID, dbo.tblAssignNo.Subs_no_ID, dbo.tblAssignNo.UID, dbo.tblAssignNo.StartDate, dbo.tblAssignNo.EndDate, dbo.tblUser.NAME, 
                      dbo.tblSubscription_Number.SUB_NO, dbo.tblSubscription_Number.MONTHLYLIMIT, dbo.tblSubscription_Number.BUSSINESSLIMIT, dbo.tblLineStatus.LineStatus, 
                      dbo.tblLineStatus.ID AS LineStatusID,dbo.tblSubscription_Number.SUB_DESC, dbo.tblUser.EMPLOYEENO,dbo.tblProvider.COUNTRYID, dbo.tblAssignNo.EXCEPTION
     FROM   dbo.tblAssignNo  INNER JOIN
                      dbo.tblSubscription_Number ON dbo.tblAssignNo.Subs_no_ID = dbo.tblSubscription_Number.ID INNER JOIN
                      dbo.tblUser ON dbo.tblAssignNo.UID = dbo.tblUser.UID INNER JOIN
                      dbo.tblLineStatus ON dbo.tblSubscription_Number.LINESTATUS = dbo.tblLineStatus.ID INNER JOIN
                      dbo.tblProvider ON dbo.tblSubscription_Number.SUB_TYPE = dbo.tblProvider.ID where  @CountryID=dbo.tblProvider.COUNTRYID OR @RoleID=8 
	
	
	
	Select ID,Name, COUNTRYID from tblProvider where @CountryID=COUNTRYID OR @RoleID=8
	

	Select tbluser.UID,tbluser.NAME,tbluser.EMPLOYEENO  
	from tbluser INNER JOIN 
	tblUserRole ON tbluser.uid=tblUserRole.Uid 
	where tblUserRole.COUNTRYID=@CountryID OR @RoleID=8

RETURN

GO

ALTER TRIGGER [dbo].[TBLTRIGGER_Telephone]
ON [dbo].[tblSubscription_Number]
AFTER INSERT, UPDATE

AS 

DECLARE @INS int, @DEL int

SELECT @INS = COUNT(*) FROM INSERTED
SELECT @DEL = COUNT(*) FROM DELETED

IF @INS > 0 AND @DEL > 0 
BEGIN

    -- a record got updated, so log accordingly.
    
   
    
    INSERT INTO TBL_AT_DETAILS ([AT_ID],[SNO],[NEW_VALUE],[OLD_VALUE],[FIELD_NAME]) 
	values ( (select top 1 ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),
	(select top 1 FORM_ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ) ,
	(select top 1 SUB_NO from inserted) , (select top 1 SUB_NO from deleted) , 'SUB NO')

    INSERT INTO TBL_AT_DETAILS ([AT_ID],[SNO],[NEW_VALUE],[OLD_VALUE],[FIELD_NAME]) 
	values ( (select top 1 ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),
	(select top 1 FORM_ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ) , 
	(select top 1 SUB_TYPE from inserted) , (select top 1 SUB_TYPE from deleted) , 'PROVIDER')

    INSERT INTO TBL_AT_DETAILS ([AT_ID],[SNO],[NEW_VALUE],[OLD_VALUE],[FIELD_NAME]) 
	values ( (select top 1 ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),
	(select top 1 FORM_ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ) , 
	(select top 1 SUB_DESC from inserted) , (select top 1 SUB_DESC from deleted), 'DESC')

    INSERT INTO TBL_AT_DETAILS ([AT_ID],[SNO],[NEW_VALUE],[OLD_VALUE],[FIELD_NAME]) 
	values ( (select top 1 ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),
	(select top 1 FORM_ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ) , 
	(select top 1 ACCOUNTNO from inserted) , (select top 1 ACCOUNTNO from deleted), 'ACC NO')

    INSERT INTO TBL_AT_DETAILS ([AT_ID],[SNO],[NEW_VALUE],[OLD_VALUE],[FIELD_NAME]) 
	values ( (select top 1 ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),
	(select top 1 FORM_ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ) , 
	(select top 1 BUSSINESSTYPE from inserted) , (select top 1 BUSSINESSTYPE from deleted), 'TYPE')

    INSERT INTO TBL_AT_DETAILS ([AT_ID],[SNO],[NEW_VALUE],[OLD_VALUE],[FIELD_NAME]) 
	values ( (select top 1 ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),
	(select top 1 FORM_ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ) , 
	(select top 1 LINETYPE from inserted) , (select top 1 LINETYPE from deleted), 'SHAYA LINE TYPE')
    
    
    
    DELETE FROM TBL_AT_DETAILS WHERE [NEW_VALUE] = [OLD_VALUE]; 
    DELETE FROM TBL_AT_DETAILS WHERE [NEW_VALUE] is Null and [OLD_VALUE] is null; 
    

    
END

GO
ALTER PROCEDURE [dbo].[sp_GetSettings] 
@userName varchar(max),
@UserUid int = 0
AS
BEGIN
	
	SET NOCOUNT ON;

	Insert into vwTblUser_tblMaster ([FORM_ID],[ACTION_NAME],[RESULT],[USERID]) values (21, 'LOGIN', 'Success',(select UID = @UserUid ))	

	Insert into vwTBLDetails_TBLMaster ([SNO],[AT_ID],[OLD_VALUE],[NEW_VALUE],[FIELD_NAME]) 
	values (21, (select ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),
	(select top 1 NAME from tblUser where Uid = @UserUid),(select top 1 NAME from tblUser where USERNAME=@USERNAME),'LOGIN')	

	SELECT top 1 * FROM [tblConfiguration]

	SELECT top 1 UID,[NAME],[MANAGERID] FROM TBLUSER WHERE [USERNAME]=@userName

	SELECT top 1 UID,[NAME],EMAIL,[MANAGERID] FROM TBLUSER WHERE uid=(SELECT top 1 [MANAGERID] 
	FROM TBLUSER WHERE [USERNAME]=@userName)

	SELECT top 1 dbo.tbluser.USERNAME,dbo.tbluser.NAME,dbo.tbluserrole.Role_ID,dbo.tbluserrole.COUNTRYID, isnull(dbo.TBLUSER.CompanyID,0) as CompanyID
	FROM TBLUSER INNER JOIN TBLUSERROLE ON TBLUSER.UID=TBLUSERROLE.Uid WHERE USERNAME=@Username

END