var ajaxReq = function(url, type, successCbk, errorCbk, contentType, postparam, datatype, xhrfields, crossDomain, headers) {

    var sCbk = function(data) {
        successCbk && successCbk(data);
    };
    var eCbk = function(err, textStatus) {
        var cbk = function() {
            errorCbk && errorCbk(err);
        };
        if (textStatus == "timeout") {
            _self.customPopup("skllb_ajaxTimeout", "Network timeout - Please try again", cbk);
        } else {
            cbk();
        }
    };
    var ajaxConfig = {
        "url": url,
        "type": (type ? type : "GET"),
        "success": sCbk,
        "error": eCbk,
    };
    if (contentType) {
        ajaxConfig.contentType = contentType;
    }
    if (postparam) {
        ajaxConfig.data = postparam;
    }
    if (datatype) {
        ajaxConfig.dataType = datatype;
    }
    if (headers) {
        ajaxConfig.headers = headers;
    }
    if (xhrfields) {
        $.extend(ajaxConfig.xhrFields, xhrfields);
    }
    if (typeof(crossDomain) != "undefined") {
        ajaxConfig.crossDomain = crossDomain;
    }
    $.ajax(ajaxConfig);
};