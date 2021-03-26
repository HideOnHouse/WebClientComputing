function start_game() {
    // 변수 초기화 부분, 재시작하는 경우를 위함입니다

    $("#startGame").hide(); // 게임이 진행되니 게임시작 메뉴를 보이지 않게 합니다.
    $("#gameOver").hide();

    let remainTime = document.getElementById("remainTime");
    remainTime.innerText = 10;
    $("#currentFail").text("0");
    $("#currentStatus").text("숨은 그림을 보세요.");
    // 테이블의 모든 원소를 초기화시킵니다

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 8; j++) {
            let temp = document.getElementById(i.toString() + j.toString());
            temp.className = "noDog";
            temp.style.backgroundImage = "url('media/img1.gif')";
            temp.style.border = 0;
        }
    }
    // 사용자가 원하는 시간을 입력받는 부분입니다.
    let userTime = 100;

    while (parseInt(userTime) >= 30 || parseInt(userTime) < 1 || isNaN(userTime)) {
        userTime = prompt("강아지를 찾는 시간을 입력해주세요 (1 이상 30 미만)");
        if (isNaN(userTime)) {
            alert("잘못된 입력입니다, 다시 입력해주세요.");
        } else if (parseInt(userTime) >= 30 || parseInt(userTime) < 1) {
            alert("1초 이상, 30초 미만으로 입력해주세요.")
        } else {
            userTime = parseInt(userTime);
        }
    }


    // 강아지를 어디에 숨길지 정하는 부분입니다. 정답과 오답은 className으로 구분하였습니다.
    // yesDog가 강아지가 숨어있는 곳이고, noDog가 강아지가 숨어있지 않은 곳입니다.
    let hiddenCount = 0; // 현재 몇마리를 숨겼는지 나타냄

    // 몇마리를 숨길지 받아들이는 부분입니다
    let hiddenDogCount = 10;
    while (hiddenDogCount >= 8 || isNaN(hiddenDogCount) || parseInt(hiddenDogCount) < 1) {
        hiddenDogCount = prompt("몇 마리의 강아지를 찾으시겠습니까? (1 이상 8 미만)");
        if (isNaN(hiddenDogCount)) {
            alert("잘못된 입력입니다, 다시 입력해주세요.");
        } else if (parseInt(hiddenDogCount) >= 8 || parseInt(hiddenDogCount) < 1) {
            alert("1 이상 8 미만으로 입력해주세요.")
        } else {
            hiddenDogCount = parseInt(hiddenDogCount);
        }
    }

    $("#remainDog").text(hiddenDogCount); // 남은 수를 출력합니다
    while (hiddenCount < hiddenDogCount) {
        let row = Math.floor(Math.random() * 3);
        let column = Math.floor(Math.random() * 8);
        let temp = Math.floor(Math.random() * 5);
        if (temp === 3) {
            let yesDog = document.getElementById(row.toString() + column);
            if (yesDog.className === "yesDog") {
                continue;
            }
            yesDog.className = "yesDog";
            yesDog.style.backgroundImage = "url('media/img2.gif')";
            hiddenCount += 1;
        }
    }

    // 게임이 시작되었음을 알리는 소리를 재생하는 부분입니다.
    document.getElementById("startAlert").play();

    // 사용자에게는 10초가 주어지고, 10초가 지나면 게임을 시작합니다. 1초가 지나면 남은 시간이 1 줄어듭니다.
    let remember = window.setTimeout("find_now(" + userTime + ")", 10000);
    let clock = window.setInterval(function () {
        if (remainTime.innerText === '0') {
            clearInterval(clock);
        } else {
            document.getElementById("remainTime").innerText -= 1;
        }
    }, 1000);
}


