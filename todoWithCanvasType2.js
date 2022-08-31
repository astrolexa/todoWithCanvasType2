const { useState, useEffect } = React;
const root = ReactDOM.createRoot(document.getElementById("root"));
//import './p5.js';

function MouseAnimation(){    
        var colorMap = [
            '#1abc9c',
            '#3498db',
            '#9b59b6'
        ];
        var Mover = /** @class */ (function () {
            function Mover(position, velocity, acceleration) {
                if (position === void 0) { position = createVector(0, 0); }
                if (velocity === void 0) { velocity = createVector(0, 0); }
                if (acceleration === void 0) { acceleration = createVector(0, 0); }
                this.position = position;
                this.velocity = velocity;
                this.acceleration = acceleration;
                this.color = color(random(colorMap));
                this.maxSpeed = 6;
            }
            Mover.prototype.update = function () {
                var mouse = createVector(mouseX, mouseY);
                this.acceleration = p5.Vector.sub(mouse, this.position);
                this.acceleration.setMag(0.2);
                this.velocity.add(this.acceleration);
                this.velocity.limit(this.maxSpeed);
                this.position.add(this.velocity);
                var vd = p5.Vector.sub(mouse, this.position);
                this.rotation = atan2(vd.y, vd.x);
            };
            Mover.prototype.draw = function () {
                push();
                translate(this.position.x, this.position.y);
                rotate(this.rotation);
                noStroke();
                rect(-20, -5, 20, 5);
                fill(this.color);
                rect(0, -5, 5, 5);
                pop();
            };
            return Mover;
        }());
        var movers = [];
        function setup() {
            var innerWidth = window.innerWidth, innerHeight = window.innerHeight;
            createCanvas(innerWidth, innerHeight);
            for (var i = 0; i < 20; i += 1) {
                movers.push(new Mover(new p5.Vector(random(0, width), random(0, height))));
            }
        }
        function draw() {
            background(33);
            movers.forEach(function (mover) {
                mover.update();
                mover.draw();
            });
        }
        function windowResized() {
            var innerWidth = window.innerWidth, innerHeight = window.innerHeight;
            resizeCanvas(innerWidth, innerHeight);
        }     
    return <canvas id="canvas"></canvas>;
}

// Components
function AddNewTodo({ newTodo, setNewTodo, addTodo }){
    return (
        <div className="inputBox">
            <input 
            type="text" 
            placeholder="請輸入待辦事項"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value.trim())}
            onKeyPress={(e) => {
                if (e.key === "Enter") addTodo();
            }}
            />            
            <a href="#" onClick={addTodo}>
                <i className="fa fa-plus" />
            </a>
        </div>
    )
}

function Tab({ tab, currentTab, setCurrentTab }){
    return (
        <>    
            {tab.map((item) => (
                <a
                    key={item.id}
                    className={item.id === currentTab ? "active":""}
                    id={item.id}
                    onClick={() => setCurrentTab(item.id)}
                >
                    {item.type}
                </a>
            ))}           
        </>
    )
} 

function TodoItem({ currentTodoItem, done, clean }){
    return (
        <>
            <ul className="todoList_item">
                {currentTodoItem.map((item) => (
                    <li key={item.id}>
                        <label className="todoList_label">
                            <input
                                className="todoList_input"
                                type="checkbox"
                                id={item.id}
                                checked={item.isDone}
                                onChange={done}
                            />
                            <div className={item.isDone ? "check":""}></div>
                            <p className={item.isDone ? "done":""}>{item.todo}</p>
                        </label>
                        <a href="#">
                            <i class="fa fa-times" id={item.id} onClick={clean}></i>
                        </a>
                    </li>
                ))}
            </ul>
        </>
    );
}

function App(){
    //hooks
    const [newTodo, setNewTodo] = useState("");
    const tab = [
        {
            id: "all",
            type: "全部"
        },
        {
            id: "undone",
            type: "待完成"
        },
        {
            id: "done",
            type: "已完成"
        }
    ];
    const [currentTab, setCurrentTab] = useState("all");
    const [todoItem, setTodoItem] = useState([
        {
            id:Math.random(),
            todo: "把冰箱發霉的檸檬拿去丟",
            isDone: false
        },
        {
            id:Math.random(),
            todo: "打電話叫媽媽匯款給我",
            isDone: false
        },
        {
            id:Math.random(),
            todo: "整理電腦資料夾",
            isDone: false
        },
        {
            id:Math.random(),
            todo: "繳電費水費瓦斯費",
            isDone: false
        },
        {
            id:Math.random(),
            todo: "約vicky禮拜三泡溫泉",
            isDone: false
        }
    ])
    const [currentTodoItem, setCurrentTodoItem] = useState(todoItem);
    const pending = todoItem.filter((item) => !item.isDone);
    const pendingLen = pending.length;

    //function
    const addTodo = () => {
        if (newTodo !== ""){
            setTodoItem((state) => [
                ...state,
                {
                    id: Math.random(),
                    todo: newTodo,
                    isDone: false
                }
            ]);
            setCurrentTodoItem(todoItem);
            setNewTodo("");            
        }
    };
    useEffect(() => {
        switch (currentTab) {
            case "all":
                setCurrentTodoItem(todoItem);
                break;
            case "undone":
                setCurrentTodoItem(todoItem.filter((item) => !item.isDone));
                break;
            case "done":
                setCurrentTodoItem(todoItem.filter((item) => item.isDone));
                break;
        }
    }, [currentTab, todoItem]);

    const done = (e) => {
        const { id, checked } = e.target;
        return setTodoItem(
            todoItem.map((item) => 
            item.id === Number(id) ? {...item, isDone: checked } : item
            )
        );
    };

    const clean = (e) => {
        setTodoItem(todoItem.filter((item) => item.id !== Number(e.target.id)));
    };

    const cleanAll = (e) => {
        setTodoItem(todoItem.filter((item) => !item.isDone));
        setCurrentTab("all");
    };

    return(
        <div id="todoListPage" class="bg-half">
            <MouseAnimation />
            <nav>
                <h1><a href="#">ONLINE TODO LIST</a></h1>
                <ul>
                    <li className="todo_sm"><a href="#"><span>王小明的代辦</span></a></li>
                    <li><a href="#loginPage">登出</a></li>
                </ul>
            </nav>
            <div class="conatiner todoListPage vhContainer">              
                {todoItem.length > 0 ? (
                    <div className="todoList_Content">
                        <AddNewTodo
                            newTodo={newTodo}
                            setNewTodo={setNewTodo}
                            addTodo={addTodo}
                        />
                        <div className="todoList_list">       
                            <ul className="todoList_tab">
                                <Tab 
                                    tab={tab}
                                    setCurrentTab={setCurrentTab}
                                    currentTab={currentTab}
                                />
                            </ul>                           
                            <div className="todoList_items">
                                <TodoItem
                                    currentTodoItem={currentTodoItem}
                                    done={done}
                                    clean={clean}
                                />
                                <div className="todoList_statistics">
                                    <p> {pendingLen} 個待完成項目</p>
                                    <a href="#" onClick={cleanAll}>清除已完成項目</a>
                                </div>
                            </div>                                                         
                        </div>  
                    </div>
                ) : (
                    <div className="todoList_Content">
                        <div className="todoList_list">
                            <div className="todoList_items">                                
                                <h2>目前尚無待辦事項</h2>                                
                            </div>
                        </div>                     
                    </div>                    
                )}
            </div>
        </div>
    );
}
root.render(<App/>);