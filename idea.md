```
const{ipcRenderer:e}=require("electron");function timeString(e){var t=[["One o’clock","Five past one","Ten past one","Quarter past one","Twenty past one","Twenty-five past one","Half past one","Twenty-five to two","Twenty to two","Quarter to two","Ten to two","Five to two",],["Two o’clock","Five past two","Ten past two","Quarter past two","Twenty past two","Twenty-five past two","Half past two","Twenty-five to three","Twenty to three","Quarter to three","Ten to three","Five to three",],["Three o’clock","Five past three","Ten past three","Quarter past three","Twenty past three","Twenty-five past three","Half past three","Twenty-five to four","Twenty to four","Quarter to four","Ten to four","Five to four",],["Four o’clock","Five past four","Ten past four","Quarter past four","Twenty past four","Twenty-five past four","Half past four","Twenty-five to five","Twenty to five","Quarter to five","Ten to five","Five to five",],["Five o’clock","Five past five","Ten past five","Quarter past five","Twenty past five","Twenty-five past five","Half past five","Twenty-five to six","Twenty to six","Quarter to six","Ten to six","Five to six",],["Six o’clock","Five past six","Ten past six","Quarter past six","Twenty past six","Twenty-five past six","Half past six","Twenty-five to seven","Twenty to seven","Quarter to seven","Ten to seven","Five to seven",],["Seven o’clock","Five past seven","Ten past seven","Quarter past seven","Twenty past seven","Twenty-five past seven","Half past seven","Twenty-five to eight","Twenty to eight","Quarter to eight","Ten to eight","Five to eight",],["Eight o’clock","Five past eight","Ten past eight","Quarter past eight","Twenty past eight","Twenty-five past eight","Half past eight","Twenty-five to nine","Twenty to nine","Quarter to nine","Ten to nine","Five to nine",],["Nine o’clock","Five past nine","Ten past nine","Quarter past nine","Twenty past nine","Twenty-five past nine","Half past nine","Twenty-five to ten","Twenty to ten","Quarter to ten","Ten to ten","Five to ten",],["Ten o’clock","Five past ten","Ten past ten","Quarter past ten","Twenty past ten","Twenty-five past ten","Half past ten","Twenty-five to eleven","Twenty to eleven","Quarter to eleven","Ten to eleven","Five to eleven",],["Eleven o’clock","Five past eleven","Ten past eleven","Quarter past eleven","Twenty past eleven","Twenty-five past eleven","Half past eleven","Twenty-five to twelve","Twenty to twelve","Quarter to twelve","Ten to twelve","Five to twelve",],["Twelve o’clock","Five past twelve","Ten past twelve","Quarter past twelve","Twenty past twelve","Twenty-five past twelve","Half past twelve","Twenty-five to one","Twenty to one","Quarter to one","Ten to one","Five to one",],];e=(e=e<1?1:e)>5?5:e;var n=new Date,o=n.getHours(),a=n.getMinutes();if(1==e||2==e){var i=0,r=0;return 1==e?a>2&&(i=(a-3)/5+1):i=3*Math.floor((i=(a+7)/15*3)/3),r=o%12>0?o%12-1:12-(o%12+1),12==(i=Math.floor(i))&&(Math.floor(r+=1)>=t.length&&(r=0),i=0),t[Math.floor(r)][i]}if(3==e)return["Sleep","Breakfast","Second Breakfast","Elevenses","Lunch","Afternoon tea","Dinner","Supper",][Math.floor(o/3)];if(4==e)return["Night","Early morning","Morning","Almost noon","Noon","Afternoon","Evening","Late evening",][Math.floor(o/3)];var s,v=n.getDay();return["Start of week","Middle of week","End of week","Weekend!"][s=1==v?0:v>=2&&v<=4?1:5==v?2:3]}function updateTime(){var t=document.getElementById("time"),n=timeString(1);t.innerHTML=n,e.send("ping")}document.addEventListener("mousedown",t=>{"BUTTON"!==t.target.tagName&&e.send("drag-window")}),updateTime(),setInterval(updateTime,3e5);
```

    ```
    var fuzzyness = 1
var hourNames = [
    [ "One o’clock",
      "Five past one",
      "Ten past one",
      "Quarter past one",
      "Twenty past one",
      "Twenty-five past one",
      "Half past one",
      "Twenty-five to two",
      "Twenty to two",
      "Quarter to two",
      "Ten to two",
      "Five to two"],
    [ "Two o’clock",
      "Five past two",
      "Ten past two",
      "Quarter past two",
      "Twenty past two",
      "Twenty-five past two",
      "Half past two",
      "Twenty-five to three",
      "Twenty to three",
      "Quarter to three",
      "Ten to three",
      "Five to three"],
    [ "Three o’clock",
      "Five past three",
      "Ten past three",
      "Quarter past three",
      "Twenty past three",
      "Twenty-five past three",
      "Half past three",
      "Twenty-five to four",
      "Twenty to four",
      "Quarter to four",
      "Ten to four",
      "Five to four"],
    [ "Four o’clock",
      "Five past four",
      "Ten past four",
      "Quarter past four",
      "Twenty past four",
      "Twenty-five past four",
      "Half past four",
      "Twenty-five to five",
      "Twenty to five",
      "Quarter to five",
      "Ten to five",
      "Five to five"],
    [ "Five o’clock",
      "Five past five",
      "Ten past five",
      "Quarter past five",
      "Twenty past five",
      "Twenty-five past five",
      "Half past five",
      "Twenty-five to six",
      "Twenty to six",
      "Quarter to six",
      "Ten to six",
      "Five to six"],
    [ "Six o’clock",
      "Five past six",
      "Ten past six",
      "Quarter past six",
      "Twenty past six",
      "Twenty-five past six",
      "Half past six",
      "Twenty-five to seven",
      "Twenty to seven",
      "Quarter to seven",
      "Ten to seven",
      "Five to seven"],
    [ "Seven o’clock",
      "Five past seven",
      "Ten past seven",
      "Quarter past seven",
      "Twenty past seven",
      "Twenty-five past seven",
      "Half past seven",
      "Twenty-five to eight",
      "Twenty to eight",
      "Quarter to eight",
      "Ten to eight",
      "Five to eight"],
    [ "Eight o’clock",
      "Five past eight",
      "Ten past eight",
      "Quarter past eight",
      "Twenty past eight",
      "Twenty-five past eight",
      "Half past eight",
      "Twenty-five to nine",
      "Twenty to nine",
      "Quarter to nine",
      "Ten to nine",
      "Five to nine"],
    [ "Nine o’clock",
      "Five past nine",
      "Ten past nine",
      "Quarter past nine",
      "Twenty past nine",
      "Twenty-five past nine",
      "Half past nine",
      "Twenty-five to ten",
      "Twenty to ten",
      "Quarter to ten",
      "Ten to ten",
      "Five to ten"],
    [ "Ten o’clock",
      "Five past ten",
      "Ten past ten",
      "Quarter past ten",
      "Twenty past ten",
      "Twenty-five past ten",
      "Half past ten",
      "Twenty-five to eleven",
      "Twenty to eleven",
      "Quarter to eleven",
      "Ten to eleven",
      "Five to eleven"],
    [ "Eleven o’clock",
      "Five past eleven",
      "Ten past eleven",
      "Quarter past eleven",
      "Twenty past eleven",
      "Twenty-five past eleven",
      "Half past eleven",
      "Twenty-five to twelve",
      "Twenty to twelve",
      "Quarter to twelve",
      "Ten to twelve",
      "Five to twelve"],
    [ "Twelve o’clock",
      "Five past twelve",
      "Ten past twelve",
      "Quarter past twelve",
      "Twenty past twelve",
      "Twenty-five past twelve",
      "Half past twelve",
      "Twenty-five to one",
      "Twenty to one",
      "Quarter to one",
      "Ten to one",
      "Five to one"]
];

var halflingTime = [
    "Sleep", "Breakfast", "Second Breakfast", "Elevenses",
    "Lunch", "Afternoon tea", "Dinner", "Supper"
];

var dayTime = [
    "Night", "Early morning", "Morning", "Almost noon",
    "Noon", "Afternoon", "Evening", "Late evening"
];

var weekTime = [
    "Start of week", "Middle of week", "End of week", "Weekend!"
];


function timeString() {
    var d = new Date();
    var hours = d.getHours();
    var minutes = d.getMinutes();

    if (main.fuzzyness == 1 || main.fuzzyness == 2) {
        var sector = 0;
        var realHour = 0;

        if (main.fuzzyness == 1) {
            if (minutes > 2) {
                sector = (minutes - 3) / 5 + 1;
            }
        } else {
            // this formula has been determined by carefully filling a spreadsheet
            // and looking at the numbers :D
            sector = ((minutes + 7) / 15 * 3);
            // now round down to the nearest three
            sector = Math.floor(sector / 3) * 3;
        }

        if (hours % 12 > 0) {
            realHour = hours % 12 - 1;
        } else {
            realHour = 12 - (hours % 12 + 1);
        }

        sector = Math.floor(sector);
        if (sector == 12) {
            realHour += 1;
            if (Math.floor(realHour) >= hourNames.length) {
                realHour = 0;
            }
            sector = 0;
        }

        return hourNames[Math.floor(realHour)][sector];
    } else if (main.fuzzyness == 3) {
        return halflingTime[Math.floor(hours / 3)];
    } else if (main.fuzzyness == 4) {
        return dayTime[Math.floor(hours / 3)];
    } else {
        var dow = d.getDay();

        var weekTimeId;
        if (dow == 1) {
            weekTimeId = 0;
        } else if (dow >= 2 && dow <= 4) {
            weekTimeId = 1;
        } else if (dow == 5) {
            weekTimeId = 2;
        } else {
            weekTimeId = 3;
        }

        return weekTime[weekTimeId];
    }
}