// find_now함수에는 사용자가 입력한 t (몇초 이내로 찾을 건지)가 인자로 전달됩니다.
function find_now(userTime) {

    // yesDog, noDog를 선택하여 각각에 onclick 이벤트 핸들러를 부여하는 부분입니다.
    let yesDogs = $(".yesDog");
    let noDogs = $(".noDog");

    // 게임이 시작됬으니 강아지를 숨깁니다, 숨어있는 강아지를 클릭하면 yes함수가 호출되도록 이벤트 리스너를 등록합니다.
    for (let yesDog of yesDogs) {
        yesDog.style.backgroundImage = "url('media/img1.gif')";
        yesDog.onclick = yes;
    }

    // 강아지가 숨어있지 않은 부분을 클릭하면 no함수가 호출되도록 이벤트 리스너를 등록합니다
    for (const noDog of noDogs) {
        noDog.onclick = no;
    }

    // 강아지를 찾으세요! 라는 문구를 출력합니다.
    $("#currentStatus").text("정답을 찾으세요!");

    // 사용자가 원하는 시간만큼 남은 시간을 설정해줍니다.
    let remainTime = document.getElementById("remainTime");
    remainTime.innerText = userTime;

    // userTime만큼 시간이 주어집니다. 남은 시간을 1초에 1씩 감소시키는 역할도 대신합니다.
    let clock = window.setInterval(function () {
        // 마지막 5초를 똑딱 소리가 나게끔 하는 부분입니다.
        if (parseInt(remainTime.innerText) <= 5) {
            document.getElementById("clock").play();
        }

        // 시간이 다 되면 패배
        if (remainTime.innerText === '0') {
            clearInterval(clock);
            fail();
        }
    }, 1000);
}

// className === "yesDog"인 <td>를 클릭했을때 호출되는 함수입니다.
function yes() {
    document.getElementById("right").play(); // 찾았다는 소리를 재생합니다
    this.style.backgroundImage = "url('media/img2.gif')"; // 틀킨 강아지를 보여줍니다
    this.onclick = null; // 다시 클릭할 수 없도록 합니다.
    this.className = "noDog";

    // 남은 강아지 수를 1 감소시킵니다
    let remainDog = document.getElementById("remainDog");
    remainDog.innerText -= 1;

    // 남은 강아지 수가 0(모두 찾음)이면 승리합니다.
    if (remainDog.innerText === '0') {
        document.getElementById("win").play(); // 정답을 알리는 소리를 재생합니다
        $("#currentStatus").text("승리!");
        $("#startGame").show(); // 다시 시작할 수 있도록 게임시작 메뉴를 다시 보여줍니다.
        clearEvent();
    }
}

// className === "noDog"인 <td>를 클릭했을때 호출되는 함수입니다.
function no() {
    document.getElementById("wrong").play(); // 틀렸음을 알리는 소리를 재생합니다

    // 실패 수를 1 증가시킵니다
    let currentFail = document.getElementById("currentFail");
    currentFail.innerText -= -1;

    // 실패 수가 5에 도달하면 패배합니다.
    if (currentFail.innerText === '5') {
        fail();
    }
}

// 시간이 다 되었을때, 실패 수가 5일때 호출되는 함수입니다.

function fail() {
    // 숨어있던 강아지를 보여주는 부분입니다
    let yesDogs = document.getElementsByClassName("yesDog");
    for (let yesDog of yesDogs) {
        yesDog.style.backgroundImage = "url('media/img2.gif')";
        yesDog.style.border = "2px solid red";
    }

    // 패배했음을 알려주는 부분입니다.
    $("#gameOver").show();
    $("#currentStatus").text("실패");
    document.getElementById("fail").play();
    $("#startGame").show(); // 다시 시작할 수 있도록 게임 시작 버튼을 보여줍니다.
    clearEvent();
}

// 게임이 끝나면, 강아지가 숨어있거나 숨어있지 않은 부분을 클릭해도 아무 일도 일어나지 않게 해줍니다.
function clearEvent() {

    let noDogs = $(".noDog");
    let yesDogs = $(".yesDog")

    for (let noDog of noDogs) {
        noDog.onclick = null;
    }
    for (let yesDog of yesDogs) {
        yesDog.onclick = null;
    }

    // 모든 타이머를 종료시키는 부분입니다.
    (function (w) {
        w = w || window;
        let i = w.setInterval(function () {
        }, 100000);
        while (i >= 0) {
            w.clearInterval(i--);
        }
    })(/*window*/);
}