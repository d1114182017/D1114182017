const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const grid = 20;
let snake, dx, dy, food, score, gameRunning;

/* ⭐ 重點：每次開啟頁面都重新初始化（不存任何資料） */
let scores = [];

function initGame() {
    snake = [{x: 200, y: 200}];
    dx = grid;
    dy = 0;
    score = 0;
    gameRunning = true;

    food = randomFood();
    document.getElementById("score").innerText = score;
}

function randomFood() {
    return {
        x: Math.floor(Math.random() * 20) * grid,
        y: Math.floor(Math.random() * 20) * grid
    };
}

/* 控制 */
document.addEventListener("keydown", (e) => {
    if (!gameRunning) return;

    if (e.key === "ArrowLeft" && dx === 0) { dx = -grid; dy = 0; }
    if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -grid; }
    if (e.key === "ArrowRight" && dx === 0) { dx = grid; dy = 0; }
    if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = grid; }
});

/* 遊戲主迴圈 */
function gameLoop() {
    if (!gameRunning) return;

    setTimeout(() => {
        ctx.clearRect(0,0,400,400);

        let head = {x: snake[0].x + dx, y: snake[0].y + dy};

        if (
            head.x < 0 || head.x >= 400 ||
            head.y < 0 || head.y >= 400 ||
            snake.some(s => s.x === head.x && s.y === head.y)
        ) {
            endGame();
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score++;
            document.getElementById("score").innerText = score;
            food = randomFood();
        } else {
            snake.pop();
        }

        snake.forEach((p,i)=>{
            ctx.fillStyle = `hsl(${120+i*3},80%,50%)`;
            ctx.fillRect(p.x,p.y,18,18);
        });

        ctx.fillStyle = "red";
        ctx.fillRect(food.x,food.y,18,18);

        gameLoop();
    }, 100);
}

/* 畫面切換 */
function show(id){
    document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

/* 開始 */
function startGame(){
    initGame();
    show("gameScreen");
    gameLoop();
}

/* 結束 */
function endGame(){
    gameRunning = false;

    document.getElementById("finalScore").innerText = score;

    addScore(score);
    render("leaderboard2");

    show("gameOverScreen");
}

/* 重玩 */
function restart(){
    show("startScreen");
    render("leaderboard");
}

/* ⭐ 排行榜（只存在於這次開啟，不會保存） */
function addScore(s){
    scores.push(s);
    scores.sort((a,b)=>b-a);
    scores = scores.slice(0,5);
}

function render(id){
    let html = "<h3>🏆  TOP 5</h3>";

    if(scores.length === 0){
        html += "<p>尚無紀錄</p>";
    } else {
        scores.forEach((s,i)=>{
            html += `<p>${i+1}. ${s}</p>`;
        });
    }

    document.getElementById(id).innerHTML = html;
}

/* 初始 */
render("leaderboard");