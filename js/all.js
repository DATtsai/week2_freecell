var stackArray;
var staies;
var moveSpace;

    // 設置開局
(function (){
    
    // 1.產生牌
    let pokers = {
        spade: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        club: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        heart: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        dimond: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
    };

    // 2.產生遊戲空間
    stackArray = {
        stack1: [],
        stack2: [],
        stack3: [],
        stack4: []
    };

    staies = {
        stay1: [],
        stay2: [],
        stay3: [],
        stay4: []
    }

    moveSpace = {
        space1: [],
        space2: [],
        space3: [],
        space4: [],
        space5: [],
        space6: [],
        space7: [],
        space8: [],
    }
    
    // 3.隨機配牌開局
    function openGame(){

        function getRandom(list){
            return list[Math.floor((Math.random() * list.length))]
        };

        let poker = {
            suit: '',
            number: 0
        };

        function checkUsed(suit, number){
            if (pokers[suit].indexOf(number) === -1) {
                return true;
            } 
            return false;
        };

        function drawPoker(){
            
            poker.suit = getRandom(['spade', 'club', 'heart', 'dimond']);
            poker.number = getRandom([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);

            // 確認所抽牌為發牌堆未發過之牌
            while(checkUsed(poker.suit, poker.number)){
                poker.suit = getRandom(['spade', 'club', 'heart', 'dimond']);
                poker.number = getRandom([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
            };

            console.log(poker);
            
            // 移除已用發牌堆
            pokers[poker.suit].splice(pokers[poker.suit].indexOf(poker.number), 1);
            // console.log(pokers);

            let checkStacked = getRandom(['space1', 'space2', 'space3', 'space4', 'space5', 'space6', 'space7', 'space8']);
            
            // 使牌堆先堆滿6張後再堆第7張
            // 每次確認各列是否滿六張，如未滿則以先堆滿6張為基準(超過就重抽列)，當6張都堆滿後再上調堆滿限制
            let stackedNumber = 0;
            for(let space in moveSpace){
                if(moveSpace[space].length >= 6){
                    stackedNumber+=1;
                }
            }    
            // console.log(stackedNumber);                    
            if(stackedNumber === 8){
                while(moveSpace[checkStacked].length > 6){
                    checkStacked = getRandom(['space1', 'space2', 'space3', 'space4', 'space5', 'space6', 'space7', 'space8']);
                };
            }else{
                while(moveSpace[checkStacked].length > 5){
                    checkStacked = getRandom(['space1', 'space2', 'space3', 'space4', 'space5', 'space6', 'space7', 'space8']);
                };
            };
            
            moveSpace[checkStacked].push({suit: poker.suit, number: poker.number});
            // console.log(moveSpace[checkStacked]);
        }

        for(let i=0; i<52; i++){
            drawPoker();
        }

        console.log(moveSpace);

    };
    
    openGame();
    // 把牌顯示於頁面上
    render();


})();
    
function render(){
    for(let space in moveSpace){
        let str = '';
        let ul = document.querySelector('.'+space);
                
        moveSpace[space].forEach(function(item){
            str+= '<li draggable="true">' + item.suit + ' ' + item.number + '</li>';
        });
    
        ul.innerHTML = str;
    }
}

// 監聽移動
// 1.判斷是否可移動
// a.移動張數最大值 = 空白欄未用格數 + 八序列空格數 + 1
// b.需是紅黑相間
// c.多張需是順號

var isDragged; // {is: true, parentClassName: string, index: number} | false
var dragged;

function isDragged(e){
    isDragged = false;

    let mouseDowned = e.target;
    // console.log(mouseDowned);
    if(mouseDowned.nodeName !== 'LI' | !mouseDowned.textContent){
        return;
    }

    let length = mouseDowned.parentNode.childNodes.length;
    let mouseDownedIndex = getChildrenIndex(mouseDowned);
    let numMoveCards = length - mouseDownedIndex;
    // console.log(numMoveCards);
    let maxNumMove = checkMaxMoveCards();

    function getChildrenIndex(el){        
        if(el.nodeName!='LI'){
            return;
        }
        let i=0;
        while(el = el.previousElementSibling){
            i++;
        }
        return i;
    }

    function checkMaxMoveCards(){
        let maxNumMove = 0;
        let notUsedStaies = 0;
        let bonusMoveSpace = 0;
        
        for(let i in staies){
            // console.log(staies[i]);
            if(staies[i].length === 0){
                notUsedStaies+=1;
            }
        }
    
        for(let i in moveSpace){
            // console.log(moveSpace[i]);
            if(moveSpace[i].length === 0){
                bonusMoveSpace+=1;
            }
        }
    
        maxNumMove = notUsedStaies + bonusMoveSpace + 1;
        return maxNumMove;
    }

    function isColorSame(el, className, mouseDownedIndex){        
        let color = (function (){
                        suit = moveSpace[className][mouseDownedIndex].suit;
                        if(suit === 'spade' | suit === 'club'){
                            return 'black';
                        }else{
                            return 'red'
                        }
                    })();
        let i = 0;
        while(el = el.nextElementSibling){
            let nextColor = (function (){
                suit = moveSpace[className][mouseDownedIndex+(i+1)].suit;
                if(suit === 'spade' | suit === 'club'){
                    return 'black';
                }else{
                    return 'red';
                }
            })();

            if(color===nextColor){
                return true;
            }else{
                color = nextColor; 
                i++;
            }            
        }
        return false;
    }

    function isNumberDesc(el, className, mouseDownedIndex){
        let number = moveSpace[className][mouseDownedIndex].number;
        let i = 0;
        while(el = el.nextElementSibling){
            let nextNumber = moveSpace[className][mouseDownedIndex+(i+1)].number;
            if(!(nextNumber === number-1)){
                return false;
            }
            i++;
            number = nextNumber;
        }
        return true;    
    }

    if(numMoveCards>maxNumMove){
        console.log('overMaxNum');
        return false;
    }else{
        if(isColorSame(mouseDowned, mouseDowned.parentNode.classList[0], mouseDownedIndex)){
            console.log('sameColor');
            return false;
        }else{
            if(isNumberDesc(mouseDowned, mouseDowned.parentNode.classList[0], mouseDownedIndex)){
                console.log('true');
                isDragged = {is: true, parentClassName: mouseDowned.parentNode.classList[0], index: mouseDownedIndex, moveNum: numMoveCards};
                return true;
            }
            else{
                console.log('notDesc');
                return false;
            }
        }
    }
}

function dragStart(e){
    dragged = e.target;
    console.log(dragged);
}


// 移動規則判斷
function drop(e){

    let drop = e.target;
    // 拉在自己所屬列上不做動作
    if(drop.parentNode.classList[0] === isDragged.parentNode){
        return;
    }

    // 監測drag和drop DOM，對應處理移動空間(moveSpace)內的陣列變化後，重新泫染頁面
    if(drop.nodeName == 'LI'){       
        drop.parentNode.style.background = '';

        let dropCard = moveSpace[drop.parentNode.classList[0]][drop.parentNode.childElementCount-1];
        let draggedCard = moveSpace[isDragged.parentClassName][isDragged.index];
        // 判斷是否能擺入，1.花色是否相異，2.數字是否遞減1
        let isDrop = (function (dropCard, draggedCard){
                            let dropColor;
                            if(dropCard.suit === 'spade' | dropCard.suit === 'club'){
                                dropColor = 'black';
                            }else{
                                dropColor = 'red';
                            }
                            let draggedColor;
                            if(draggedCard.suit === 'spade' | draggedCard.suit === 'club'){
                                draggedColor = 'black';
                            }else{
                                draggedColor = 'red';
                            }
                            console.log(draggedColor, dropColor);
                            if(dropColor === draggedColor){
                                console.log('samecolor');
                                return false;
                            }
                            console.log(draggedCard.number, dropCard.number);
                            if((dropCard.number-1) === draggedCard.number){
                                return true;
                            }else{
                                console.log('numbererror');
                                return false;
                            }
                        })(dropCard, draggedCard);
        console.log(isDrop);
        if(isDrop){
            for(let i=0; i<isDragged.moveNum; i++){
                let item = moveSpace[isDragged.parentClassName][isDragged.index];
                moveSpace[drop.parentNode.classList[0]].push(item);
                moveSpace[dragged.parentNode.classList[0]].splice(isDragged.index, 1);
            }
        }

        render();

    }
    else if(drop.nodeName == 'UL' & moveSpace[e.target.classList[0]].length === 0){
        for(let i=0; i<isDragged.moveNum; i++){
            let item = moveSpace[isDragged.parentClassName][isDragged.index];
            moveSpace[drop.classList[0]].push(item);
            moveSpace[dragged.parentNode.classList[0]].splice(isDragged.index, 1);
        }
        render();
    }
}


function dragOver(e){
    // console.log(e.target);
    e.preventDefault();
}

function enterDrop(e){
    if(!isDragged){
        return;
    }
    // console.log(e.target);
    if(e.target.nodeName == 'LI'){        
        e.target.parentNode.style.background = 'red';
    }
    if(e.target.nodeName == 'UL' & moveSpace[e.target.classList[0]] === []){
        e.target.parentNode.style.background = 'red';
    }
}

function leaveDrop(e){
    // console.log(e.target);
    if(e.target.nodeName == 'LI'){
        e.target.parentNode.style.background = '';
    }
    if(e.target.nodeName == 'UL' & moveSpace[e.target.classList[0]] === []){
        e.target.parentNode.style.background = '';
    }
}


document.addEventListener('mousedown', isDragged);
document.addEventListener('dragstart', dragStart);
document.addEventListener('dragover', dragOver, true);
document.addEventListener('drop', drop, true);

// dragenter表示一個拖曳動作過程時，被拖曳物件所進入的所有的DOM，只有在進入的瞬間，回傳一個被進入的DOM
document.addEventListener('dragenter', enterDrop);
// dragenter表示一個拖曳動作過程時，被拖曳物件所離開的所有的DOM，只有在離開的瞬間，回傳一個被離開的DOM
document.addEventListener('dragleave', leaveDrop);


