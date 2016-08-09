var HistoryItems=[];
var Host="https://www.google.com/#q=";
var visitedDict=[];
var MostVisited=[]
var IsVisited=false;
$(document).ready(function()
{
    
    var searchBox=$('#search-box');
    $('#search').click(myfunc);
    
    searchBox.keypress(function(e)
                    {
                    if (e.which==13)
                        {
                            myfunc();
                        }
                     //console.log(searchBox.val());
                     });
    
    
   CalcHistory(); 
    
    function myfunc()
    {
        console.log(searchBox.val());
        var query=Host+searchBox.val().split(" ").join('+');
        console.log(query);
        document.location=query;
        chrome.identity.getProfileUserInfo(function(user_info)
                                          {
           console.log(user_info); 
        });
        
    }
    
    
    
});

//calculate The Time For The History
var CalcTime=function(n){
    var date=new Date();
    date.setMonth(date.getMonth()-n);
    return date.getTime();
};


function CalcHistory()
{
    var ChromeHistory={text:'',startTime:CalcTime(2),maxResults:5000};
    chrome.history.search(ChromeHistory,HistoryCallback);
    
        
    //getting all the history items
    /*for( i=0;i<6; i++ )
    {
        chrome.history.search(ChromeHistory,HistoryCallback);
        ChromeHistory.startTime=HistoryItems[HistoryItems.length-1];
       
    }
    */
}

var HistoryCallback=function(historyItems)
{
    HistoryItems=(historyItems);
    console.log(HistoryItems.length);
    completed();
    
}
//for sorting 
function compare(value1 ,value2)
{
    if (value1.count<value2.count)
        {
            return 1;
        }
    else if (value1.count> value2.count)
        {
            return -1;
        }
    else{
            return 0;
    }
    
}


function completed()
{
    console.log("Entered");
    if ( IsVisited ==false)
        {
            IsVisited=true;
            HistoryItems.forEach(function(o,i,a){
                
                var s= o.url;
                try{
                    
                    s=s.split('//')[1].split('/')[0];
                    if (s!="")
                    {
                        if (visitedDict[s] !=null)
                          {
                              visitedDict[s].count+=o.visitCount;
                          }
                        else
                        {
                            visitedDict[s]={item:o,count:1,url:s};
                        }
                    }
                }
                catch(error)
                    {
                        
                    }
            });
            for(var key in visitedDict)
                {
                    MostVisited.push(visitedDict[key]);
                }
            MostVisited.sort(compare);
            console.log(MostVisited.slice(0,10));
        }
    Done();
}

function Done()
{
    var ul=$('#MostVisited');
    for (i=0;i<10;i++)
    { var s='<li>'+ MostVisited[i].url+' </li>';
            ul.append(s);
    }
 }



