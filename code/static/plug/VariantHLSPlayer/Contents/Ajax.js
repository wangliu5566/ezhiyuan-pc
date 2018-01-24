var Ajax = {
    get: function (url, respType, fn) {

        respType = respType || "text";

        var xhr = new XMLHttpRequest(); 
        
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
                fn.call(this, xhr, Ajax.getRespContent(xhr, respType));
            }
        };
        obj.send();
    },
    post: function (url, data, contentType, respType, async, fn) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, async);
        
        respType = respType || "text";
        contentType = contentType || "application/x-www-form-urlencoded";

        xhr.setRequestHeader("Content-type", contentType);

        if (respType == "blob" || respType == "arraybuffer")
            xhr.overrideMimeType("text/plain; charset=x-user-defined");

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
                fn.call(this, xhr, Ajax.getRespContent(xhr, respType));
            }
        };
        xhr.send(data);
    },

    getRespContent: function (xhr, type)
    {
        if (type == "arraybuffer")
            return new Uint8Array(xhr.response);
        else if (type == "blob")
            return xhr.response;
        else if (type == "json")
            return eval("(" + xhr.responseText + ")");
        else if (type == "document")
            return new DOMParser().parseFromString(xhr.responseText, "text/xml");
        else
            return xhr.responseText;
    }
}