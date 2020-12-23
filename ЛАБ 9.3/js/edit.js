function EditUser(userId, userName, sheduleLesson) {
    $.ajax({
        url: "api/users",
        contentType: "application/json",
        method: "PUT",
        data: JSON.stringify({
            id: userId,
            name: userName,
            lesson: sheduleLesson,
            time: sheduleTime
        }),
        success: function (user) {
            reset();
            console.log(user);
            $("tr[data-rowid='" + user._id + "']").replaceWith(row(user));
        }
    })
}

