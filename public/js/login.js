$(document).ready(function() {
    $("#btn-login").off("click").on("click", function() {
        if($("#username").val() != "" && $("#password").val() != ""){
            var config = {
                "username": $("#username").val(),
                "password": $("#password").val()
            };
            $("#login-alert").hide();
            var successCbk = function(data) {
                console.log(data);
                if (data && data.code == 200) {
                    location = window.location;
                    host = location.origin;
                    url = host + "/" + data.redirectUrl;
                    $("#login-alert").removeClass('alert-danger').addClass('alert-success').text(data.success).show();
                    console.log(url)
                    //window.location.href = url;
                } else if(data && data.success) {
                    $("#login-alert").addClass('alert-danger').text(data.success).show();
                }
            };
            var errorCbk = function(data) {
                console.log(data);
                if(data && data.status == 429)
                {
                    $("#login-alert").addClass('alert-danger').text(data.responseText).show();
                }
            };
            ajaxReq("http://localhost:9999/api/login", "POST", successCbk, errorCbk, null, config);
        }
        else
        {
            $("#login-alert").text("Email or Password should not be empty").show();
        }
    });
});