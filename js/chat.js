const eventSource = new EventSource("http://localhost:8080/sender/a/receiver/b");

eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);

    const parsed_year = data.createdAt.substr(0, 4);
    const parsed_month = data.createdAt.substr(5, 2);
    const parsed_day = data.createdAt.substr(8, 2);
    const parsed_hour = data.createdAt.substr(11, 2);
    const parsed_minute = data.createdAt.substr(14, 2);
    const parsed_second = data.createdAt.substr(17, 2);


    const parsed_time = parsed_year + '-' + parsed_month + '-' + parsed_day
        + ' | ' + parsed_hour + ':' + parsed_minute + ':' + parsed_second;

    console.log(parsed_time);
    initMessage(data, parsed_time);
}

function getSendMsgBox(msg, time) {
    return `<div class="sent_msg">
    <p>${msg}</p>
    <span class="time_date"> ${time} </span>
  </div>`;
}

function initMessage(data, time) {
    let chatBox = document.querySelector("#chat-box");
    let msgInput = document.querySelector("#chat-outgoing-msg");

    let chatOutgoingBox = document.createElement("div");
    chatOutgoingBox.className = "outgoing_msg";
    chatOutgoingBox.innerHTML = getSendMsgBox(data.msg, time);
    chatBox.append(chatOutgoingBox);
    msgInput.value = "";
}

function addMessage() {
    let chatBox = document.querySelector("#chat-box");
    let msgInput = document.querySelector("#chat-outgoing-msg");

    let chatOutgoingBox = document.createElement("div");
    chatOutgoingBox.className = "outgoing_msg";

    let date = new Date();

    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    let hours = ('0' + date.getHours()).slice(-2);
    let minutes = ('0' + date.getMinutes()).slice(-2);
    
    let seconds = ('0' + date.getSeconds()).slice(-2);

    let now = year + '-' + month + '-' + day
        + ' | ' + hours + ':' + minutes + ':' + seconds;

    chatOutgoingBox.innerHTML = getSendMsgBox(msgInput.value, now);
    chatBox.append(chatOutgoingBox);
    msgInput.value = "";
}


document.querySelector("#chat-send").addEventListener("click", () => {
    addMessage();
});

document.querySelector("#chat-outgoing-msg").addEventListener("keydown", (e) => {
    if (e.keyCode === 13) {
        addMessage();
    }
})