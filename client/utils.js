function setDataOnEmailTable() {
    if (this.readyState === this.DONE && this.status == 200) {
        var rows = JSON.parse(this.responseText);
        var data = [];

        for (var i = 0; i < rows.length; i++) {
            data.push({
                id: rows[i].id,
                from: rows[i].from,
                subject: rows[i].subject,
                actions: '<input class="btn btn-warning" onclick="getEmailInfo(' + rows[i].id + ', \'open\')" type="button" value="Open" /><input class="btn btn-success" onclick="getEmailInfo(' + rows[i].id + ', \'forward\')" type="button" value="Forward" /><input class="btn btn-primary" onclick="getEmailInfo(' + rows[i].id + ', \'reply\')" type="button" value="Reply" /><input class="btn btn-danger" onclick="deleteEmail(' + rows[i].id + ')" type="button" value="Delete" />',
            })
        }

        $('#username').attr('readonly', true);
        $('#table').bootstrapTable('removeAll');
        $('#table').bootstrapTable('append', data);
        $('#table').bootstrapTable('hideLoading')
    }
}

function setEmailInfosOpen() {
    if (this.readyState === this.DONE && this.status == 200) {
        var email = JSON.parse(this.responseText);

        document.getElementById("idOpenModal").value = email.id;
        document.getElementById("fromOpenModal").value = email.from;
        document.getElementById("toOpenModal").value = email.to;
        document.getElementById("subjectOpenModal").value = email.subject;
        document.getElementById("bodyOpenModal").value = email.body;
        $('#emailOpenModal').modal('show')
    }
}

function setEmailInfosForward() {
    if (this.readyState === this.DONE && this.status == 200) {
        var email = JSON.parse(this.responseText);

        document.getElementById("idForwardModal").value = email.id;
        document.getElementById("fromForwardModal").value = email.to;
        document.getElementById("toForwardModal").value = '';
        document.getElementById("subjectForwardModal").value = 'Fwd: ' + email.subject;
        document.getElementById("bodyForwardModal").value = email.body;
        $('#emailForwardModal').modal('show')
    }
}

function setEmailInfosReply() {
    if (this.readyState === this.DONE && this.status == 200) {
        var email = JSON.parse(this.responseText);

        document.getElementById("idReplyModal").value = email.id;
        document.getElementById("fromReplyModal").value = email.to;
        document.getElementById("toReplyModal").value = email.from;
        document.getElementById("subjectReplyModal").value = 'Re: ' + email.subject;
        document.getElementById("bodyReplyModal").value = '';
        $('#emailReplyModal').modal('show')
    }
}

function getEmailInfo(id, action) {
    const xhr = new XMLHttpRequest();

    if (action == 'open') {
        xhr.addEventListener("readystatechange", setEmailInfosOpen);
    } else if (action == 'forward') {
        xhr.addEventListener("readystatechange", setEmailInfosForward);
    } else if (action == 'reply') {
        xhr.addEventListener("readystatechange", setEmailInfosReply);
    }

    if (id) {
        xhr.open("GET", "http://localhost:5000/api/emails/" + id);
        xhr.send();
    }
    else {
        alert("Unable to get email infos!");
    }

}

function getEmails() {
    if (this.readyState === this.DONE && this.status == 201) {
        var username = this.responseText.replaceAll('"', '');

        const xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", setDataOnEmailTable);

        if (username) {
            xhr.open("GET", "http://localhost:5000/api/emails/" + username);
            xhr.send();
        }
        else {
            alert("You must provide a valid username!");
            $('#table').bootstrapTable('hideLoading')
        }

    }
}

function logout() {
    $('#username').attr('readonly', false);
    $('#username').val('');
    $('#table').bootstrapTable('removeAll');
}

function removeEmailFromTable() {
    if (this.readyState === this.DONE && this.status == 200) {
        $('#table').bootstrapTable('remove', {
            field: 'id',
            values: [this.responseText]
        })
        $('#table').bootstrapTable('hideLoading')
    }
}

function deleteEmail(id) {

    $('#table').bootstrapTable('showLoading')

    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", removeEmailFromTable);

    if (id) {
        xhr.open("DELETE", "http://localhost:5000/api/emails/" + id);
        xhr.send();
    }
    else {
        alert("Unable to delete e-mail!");
        $('#table').bootstrapTable('hideLoading')
    }

}

function signInOrSignUp() {
    $('#table').bootstrapTable('showLoading')

    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", getEmails);

    if (document.getElementById("username").value && !(document.getElementById("username").value.indexOf(' ') >= 0)) {
        const data = JSON.stringify({ user: document.getElementById("username").value });
        xhr.open("POST", "http://localhost:5000/api/users");
        xhr.send(data);
    }
    else if (document.getElementById("username").value.indexOf(' ') >= 0) {
        alert("Username must not have white spaces !");
        $('#table').bootstrapTable('hideLoading')
    }
    else {
        alert("You must provide a valid username!");
        $('#table').bootstrapTable('hideLoading')
    }
}

function openSendModal() {
    if (document.getElementById("username").value) {
        document.getElementById("fromSendModal").value = document.getElementById("username").value;
        document.getElementById("toSendModal").value = '';
        document.getElementById("subjectSendModal").value = '';
        document.getElementById("bodySendModal").value = '';
        $('#emailSendModal').modal('show');
    } else {
        alert("You must sign in before sending an email");
    }
}

function send() {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", closeSendModal);

    if (document.getElementById("fromSendModal").value && document.getElementById("toSendModal").value && document.getElementById("subjectSendModal").value && document.getElementById("bodySendModal").value) {
        const data = JSON.stringify({ from: document.getElementById("fromSendModal").value, to: document.getElementById("toSendModal").value, subject: document.getElementById("subjectSendModal").value, body: document.getElementById("bodySendModal").value });
        xhr.open("POST", "http://localhost:5000/api/emails");
        xhr.send(data);
    }
    else {
        alert("Unable to send email!");
    }
}

function closeSendModal() {
    if (this.readyState === this.DONE) {
        if (this.status == 201) {
            $('#emailSendModal').modal('hide')
            alert("Success!");
        } else {
            alert(this.responseText);
        }
    }
}

function forward() {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", closeForwardModal);

    if (document.getElementById("idForwardModal").value && document.getElementById("toForwardModal").value) {
        const data = JSON.stringify({ id: document.getElementById("idForwardModal").value, to: document.getElementById("toForwardModal").value });
        xhr.open("PUT", "http://localhost:5000/api/emails/fwd");
        xhr.send(data);
    }
    else {
        alert("Unable to forward email!");
    }

}

function closeForwardModal() {
    if (this.readyState === this.DONE) {
        if (this.status == 201) {
            $('#emailForwardModal').modal('hide')
            alert("Success!");
        } else {
            alert(this.responseText);
        }
    }
}

function reply() {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", closeReplyModal);

    if (document.getElementById("idReplyModal").value && document.getElementById("toReplyModal").value) {
        const data = JSON.stringify({ id: document.getElementById("idReplyModal").value, body: document.getElementById("bodyReplyModal").value });
        xhr.open("PUT", "http://localhost:5000/api/emails/reply");
        xhr.send(data);
    }
    else {
        alert("Unable to reply email!");
    }

}

function closeReplyModal() {
    if (this.readyState === this.DONE) {
        if (this.status == 201) {
            $('#emailReplyModal').modal('hide')
            alert("Success!");
        } else {
            alert(this.responseText);
        }
    }
}