$("document").ready(function() {

    var col1 = document.getElementById("col1");
    var col2 = document.getElementById("col2");
    var col3 = document.getElementById("col3");
    var cells = document.getElementsByClassName("cell");
    var clicks = 0;
    var click1Pos = [];
    var smallarray = [
        [],
        [],
        []
    ];

    class cards {
        constructor(img) {
            this.img = img;
        }
    }

    var ALLCARDS = [];

    ALLCARDS.push(
        card1 = new cards("img/acehearts.jpg"),
        card2 = new cards("img/acespades.jpg"),
        card3 = new cards("img/twohearts.jpg"),
        card4 = new cards("img/twospades.jpg"),
        card5 = new cards("img/threehearts.jpg"),
        card6 = new cards("img/threespades.jpg"),
        card7 = new cards("img/fourhearts.jpg"),
        card8 = new cards("img/fourspades.jpg"),
        card9 = new cards("img/fivehearts.jpg"),
        card10 = new cards("img/fivespades.jpg"),
        card11 = new cards("img/sixhearts.jpg"),
        card12 = new cards("img/sixspades.jpg"),
        card13 = new cards("img/sevenhearts.jpg"),
        card14 = new cards("img/sevenspades.jpg"),
        card15 = new cards("img/eighthearts.jpg"),
        card16 = new cards("img/eightspades.jpg"),
        card17 = new cards("img/ninehearts.jpg"),
        card18 = new cards("img/ninespades.jpg"),
        card19 = new cards("img/tenhearts.jpg"),
        card20 = new cards("img/tenspades.jpg"),
        card21 = new cards("img/jackhearts.jpg"),
        card22 = new cards("img/jackspades.jpg"),
        card23 = new cards("img/queenhearts.jpg"),
        card24 = new cards("img/queenspades.jpg"),
        card25 = new cards("img/kinghearts.jpg"),
        card26 = new cards("img/kingspades.jpg"),
        card27 = new cards("img/aceclubs.jpg")
    );

    assign();

    function assign() {
        var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];
        for (i = 0; i < 27; i++) {
            var ranNumByLength = Math.floor(Math.random() * (arr.length - 1));
            var randomArrPosition = arr[ranNumByLength];
            cells[i].innerHTML = "<img src ='" + ALLCARDS[randomArrPosition].img + "'>";
            arr.splice(ranNumByLength, 1);
        }
    }

    startGame();

    function startGame() {
        var columns = document.getElementsByClassName("col-xs-4");
        for (i = 0; i < columns.length; i++) {
            columns[i].addEventListener('click', columnClicked);
        }
    }

    function columnClicked() {
        clickCounter();
        for (i = 0; i < 9; i++) {
            if (clicks < 3) {
                if (this.id == col1.id) {
                    click1Pos.push(
                        this.children[i].innerHTML,
                        col2.children[i].innerHTML,
                        col3.children[i].innerHTML
                    );
                } else if (this.id == col2.id) {
                    click1Pos.push(
                        this.children[i].innerHTML,
                        col3.children[i].innerHTML,
                        col1.children[i].innerHTML
                    );
                } else {
                    click1Pos.push(
                        this.children[i].innerHTML,
                        col1.children[i].innerHTML,
                        col2.children[i].innerHTML
                    );
                }
                shuffleAndDeal();
            }
        }
        if (clicks == 3) {
            var yourCard = this.children[0];
            console.log("Your card: ", this.children[0].innerHTML);
        }
    }

    function shuffleAndDeal() {
        if (click1Pos.length == 27) {
            for (i = 0; i < 9; i++) {
                smallarray[0] = click1Pos.slice(0, 9);
                smallarray[1] = click1Pos.slice(9, 18);
                smallarray[2] = click1Pos.slice(18, 27);
                col1.children[i].innerHTML = smallarray[0][i];
                col2.children[i].innerHTML = smallarray[1][i];
                col3.children[i].innerHTML = smallarray[2][i];
            }
            click1Pos = [];
        }
    }

    function clickCounter() {
        clicks += 1;
        console.log('counter works', clicks);
        return clicks;
    }
});
