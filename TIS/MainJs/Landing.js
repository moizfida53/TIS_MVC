$(document).ready(function () {
    debugger;
    BindLandingViewData();
});
$(document)
    .ajaxStart(function () {
        showLoader();
    })
    .ajaxComplete(function () {
        debugger;
        hideLoader();
    })
    .ajaxStop(function () {
        hideLoader();
    });

function showLoader() {
    debugger;
    if (!($("#loaderDiv").is(':visible'))) {
        /* setTimeout(*/
        //function () {
        $('#loading').show();
        $('#loaderDiv').show();
        /*   }, 900);*/
    }
}

function hideLoader() {
    if (($("#loaderDiv").is(':visible'))) {
        /* setTimeout(*/
        //function () {
        $('#loading').hide();
        $('#loaderDiv').hide();
        /*   }, 900);*/
    }
}

function BindLandingViewData() {
    debugger;
    $.ajax({
        type: "GET",
        cache: false,
        async: false,
        url: "/user/GetLandingPageData",
        data: { uid: $('#hdnUid').val() },
        success: function (result) {
            debugger;
            if (result.Message == "Success") {
                var objData = JSON.parse(result.Data);
                if (objData.length) {
                    $('#lblPendingIdentificationCount').html(objData[0].PendingIdentificationBillsCnt);
                    $('#lblPendingApproval').html(objData[0].PendingApprovalBillsCnt);
                    $('#lblBillsHistory').html(objData[0].HistoryBillsCnt);
                }
            }
        }
    });
}
//function displayTabDetails(tabId) {
//    debugger;
//var url = "/user/Index?SelectedTabIndex=" + tabId;
//window.location.href = url;
//}
function displayTabDetails(Tabindex) {
    debugger;
    //var NestId = $(this).data('id');
    window.sessionStorage['SelectedTabIndex'] = Tabindex;
    //var url = '@Html.Raw(Url.Action("Index", new { tabindex = "3" }))';
    //var url = '@Html.Raw(Url.Action("Index"))';
    window.location.href = '/User/Index';
    window.location.href = url;

    //var url = "/user/RedirectOnListView?SelectedTabIndex=" + Tabindex;
    //window.location.href = url;
    //$.ajax({
    //    type: "POST",
    //    cache: false,
    //    async: false,
    //    url: "/user/Index",
    //    data: { tabindex: Tabindex },
    //    success: function (result) {
    //        debugger;
    //        if (result.Message == "Success") {
    //            //var objData = JSON.parse(result.Data);
    //            //if (objData.length) {
    //            //    $('#lblPendingIdentificationCount').html(objData[0].PendingIdentificationBillsCnt);
    //            //    $('#lblPendingApproval').html(objData[0].PendingApprovalBillsCnt);
    //            //    $('#lblBillsHistory').html(objData[0].HistoryBillsCnt);
    //            //}
    //        }
    //    }
    //});
}