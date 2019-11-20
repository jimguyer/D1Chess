angular.module('WebMod', [])
    .service('Web', Web)
    ;
function Web() {
    this.Get = function (pSubscribe, pAction, pKey, pKey2) {
        $http
            .get("api/Web", { params: { Action: pAction, Key: pKey, Key2: pKey2 } })
            .success(function (Result) { pSubscribe({ Method: "Get", Action: pAction, Error: Result.Error, Data: Result.Data }) })
            .error(function (Result) { pSubscribe({ Method: "Get", Action: pAction, Error: Result.Error }) })
        //.success((Result) => pSubscribe({ Method: "Get", Action: pAction, Error: Result.Error, Data: Result.Data }))
        //.error((Result) => pSubscribe({ Method: "Get", Action: pAction, Error: Result.Error }))
    }
    this.Post = function (pSubscribe, pAction, pData) {
        $http
            .post("api/Web", { Action: pAction, Data: pData })
            .success(function (Result) { pSubscribe({ Method: "Post", Action: pAction, Error: Result.Error, Data: Result.Data }) })
            .error(function (Result) { pSubscribe({ Method: "Post", Action: pAction, Error: Result.Error }) })
        //.success((Result) => pSubscribe({ Method: "Post", Action: pAction, Error: Result.Error, Data: Result.Data }))
        //.error((Result) => pSubscribe({ Method: "Post", Action: pAction, Error: Result.Error }))
    }
}