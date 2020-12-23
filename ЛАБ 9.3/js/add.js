function GetUsers() {
    $.ajax({
        url: "/api/users",
        type: "GET",
        contentType: "application/json",
        success: function (users) {
            var rows = "";
            $.each(users, function (index, user) {
                rows += row(user);
            })
            $("table tbody").append(rows);
         }
    });
}

function GetUser(id) {
    $.ajax({
        url: "/api/users/"+id,
        type: "GET",
        contentType: "application/json",
        success: function (user) {
            var form = document.forms["climateForm"];
            form.elements["id"].value = user._id;
            form.elements["region"].value = user.name;
            form.elements["lesson"].value = user.lesson;
            form.elements["time"].value = user.time;
        }
    });
}


function CreateUser(userName, sheduleLesson, sheduleTime) {
    $.ajax({
        url: "api/users",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            name: userName,
            lesson: sheduleLesson,
            time: sheduleTime
        }),
        success: function (user) {
            reset();
            $("table tbody").append(row(user));
        }
    })
}

function reset() {
    var form = document.forms["sheduleForm"];
    form.reset();
    form.elements["id"].value = 0;
}

let row = function (user) {
    return "<tr data-rowid='" + user._id + "'>" +
    "<td>" + user._id + "</td> <td>" + user.name + "</td> <td>" + user.lesson + "</td>" + "<td>" + user.time + "</td>" +
           "<td><a class='editLink' data-id='" + user._id + "'>Изменить</a> | " +
            "<a class='removeLink' data-id='" + user._id + "'>Удалить</a></е></tr>";
}

GetUsers();