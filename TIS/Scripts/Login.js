$(document).ready(function () {
    $("#loginpage").keypress(function (e) {
        if (e.which == 13) {

            $("#btnLogin").click();
        }
    });

    $("#btnLogin").jqxButton({ template: 'primary' });
    $('#btnLogin').on('click', function () {
        Login();
    });
})
function Login() {
    if ($('#txtUsername').val() == '') {
        //                alert('Please Enter Username')
        $("#txtUsername").notify('Please Enter Username', { position: "right" });
        return;
    }
    if ($('#txtPassword').val() == '') {
        //                alert('Please Enter Password')
        $("#txtPassword").notify('Please Enter Password', { position: "right" });
        return;
    }


    var Login = {
        "Username": $('#txtUsername').val(),
        "Password": $('#txtPassword').val()
    };
    var obji = { Login: Login }
    $.ajax({
        type: "POST",
        url: "../../User/Login",
        data: JSON.stringify(obji),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            window.location.href = '/User/Index';
            //this.close();
        }
    })
}

$(function () {
    $("#chkShowPassword").bind("click", function () {
        var txtPassword = $("[id*=txtPassword]");
        if ($(this).is(":checked")) {
            txtPassword.after('<input id = "txt_' + txtPassword.attr("id") + '" type = "text" value = "' + txtPassword.val() + '" />');
            txtPassword.hide();
        } else {
            txtPassword.val(txtPassword.next().val());
            txtPassword.next().remove();
            txtPassword.show();

        }
    });
});