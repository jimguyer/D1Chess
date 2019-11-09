angular.module('PaypalMod', [])
    .service('PaypalSvc', PaypalSvc)
;

function PaypalSvc($rootScope) {
    this.Amount = function (pMembershipLevel) {
        switch (pMembershipLevel) {
            case "Bronze": return ".01";
            case "Silver": return ".01";
            case "Gold": return ".01";
        }

    }
    this.Item_name = function (pMembershipLevel) {
        switch (pMembershipLevel) {
            case "Bronze": return "Bronze Membership";
            case "Silver": return "Silver Membership";
            case "Gold": return "Gold Membership";
        }

    }
    this.GetHttp = function (pHost, pId) {
        var http = "http://" + location.host + "/View/Index?pId=" + pId;
        //console.log("PaypalSvc.GetHttp - http = " + http);

        return "http://" + location.host + "/View/Index?pId=" + pId;
    }



    this.HRefCart = function (pSite, pInvoice, pItem_name, pItem_number, pQuantity, pAmount, pReturn, pCancelReturn) {
        var hRef = "https://www." + pSite + "/us/cgi-bin/webscr";
        hRef += "?cmd=" + "_cart";
        hRef += "&business=" + "Sales@DMChess.com";
        hRef += "&invoice=" + pInvoice;
        hRef += "&currency_code=" + "USD";
        hRef += "&item_name=" + pItem_name;
        hRef += "&item_number=" + pItem_number;
        hRef += "&quantity=" + pQuantity;
        hRef += "&amount=" + pAmount;
        hRef += "&return=" + pReturn;
        hRef += "&cancelreturn=" + pCancelReturn;
        return hRef;
    }
    this.HRefXClick = function (pItem_name, pAmount, pShipping, pReturn, pCancelReturn) {
        var hRef = "https://www.paypal.com/us/cgi-bin/webscr";
        hRef += "?cmd=" + "_xclick";
        hRef += "&business=" + "Sales@DMChess.com";
        hRef += "&item_name=" + pItem_name;
        hRef += "&amount=" + pAmount;
        if (pShipping != null) hRef += "&shipping=" + pShipping;
        hRef += "&return=" + pReturn;
        hRef += "&cancelreturn=" + pCancelReturn;
        return hRef;
    }
}