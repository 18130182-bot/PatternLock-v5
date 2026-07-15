const ADMIN_KEY = "patternLockAdmin";


function setAdminLogin(){

    localStorage.setItem(
        ADMIN_KEY,
        "true"
    );

}



function isAdminLogin(){

    return localStorage.getItem(
        ADMIN_KEY
    ) === "true";

}



function requireAdmin(){

    if(!isAdminLogin()){

        alert(
        "管理者ログインが必要です"
        );


        location.href =
        "login.html";

    }

}
