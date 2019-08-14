import Request from './request.js';

let request = Request.get("/zero-question-list-tp/public/index/user/a");
request.then((response)=>{
    console.log(response);
});