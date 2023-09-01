// 채팅 접속
let username = prompt("아이디를 입력하세요");
let roomNum = prompt("들어가려는 채팅방 번호를 입력하세요");

let fileinput = document.querySelector("#fileinput");

fileinput.addEventListener('change', (e) => {
    let file = e.target.files[0];
    console.log(file)

    const selectfile = URL.createObjectURL(file);
    document.querySelector("#user_profile").src = selectfile;
})


document.querySelector("#username").innerHTML = username;

// SSE 연결
const eventSource = new EventSource(`http://localhost:8080/chat/roomNum/${roomNum}`);

// eventSource.onmessage = (event) => {
//     const data = JSON.parse(event.data);

//     const parsed_year = data.createdAt.substr(0, 4);
//     const parsed_month = data.createdAt.substr(5, 2);
//     const parsed_day = data.createdAt.substr(8, 2);
//     const parsed_hour = data.createdAt.substr(11, 2);
//     const parsed_minute = data.createdAt.substr(14, 2);
//     const parsed_second = data.createdAt.substr(17, 2);

//     const parsed_time = parsed_year + '-' + parsed_month + '-' + parsed_day
//         + ' | ' + parsed_hour + ':' + parsed_minute + ':' + parsed_second;
    
//     if (data.sender === username) {
//         // 오른쪽
//         initMyMessage(data, parsed_time);
//     } else {
//         // 왼쪽
//     }
// }

eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    if (data.sender === username) {
        // 오른쪽
        initMyMessage(data);
    } else {
        // 왼쪽
        initYourMessage(data);
    }
}


function getReceiveMsgBox(data) {
    return `<div class="received_withd_msg">
    <p style="margin-top:20px">${data.msg}</p>
    <span class="time_date"> ${parse_time(data)} // <b>${data.sender}</b> </span>
  </div>`;
}

// function getSendMsgBox(msg, time) {
//     return `<div class="sent_msg">
//     <p>${msg}</p>
//     <span class="time_date"> ${time} </span>
//   </div>`;
// }

function getSendMsgBox(data) {
    return `<div class="sent_msg">
    <p>${data.msg}</p>
    <span class="time_date"> ${parse_time(data)} // <b>${data.sender}</b></span>
  </div>`;
}

function parse_time(data) {
    let parsed_year = data.createdAt.substr(0, 4);
    let parsed_month = data.createdAt.substr(5, 2);
    let parsed_day = data.createdAt.substr(8, 2);
    let parsed_hour = data.createdAt.substr(11, 2);
    let parsed_minute = data.createdAt.substr(14, 2);
    let parsed_second = data.createdAt.substr(17, 2);

    let parsed_time = parsed_year + '-' + parsed_month + '-' + parsed_day
    + ' | ' + parsed_hour + ':' + parsed_minute + ':' + parsed_second;

    return parsed_time;
}

// function initMyMessage(data, time) {
//     let chatBox = document.querySelector("#chat-box");
//     // let msgInput = document.querySelector("#chat-outgoing-msg");

//     let chatOutgoingBox = document.createElement("div");
//     chatOutgoingBox.className = "outgoing_msg";
//     chatOutgoingBox.innerHTML = getSendMsgBox(data.msg, time);

//     chatBox.append(chatOutgoingBox);
//     // msgInput.value = "";
// }

function initMyMessage(data) {
    let chatBox = document.querySelector("#chat-box");
    // let msgInput = document.querySelector("#chat-outgoing-msg");

    let sendBox = document.createElement("div");
    sendBox.className = "outgoing_msg";
    sendBox.innerHTML = getSendMsgBox(data);

    chatBox.append(sendBox);

    document.documentElement.scrollTop = document.body.scrollHeight;
    // msgInput.value = "";
}


function initYourMessage(data) {
    let chatBox = document.querySelector("#chat-box");
    // let msgInput = document.querySelector("#chat-outgoing-msg");

    let receivedBox = document.createElement("div");
    receivedBox.className = "received_msg";
    receivedBox.innerHTML = getReceiveMsgBox(data);

    chatBox.append(receivedBox);
    // msgInput.value = "";
}

//AJAX 통신으로 인해 비동기 함수 처리
async function addMessage() {
    // let chatBox = document.querySelector("#chat-box");
    let msgInput = document.querySelector("#chat-outgoing-msg");

    // let chatOutgoingBox = document.createElement("div");
    // chatOutgoingBox.className = "outgoing_msg";

    // let date = new Date();

    // let year = date.getFullYear();
    // let month = ('0' + (date.getMonth() + 1)).slice(-2);
    // let day = ('0' + date.getDate()).slice(-2);
    // let hours = ('0' + date.getHours()).slice(-2);
    // let minutes = ('0' + date.getMinutes()).slice(-2);
    
    // let seconds = ('0' + date.getSeconds()).slice(-2);

    // let now = year + '-' + month + '-' + day
    //     + ' | ' + hours + ':' + minutes + ':' + seconds;
    
    let chat = {
        sender: username,
        roomNum: roomNum,
        msg: msgInput.value
    };

    let response = await fetch("http://localhost:8080/chat", {
        method: "post",
        body: JSON.stringify(chat),
        headers: {
            //MIME Type : 웹에서는 파일 확장자가 의미가 없으므로, 웹 상에서 전송하는 데이터 타입 정의
            "Content-Type": "application/json; charset=utf-8"
        }
    });
    // 통신이 끝날 때까지 기다려야 한다.

    await response.json();
    
    // console.log(parseResponse);

    // chatOutgoingBox.innerHTML = getSendMsgBox(msgInput.value, now);
    // chatBox.append(chatOutgoingBox);
    msgInput.value = "";
}

// 메시지 전송
document.querySelector("#chat-send").addEventListener("click", () => {
    addMessage();
});


document.querySelector("#chat-outgoing-msg").addEventListener("keydown", (e) => {
    if (e.keyCode === 13) {
        addMessage();
    }
})