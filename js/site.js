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
                     
                     });
    
    
    CalcHistory();   //calculates the most visited sites -beware if you watch porn without incognito
    
    /* for searchinfg google -- required  add feature to search from other search engines  */
    function myfunc()   
    {
        //console.log(searchBox.val());
        var query=Host+searchBox.val().split(" ").join('+');
        console.log(query);
        document.location=query;
        /*
        chrome.identity.getProfileUserInfo(function(user_info)
                                          {
           console.log(user_info); 
        });
        */
    }
    
    
    
});

//calculate The Time For The History
var CalcTime=function(n){
    var date=new Date();
    date.setMonth(date.getMonth()-n);
    return date.getTime();
};

/*  
    CalcHistory -- Function to get history from chrome for a certain amount of time
*/
function CalcHistory()
{
    // get lsat 2 months history and limit the result to 5000 entries
    var ChromeHistory={text:'',startTime:CalcTime(2),maxResults:5000};
    chrome.history.search(ChromeHistory,HistoryCallback);
}

/*
    Function Callback for chrome history search - 
     action to be taken after chrome returns the result
*/
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
                        //do something if required
                        console.log(error); //never let the errors pass silently
                    }
            });
            for(var key in visitedDict)
                {
                    MostVisited.push(visitedDict[key]);
                }
            MostVisited.sort(compare);
            //console.log(MostVisited.slice(0,10));
        }
    Done();     // hurray!! -- got my top 10 result DONE!!!
}


/* 
    Fuction to add the results to the DOM
*/
function Done()
{
    var ul=$('#MostVisited');
    for (i=0;i<10;i++)
    { 
        url='https://'+ MostVisited[i].url;
        var title=MostVisited[i].url.replace('www.','').split('.')[0];
        //console.log(title);
        var s='<li class="links" ><a href=" ' + url +'" > <span>    ' + title+ '</span> - ' +MostVisited[i].url +'</a> </li>';
        ul.append(s);
    }
 }



