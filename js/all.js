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

    let stackArray;
    let staies;
    let moveSpace;

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
    for(let space in moveSpace){
        let str = '';
        let ul = document.querySelector('.'+space);
                
        moveSpace[space].forEach(function(item){      
            str+= '<li>' + item.suit + ' ' + item.number + '</li>';
        });
    
        ul.innerHTML = str;
    }

})();

// 監聽移動

// 移動規則判斷