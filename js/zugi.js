var hrefDetail = "https://market-api.radiocaca.com/nft-sales/";
var totalViewMarket = 0;
var categories = 0;
var scoreFrom, scoreTo = 0;
var priceFrom, priceTo = 0;
var totalListShow,tb = []; 
var listNFT = [
                {name:"mmlland",categories:7,sl:1},
                {name:"kissland",categories:20,sl:3},
                {name:"punk",categories:28,sl:1},
                {name:"mtmR",categories:23,sl:1},
                {name:"mtmN",categories:13,sl:2},
                {name:"token",categories:0,sl:70000}
                ];

var xtb = [];
$(document).ready(function() { /* code here */ 

//    var num = Number(data.data.price);
//    num = num.toFixed(6);
    racaPrice().then(data=>{
        data = Number(data).toFixed(6);
        $('#racaprice').text(data);
        listNFT.forEach(element => {
            if(element.categories==0){
                loadToken(element.name,element.name+"Usd",element.sl,data);
            }else{
                loadHistory(element.name,element.name+"Usd",element.sl,element.categories,data);
            }   

        });
    });
});

async function racaPrice(){
    // this.href = "https://api.pancakeswap.info/api/v2/tokens/0x12bb890508c125661e03b09ec06e404bc9289040";
    this.href = "https://api.coingecko.com/api/v3/coins/radio-caca";
    let response = await fetch(this.href,{
        headers: new Headers({
            'Accepts':'application/json',
            'Access-Control-Allow-Origin':'https://racamarket.github.io/',
            'Access-Control-Allow-Headers':'Origin, X-Requested-With, Content-Type, Accept'
        })
    });
    let data = await response.json();
    return data.market_data.current_price.usd;
}


var showToast = function(){

    var toastLiveExample = document.getElementById('liveToast');
    var toast = new bootstrap.Toast(toastLiveExample);
    toast.show();
}


{/* <option  value="13">Metamon</option>
<option value="23">R-Metamon</option>
<option value="20">Kiss-up Land</option>
<option selected value="7">Musk USM LAND</option>
<option value="28">Raca Punk</option>
<option value="17">Egg</option>
<option value="10">Matrix Plus Box</option> */}
var loadHistory = function(idText,idTextUSD,sl,categories,racaPrice){
    totalViewMarket = 50;
    this.href="https://market-api.radiocaca.com/nft-sales?pageNo=1&pageSize="+totalViewMarket+"&sortBy=created_at&order=desc&name=&saleType&category="+categories+"&tokenType&tokenId=-1";
    var newList = [];
    $.ajax(this.href, {
        success: function(data) {
            data.list.sort(function(a, b){
                return b.fixed_price - a.fixed_price;
            }).forEach(element => {
                newList.push(element.fixed_price);
                if(newList.length==data.list.length){
                    console.log(newList)
                    totalPrice = Number(Math.min.apply(Math, newList));
                    document.getElementById(idText).value = totalPrice*sl;
                    document.getElementById(idTextUSD).value = Number(totalPrice*racaPrice*sl).toFixed(0);

                }
            });
            
        },
        error: function() {
           $('#notification-bar').text('An error occurred');
            showToast();
        }
     });
    
};

var formatter = new Intl.NumberFormat();
  
var loadToken = function(idText,idTextUSD,totalToken){
    var racaPrice = document.getElementById("racaprice").innerHTML;
    document.getElementById(idText).value = formatter.format(totalToken);
    document.getElementById(idTextUSD).value = formatter.format(Number(totalToken*racaPrice).toFixed(0));
}

var totalCalculation = function(){
    var raca = 0;
    listNFT.forEach(element => {
        if(element.categories==0)
            raca = raca + element.sl;
        else
            raca = raca + cal(element.name);
        console.log(raca);
    });
    loadToken('total','totalUsd',raca);
    calVND(Number(raca)*document.getElementById("racaprice").innerHTML);
}

var cal = function(idText){
    var num =  Number(document.getElementById(idText).value);
    return num;
}

var calVND = function(usd){
    document.getElementById('totalVnd').value = formatter.format(Number(usd*23000).toFixed(0));
};